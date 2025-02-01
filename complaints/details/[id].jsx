import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';

export default function ComplaintDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      const docRef = doc(db, 'Complant foram', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setComplaint({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error fetching complaint details:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1666a8" />
      </SafeAreaView>
    );
  }

  if (!complaint) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Complaint not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint Details</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.Status) }]}>
          <Text style={styles.statusText}>{complaint.Status || 'Pending'}</Text>
        </View>

        {/* Title Section */}
        <Text style={styles.title}>{complaint.Title}</Text>
        
        {/* Metadata Section */}
        <View style={styles.metadataContainer}>
          <View style={styles.metadataItem}>
            <MaterialIcons name="category" size={20} color="#666" />
            <Text style={styles.metadataText}>{complaint.Category}</Text>
          </View>
          <View style={styles.metadataItem}>
            <MaterialIcons name="access-time" size={20} color="#666" />
            <Text style={styles.metadataText}>{formatDate(complaint.CreatedAt)}</Text>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={20} color="#666" />
            <Text style={styles.locationText}>{complaint.Location}</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{complaint.Description}</Text>
        </View>

        {/* Images Section */}
        {complaint.Images && complaint.Images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {complaint.Images.map((imageUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Urgency Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Urgency Level</Text>
          <View style={[styles.urgencyBadge, { backgroundColor: getStatusColor(complaint.Urgency) }]}>
            <Text style={styles.urgencyText}>{complaint.Urgency}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  content: {
    flex: 1,
    padding: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  metadataContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  metadataText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginRight: 12,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  urgencyText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
}); 