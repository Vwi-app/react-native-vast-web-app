import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, PermissionsAndroid } from 'react-native';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { openSettings } from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';

const CameraScreen = ({ onQRCodeScan }) => {
  const cameraRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    const requestCameraPermission = useCallback(async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take photos and videos.',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'Permission Required',
            textBody: 'Please grant the camera permission from settings.',
            button: 'OK',
            onPressButton: () => {
              Dialog.hide();
              openSettings().catch(() => console.warn('Cannot open settings'));
            },
          });
        }
      } catch (err) {
        console.warn(err);
      }
    }, []);
    
    requestCameraPermission();
  }, []);

  const onSuccess = (e) => {
    console.log(e);
    if (onQRCodeScan) {
      onQRCodeScan(e.data); 
    }
    Linking.openURL(e.data).catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        topContent={
          <Text>
            Go to{' '}
            <Text>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
          </Text>
        }
        bottomContent={
          <TouchableOpacity>
            <Text>OK. Got it!</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraScreen;
