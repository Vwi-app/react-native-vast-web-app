import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { hScale, wScale } from '../utils/styles/dimensions';
import CloseAadharSvg from '../features/drawer/svgimgcomponents/CloseAadharSvg';
import DynamicButton from '../features/drawer/button/DynamicButton';

const NotFoundScreen = ({ description, buttontitle, img, title, title2 }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const zoomInOut = () => {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2, // Zoom in
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1, // Zoom out
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => zoomInOut()); // Repeat the animation
    };

    zoomInOut(); // Start the animation

    return () => {
      scaleValue.stop(); // Cleanup on unmount
    };
  }, [scaleValue]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View>
          <View style={styles.iconContainer}>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <CloseAadharSvg />
            </Animated.View>
          </View>
          <View style={styles.cutout} />
        </View>
        <Text style={styles.pageNotFoundText}>{title2}</Text>
        <Text style={styles.descriptionText}>{description}</Text>
        {/* <DynamicButton title={'Go Back'}  onPress={null}/> */}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wScale(15),
    backgroundColor: '#c9c2c1',
    paddingVertical: hScale(15),
  },
  card: {
    paddingHorizontal: wScale(40),
    paddingVertical: hScale(30),
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 5,
    textAlign: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#2a3d82',
    borderRadius: 50,
    alignItems: 'center',
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 81,
    width: wScale(300),
    paddingVertical: 20,
  },
  pageNotFoundText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    paddingTop: hScale(70),
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'justify',
    marginBottom: 20,
  },
  cutout: {
    width: 0,
    height: 0,
    borderLeftWidth: 0,
    borderRightWidth: 115,
    borderTopWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#2a3d82',
    position: 'absolute',
    left: wScale(65),
    bottom: hScale(-85),
    zIndex: -99,
    borderRadius: 5,
  },
});

export default NotFoundScreen;
