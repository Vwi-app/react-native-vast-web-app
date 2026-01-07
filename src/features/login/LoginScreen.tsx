import React, { useCallback, useEffect, useState, version } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  NativeModules,
  Alert,
  ToastAndroid,
  AsyncStorage,
  Modal,
  Linking,
  Button,
  Animated,
  Easing,
  Platform,
  Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { decryptData, encrypt } from '../../utils/encryptionUtils';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../utils/languageUtils/I18n';
import LinearGradient from 'react-native-linear-gradient';
import { hScale, wScale } from '../../utils/styles/dimensions';
import {
  ALERT_TYPE,
  Dialog,

} from 'react-native-alert-notification';
import messaging from '@react-native-firebase/messaging';

import { APP_URLS } from '../../utils/network/urls';
import {
  setAuthToken,
  setColorConfig,
  setFcmToken,
  setIsDealer,
  setRefreshToken,
  setUserId,
} from '../../reduxUtils/store/userInfoSlice';
import useAxiosHook from '../../utils/network/AxiosClient';
import { useLocationHook } from '../../hooks/useLocationHook';
import { colors } from '../../utils/styles/theme';
import { useDeviceInfoHook } from '../../utils/hooks/useDeviceInfoHook';
import DynamicButton from '../drawer/button/DynamicButton';
import DeviceInfo, { getBrand, getBuildId, getBuildNumber, getCarrier, getDevice, getDeviceId, getDeviceName, getIpAddress, getModel, getSerialNumber, getSystemName, getSystemVersion, getUniqueId, getVersion } from 'react-native-device-info';
import ShowEye from '../drawer/HideShowImgBtn/ShowEye';
import ForgotPasswordModal from '../../components/ForgotPassword';
import { SvgUri, } from 'react-native-svg';
import SplashScreen from './SplashScreen';
import OTPModal from '../../components/OTPModal';
import ShowLoader from '../../components/ShowLoder';
import CheckSvg from '../drawer/svgimgcomponents/CheckSvg';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import registerNotification, { listenFCMDeviceToken, onReceiveNotification2 } from '../../utils/NotificationService';
import { appendLog, generateUniqueId, requestStoragePermission } from '../../components/log_file_Saver';

const LoginScreen = () => {
  const { colorConfig, Loc_Data ,} = useSelector((state: RootState) => state.userInfo);

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('7414088555');
  const [uniqueId, setUniqueId] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [androidVersion, setCurrentAndroidVersion] = useState('');
  const [brand, setBrand] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const [remember, setRemember] = useState(false);
  const [passwordimgreadius, setPasswordimgreadius] = useState(Number);
  const [Radius1, setRadius1] = useState(Number);
  const [Radius2, setRadius2] = useState(Number);
  const [svg, setSvg] = useState([])
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { latitude, longitude, isLocationPermissionGranted, getLocation, checkLocationPermissionStatus, getLatLongValue } = useLocationHook();
  const { authToken, refreshToken } = useSelector(

    (state: RootState) => state.userInfo,
  );
  const [ShowOtpModal, setShowOtpModal] = useState(false);
  const [isVer, setIsVer] = useState(true);

  const { post, get } = useAxiosHook();


  const getDeviceInfo = useCallback(async () => {
    const buildId = await getBuildId();
    await getLocation();
    const brand = getBrand();
    setBrand(brand);

    const ip = await getIpAddress();
    setIpAddress(ip);

    const model = getModel();
    setModelNumber(model);

    const serialNum = await getUniqueId();
    setUniqueId(serialNum);

    const systemVersion = getSystemVersion();

    setCurrentAndroidVersion(systemVersion)
    console.log('**DATA')
  }, [])
  //console.log('**latitude, longitude', latitude, longitude);

  useEffect(() => {
    const onFocusCall = navigation.addListener('focus', async () => {
      // console.log('**DATA_PERM11_CALLED', isPhonePermissionGranted);
      console.log('**DATA_PERM77_CALLED', isLocationPermissionGranted);
      const Model = getMobileDeviceId();
    })
    return onFocusCall;
  }, [navigation, latitude, longitude]);

  const extsvg = (svgarray) => {
    const result = {};
    svgarray.forEach((item) => {
      result[item.name] = item.svg;
    });
    return result;
  };
  const [loading, setLoading] = useState(true);

  const saveCredentials = async (id: string, password: string) => {
    try {
      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('userPassword', password);
      console.log('Credentials saved successfully');
    } catch (error) {
      console.log('Error saving credentials: ', error);
    }
  };

  const getCredentials = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      const password = await AsyncStorage.getItem('userPassword');

      if (id !== null && password !== null) {
        setUserEmail(id);
        setUserPassword(password);
        console.log('Retrieved credentials: ', id, password);
        return { id, password };
      } else {
        console.log('No credentials found');
        return null;
      }
    } catch (error) {
      console.log('Error retrieving credentials: ', error);
      return null;
    }
  };

  const removeCredentials = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userPassword');
      console.log('Credentials removed successfully');
    } catch (error) {
      console.log('Error removing credentials: ', error);
    }
  };



  useEffect(() => {
    getCredentials()
    const fetchData = async () => {
      try {
        getDeviceInfo();

        const model = getMobileDeviceId();
        console.log(model, "Modelaaaaaaaa");

        const res = await get({ url: APP_URLS.getColors });

        console.log(res, '************************************************************')
        if (res) {
          dispatch(
            setColorConfig({
              primaryColor: res.BACKGROUNDCOLOR1,
              secondaryColor: res.BACKGROUNDCOLOR2,
              primaryButtonColor: res.BUTTONCOLOR1,
              secondaryButtonColor: res.BUTTONCOLOR2,
              labelColor: res.LABLECOLOR,
            }),
          );
        }

        const response = await post({ url: APP_URLS.signUpSvg });
        console.log(response, '************************************************************')

        if (response && Array.isArray(response)) {
          setRadius1(response[0].Radius2);
          setRadius2(response[0].Radius3);

          const svgList = extsvg(response);
          setSvg(svgList);
        }



        if (authToken) {
          navigation.navigate('Dashboard');
        }

        await checkNotificationPermission()

      } catch (error) {
        console.error('Error fetching data:', error);
        const response = await post({ url: APP_URLS.signUpSvg });
        console.log(response, '************************************************************')

        Alert.alert('Error', 'There was an issue fetching the data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
    };

  }, [authToken, dispatch, get, navigation]); // Dependencies to trigger the effect



  // useEffect(() => {
  //   if(isLocationPermissionGranted){

  //       getLocation();
  //   }
  //   if(isPhonePermissionGranted){
  //     getSimPhoneNumber();
  //   }
  // },[isLocationPermissionGranted, isPhonePermissionGranted, getSimPhoneNumber, getLocation])
  const saveData = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Data saved successfully');
    } catch (e) {
      console.error('Failed to save data', e);
    }
  };
  const { getMobileDeviceId, getSimPhoneNumber, isPhonePermissionGranted, checkPhoneStatePermissionStatus } = useDeviceInfoHook();
  const formatErrorCode = (code) => {
    return code.replace(/_/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };



  const openSettings = () => {
    console.log('Settings can be opened manually on iOS');

    if (Platform.OS === 'android') {
      Linking.openSettings().catch(() => console.warn('Unable to open settings'));
    } else {
      console.log('Settings can be opened manually on iOS');
    }
  };
  const checkNotificationPermission = async () => {
    const permissionStatus = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);

    if (permissionStatus === RESULTS.GRANTED) {

      ToastAndroid.show('Notification permission granted', ToastAndroid.LONG);
    } else if (permissionStatus === RESULTS.DENIED) {
      console.log('Notification permission denied');

      requestNotificationPermission();

    } else if (permissionStatus === RESULTS.BLOCKED) {
      requestNotificationPermission();

      console.log('Notification permission blocked');
    } else {
      console.log('Notification permission status unknown');
    }
  };

  const requestNotificationPermission = async () => {
    const permissionStatus = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS); // Request notification permission on Android

    if (permissionStatus === RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      Alert.alert(
        'Notification permission not granted',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => null,
          },
          {
            text: 'Open Setting',
            onPress: () => openSettings(),
          },

        ],
        { cancelable: false }
      );
      console.log('Notification permission not granted');
    }
  };

  const onPressLogin = useCallback(async (otp) => {
    // openSettings()
    //    const stg = await requestStoragePermission()

    //    if(!stg){
    // console.log(stg);
    // return;
    //    }
    Keyboard.dismiss();
    const uniqueId = generateUniqueId(5)
    setIsLoading(true);
    let role;
    let msg;
    await appendLog(`Login initiated with OTP: ${otp}`, uniqueId);
    try {
      await appendLog('Hiding OTP modal...', uniqueId);
      setShowOtpModal(false);

      const net = await getCarrier() || 'wifi/net';
      await appendLog(`Network type detected: ${net}`, uniqueId);

      await appendLog('Encrypting login data...', uniqueId);
      const encryption = encrypt([
        userEmail, userPassword, otp, mobileNumber, 'ImeiuniqueId1234',
        'D1e2v3i4c5e6t7o8k9e0n', Loc_Data['latitude'], Loc_Data['longitude'],
        'SM-A146B', 'Samsung', "0.0.0.0", 'Laxmangarh',
        'City Laxmangarh', '332122', net
      ]);

      console.log([
        userEmail, userPassword, otp, mobileNumber, 'ImeiuniqueId1234',
        'D1e2v3i4c5e6t7o8k9e0n', Loc_Data['latitude'], Loc_Data['longitude'],
        'SM-A146B', 'Samsung', "0.0.0.0", 'Laxmangarh',
        'City Laxmangarh', '332122', net
      ])
      await appendLog(`loginData Data: ${JSON.stringify([
        userEmail, userPassword, otp, mobileNumber, 'ImeiuniqueId1234',
        'D1e2v3i4c5e6t7o8k9e0n', "27.8031507", "75.035648",
        'SM-A146B', 'Samsung', "0.0.0.0", 'Laxmangarh',
        'City Laxmangarh', '332122', 'wifi'
      ])}`, uniqueId);

      await appendLog(`Encrypted Data: ${JSON.stringify(encryption.encryptedData)}`, uniqueId);


      const loginData = {
        UserName: encryption.encryptedData[0],
        Password: encryption.encryptedData[1],
        'X-OTP': encryption.encryptedData[2],
        Mobile: encryption.encryptedData[3],
        Imei: encryption.encryptedData[4],
        Devicetoken: encryption.encryptedData[5],
        Latitude: encryption.encryptedData[6],
        Longitude: encryption.encryptedData[7],
        ModelNo: encryption.encryptedData[8],
        brandname: encryption.encryptedData[9],
        IPAddress: encryption.encryptedData[10],
        Address: encryption.encryptedData[11],
        City: encryption.encryptedData[12],
        PostalCode: encryption.encryptedData[13],
        InternetTYPE: encryption.encryptedData[13],
        grant_type: 'password',
      };
      console.log(loginData)
      const config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: 'bearer',
          value1: encryption.keyEncode,
          value2: encryption.ivEncode,
        },
      };
      console.log({
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'bearer',
        value1: encryption.keyEncode,
        value2: encryption.ivEncode,
      },)
      await appendLog('Sending login request...', uniqueId);
      const response = await post({ url: APP_URLS.getToken, data: loginData, config });
      console.error('Exception in login process:', response);

      await appendLog(`Login response received: ${JSON.stringify(response)}`, uniqueId);

      if (response?.access_token) {


        role = response.role;
        msg = `finally ${role} Login process completed.`
        dispatch(setIsDealer(response.role === 'Dealer'));
        await appendLog(`User role: ${response.role}`, uniqueId);

        if (response.VideoKYC === 'VideoKYCPENDING') {
          Alert.alert('', 'Video KYC Uploaded. Wait for admin approval.');
          await appendLog('VideoKYC pending alert shown', uniqueId);
          return;
        }
        authenticate(response)
        dispatch(setUserId(response?.userId));

        dispatch(setRefreshToken(response?.refresh_token));
        await appendLog('User ID and tokens saved.', uniqueId);
        const expiryDate = response[".expires"];
        console.log('Expiry:', expiryDate);
        userData(expiryDate);

      } else if (response?.error) {
        await appendLog(`Login error: ${JSON.stringify(response)}`, uniqueId);

        const errorDescription = response?.error_description || 'An error occurred';
        msg = errorDescription;
        alert(errorDescription)
        //ToastAndroid.show(errorDescription, ToastAndroid.LONG);
        await appendLog(`Error toast shown: ${errorDescription}`, uniqueId);

        if (response.error === 'SENDOTP') {
          setShowOtpModal(true);
          await appendLog('OTP modal re-shown due to SENDOTP error', uniqueId);
        }
      }
    } catch (error) {
      await appendLog(`Exception in login process: ${error.message}`, uniqueId);
      console.error('Exception in login process:', error);
      ToastAndroid.show('An error occurred, please try again later', ToastAndroid.LONG);
    } finally {
      const mockNotification = {
        notification: {
          title: role,
          body: msg,
        },
      };
      onReceiveNotification2(mockNotification);
      await appendLog('Login process completed. Setting loading false.', uniqueId);

      await appendLog(`*******************************************************`, uniqueId);
      setIsLoading(false)
    }
  }, [
    dispatch,
    navigation,
    post,
    userEmail,
    userPassword,
    isLocationPermissionGranted,
    isPhonePermissionGranted,
  ]);
  async function authenticate(response) {
    try {
      let fcmToken = '';

      // Ensure FCM setup and get token
      const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages;
      if (isRegistered) {
        try {
          fcmToken = await messaging().getToken();
          if (fcmToken) {
            console.log('FCM Token:', fcmToken);
            dispatch(setFcmToken(fcmToken));
          }
        } catch (err) {
          console.error('FCM Token Error:', err);
        }

        messaging().onTokenRefresh((newToken) => {
          console.log('FCM Token Refreshed:', newToken);
          dispatch(setFcmToken(newToken));
        });
      }

      const internetType = await getCarrier() || 'wifi/net';

      const params = new URLSearchParams({
        Devicetoken: fcmToken,
        Imeino: uniqueId || 'Not Found',
        Latitude: Loc_Data?.latitude || '0.0',
        Longitude: Loc_Data?.longitude || '0.0',
        ModelNo: modelNumber || 'Not Found',
        IPAddress: ipAddress || '0.0.0.0',
        Address: 'address11',
        City: 'City',
        PostalCode: '123456',
        InternetTYPE: internetType,
        simslote1: 'SIM1',
        simslote2: 'SIM2',
        brandname: brand || 'Not Found'
      });

      const url = `http://native.${APP_URLS.baseWebUrl}Common/api/data/authenticate?${params.toString()}`;
      console.log('Auth URL:', url);

      const response1 = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${response?.access_token}`,
        },
      });

      const json = await response1.json();
      console.log('Auth Response:', json);

      // Handle response
      if (json.status === 'SUCCESS') {
        if (json.message?.APPLOGINSTATUS === 'N') {
          dispatch(setAuthToken(null));
          alert('You are not allowed to login, please contact admin.');
          return;
        } else {
          dispatch(setAuthToken(response?.access_token));
        }
      }

    } catch (error) {
      console.error('Authentication Error:', error);
      setIsLoading(false); // Make sure `setIsLoading` is defined in your component
    }
  }
  const onPressSignUp = () => {

    //navigation.navigate("WebSignUp")
    navigation.navigate("SignUpScreen", {
      svg, Radius2

    });
  }


  const ToggleSecureEntry = () => {
    setSecureEntry(!secureEntry)
  }
  const verifyOtp = async (otp) => {
    try {
      const res = await post({ url: `Common/api/data/CHECKPASSCODEPASSWORD?Passscodes=${otp}` })
      const status = res.Status;
      const role = await AsyncStorage.getItem('role');

      if (status == 'BOXNOTOPEN') {
        if (role == 'Retailer') {
          navigation.navigate({ name: 'Dashboard' });

        } else {

        }
      }


    } catch (error) {

    }
  }
  const checkUpldate = async () => {
    try {
      const version = await get({ url: ` ${APP_URLS.current_version}1.0.0` });
      console.log('version', version);

      if (version.currentversion === '1.0.8') {
        const aepscode = version.aepscode;

        await AsyncStorage.setItem('aepscode', aepscode);

        setIsVer(true);
      } else {
        setIsVer(false);
        return;
      }
    } catch (error) {
      console.error('Error fetching version or saving aepscode:', error);
    }
  };
  const userData = async (expiryDate) => {

    try {
      await AsyncStorage.setItem('expiryDate', expiryDate);
      console.log('Data saved successfully!');
    } catch (error) {
      console.log('Error saving data: ', error);
    }
  };
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isAutofilled, setIsAutofilled] = useState(false);
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  if (isVer === false) {
    fadeIn();

    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f5d']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            width: '80%',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
            elevation: 5, // Add shadow effect for elevation (Android)
            shadowColor: '#000', // Shadow for iOS
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            Update Available
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 20,
              color: '#555',
            }}
          >
            Sorry for the inconvenience, an updated application is available with some improvements.
            You can update it by clicking the button below. If you face any inconvenience, please
            uninstall the application and reinstall it.
          </Text>

          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`https://${APP_URLS.baseWebUrl}/Home/DownloadAPK`).catch(err =>
                console.error('Failed to open URL: ', err)
              );
            }}
            style={{
              backgroundColor: '#008CBA',
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginBottom: 10,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Update Now
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              color: '#888',
            }}
          >
            If the app doesn't update, please uninstall and reinstall the app.
          </Text>
        </Animated.View>
      </LinearGradient>
    );
  }
  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#87ceeb',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image source={require('../../../assets/images/app_logo.png')}
          style={[styles.imgstyle, {
            width: wScale(100),
            height: wScale(100),
          }]} resizeMode='contain' />
      </View>
    );
  }
  return (

    <View style={styles.main}>
      <LinearGradient
        colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
        style={styles.gradientContainer}>
        <ScrollView keyboardShouldPersistTaps={"handled"}>
          <View
            style={styles.container}>
            <View style={[styles.Logocontainer,]}>
              <Image source={require('../../../assets/images/app_logo.png')}
                style={styles.imgstyle} resizeMode='contain' />
              <Text style={{ color: colorConfig.secondaryColor ? colorConfig.secondaryColor : 'white', fontWeight: 'bold' }}>
                {APP_URLS.AppName}
              </Text>
            </View>


            <View style={[styles.inputContainer, { borderRadius: Radius1 }]}>
              <View style={styles.InputImage}>

                <SvgUri
                  height={hScale(48)}
                  width={hScale(48)}
                  uri={svg.personUser}
                />

              </View>
              <TextInput
                style={[styles.textInput,]}
                cursorColor={'white'}
                placeholder={translate('emailOrMobile')}
                autoCapitalize="none"
                placeholderTextColor={'white'}
                value={userEmail}
                onChangeText={text => setUserEmail(text)}
              />
            </View>


            <View style={[styles.inputContainer, { borderRadius: Radius1 }]}>
              <View style={styles.InputImage}>
                <SvgUri
                  height={hScale(48)}
                  width={hScale(48)}
                  uri={svg.Password}
                />
              </View>
              <TextInput
                style={[styles.textInput,]}
                cursorColor={'white'}
                placeholder={translate('password')}
                value={userPassword}
                onChangeText={text => setUserPassword(text)}
                placeholderTextColor={'#fff'}
                secureTextEntry={secureEntry}

              />
              {userPassword.length >= 5 ? (
                <View style={styles.righticon}>
                  <TouchableOpacity onPressOut={ToggleSecureEntry} onPressIn={ToggleSecureEntry}>
                    <ShowEye color1="#fff" color2="#fff" />
                  </TouchableOpacity>
                </View>
              ) : ''}

            </View>
            <View style={styles.forgetrow}>
              <TouchableOpacity style={[styles.rememberow,]}
                onPress={() => {
                  Keyboard.dismiss();
                  setRemember(!remember);
                  if (remember) {
                    saveCredentials(userEmail, userPassword);
                  }

                }} >
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();

                    setRemember(!remember);
                    if (remember) {
                      saveCredentials(userEmail, userPassword);
                    }

                  }}
                  style={styles.remember}>
                  {remember ?
                    <CheckSvg size={8} />
                    : null}
                </TouchableOpacity>
                <Text style={[styles.forgettext, { paddingLeft: wScale(4) }]}>
                  Remember
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setShowForgotPasswordModal(true) }}
                style={styles.forgetbtn}
              >
                <Text style={styles.forgettext}>
                  {translate('forgotPassword')}<Text style={{ fontWeight: 'bold', fontSize: 15 }}>?</Text>
                </Text>
              </TouchableOpacity>

            </View>
            <DynamicButton title={
              isLoading ? <ActivityIndicator color={colorConfig.labelColor} size="large" /> :
                "Login"}
              onPress={() => {

                if (userEmail && userPassword) {
                  onPressLogin('');
                } else {
                  listenFCMDeviceToken()
                  ToastAndroid.show("Please enter valid User ID and Password, you cannot leave it blank", ToastAndroid.SHORT);
                }
              }} styleoveride={undefined}

            />

            <View style={styles.signup_continer}>
              <Text style={styles.donthave_text}>
                {translate('signupText')}
              </Text>

              <TouchableOpacity
                // onLongPress={()=>registerNotification()}
                onPress={onPressSignUp}>
                <Text
                  style={[styles.donthave_text, { fontWeight: 'bold', }]}>
                  {translate('signUp')}
                </Text>
              </TouchableOpacity>
            </View>
            <ForgotPasswordModal
              showForgotPasswordModal={showForgotPasswordModal}
              setShowForgotPasswordModal={setShowForgotPasswordModal}
              handleForgotPassword={undefined}
            />
            <OTPModal
              setShowOtpModal={setShowOtpModal}
              disabled={otp.length !== 6}
              showOtpModal={ShowOtpModal}
              setMobileOtp={setOtp}
              verifyOtp={() => {
                onPressLogin(otp)
              }}
              inputCount={6}
              sendID={userEmail}
            />

          </View>
        </ScrollView>
      </LinearGradient>
    </View >
  );
};

const styles = StyleSheet.create({
  Logocontainer: {
    backgroundColor: 'rgba(255,255, 255, 0.5)',
    justifyContent: 'center',
    alignSelf: 'center',
    width: wScale(180),
    height: wScale(180),
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: hScale(40),
    padding: hScale(8)
  },
  imgstyle: {
    flex: 1
  },

  main: {
    flex: 1
  },
  gradientContainer: {
    width: '100%',
    height: '100%',
  },
  container: {
    paddingHorizontal: wScale(40),
    paddingTop: hScale(60),
  },
  inputContainer: {
    marginTop: hScale(24),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: 'white',
    borderWidth: 0.2,
    height: hScale(48),

  },
  InputImage: {
  },
  lotiimg: { flex: 1, height: wScale(35), width: wScale(35) },
  textInput: {
    flex: 1,
    fontSize: wScale(18),
    color: '#fff',
    // textAlign: 'center',                                                                                                                                                                                   
  },
  input: {
    color: 'black',
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    margin: wScale(5),
  },

  forgetrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: hScale(20),
    paddingTop: hScale(7),
  },
  rememberow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  remember: {
    borderWidth: wScale(.8),
    borderColor: '#fff',
    height: wScale(14),
    width: wScale(14),
    alignItems: 'center',
    marginRight: wScale(0),
    justifyContent: 'center',
    borderRadius: 4
  },
  forgetbtn: {
    backgroundColor: 'transparent',
  },
  forgettext: {
    fontSize: wScale(15),
    color: '#fff',

  },
  signup_continer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: hScale(20)
  },
  donthave_text: {
    fontSize: wScale(14.5),
    color: 'white', marginRight: wScale(4),
  },
  righticon: {
    justifyContent: 'center',
    marginRight: wScale(20),
    opacity: .3
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: wScale(10),
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  submitButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  resendText: {
    color: '#2196F3',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  resendButton: {
    marginTop: 10,
  },
});
export default LoginScreen;