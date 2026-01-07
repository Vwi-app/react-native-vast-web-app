import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, Platform } from 'react-native';
import Share from 'react-native-share';
import { useNavigation } from '@react-navigation/native'; // For back navigation
import { APP_URLS } from '../../utils/network/urls';
import useAxiosHook from '../../utils/network/AxiosClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { useLocationHook } from '../../hooks/useLocationHook';

const ReferAndEran = () => {
  const {get}= useAxiosHook()
  const navigation = useNavigation();
  const text = `https://play.google.com/store/apps/details?id=com.sudhaarpay`;
  const text2 = `https://www.${APP_URLS.baseWebUrl}/Home/Index1`;
  const text3 = `https://www.${APP_URLS.baseWebUrl}/Home/Index1`;
  const text4 = `https://www.${APP_URLS.baseWebUrl}/Home/Index1`;
  const subject = `App Link`;
  const [refcode,setRefcode]= useState('')
  const { colorConfig, IsDealer ,fcmToken ,Loc_Data} = useSelector((state: RootState) => state.userInfo);
  const { latitude, longitude } = Loc_Data;

useEffect(()=>{
const ref = async ()=>{
console.log(latitude, longitude)
  console.log(fcmToken)
  const reff = await get({url:`Common/api/data/authenticate?Devicetoken=${fcmToken}&Imeino=1234567890&Latitude=${latitude}&Longitude=${longitude}&ModelNo=GalaxyS21&IPAddress=192.168.1.1&Address=1234MainStreet&City=Delhi&PostalCode=110001&InternetTYPE=4G&simslote1=SIM1&simslote2=SIM2&brandname=Samsung`})
  setRefcode(reff?.message.SELFREFFERALCODE);
console.log(reff)

}
ref()
},[])
  const onShare = async (link) => {
    const shareOptions = {
      message: link,
      subject: subject,
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
       
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>App Share</Text>
        <Text style={styles.message}>Share the app link with your friends.</Text>
        <Text style={styles.title}>{'Your Refferal Code'}</Text>
        <Text style={styles.title}>{refcode}</Text>

        <View style={styles.shareSection}>
        
          <TouchableOpacity style={styles.shareButton} onPress={() => onShare(text)}>
            <Text style={styles.buttonText}>Play Store Link</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shareSection}>
        
          <TouchableOpacity style={styles.shareButton} onPress={() => onShare(text2)}>
            <Text style={styles.buttonText}>Web Link</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shareSection}>
          
          <TouchableOpacity style={styles.shareButton} onPress={() => onShare(text3)}>
            <Text style={styles.buttonText}>App Store Link</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shareSection}>
        
          <TouchableOpacity style={styles.shareButton} onPress={() => onShare(text4)}>
            <Text style={styles.buttonText}>Web Link</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#0a74da',
  },
  backButton: {
    marginTop: 5,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#ffffff',
  },
  shareIconContainer: {
    marginLeft: 70,
    padding: 10,
    backgroundColor: '#0a74da',
    borderRadius: 50,
  },
  shareIcon: {
    width: 70,
    height: 70,
    tintColor: '#ffffff',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 5,
  },
  shareSection: {
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  shareText: {
    fontSize: 13,
    color: '#333333',
    marginLeft: 5,
  },
  shareButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#0a74da',
  },
  buttonText: {
    fontSize: 14,
    color: '#0a74da',
    textAlign: 'center',
  },
});

export default ReferAndEran;
