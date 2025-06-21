import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from "expo-router";
import { auth, handleError } from '../lib/supabase';
import { globalStyles } from './theme';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      const { user } = await auth.signIn(email, password);

      if (user) {
        Alert.alert('Success', 'Logged in successfully!');
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', handleError(error));
      console.error('Error logging in:', error.message);
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
      <Text style={globalStyles.title}>Login</Text>

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
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={globalStyles.buttonText}>{loading ? 'Signing in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[globalStyles.button, { backgroundColor: '#000' }]}
        onPress={() => router.push("/reset-password")}
      >
        <Text style={[globalStyles.buttonText, { color: '#fff' }]}>
          Forgot password?
        </Text>
      </TouchableOpacity>
    </View>
  );
}
