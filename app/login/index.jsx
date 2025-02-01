import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();

  return (
    <SafeAreaView  style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.image}
          />
          <Text style={styles.title}>SamadhanSetu</Text>
          <Text style={styles.subtitle}>Your Voice, Our Priority</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="shield-check" size={24} color="#1666a8" />
            <Text style={styles.featureText}>Secure & Anonymous Reporting</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#1666a8" />
            <Text style={styles.featureText}>Quick Resolution Process</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="chart-line" size={24} color="#1666a8" />
            <Text style={styles.featureText}>Real-time Status Updates</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={() => router.push('/login/signIn')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={() => router.push('/login/signUp')}
          >
            <Text style={styles.signUpButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Stay Connected, Stay Safe</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1666a8',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#3a9874',
    marginTop: 8,
  },
  featuresContainer: {
    marginVertical: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#1666a8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1666a8',
  },
  signUpButtonText: {
    color: '#1666a8',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    fontSize: 14,
  },
});
