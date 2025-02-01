import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView, Linking, ToastAndroid } from 'react-native'; 
import React from 'react'; 
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 
import { auth, storage, db } from "../../config/firebaseconfig"; 
import * as ImagePicker from 'expo-image-picker'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'; 
import { useFocusEffect } from '@react-navigation/native';
 
export default function Profile() { 
  const router = useRouter(); 
  const [userName, setUserName] = React.useState("User"); // Default fallback name 
  const [profileImage, setProfileImage] = React.useState(require('../../assets/images/default-avatar.png')); 
  const [loading, setLoading] = React.useState(true); 
  const [complaints, setComplaints] = React.useState({ 
    total: 0, 
    resolved: 0, 
    pending: 0 
  }); 
 
  React.useEffect(() => { 
    fetchUserProfile(); 
    fetchComplaintStats(); 
  }, []); 
 
  // Add this effect to refresh data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
      fetchComplaintStats();
    }, [])
  );
 
  const fetchUserProfile = async () => { 
    try { 
      const user = auth.currentUser; 
      if (user) { 
        // Get display name 
        if (user.displayName) { 
          setUserName(user.displayName); 
        } 
         
        // Get profile image from Firebase Storage 
        const imageRef = ref(storage, `profileImages/${user.uid}`); 
        try { 
          const url = await getDownloadURL(imageRef); 
          setProfileImage({ uri: url }); 
        } catch (error) { 
          console.log("No profile image found, using default"); 
        } 
      } 
    } catch (error) { 
      console.error("Error fetching user profile:", error); 
    } finally { 
      setLoading(false); 
    } 
  }; 
 
  const fetchComplaintStats = async () => { 
    try { 
      if (!auth.currentUser) return;

      const complaintsRef = collection(db, 'Complant foram');
      const q = query(
        complaintsRef,
        where('UserId', '==', auth.currentUser.uid),
        orderBy('CreatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      let total = querySnapshot.size;
      let resolved = 0;
      let pending = 0;

      querySnapshot.forEach((doc) => {
        const complaint = doc.data();
        if (complaint.Status?.toLowerCase() === 'resolved') {
          resolved++;
        } else {
          pending++;
        }
      });

      console.log('User complaints stats:', { total, resolved, pending });
      setComplaints({ total, resolved, pending });
    } catch (error) { 
      console.error('Error fetching complaint stats:', error); 
      ToastAndroid.show('Error updating stats', ToastAndroid.SHORT);
    } 
  }; 
 
  const uploadImageToFirebase = async (uri) => { 
    try { 
      const user = auth.currentUser; 
      if (!user) throw new Error('User not authenticated'); 
 
      // Convert URI to blob 
      const response = await fetch(uri); 
      const blob = await response.blob(); 
 
      // Upload to Firebase Storage 
      const imageRef = ref(storage, `profileImages/${user.uid}`); 
      await uploadBytes(imageRef, blob); 
 
      // Get the download URL 
      const downloadURL = await getDownloadURL(imageRef); 
      return downloadURL; 
    } catch (error) { 
      console.error('Error uploading image:', error); 
      throw error; 
    } 
  }; 
 
  const handleSignOut = async () => { 
    try { 
      await auth.signOut(); 
      router.push('/login'); 
    } catch (error) { 
      console.error('Error signing out:', error); 
    } 
  }; 
 
  const handleHelpSupport = () => { 
    Linking.openURL('tel:1800-123-4567'); 
  }; 
 
  const handleEditProfilePicture = async () => { 
    try { 
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); 
       
      if (status !== 'granted') { 
        alert('Sorry, we need camera roll permissions to change your profile picture!'); 
        return; 
      } 
 
      const result = await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: true, 
        aspect: [1, 1], 
        quality: 1, 
      }); 
 
      if (!result.canceled) { 
        setLoading(true); 
        const downloadURL = await uploadImageToFirebase(result.assets[0].uri); 
        setProfileImage({ uri: downloadURL }); 
      } 
    } catch (error) { 
      console.error('Error updating profile picture:', error);
alert('Failed to update profile picture'); 
    } finally { 
      setLoading(false); 
    } 
  }; 
 
  const handleViewComplaints = () => {
    if (!auth.currentUser) {
      ToastAndroid.show('Please sign in to view complaints', ToastAndroid.SHORT);
      router.push('/login');
      return;
    }
    router.push('/complaints/history');
  };
 
  const menuItems = [ 
    { 
      icon: <MaterialCommunityIcons name="bell-outline" size={24} color="#1666a8" />, 
      title: "Notifications", 
      subtitle: "Manage your notifications", 
      onPress: () => {} 
    }, 
    { 
      icon: <MaterialIcons name="history" size={24} color="#1666a8" />, 
      title: "Complaint History", 
      subtitle: "View your past complaints", 
      onPress: handleViewComplaints 
    }, 
    { 
      icon: <MaterialCommunityIcons name="bookmark-outline" size={24} color="#1666a8" />, 
      title: "Saved Drafts", 
      subtitle: "Access your saved complaints", 
      onPress: () => {} 
    }, 
    { 
      icon: <MaterialIcons name="help-outline" size={24} color="#1666a8" />, 
      title: "Help & Support", 
      subtitle: "Toll Free: 1800-123-4567", 
      onPress: handleHelpSupport 
    } 
  ]; 
 
  return ( 
    <SafeAreaView style={styles.container}> 
      {/* Header */} 
      <View style={styles.header}> 
        <Text style={styles.headerTitle}>Profile</Text> 
      </View> 
 
      <ScrollView showsVerticalScrollIndicator={false}> 
        {/* Profile Card */} 
        <View style={styles.profileCard}> 
          <View style={styles.profileImageContainer}> 
            <Image 
              source={profileImage} 
              style={styles.profileImage} 
            /> 
            <TouchableOpacity  
              style={[styles.editButton, { backgroundColor: '#1666a8' }]} 
              onPress={handleEditProfilePicture} 
            > 
              <MaterialCommunityIcons name="pencil" size={20} color="#FFF" /> 
            </TouchableOpacity> 
          </View> 
          <Text style={styles.userName}>{userName}</Text> 
          <Text style={styles.userEmail}>{auth.currentUser?.email}</Text> 
          <View style={styles.statsContainer}> 
            <View style={styles.statItem}> 
              <Text style={styles.statNumber}>{complaints.total}</Text> 
              <Text style={styles.statLabel}>Complaints</Text> 
            </View> 
            <View style={styles.statDivider} /> 
            <View style={styles.statItem}> 
              <Text style={styles.statNumber}>{complaints.resolved}</Text> 
              <Text style={styles.statLabel}>Resolved</Text> 
            </View> 
            <View style={styles.statDivider} /> 
            <View style={styles.statItem}> 
              <Text style={styles.statNumber}>{complaints.pending}</Text> 
              <Text style={styles.statLabel}>Pending</Text> 
            </View> 
          </View> 
        </View> 
 
        {/* Menu Items */} 
        <View style={styles.menuContainer}> 
          {menuItems.map((item, index) => ( 
            <TouchableOpacity  
              key={index}  
              style={styles.menuItem} 
              onPress={item.onPress} 
            > 
              <View style={styles.menuIconContainer}> 
                {item.icon} 
              </View> 
              <View style={styles.menuTextContainer}> 
                <Text style={styles.menuTitle}>{item.title}</Text> 
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text> 
              </View> 
              <MaterialIcons name="chevron-right" size={24} color="#1666a8" /> 
            </TouchableOpacity> 
          ))} 
        </View> 
 
        {/* Sign Out Button */} 
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}> 
          <MaterialCommunityIcons name="logout" size={24} color="#1666a8" /> 
          <Text style={styles.signOutText}>Sign Out</Text> 
        </TouchableOpacity> 
      </ScrollView> 
    </SafeAreaView> 
  ); 
} 
 
const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA', 
  }, 
  header: { 
    backgroundColor: '#FFF', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEEEEE', 
  }, 
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#1666a8',
}, 
  profileCard: { 
    backgroundColor: '#FFF', 
    margin: 16, 
    borderRadius: 16, 
    padding: 20, 
    alignItems: 'center', 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 2, 
    }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
  }, 
  profileImageContainer: { 
    position: 'relative', 
  }, 
  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 16, 
  }, 
  editButton: { 
    position: 'absolute', 
    right: -8, 
    bottom: -8, 
    backgroundColor: '#1666a8', 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 2, 
    }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
  }, 
  userName: { 
    fontSize: 24, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 4, 
  }, 
  userEmail: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 16, 
  }, 
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%', 
    paddingVertical: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#EEEEEE', 
  }, 
  statItem: { 
    alignItems: 'center', 
  }, 
  statNumber: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1666a8', 
  }, 
  statLabel: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4, 
  }, 
  statDivider: { 
    width: 1, 
    backgroundColor: '#EEEEEE', 
  }, 
  menuContainer: { 
    backgroundColor: '#FFF', 
    marginHorizontal: 16, 
    marginBottom: 16, 
    borderRadius: 16, 
    overflow: 'hidden', 
  }, 
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEEEEE', 
  }, 
  menuIconContainer: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#F0F7FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16, 
  }, 
  menuTextContainer: { 
    flex: 1, 
  }, 
  menuTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333', 
  }, 
  menuSubtitle: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 2, 
  }, 
  signOutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FFF', 
    marginHorizontal: 16, 
    marginBottom: 32, 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 2, 
    borderColor: '#1666a8', 
  }, 
  signOutText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1666a8', 
    marginLeft: 8, 
  }, 
});