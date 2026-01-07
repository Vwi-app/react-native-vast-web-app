import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import { BottomSheet, Button } from '@rneui/themed';
import { colors } from '../utils/styles/theme';
import { hScale, SCREEN_HEIGHT, wScale } from '../utils/styles/dimensions';
import { APP_URLS } from '../utils/network/urls';
import useAxiosHook from '../utils/network/AxiosClient';
import DynamicButton from '../features/drawer/button/DynamicButton';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxUtils/store';

const ForgotPasswordModal = ({

  showForgotPasswordModal,
  setShowForgotPasswordModal,
  handleForgotPassword,
}) => {

  const { colorConfig } = useSelector((state: RootState) => state.userInfo)
  const { post } = useAxiosHook();
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateInput = (input) => {
    const isMobileValid = /^\d{10}$/.test(input);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    return isMobileValid || isEmailValid;
  };

  const ForgotPassword = useCallback(async () => {
    try {
      if (!validateInput(mobile))  {
        ToastAndroid.showWithGravity(
          'Please enter a valid mobile number or email address.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );

        return;
      }

      const data = { Email: mobile };
      const response = await post({
        url: APP_URLS.forgotLoginPassword,
        data: data,
      });

      if (response && response.Message) {

        ToastAndroid.showWithGravity(
          response.Message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
        setIsLoading(false);
        setShowForgotPasswordModal(false)
      } else {
        ToastAndroid.showWithGravity(
          'An error occurred. Please try again later.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      }
    } catch (error) {
      console.error('Error fetching dealer token status:', error);
      ToastAndroid.showWithGravity(
        'Failed to send password reset link. Please try again later.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  }, [mobile]);

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet
        isVisible={showForgotPasswordModal}
        onBackdropPress={() => {
          setIsLoading(false);

          setShowForgotPasswordModal(false)
        }}
        scrollViewProps={{ scrollEnabled: false }}
        containerStyle={{ backgroundColor: 'transparent' }}
      >
        <View style={styles.container}>
          <View style={[styles.header, { backgroundColor: colorConfig.secondaryColor }]}>
            <Text style={styles.headerText}>Forgot Password</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.infoText}>
              Enter your mobile number or email ID to reset your password
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter Mobile Number or Email ID"
                onChangeText={setMobile}
                accessibilityLabel="Forgot Password Input"
              />
            </View>

            <DynamicButton title={isLoading ? <ActivityIndicator color={colorConfig.labelColor} size={'large'} /> : 'Send Password'}
              onPress={() => {
                setIsLoading(true);
                ForgotPassword()
              }} 
              disabled={isLoading}
            />
          </View>
        </View>

      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: SCREEN_HEIGHT / 1.5,
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  header: {
    paddingVertical: hScale(15),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: wScale(20),
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  content: {
    paddingHorizontal: wScale(20),
    paddingTop: hScale(15)
  },
  infoText: {
    marginTop: 8,
    fontSize: wScale(20),
    fontWeight: 'bold',
    textAlign: 'center',
    color:colors.black75
  },
  inputContainer: {
    marginBottom: wScale(40),
  },
  input: {
    top: hScale(20),
    width: '100%',
    height: hScale(50),
    borderColor: colors.ticker_border,
    borderWidth: 1,
    paddingHorizontal: wScale(10),
    fontSize: wScale(18),
    borderRadius: 5,
    color: colors.black75
  },
 

});

export default ForgotPasswordModal;
