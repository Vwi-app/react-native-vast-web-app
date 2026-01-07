import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LocationSvg from '../features/drawer/svgimgcomponents/LocationSvg';
import LocationCmsSvg from '../features/drawer/svgimgcomponents/LocationCmsSvg';
import { hScale, wScale } from '../utils/styles/dimensions';

const LocationModal = ({ visible, onClose }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Please Note That it's{"\n"} <Text style={styles.important}>Important</Text></Text>
                    <View style={{ alignSelf: 'center' }}>
                        <LocationCmsSvg />

                    </View>
                    <Text style={styles.message}>
                        You are currently outside the geofencing area of the Customer Center, so we cannot allow you to proceed.
                    </Text>

                    <Text style={styles.solutionTitle}>What can be the solution?</Text>
                    <Text style={styles.solutionText}>1. If you are in the correct location, turn on or reset your Google Location.</Text>
                    <Text style={styles.solutionText}>2. If you are outside, move inside the geofence. If you are very close to the geofence but not inside, move inside and try again.</Text>
                    <Text style={styles.solutionText}>3. Turn on Google Location Accuracy: This will ensure your phone is getting the most accurate location info.</Text>
                    <Text style={styles.solutionText}>4. If there is another issue, call customer service.</Text>

                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>I Understood</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default LocationModal;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: wScale(10),
        paddingVertical: wScale(20),
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    important: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 35,
        textTransform: 'uppercase',
        letterSpacing: 0,

    },
    message: {
        color: '#fff',
        fontSize: 14,
        marginVertical: hScale(10),
        textAlign: 'justify',
        fontWeight: 'bold'
    },
    solutionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    solutionText: {
        color: '#fff',
        fontSize: 13,
        marginBottom: 5,
        textAlign: 'justify',
    },
    button: {
        marginTop: 15,
        backgroundColor: '#ffff66',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});
