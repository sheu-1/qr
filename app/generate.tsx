import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function GenerateScreen() {
  const [phone, setPhone] = useState('');
  const [showQR, setShowQR] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Generate QR{"\n"}(Guest)</Text>
      <TextInput
        placeholder="Enter Phone Number"
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity style={styles.button} onPress={() => setShowQR(true)}>
        <Text style={styles.buttonText}>Generate QR Code</Text>
      </TouchableOpacity>
      {showQR && <QRCode value={phone} size={200} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
