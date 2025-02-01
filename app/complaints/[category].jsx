import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Category data with subcategories
export const categoryData = {
  'public-services': {
    title: 'Public Services',
    color: '#4CAF50',
    icon: 'public',
    subcategories: [
      { 
        id: 'roads', 
        title: 'Roads & Infrastructure', 
        description: 'Potholes, Streetlights, Drainage Issues',
        icon: 'construction'
      },
      { 
        id: 'water', 
        title: 'Water Supply & Sewage', 
        description: 'Water Supply Issues, Sewage Problems',
        icon: 'water-drop'
      },
      { 
        id: 'electricity', 
        title: 'Electricity Issues', 
        description: 'Power Cuts, Faulty Meters',
        icon: 'electrical-services'
      },
      { 
        id: 'waste', 
        title: 'Waste Management', 
        description: 'Garbage Collection, Dumping',
        icon: 'delete'
      },
      { 
        id: 'transport', 
        title: 'Public Transport', 
        description: 'Delays, Mismanagement',
        icon: 'directions-bus'
      }
    ]
  },
  'consumer': {
    title: 'Consumer Issues',
    color: '#2196F3',
    icon: 'shopping-cart',
    subcategories: [
      { id: 'product', title: 'Product Quality', description: 'Defective Products, False Advertising', icon: 'inventory-2' },
      { id: 'service', title: 'Service Quality', description: 'Poor Service, Contract Issues', icon: 'support-agent' },
      { id: 'pricing', title: 'Pricing Issues', description: 'Overcharging, Hidden Fees', icon: 'attach-money' },
      { id: 'delivery', title: 'Delivery Problems', description: 'Late Delivery, Wrong Items', icon: 'local-shipping' }
    ]
  },
  'government': {
    title: 'Government',
    color: '#9C27B0',
    icon: 'account-balance',
    subcategories: [
      { id: 'documents', title: 'Document Services', description: 'ID Cards, Certificates, Licenses', icon: 'description' },
      { id: 'schemes', title: 'Government Schemes', description: 'Benefits, Subsidies', icon: 'policy' },
      { id: 'corruption', title: 'Corruption', description: 'Bribery, Misuse of Power', icon: 'gavel' }
    ]
  },
  'workplace': {
    title: 'Workplace',
    color: '#FF5722',
    icon: 'work',
    subcategories: [
      { id: 'harassment', title: 'Workplace Harassment', description: 'Bullying, Discrimination', icon: 'warning' },
      { id: 'salary', title: 'Salary Issues', description: 'Delayed Payment, Incorrect Deductions', icon: 'payments' },
      { id: 'safety', title: 'Safety Concerns', description: 'Unsafe Conditions, Health Hazards', icon: 'health-and-safety' }
    ]
  },
  'healthcare': {
    title: 'Healthcare',
    color: '#E91E63',
    icon: 'local-hospital',
    subcategories: [
      { id: 'treatment', title: 'Medical Treatment', description: 'Quality of Care, Malpractice', icon: 'medical-services' },
      { id: 'billing', title: 'Hospital Billing', description: 'Overcharging, Insurance Issues', icon: 'receipt-long' },
      { id: 'facilities', title: 'Hospital Facilities', description: 'Cleanliness, Equipment', icon: 'cleaning-services' }
    ]
  },
  'housing': {
    title: 'Housing & Property',
    color: '#795548',
    icon: 'home',
    subcategories: [
      { id: 'maintenance', title: 'Maintenance Issues', description: 'Repairs, Services', icon: 'build' },
      { id: 'rent', title: 'Rental Issues', description: 'Disputes, Illegal Practices', icon: 'real-estate-agent' },
      { id: 'construction', title: 'Construction Quality', description: 'Building Issues, Safety', icon: 'architecture' }
    ]
  },
  'financial': {
    title: 'Financial & Banking',
    color: '#607D8B',
    icon: 'account-balance-wallet',
    subcategories: [
      { id: 'banking', title: 'Banking Services', description: 'Account Issues, Services', icon: 'account-balance' },
      { id: 'fraud', title: 'Financial Fraud', description: 'Scams, Unauthorized Transactions', icon: 'security' },
      { id: 'loans', title: 'Loan Issues', description: 'EMI, Interest Rates', icon: 'request-quote' }
    ]
  },
  'education': {
    title: 'Education',
    color: '#FF9800',
    icon: 'school',
    subcategories: [
      { id: 'fees', title: 'Fee Related', description: 'Fee Structure, Refunds', icon: 'payments' },
      { id: 'quality', title: 'Education Quality', description: 'Teaching Standards, Facilities', icon: 'auto-stories' },
      { id: 'admission', title: 'Admission Issues', description: 'Process, Documentation', icon: 'how-to-reg' }
    ]
  },
  'cybercrime': {
    title: 'Cybercrime',
    color: '#F44336',
    icon: 'security',
    subcategories: [
      { id: 'online-fraud', title: 'Online Fraud', description: 'Phishing, Identity Theft', icon: 'phishing' },
      { id: 'cyberbullying', title: 'Cyberbullying', description: 'Harassment, Threats', icon: 'block' },
      { id: 'data-breach', title: 'Data Privacy', description: 'Data Leaks, Unauthorized Access', icon: 'privacy-tip' }
    ]
  }
};

export default function Category() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const categoryInfo = categoryData[category];

  if (!categoryInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Category Not Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryInfo.title}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>Select a subcategory to file your complaint</Text>
        
        {categoryInfo.subcategories.map((subcategory, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push({
              pathname: '/complaints/new',
              params: { category, subcategory: subcategory.id }
            })}
          >
            <View style={[styles.cardIcon, { backgroundColor: categoryInfo.color }]}>
              <MaterialIcons name={subcategory.icon} size={24} color="#FFF" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{subcategory.title}</Text>
              <Text style={styles.cardDescription}>{subcategory.description}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        ))}
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
}); 