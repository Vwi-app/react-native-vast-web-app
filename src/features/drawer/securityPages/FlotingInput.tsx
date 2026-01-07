import React, { useState, useEffect } from 'react';
import { TextInput, View, Animated, StyleSheet } from 'react-native';
import { hScale, wScale } from '../../../utils/styles/dimensions';

const FlotingInput = ({ inputstyle, labelinputstyle, label, onChangeTextCallback, autoFocus = false, ...props }) => {
  const [isFocused, setIsFocused] = useState(autoFocus);
  const value = props.value;
  const animatedFocused = new Animated.Value(isFocused || value ? 1 : 0);
  useEffect(() => {
    if (autoFocus || value) {
      setIsFocused(true);
      Animated.timing(animatedFocused, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [autoFocus]);

  const handleFocus = () => {
    setIsFocused(true);

    if (!value?.trim()) {
      onChangeTextCallback?.('');
    }
  };

  const handleBlur = () => {
    if (value && !value?.trim()) {
      setIsFocused(false);

      Animated.timing(animatedFocused, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault(); // Prevent pasting text
  };

  const labelStyle = {
    position: 'absolute',
    left: wScale(12),
    justifyContent: 'center',
    alignItems: 'center',


    zIndex: animatedFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),

    top: animatedFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [hScale(8), hScale(0)],
    }),
    fontSize: animatedFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [wScale(20), wScale(14)],
    }),
    color: animatedFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#000', '#1f1d1d'],
    }),
    backgroundColor: animatedFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', 'rgba(255,255,255,1)'],
    }),
    height: animatedFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [hScale(48), hScale(18)],
    }),
    paddingHorizontal: wScale(2),

    textAlignVertical: 'center',
  };

  return (
    <View style={styles.main}>
      <Animated.Text numberOfLines={1} ellipsizeMode="tail"
        style={[labelStyle, labelinputstyle, autoFocus && { opacity: 1 },]}>{label}</Animated.Text>

      <TextInput

        {...props}
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.input, inputstyle]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={"#000"}
        onChangeText={(value) => {
          onChangeTextCallback && onChangeTextCallback(value);
        }}
        autoFocus={autoFocus}
        cursorColor="#000"
      >

      </TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingTop: hScale(8.9),
  },
  input: {
    borderWidth: wScale(0.5),
    borderColor: '#000',
    borderRadius: wScale(5),
    paddingLeft: wScale(15),
    height: hScale(48),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
    fontSize: hScale(20),
    marginBottom: hScale(18),

  },
});

export default FlotingInput;
