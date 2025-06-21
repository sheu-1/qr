import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { supabase, auth, handleError } from '../lib/supabase';
import { useRouter } from "expo-router";
import { globalStyles } from './theme';
import { Ionicons } from '@expo/vector-icons';

function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      const { user } = await auth.signUp(email, password);

      if (!user) {
        Alert.alert('Error', 'Failed to create user account. Please try again.');
        return;
      }

      Alert.alert('Success', 'Account created successfully! Please check your email to verify your account.');
      router.replace('/login');

    } catch (error: any) {
      Alert.alert('Sign Up Failed', handleError(error));
      console.error('Signup process failed:', error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <TouchableOpacity onPress={() => router.replace("/welcome")}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Stack.Screen
        options={{
          title: 'Sign Up',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
        }}
      />
      <Text style={globalStyles.title}>Create Account</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[globalStyles.button, loading && { opacity: 0.7 }]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={globalStyles.buttonText}>{loading ? 'Creating...' : 'Sign Up'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SignupScreen;
