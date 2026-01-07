import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BusCom = () => {
  return (
    <View style={styles.container}>
      <Text>BusCom Component</Text>
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

export default BusCom;
