import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '../../../utils/navigation/NavigationService';
import { useIsFocused } from '@react-navigation/native';

const QRScanScreen = () => {
    const [scannedData, setScannedData] = useState(null);
    const navigation = useNavigation();
    const [reactivateScanner, setReactivateScanner] = useState(true);
    const isFocused = useIsFocused();

    // Parse UPI String
    const parseUPIData = (data) => {
        const obj = {};
        const queryString = data.split("?")[1];
        const parts = queryString.split("&");

        parts.forEach((item) => {
            const [key, value] = item.split("=");
            obj[key] = decodeURIComponent(value);
        });

        return obj;
    };

    // QR Scan Success
    const onSuccess = (e) => {
        setScannedData(e.data);

        const parsed = parseUPIData(e.data);

        // Scanner बंद (reactivate false)
        // अब same QR दोबारा scan नहीं होगा
        console.log("PARSED DATA:", parsed);

        // दूसरे पेज पर भेजना
        navigation.navigate("ShowUPIData", { upi: parsed });
    };
    useEffect(() => {
        if (isFocused) {
            setScannedData(null);
            setReactivateScanner(true);   // Scanner ON
        } else {
            setReactivateScanner(false);  // Scanner OFF
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            {reactivateScanner && (

                <QRCodeScanner
                    onRead={onSuccess}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    reactivate={false}   // Scan once only
                    showMarker={true}
                    markerStyle={styles.marker}
                    topContent={
                        <Text style={styles.centerText}>
                            Align the QR code inside the box.
                        </Text>
                    }
                    bottomContent={
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Scanner Ready</Text>
                        </TouchableOpacity>
                    }
                />
            )}

            {/* <Button title='asdfsdf'onPress={()=>{      
      navigation.navigate("ShowUPIData", );
}}/> */}
            {scannedData && (
                <View style={styles.resultBox}>
                    <Text style={styles.resultText}>Scanned Data:</Text>
                    <Text style={styles.resultValue}>{scannedData}</Text>
                </View>
            )}
        </View>
    );
};

export default QRScanScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    centerText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    marker: {
        borderColor: '#00E676',
        borderWidth: 2,
        borderRadius: 10,
    },
    button: {
        padding: 12,
        backgroundColor: '#1FAA59',
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    resultBox: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: '#222',
        padding: 16,
        borderRadius: 8,
    },
    resultText: {
        color: '#aaa',
        fontSize: 14,
    },
    resultValue: {
        color: '#00E676',
        fontSize: 16,
        marginTop: 4,
        fontWeight: '600',
    },
});
