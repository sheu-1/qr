import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import QRCodeSVG from 'react-native-qrcode-svg';
import { supabase } from '../../lib/supabase';
import { useState, useRef } from 'react';
import { decode } from 'base64-arraybuffer';

export default function GenerateScreen() {
  const [accountNumber, setAccountNumber] = useState('');
  const [qrCodeId, setQrCodeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const qrCodeRef = useRef<any>(null);

  const generateAndUploadQRCode = async () => {
    if (!accountNumber) {
      Alert.alert('Error', 'Please enter an account number.');
      return;
    }

    setLoading(true);
    setQrCodeId(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // 1. Insert data and get the new record's ID
      const { data: newQrCode, error: insertError } = await supabase
        .from('qr_codes')
        .insert({ account_number: accountNumber, user_id: user.id })
        .select()
        .single();

      if (insertError) throw insertError;
      if (!newQrCode) throw new Error('Failed to create QR code record.');

      // Set the ID in state to render the QR code component
      setQrCodeId(newQrCode.id);

      // Use a timeout to allow the QR code to render before we grab the image data
      setTimeout(() => {
        if (qrCodeRef.current) {
          qrCodeRef.current.toDataURL(async (dataURL: string) => {
            try {
              const base64Data = dataURL.replace('data:image/png;base64,', '');
              const filePath = `${user.id}/${newQrCode.id}.png`;

              // 2. Upload the image to Supabase Storage
              const { error: uploadError } = await supabase.storage
                .from('qr-images')
                .upload(filePath, decode(base64Data), { contentType: 'image/png' });

              if (uploadError) throw uploadError;

              // 3. Get the public URL of the uploaded image
              const { data: { publicUrl } } = supabase.storage
                .from('qr-images')
                .getPublicUrl(filePath);

              // 4. Update the database record with the image URL
              const { error: updateError } = await supabase
                .from('qr_codes')
                .update({ image_url: publicUrl })
                .eq('id', newQrCode.id);

              if (updateError) throw updateError;

              Alert.alert('Success', 'QR Code generated and saved!');
            } catch (error: any) {
              console.error('Error saving QR image:', error);
              Alert.alert('Error', 'Failed to save QR code image.');
            } finally {
              setLoading(false);
            }
          });
        }
      }, 200);

    } catch (error: any) {
      console.error('Error generating QR code:', error);
      Alert.alert('Error', `Failed to generate QR code: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Generate QR Code' }} />

      <Text style={styles.label}>Enter Account Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your account number"
        value={accountNumber}
        onChangeText={setAccountNumber}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={generateAndUploadQRCode}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Generating...' : 'Generate & Save QR Code'}</Text>
      </TouchableOpacity>

      {qrCodeId && (
        <View style={styles.qrContainer}>
          <QRCodeSVG
            getRef={qrCodeRef}
            value={qrCodeId}
            size={200}
            color="black"
            backgroundColor="white"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});