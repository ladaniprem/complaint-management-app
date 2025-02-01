import React, { useState, useEffect } from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator, 
  Image, 
  ToastAndroid, 
  RefreshControl 
} from 'react-native'; 
import { useRouter } from 'expo-router'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore'; 
import { db, auth } from '../config/firebaseconfig'; 
import { getUserComplaints } from '../services/complaintService';
import { useFocusEffect } from '@react-navigation/native';
 
export default function ComplaintHistory() { 
  const router = useRouter(); 
  /**
   * @typedef {Object} Complaint
   * @property {string} id
   * @property {string} Title
   * @property {string} Category
   * @property {string} Description
   * @property {string} Location
   * @property {string} Status
   * @property {string} UserId
   * @property {string} Urgency
   * @property {string[]} Images
   * @property {timestamp} CreatedAt
   */
  const [complaints, setComplaints] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
 
  useEffect(() => { 
    if (auth.currentUser) { 
      fetchComplaints(); 
    } else { 
      router.push('/login'); 
    } 
  }, [auth.currentUser]); 
 
  const fetchComplaints = async () => { 
    try { 
      setError(null);
      setLoading(true);
      
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const complaintsRef = collection(db, 'Complant foram');
      const q = query(
        complaintsRef,
        where('UserId', '==', auth.currentUser.uid),
        orderBy('CreatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      console.log('Found complaints:', querySnapshot.size);

      const complaintsList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        complaintsList.push({
          id: doc.id,
          ...data,
          CreatedAt: data.CreatedAt?.toDate()
        });
      });

      console.log('Fetched complaints:', complaintsList);
      setComplaints(complaintsList);
    } catch (error) { 
      console.error('Error fetching complaints:', error); 
      setError(error.message);
      ToastAndroid.show('Error loading complaints', ToastAndroid.SHORT); 
    } finally { 
      setLoading(false); 
    } 
  }; 
 
  // Helper function to get status color
  const getStatusColor = (status) => { 
    switch (status?.toLowerCase()) { 
      case 'pending': 
        return '#FFB74D'; 
      case 'in progress': 
        return '#64B5F6'; 
      case 'resolved': 
        return '#81C784'; 
      case 'rejected': 
        return '#E57373'; 
      default: 
        return '#FFB74D'; 
    } 
  }; 
 
  // Helper function to format date
  const formatDate = (timestamp) => { 
    if (!timestamp) return ''; 
    const date = timestamp.toDate(); 
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }); 
  }; 
 
  const renderComplaintItem = ({ item }) => ( 
    <TouchableOpacity 
      style={styles.complaintCard} 
      onPress={() => router.push(`/complaints/details/${item.id}`)}
    > 
      <View style={styles.cardHeader}> 
        <Text style={styles.cardTitle}>{item.Title}</Text> 
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.Status) }]}> 
          <Text style={styles.statusText}>{item.Status || 'Pending'}</Text> 
        </View> 
      </View> 
      <Text style={styles.cardCategory}> 
        <MaterialIcons name="category" size={16} color="#666" /> 
        {' '}{item.Category} 
      </Text> 
      <Text style={styles.cardDescription} numberOfLines={2}> 
        {item.Description} 
      </Text> 
       
      <View style={styles.cardFooter}> 
        <Text style={styles.cardLocation}> 
          <MaterialIcons name="location-on" size={16} color="#666" /> 
          {' '}{item.Location} 
        </Text> 
        <Text style={styles.cardDate}> 
          <MaterialIcons name="access-time" size={16} color="#666" /> 
          {' '}{formatDate(item.CreatedAt)} 
        </Text> 
      </View> 

      {item.Images && item.Images.length > 0 && ( 
        <View style={styles.imageContainer}> 
          <Image 
            source={{ uri: item.Images[0] }} 
            style={styles.thumbnailImage} 
            resizeMode="cover" 
          /> 
          {item.Images.length > 1 && ( 
            <View style={styles.imageCountBadge}> 
              <Text style={styles.imageCountText}>+{item.Images.length - 1}</Text> 
            </View> 
          )} 
        </View> 
      )} 
    </TouchableOpacity> 
  );
 
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchComplaints().finally(() => setRefreshing(false));
  }, []);
 
  // Add this to refresh when the component mounts or when coming back to the screen
  useFocusEffect(
    React.useCallback(() => {
      if (auth.currentUser) {
        fetchComplaints();
      }
    }, [])
  );
 
  return ( 
    <SafeAreaView style={styles.container}> 
      <View style={styles.header}> 
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}> 
          <MaterialIcons name="arrow-back" size={24} color="#333" /> 
        </TouchableOpacity> 
        <Text style={styles.headerTitle}>Your Complaints</Text> 
      </View> 
 
      {error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#E57373" />
          <Text style={styles.errorText}>Error loading complaints</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchComplaints}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? ( 
        <ActivityIndicator size="large" color="#1666a8" style={styles.loader} /> 
    ) : ( 
        <FlatList 
          data={complaints} 
          renderItem={renderComplaintItem} 
          keyExtractor={item => item.id} 
          contentContainerStyle={styles.listContainer} 
          showsVerticalScrollIndicator={false} 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => ( 
            <View style={styles.emptyContainer}> 
              <MaterialIcons name="history" size={48} color="#666" /> 
              <Text style={styles.emptyText}> No complaints found</Text> 
            </View> 
          )} 
        /> 
      )} 
    </SafeAreaView> 
  ); 
}
 
const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA', 
  }, 
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEEEEE', 
  }, 
  backButton: { 
    padding: 8, 
  }, 
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginLeft: 16, 
    color: '#333', 
  }, 
  listContainer: { 
    padding: 16, 
  }, 
  complaintCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 2, 
    }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
  }, 
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent:
'space-between', 
    alignItems: 'center', 
    marginBottom: 8, 
  }, 
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333', 
    flex: 1, 
  }, 
  statusBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 12, 
    marginLeft: 8, 
  }, 
  statusText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#FFF', 
  }, 
  cardCategory: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 8, 
  }, 
  cardDescription: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 12, 
  }, 
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
  }, 
  cardLocation: { 
    fontSize: 14, 
    color: '#666', 
  }, 
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  }, 
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 32, 
  }, 
  emptyText: { 
    fontSize: 16, 
    color: '#666', 
    marginTop: 8, 
  }, 
  cardDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  imageContainer: {
    marginTop: 8,
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  imageCountBadge: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#E57373',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#64B5F6',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});