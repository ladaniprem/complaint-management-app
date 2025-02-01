import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Image, SafeAreaView } from 'react-native';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/images/login.png')} 
          style={styles.image}
        />
        <ActivityIndicator size="large" color="#1666a8" style={styles.loader} />
      </View>
      <Redirect href="/login" />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  loader: {
    marginTop: 20,
  },
}); 