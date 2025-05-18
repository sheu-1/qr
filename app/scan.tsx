// scan.tsx
import { View, Text, Alert, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function scan() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleScan = ({ data }: { data: string }) => {
    setScanned(true);
    Alert.alert("Scanned Phone", data);
  };

  if (hasPermission === null)
    return <Text style={styles.message}>Requesting camera permission...</Text>;
  if (hasPermission === false)
    return <Text style={styles.message}>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleScan}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <View style={styles.navButtons}>
          <Button
            title="Tap to Scan Again"
            onPress={() => setScanned(false)}
            color="#fff"
          />
        </View>
      )}

      <View style={styles.navButtons}>
        <Button title="My QR Code" onPress={() => router.push("/myqr")} color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  message: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 18,
  },
  navButtons: {
    padding: 20,
  },
});
