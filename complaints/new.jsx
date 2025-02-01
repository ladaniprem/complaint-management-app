import React, { useState } from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  ToastAndroid, 
  SafeAreaView, 
  ActivityIndicator 
} from 'react-native'; 
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import * as ImagePicker from 'expo-image-picker'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { categoryData } from './[category]'; 
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { auth } from '../config/firebaseconfig'; 
import { submitComplaint } from '../services/complaintService'; 
import { sendLocalNotification } from '../services/notificationService';

const URGENCY_LEVELS = [ 
  { id: 'low', label: 'Low', color: '#4CAF50' }, 
  { id: 'medium', label: 'Medium', color: '#FF9800' }, 
  { id: 'high', label: 'High', color: '#F44336' } 
]; 
 
export default function NewComplaint() { 
  const router = useRouter(); 
  const { category, subcategory } = useLocalSearchParams(); 
   
  const [title, setTitle] = useState(''); 
  const [description, setDescription] = useState(''); 
  const [location, setLocation] = useState(''); 
  const [urgency, setUrgency] = useState('medium'); 
  const [images, setImages] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
 
  const categoryInfo = categoryData[category]; 
  const subcategoryInfo = categoryInfo?.subcategories.find(s => s.id === subcategory); 
 
  const handleImagePick = async () => { 
    try { 
      const result = await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsMultipleSelection: true, 
        quality: 0.5, 
        aspect: [4, 3], 
        base64: false, 
      }); 
 
      if (!result.canceled) { 
        if (images.length + result.assets.length > 5) { 
          ToastAndroid.show('Maximum 5 images allowed', ToastAndroid.SHORT); 
          return; 
        } 
        setImages([...images, ...result.assets]); 
      } 
    } catch (error) { 
      console.error('Error picking image:', error); 
      ToastAndroid.show('Error selecting images', ToastAndroid.SHORT); 
    } 
  }; 
 
  const removeImage = (index) => { 
    setImages(images.filter((_, i) => i !== index)); 
  }; 
 
  const uploadImage = async (uri) => { 
    try { 
      const response = await fetch(uri); 
      const blobFile = await response.blob(); 
       
      const timestamp = new Date().getTime(); 
      const filename = `complaint_${timestamp}.jpg`; 
       
      const storage = getStorage(); 
      const storageRef = ref(storage, `complaint_images/${filename}`); 
 
      const metadata = { 
        contentType: 'image/jpeg', 
      }; 
       
      const uploadTask = await uploadBytes(storageRef, blobFile, metadata); 
      console.log('Image uploaded successfully'); 
       
      const downloadURL = await getDownloadURL(uploadTask.ref); 
      console.log('Download URL:', downloadURL); 
       
      return downloadURL; 
    } catch (error) { 
      console.error('Upload error details:', { 
        errorCode: error.code, 
        errorMessage: error.message, 
        serverResponse: error.serverResponse 
      }); 
      throw error; 
    } 
  }; 
 
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      ToastAndroid.show('Please fill all required fields', ToastAndroid.SHORT);
      return;
    }  

    if (!auth.currentUser) { 
      ToastAndroid.show('Please sign in to submit a complaint', ToastAndroid.SHORT); 
      router.push('/login'); 
      return; 
    } 

    setIsSubmitting(true); 
    const imageUrls = [];

    try { 
      // Upload images if any 
      if (images.length > 0) {
        for (const image of images) { 
          try { 
            const url = await uploadImage(image.uri); 
            imageUrls.push(url); 
          } catch (uploadError) { 
            console.error('Failed to upload image:', uploadError); 
          } 
        } 
      } 

      // Create complaint data 
      const complaintData = {
        Title: title,
        Category: category,
        Description: description,
        Location: location,
        Images: imageUrls,
        Status: 'pending',
        UserId: auth.currentUser.uid,
        UserEmail: auth.currentUser.email,
        CreatedAt: serverTimestamp(),
        Urgency: urgency,
        Subcategory: subcategory
      }; 

      // Submit complaint 
      await submitComplaint(complaintData); 

      // Send notification 
      await sendLocalNotification( 
        'Complaint Submitted Successfully', 
        `Your complaint "${title}" has been submitted and is under review.` 
      ); 

      ToastAndroid.show('Complaint submitted successfully', ToastAndroid.SHORT); 
      
      // Navigate to history after submission 
      router.push('/(tabs)/Profile', {
        refresh: true // Add this parameter to trigger refresh
      }); 
    } catch (error) { 
      console.error('Submission error:', error); 
      ToastAndroid.show('Error submitting complaint. Please try again.', ToastAndroid.SHORT); 
    } finally { 
      setIsSubmitting(false); 
    } 
  }; 
 
  if (!categoryInfo || !subcategoryInfo) { 
    return ( 
      <SafeAreaView style={styles.container}> 
        <Text>Invalid category or subcategory</Text> 
      </SafeAreaView> 
    ); 
  } 
 
  return ( 
    <SafeAreaView style={styles.container}> 
      <ScrollView style={styles.scrollView}> 
        <View style={styles.header}> 
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}> 
            <MaterialIcons name="arrow-back" size={24} color="#333" /> 
          </TouchableOpacity> 
          <Text style={styles.headerTitle}>New Complaint</Text> 
          <View style={styles.categoryInfo}> 
            <MaterialIcons name={subcategoryInfo?.icon} size={24} color="#1666a8" /> 
            <Text style={styles.categoryText}>{subcategoryInfo?.title}</Text> 
          </View> 
        </View> 
 
        <View style={styles.form}> 
          <View style={styles.inputContainer}> 
            <Text style={styles.label}>Title*</Text> 
            <TextInput 
              style={styles.input} 
              value={title} 
              onChangeText={setTitle} 
              placeholder="Brief title of your complaint" 
              maxLength={100} 
            /> 
          </View> 
 
          <View style={styles.inputContainer}> 
            <Text style={styles.label}>Description*</Text> 
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={description} 
              onChangeText={setDescription} 
              placeholder="Detailed description of the issue" 
              multiline 
              numberOfLines={6} 
              textAlignVertical="top" 
            /> 
          </View> 
 
          <View style={styles.inputContainer}> 
            <Text style={styles.label}>Location*</Text> 
            <TextInput 
              style={styles.input} 
              value={location} 
              onChangeText={setLocation} 
              placeholder="Address or location of the issue" 
            /> 
          </View> 
 
          <View style={styles.inputContainer}> 
            <Text style={styles.label}>Urgency Level*</Text> 
            <View style={styles.urgencyContainer}> 
              {URGENCY_LEVELS.map((level) => ( 
                <TouchableOpacity 
                  key={level.id} 
                  style={[ 
                    styles.urgencyButton, 
                    urgency === level.id && { backgroundColor: level.color } 
                  ]} 
                  onPress={() => setUrgency(level.id)} 
                > 
                  <Text style={[ 
                    styles.urgencyText, 
                    urgency === level.id && styles.urgencyTextSelected 
                  ]}> 
                    {level.label} 
                  </Text> 
                </TouchableOpacity> 
              ))} 
            </View> 
          </View>
<View style={styles.inputContainer}> 
            <Text style={styles.label}>Images (Max 5)</Text> 
            <TouchableOpacity  
              style={styles.imagePickerButton} 
              onPress={handleImagePick} 
            > 
              <MaterialIcons name="add-photo-alternate" size={24} color="#1666a8" /> 
              <Text style={styles.imagePickerText}>Add Photos</Text> 
            </TouchableOpacity> 
 
            <ScrollView horizontal style={styles.imagePreviewContainer}> 
              {images.map((image, index) => ( 
                <View key={index} style={styles.imagePreview}> 
                  <Image source={{ uri: image.uri }} style={styles.previewImage} /> 
                  <TouchableOpacity 
                    style={styles.removeImageButton} 
                    onPress={() => removeImage(index)} 
                  > 
                    <MaterialIcons name="close" size={20} color="#fff" /> 
                  </TouchableOpacity> 
                </View> 
              ))} 
            </ScrollView> 
          </View> 
        </View> 
      </ScrollView> 
 
      <View style={styles.footer}> 
        <TouchableOpacity  
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit} 
          disabled={isSubmitting} > 
          {isSubmitting ? ( 
            <ActivityIndicator color="#FFF" /> 
          ) : ( 
            <Text style={styles.submitButtonText}>Submit Complaint</Text> 
          )} 
        </TouchableOpacity> 
      </View> 
    </SafeAreaView> 
  ); 
} 
 
const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
  }, 
  scrollView: { 
    flex: 1, 
  }, 
  header: { 
    flexDirection: 'column', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEEEEE', 
  }, 
  backButton: { 
    padding: 8, 
    alignSelf: 'flex-start', 
  }, 
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '600', 
    color: '#333', 
    marginLeft: 8, 
    marginBottom: 8, 
  }, 
  categoryInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F0F7FF', 
    padding: 8, 
    borderRadius: 8, 
    marginLeft: 8, 
  }, 
  categoryText: { 
    fontSize: 16, 
    color: '#1666a8', 
    marginLeft: 8, 
    fontWeight: '500', 
  }, 
  form: { 
    padding: 16, 
  }, 
  inputContainer: { 
    marginBottom: 20, 
  }, 
  label: { 
    fontSize: 16, 
    color: '#333', 
    marginBottom: 8, 
    fontWeight: '500', 
  }, 
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 12, 
    padding: 12, 
    fontSize: 16, 
    backgroundColor: '#fff', 
  }, 
  textArea: { 
    height: 120, 
    textAlignVertical: 'top', 
  }, 
  imagePickerButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#1666a8', 
    borderRadius: 12, 
    padding: 12, 
    marginTop: 8, 
  }, 
  imagePickerText: { 
    color: '#1666a8', 
    marginLeft: 8, 
    fontSize: 16, 
    fontWeight: '500', 
  }, 
  imagePreviewContainer: { 
    flexDirection: 'row', 
    marginTop: 16, 
  }, 
  imagePreview: { 
    marginRight: 12, 
    position: 'relative', 
  }, 
  previewImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 8, 
  }, 
  removeImageButton: { 
    position: 'absolute', 
    top: -8, 
    right: -8, 
    backgroundColor: '#ff4444', 
    borderRadius: 12, 
    width: 24, 
    height: 24, 
    justifyContent: 'center', 
    alignItems: 'center', 
  }, 
  footer: { 
    padding: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#EEEEEE', 
  }, 
  submitButton: { 
    backgroundColor: '#1666a8', 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center', 
  }, 
  submitButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600', 
  }, 
  urgencyContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 8, 
  }, 
  urgencyButton: { 
    flex: 1, 
    marginHorizontal: 4, 
    paddingVertical: 12,
paddingHorizontal: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    backgroundColor: '#fff', 
    alignItems: 'center', 
  }, 
  urgencyText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#666', 
  }, 
  urgencyTextSelected: { 
    color: '#fff', 
  }, 
  submitButtonDisabled: { 
    opacity: 0.7, 
  }, 
});
