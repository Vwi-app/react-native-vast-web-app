import React, { useEffect, useState,  } from 'react';
import { View, StyleSheet, ActivityIndicator, Button, Image,Linking, Platform, Alert } from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../HomeScreen';
import WalletScreen from '../WalletScreen';
import HomeSvg from '../../drawer/svgimgcomponents/homesvg';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { colors } from '../../../utils/styles/theme';
import SettingSvg from '../../drawer/svgimgcomponents/Settingsvg';
import ReportSvg from '../../drawer/svgimgcomponents/Reportsvg';
import ReportScreen from '../ReportScreen';
import { RootState } from '../../../reduxUtils/store';
import WalletSvg from '../../drawer/svgimgcomponents/Walletsvg';
import AccReportScreen from '../accont';
import Accounttabsvg from '../../drawer/svgimgcomponents/Accounttabsvg';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';
import Updatebox from './Update';
import DealerHome from '../../Delerpages/DealerTabs/DealerHome';
import { getDistance } from 'geolib';
import GetLocation from 'react-native-get-location';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { listenFCMDeviceToken } from '../../../utils/NotificationService';
import messaging from '@react-native-firebase/messaging';
import { setFcmToken } from '../../../reduxUtils/store/userInfoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getBrand, getCarrier, getDevice, getIpAddress, getModel, getUniqueId } from 'react-native-device-info';

const Tab = createBottomTabNavigator();

export const TabComponent = () => {
  const { colorConfig, IsDealer ,Loc_Data } = useSelector((state: RootState) => state.userInfo);
  const { get } = useAxiosHook();
  const [update, setUpdate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { latitude, longitude } = Loc_Data;

  const [fcm,setfcm]= useState('')
const [isplay ,setIsplay]= useState(true);
  useEffect(() => {

       
  if(Loc_Data['isGPS']){
    return;
      }
    async function version() {
      try {
        setIsLoading(true);
        const version = await get({ url: APP_URLS.current_version });
        console.log(version);
        setIsplay(version.isgoogle)
        console.log(APP_URLS.version, version.currentversion);

        setUpdate(APP_URLS.version === version.currentversion);
        listenFCMDeviceToken()

            if (messaging().isDeviceRegisteredForRemoteMessages) {
              const FCMToken = await messaging()
                .getToken()
                .catch((error) => {
                 
                });
                console.log('**TOKEN', FCMToken);
              if (FCMToken) {
                setfcm(FCMToken)
                //  ref(FCMToken)
             //   saveDeviceToken(FCMToken);
                dispatch(setFcmToken(FCMToken));
              }
              // Listen to whether the token changes
              messaging().onTokenRefresh((refreshedToken) => {
                console.log('**TOKEN1', refreshedToken);
               //saveDeviceToken(refreshedToken);
               // appDispatcher.sendDeviceTokenToServer(refreshedToken);
               dispatch(setFcmToken(refreshedToken));
              });
            } 
      } catch (error) {
        console.error('Error fetching version:', error);
      } finally {
        setIsLoading(false);
      }
    }
    version();
  
   checkNotificationPermission()

  }, []);
  const openSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings().catch(() => console.warn('Unable to open settings'));
    } else {
      console.log('Settings can be opened manually on iOS');
    }
  };
  const checkNotificationPermission = async () => {
    const permissionStatus = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS); 

    if (permissionStatus === RESULTS.GRANTED) {
      console.log('Notification permission granted');
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

const ref = async (FCMToken)=>{
  const IPAddress = await getIpAddress();
  const model =  getModel();
      const brand = getBrand();
      const serialNum = await getUniqueId();
        const net = await getCarrier() || 'wifi/net';
  
  console.log(fcm)
  const reff = await get({url:`Common/api/data/authenticate?Devicetoken=${FCMToken}&Imeino=${serialNum}&Latitude=${latitude}&Longitude=${longitude}&ModelNo=${model}&IPAddress=${IPAddress}&Address=&City=&PostalCode=000000&InternetTYPE=${net}&simslote1=SIM1&simslote2=SIM2&brandname=${brand}`})
console.log(reff)

}
  if (isLoading) {
    return (
      <View style={[styles.loaderContainer,{backgroundColor:colorConfig.secondaryColor}]}>
        {/* <ActivityIndicator size="large" color={colorConfig.secondaryColor} /> */}
        <Image source={require('../../../../assets/images/app_logo.png')}
          style={[{
            width: wScale(100),
            height: wScale(100),
          }]} resizeMode='contain' />
      </View>
    );
  }

  if (!update) {
    return <Updatebox isVer={undefined} loading={undefined} isplay={isplay} />;
  }

  
  return (

    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}

      tabBar={({ navigation, state, descriptors, insets }) => (

        <BottomNavigation.Bar
          activeColor={colorConfig.secondaryColor}
          activeIndicatorStyle={{ backgroundColor: 'transtparent' }}

          style={{ backgroundColor: colors.light_blue, borderRadius: 30, }}
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color: 'red', size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen

        name="Home"
        component={IsDealer ? DealerHome : HomeScreen}
        options={{

          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => {
            return <HomeSvg size={wScale(28)} color={focused ? colorConfig.secondaryColor : '#263142'} />;
          },
          // tabBarIcon: ({ color, size }) => {
          //   return <HomeSvg size={wScale(28)} color={colors.white} />;
          // },
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarLabel: 'Wallet',

          tabBarIcon: ({ focused }) => {
            return <WalletSvg size={wScale(28)} color={focused ? colorConfig.secondaryColor : '#263142'} />;
          },

        }}
      />
      <Tab.Screen

        name="Account"
        component={AccReportScreen}
        options={{

          tabBarLabel: 'Account',
          tabBarIcon: ({ focused }) => {
            return <Accounttabsvg size={wScale(28)} color={focused ? colorConfig.secondaryColor : '#263142'} />;
          },
        }}
      />
      <Tab.Screen
        name="Report"
        component={IsDealer ? ReportScreen:ReportScreen}
        options={{
          tabBarLabel: 'Report',
          tabBarIcon: ({ focused }) => {
            return <ReportSvg size={wScale(28)} color={focused ? colorConfig.secondaryColor : '#263142'} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});