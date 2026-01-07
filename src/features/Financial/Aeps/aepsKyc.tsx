import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet, AsyncStorage, ToastAndroid } from 'react-native';
import { useDeviceInfoHook } from '../../../utils/hooks/useDeviceInfoHook';
import { useNavigation } from '@react-navigation/native';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import DynamicButton from '../../drawer/button/DynamicButton';
import { colors } from '../../../utils/styles/theme';
import OTPModal from '../../../components/OTPModal';
import DeviceConnected from './checkDeviceConnected';
import { useLocationHook } from '../../../hooks/useLocationHook';
import ShowLoader from '../../../components/ShowLoder';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';

const Aepsekyc = () => {
  const [MailOtp, setMailOtp] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpModalVisible1, setOtpModalVisible1] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [primarykeyid, setprimarykeyid] = useState('');
  const [encodeFPTxnId, setencodeFPTxnId] = useState('');
  const navigation = useNavigation<any>();
  const { get, post } = useAxiosHook();
  const { userId, Loc_Data, activeAepsLine } = useSelector((state: RootState) => state.userInfo);

  const { latitude, longitude } = Loc_Data;

  const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
    useDeviceInfoHook();
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const dayOfWeek = days[now.getDay()];
  const dayOfMonth = now.getDate();
  const month = months[now.getMonth()];
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const formattedDate = `${dayOfWeek} ${dayOfMonth} ${month} ${hours}:${minutes}:${seconds}`;

  const Model = getMobileDeviceId();

  const handleOtpSend = async () => {
    kycotpsend(Model);
    setIsLoading(true);
    // try {

    //   setIsLoading(false);
    //   setShowOtpInput(true);
    // } catch (error) {
    //   setIsLoading(false);
    //   Alert.alert('Error', 'Failed to send OTP');
    // }
  };

  useEffect(() => {
    console.log(longitude, Model);
    if (latitude?.length > 1 && longitude?.length > 1) {
      setIsLoading(false);
    } else {
      ToastAndroid.show('Please wait for fetching lat, long', ToastAndroid.SHORT);
    }

  }, [longitude, latitude])

  const kycotpsend = useCallback(async (deviceid) => {
    setIsLoading(true);
    try {
      const url = activeAepsLine ? `${APP_URLS.sendekycotpNifi}` : `${APP_URLS.sendekycotp}`;
      console.log(url, latitude, '*******************');

      const data1 = {
        latitude: latitude, // Default to 0 if latitude is null or undefined
        longitude: longitude, // Default to 0 if longitude is null or undefined
        ImeiNo: deviceid ?? '', // Default to empty string if deviceid is null or undefined
      };

      const data = JSON.stringify(data1);
      console.log(data);

      const headers = {
        trnTimestam: formattedDate ?? '', // Ensure formattedDate is not null
        deviceIMEI: deviceid ?? '', // Ensure deviceid is available
      };

      console.log(headers);

      // Make the POST request
      const response = await post({
        url: url,
        data: data,
        config: {
          headers,
        },
      });

      console.log('Responseee:', response);

      if (response) {
        const { Status, Message, primaryKeyId, encodeFPTxnId } = response;
        setprimarykeyid(primaryKeyId);
        setencodeFPTxnId(encodeFPTxnId);
        console.log(Status, Message, primaryKeyId, encodeFPTxnId);

        if (Status) {
          setShowOtpInput(true); // Show OTP input if the status is successful
          ToastAndroid.showWithGravity(
            `Success: ${Message}`,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        } else {
          Alert.alert('Error', `${Message}`);
        }
      } else {
        throw new Error('Failed to send KYC OTP');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Set loading to false once the request is complete
    }
  }, [
    latitude,
    longitude,
    formattedDate
  ]);


  const handleVerifyOtp = async () => {
    setShowOtpInput(false);

    setIsLoading(true);
    setOtpModalVisible1(true);
    const id = await getMobileDeviceId()
    try {
      verifyotp(MailOtp, id, primarykeyid, encodeFPTxnId);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to verify OTP');
    }
  };


  const verifyotp = useCallback(async (MailOtp, deviceid, prikey, encodeFPTxnid) => {
    try {
      const requestBody = {
        latitude: latitude,
        longitude: longitude,
        ImeiNo: deviceid,
        otp: MailOtp,
        primaryKeyId: prikey,
        encodeFPTxnId: encodeFPTxnid
      };

      console.log(requestBody);
      const data = JSON.stringify(requestBody);
      const response = await post({
        url: activeAepsLine ? 'AEPS/api/Nifi/data/EkycVerifyOtp' : 'AEPS/api/data/EkycVerifyOtp',
        data: data,
      });

      console.log(data);
      console.log(response, '~~~~~~~~~~~~~~~~~~~~');
      console.log(data);
      // {"Message": "Otp is expired..Please request for new otp", "Status": false}

      if (response) {
        if (response.Status === true) {
          navigation?.navigate("Aepsekycscan");
        } else {
          Alert.alert('Error', `${response.Message} !!!`);
        }
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      console.error(error);
      // Handle errors here
    }
  }, [latitude, longitude]); //
  console.log(latitude, longitude)
  return (
    <View style={styles.main}>
      <AppBarSecond title={'E-Kyc'} />
      <ScrollView>
        {/* <DeviceConnected/> */}

        <View style={styles.container}>
          {!showOtpInput ? (
            <View style={styles.infoContainer}>
              <Text style={styles.title}>E-KYC is Not Completed </Text>
              <Text style={styles.infoText}>
                1. Dear Customer, Your E-KYC is Not Completed. So Firstly Complete Your E-KYC.
              </Text>
              <Text style={styles.infoText}>
                2. For Complete Your E-KYC please Click to 'OK' Button, after click you receive an OTP
                on Your Registered Mobile Number
              </Text>
              <Text style={styles.infoText}>
                3. Please firstly Connect Your Mobile with Finger Print Scanner Device (Morpho, Mantra, Startek).
              </Text>
              <DynamicButton
                onPress={handleOtpSend}
                title={isLoading ? 'Loading...' : 'KYC NOW'}
                disabled={isLoading}
              />

            </View>
          ) : (
            <View style={styles.infoContainer}>
              {/* <Text style={styles.title}>Please Enter Your mobile number or email ID </Text>
            
            
              <DynamicButton
                onPress={handleVerifyOtp}
                disabled={isLoading}
                title={isLoading ? 'Verifying...' : 'Submit OTP'}
              /> */}

              <OTPModal
                inputCount={6}

                setShowOtpModal={setOtpModalVisible1}
                disabled={MailOtp.length !== 6}
                showOtpModal={otpModalVisible1}
                setMobileOtp={setMailOtp}
                //  setEmailOtp={setMailOtp}
                verifyOtp={() => {
                  handleVerifyOtp()
                }}
              />
            </View>
          )}
        </View>

        {isLoading && <ShowLoader />}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: wScale(15)
  },
  infoContainer: {
    marginTop: hScale(20),
  },
  title: {
    fontSize: hScale(14),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hScale(10),
    color: '#333',
    textTransform: 'capitalize'
  },
  infoText: {
    fontSize: hScale(14),
    textAlign: 'justify',
    marginBottom: hScale(10),
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: hScale(10),
    paddingHorizontal: hScale(15),
    borderRadius: 8,
    width: '100%',
    fontSize: wScale(18),
    color: colors.black75,
    marginBottom: hScale(20)
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: hScale(30),
    borderRadius: 15,
    marginVertical: hScale(20),
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: hScale(15),
    paddingHorizontal: hScale(20),
    borderRadius: 10,
    marginVertical: hScale(20),
  },

});

export default Aepsekyc;
