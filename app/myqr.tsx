// myqr.tsx
import { View, Text, StyleSheet, Button } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useRouter } from "expo-router";

export default function MyQR() {
  const router = useRouter();
  const phone = "0712345678";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your QR Code</Text>
      <QRCode value={phone} size={220} color="#000" backgroundColor="#fff" />

      <View style={styles.navButtons}>
        <Button title="Scan QR Code" onPress={() => router.push("/scan")} color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 20,
  },
  navButtons: {
    marginTop: 30,
  },
});
