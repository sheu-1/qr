import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect, Stack } from 'expo-router';
import { supabase } from '../../lib/supabase';

interface QRCodeRecord {
  id: string;
  account_number: string;
  image_url: string;
  created_at: string;
}

export default function MyQRScreen() {
  const [qrCodes, setQrCodes] = useState<QRCodeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchMyQRCodes = async () => {
        try {
          setLoading(true);
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            setQrCodes([]);
            return;
          }

          const { data, error } = await supabase
            .from('qr_codes')
            .select('*')
            .not('image_url', 'is', null) // Only fetch records that have an image
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching QR codes:', error);
            setQrCodes([]);
          } else {
            setQrCodes(data || []);
          }
        } catch (e: any) {
          console.error('An unexpected error occurred:', e);
          setQrCodes([]);
        } finally {
          setLoading(false);
        }
      };

      fetchMyQRCodes();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'My Saved QR Codes' }} />
      {qrCodes.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.subtitle}>You haven't saved any QR codes yet.</Text>
        </View>
      ) : (
        <FlatList
          data={qrCodes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.qrItem}>
              <Image source={{ uri: item.image_url }} style={styles.qrImage} />
              <View style={styles.qrInfo}>
                <Text style={styles.accountText}>Account: {item.account_number}</Text>
                <Text style={styles.dateText}>
                  Created: {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  listContent: {
    padding: 10,
  },
  qrItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  qrImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 5,
  },
  qrInfo: {
    flex: 1,
  },
  accountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
