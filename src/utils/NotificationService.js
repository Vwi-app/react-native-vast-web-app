import { AppState, PermissionsAndroid, Platform ,AsyncStorage} from "react-native";
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { setFcmToken } from "../reduxUtils/store/userInfoSlice";
import firestore from '@react-native-firebase/firestore';
if (Platform.OS === 'android') {

    PushNotification.createChannel(
      {
        channelId: 'CHANNEL_ID',
        channelName: 'NOTIFICATIONS_CHANNEL',
      },
      (created) => {
        console.log(`createChannel returned '${created}'`);
      },
    );
  }

  PushNotification.configure({
    onNotification: (notification) => {
        console.log('NotificationHandler:', notification);
    },
  });
const requestPermission = async () => {
    const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      console.log('**PERMISSION', permission);  
      return permission === 'granted';
};

export async function listenFCMDeviceToken() {
    
    const dispatch = useDispatch();
    if (messaging().isDeviceRegisteredForRemoteMessages) {
      const FCMToken = await messaging()
        .getToken()
        .catch((error) => {
         
        });
        console.log('**TOKEN', FCMToken);
      if (FCMToken) {
       // saveDeviceToken(FCMToken);
        dispatch(setFcmToken(FCMToken));
      }
      // Listen to whether the token changes
      messaging().onTokenRefresh((refreshedToken) => {
        console.log('**TOKEN1', refreshedToken);
       // saveDeviceToken(refreshedToken);
       // appDispatcher.sendDeviceTokenToServer(refreshedToken);
      // dispatch(setFcmToken(refreshedToken));
      });
    } 
  }


export default async function registerNotification() {
    try {
      
      listenFCMDeviceToken();
      // const hasNotificationPermission = await requestPermission();
      // if (hasNotificationPermission) {
      //   
      //   await initialNotificationConfig();
      // }
    } catch (error) {
      
    }
  }

  export async function onReceiveNotification2(notification) {
   await readNotifications()

   if (AppState.currentState === 'active') {
    PushNotification.localNotification({
      
      title: notification.notification?.title,
      message: notification.notification?.body,
      channelId: 'CHANNEL_ID',
      userInfo: {
        id: new Date().getTime(),
        notificationData: notification,
      },
      smallIcon: 'ic_notification', // Replace with your small icon name (without .png)
      largeIcon: 'ic_launcher', // Replace with your large icon name (without .png)
      bigPicture: require('../../assets/images/app_logo.png'), // URL of the image to display
    });
  }



      const notificationData = {
        title: notification.notification?.title,
        body: notification.notification?.body,
        createdAt: new Date(),  
      };
    
      try {
        const storedNotifications = await AsyncStorage.getItem('notifications');

        console.log(storedNotifications)
        let notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    
        notifications.push(notificationData);
    
        await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
        console.log(" saving notification to AsyncStorage:");

      } catch (error) {
        console.error("Error saving notification to AsyncStorage:", error);
      }
    //  await firestore().collection('notifications').add(notificationData);
      // const pendingActionCount = notification.notification?.ios?.badge;

      //   PushNotification.setApplicationIconBadgeNumber(pendingActionCount);

  }

  export async function onReceiveNotification(notification) {
   await readNotifications()
    if (AppState.currentState === 'active') {
        PushNotification.localNotification({
          title: notification.notification?.title,
          message: notification.notification?.body,
          channelId: 'CHANNEL_ID',
          userInfo: {
            id: new Date().getTime(),
            notificationData: notification,
          },
        });
      }



      const notificationData = {
        title: notification.notification?.title,
        body: notification.notification?.body,
        createdAt: new Date(),  
      };
    
      try {
        const storedNotifications = await AsyncStorage.getItem('notifications');

        console.log(storedNotifications)
        let notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    
        notifications.push(notificationData);
    
        await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
      } catch (error) {
        console.error("Error saving notification to AsyncStorage:", error);
      }
    //  await firestore().collection('notifications').add(notificationData);
      // const pendingActionCount = notification.notification?.ios?.badge;

      //   PushNotification.setApplicationIconBadgeNumber(pendingActionCount);

  }

  const readNotifications = async () => {
    try {
      const notificationsSnapshot = await firestore()
        .collection('notifications')
        .orderBy('createdAt', 'desc')
        .get();
      const notifications = notificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      console.log('Notifications:', notifications);
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications: ', error);
    }
  };

  const initialNotificationConfig = async () => {
    messaging().onMessage(onReceiveNotification);
  };



  export const registerBgNotification = () => {

   //   const navigation = useNavigation();
    
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log(remoteMessage, 'Foreground Message Handler');
      onReceiveNotification(remoteMessage);
    });
  
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background Message Handler',remoteMessage );
      onReceiveNotification(remoteMessage);
    });
  
    const unsubscribeOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open from background state:', remoteMessage);
   //navigation.navigate('Natifications');
    });
  
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('App was opened from a notification:', remoteMessage);
         // navigation.navigate('Natifications');
        }
      });
  
    return () => {   
       //  checkNotificationPermission();

      unsubscribe();
      unsubscribeOpened();
    };
  };
  