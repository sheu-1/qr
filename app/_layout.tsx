import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import SplashScreen from '../components/SplashScreen';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [showSplash, setShowSplash] = useState(true);

  if (isLoading || showSplash) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        {!user ? (
          // Auth screens
          <>
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="reset-password" />
          </>
        ) : (
          // Main app with tabs
          <Stack.Screen name="(tabs)" />
        )}
      </Stack>
    </>
  );
}