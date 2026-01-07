// components/ImageBottomSheet.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { wScale, hScale } from '../utils/styles/dimensions'; // Adjust the import as needed
import { BottomSheet } from '@rneui/base';

const ImageBottomSheet = ({ sheetRef, imageUri, onClose }) => {
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={[0, hScale(400)]} 
      borderRadius={10}
      renderContent={() => (
        <View style={styles.container}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: wScale(15),
    backgroundColor: '#fff',
    height: hScale(400),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  closeButton: {
    marginTop: hScale(10),
    padding: wScale(10),
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ImageBottomSheet;
