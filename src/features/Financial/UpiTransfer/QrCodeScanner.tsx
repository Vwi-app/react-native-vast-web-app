import React, { useState } from 'react';
import { StyleSheet, Text, View, Linking, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
// import { RNCamera } from 'react-native-camera';

const QrCodeScanner = () => {
  const [scannedData, setScannedData] = useState('');

  const onSuccess = (e: any) => {
    setScannedData(e.data);
    Alert.alert("QR Code Scanned", e.data, [
      { text: "OK" },
      { text: "Visit URL", onPress: () => Linking.openURL(e.data) }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.auto}
        topContent={
          <Text style={styles.centerText}>
            Scan the QR Code
          </Text>
        }
        bottomContent={
          <Text style={styles.bottomText}>
            Scanned Data: {scannedData}
          </Text>
        }
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  bottomText: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
  },
});

export default QrCodeScanner;
