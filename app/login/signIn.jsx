import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Image, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { auth } from "../../config/firebaseconfig";  
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("Digant.malviya5@gmail.com");
  const [password, setPassword] = useState("Password@123");

  const OnSignInClick = () => {
    if (email === "" || password === "") {
      ToastAndroid.show("Please fill all details", ToastAndroid.BOTTOM);
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        router.push('/(tabs)/Home');
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-credential') {
          ToastAndroid.show("Invalid Email or Password", ToastAndroid.BOTTOM);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.logo}
          />
          <Text style={styles.textheader}>Welcome Back!</Text>
          <Text style={styles.subTextheader}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter your password"
              secureTextEntry={true}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={OnSignInClick}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/login/signUp")}>
            <Text style={styles.footerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 40,
  },
  textheader: {
    fontSize: 28,
    fontWeight: "900",
    color: '#1666a8',
    marginTop: 10,
  },
  subTextheader: {
    fontSize: 16,
    marginTop: 4,
    color: '#666',
  },
  form: {
    marginTop: 20,
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
    height: 50,
    borderRadius: 12,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#1666a8',
    fontSize: 14,
  },
  button: {
    height: 50,
    backgroundColor: '#1666a8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#1666a8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
});
