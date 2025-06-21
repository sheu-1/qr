import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => router.push('/login')}>
          <Text style={[styles.buttonText, styles.loginButtonText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={() => router.push('/signup')}>
          <Text style={[styles.buttonText, styles.signupButtonText]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 40,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
  },
  loginButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  signupButton: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  loginButtonText: {
    color: '#ffffff',
  },
  signupButtonText: {
    color: '#000000',
  },
});
