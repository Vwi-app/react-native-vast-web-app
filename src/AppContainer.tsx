import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './reduxUtils/store';
import useAxiosHook from './utils/network/AxiosClient';
import { APP_URLS } from './utils/network/urls';
import { useDispatch } from 'react-redux';

import { useNavigation } from './utils/navigation/NavigationService';
import { AuthNavigator } from './utils/navigation/AuthNavigator';
import { AppNavigator } from './utils/navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { setColorConfig, setNeedUpdate, setVersionData } from './reduxUtils/store/userInfoSlice';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import isEqual from 'lodash/isEqual';
import FundTransferRetailer from './components/DealerToRetFTtest';
import RequestFromRetailer from './components/RequestFromRetailer';
import { DealerNavigator } from './utils/navigation/DealerNavigator';
import registerNotification from './utils/NotificationService';
import { getApp, initializeApp } from '@react-native-firebase/app';

import SenderScreen from './sender';
import ReceiverScreen from './Reciever';
import { Alert, AsyncStorage } from 'react-native';
import Updatebox from './features/dashboard/components/Update';
import PayuCheckoutScreen from './payutest';
import AddMoneyPayResponse from './components/AddMoneyPayResponse';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

export const AppContainer = () => {
  const { authToken, refreshToken, versionData ,IsDealer } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const { get, post } = useAxiosHook();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isFingerPrintEnabled, setIsFingerPrintEnabled] = useState(false);
  const [isFingerPrintVerified, setIsFingerPrintVerified] = useState(false);
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await get({ url: APP_URLS.getColors });
    const vi =  await AsyncStorage.getItem('VIDEOKYC');
      if(vi=='VideoKYCNOTDONE' && authToken){
showKycAlert()
      }
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
      const versionResult = await post({ url: APP_URLS.versionCheck });


     const version = await get({ url: APP_URLS.current_version });
        console.log(version);
        console.log(APP_URLS.version, version.currentversion);

        setUpdate(APP_URLS.version === version.currentversion);

      if (versionData && versionResult) {
        const isChanged = isEqual(versionData?.data, versionResult?.data)

        if (!isChanged) {
          dispatch(setVersionData(versionResult));
          dispatch(setNeedUpdate(true));
        
        }


        dispatch(setNeedUpdate(false));
       registerNotification();
      }
    }
    fetchData();
  }, [authToken, dispatch, get, navigation]);



   const showKycAlert = () => {
    Alert.alert(
      "Complete your Video KYC",
      "To continue using this feature you must complete a short video KYC.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start KYC",
          onPress: () => 
                      navigation.navigate('VideoKYC', {
                        'CNTNT': {
                          'hindi': '',
                          'Eng': ''

                        }
                      }),
        },
      ],
      { cancelable: false }
    );
  };


  // const authenticateFingerprint = useCallback(async () => {
  //   rnBiometrics
  //     .simplePrompt({ promptMessage: 'Confirm fingerprint' })
  //     .then(resultObject => {
  //       const { success } = resultObject;

  //       if (success) {
  //         setIsFingerPrintVerified(true);
  //         console.log('successful biometrics provided');
  //       } else {
  //         setIsFingerPrintVerified(false);

  //       }
  //     })
  //     .catch(() => {

  //     });
  // }, []);
const firebaseConfig = {
  apiKey: "AIzaSyDi1-AFsoyO_m1F4u46KGnKm0sdksg7bUM",
  projectId: "bismillahrecharge-a725e",
  storageBucket: "bismillahrecharge-a725e.firebasestorage.app",
  messagingSenderId: "75934719883",
  appId: "1:75934719883:android:089d215326cac52117998e",

};

const app = getApp() || initializeApp(firebaseConfig ,'bismillahrecharge'); 
  useEffect(() => {
    async function checkBiometrics() {
      const {available, biometryType} = await rnBiometrics.isSensorAvailable();
console.log(app)
      if (available && biometryType === BiometryTypes.Biometrics) {
         setIsFingerPrintEnabled(true);
      }
    }
    checkBiometrics();
  }, []);



   if (!update) {
    return <Updatebox isVer={undefined} loading={undefined} isplay={false} />;
  }

  if (authToken) {
    console.log(authToken, IsDealer);
    if (IsDealer) {
      return <DealerNavigator />;
    } else {
      return <AppNavigator/>;
    }
  } else {
   return <AuthNavigator />;
  }
};