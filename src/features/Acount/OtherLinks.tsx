import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  Animated,
  Easing,
} from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond'; // Ensure this import is correct based on your project structure
import { hScale, wScale } from '../../utils/styles/dimensions';
import { color } from '@rneui/base';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';

const OtherLinks = () => {
  const [inforeport, setInforeport] = useState([]);
  const [inforeport2, setInforeport2] = useState([]);
  const [loading, setLoading] = useState(true);
  const { get } = useAxiosHook();
  const colorScheme = useColorScheme();
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);

  const demoData = [
    { Name: 'Demo Link 1', Link: 'https://example.com/1' },
    { Name: 'Demo Link 2', Link: 'https://example.com/2' },
  ];

  const fetchReports = async () => {
    try {
      const response = await get({ url: `${APP_URLS.OtherLinks}` });
      if (!response) {
        throw new Error('Network response was not ok');
      }
console.log(response,'***********************')


      setInforeport(response.uploadlink_list);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data, showing demo data');
      setInforeport(demoData);
    } finally {
      setLoading(false);
    }
  };

  const colorAnim = useRef(new Animated.Value(0)).current;
 const masterBankList = {
    "accounts": [
      {
        "bank_name": "ICICI Bank",
        "link": "https://buy.icicibank.com/ucj/accounts"
      },
      {
        "bank_name": "Axis Bank",
        "link": "https://www.axisbank.com/retail/accounts"
      },
      {
        "bank_name": "IDFC First Bank",
        "link": "https://digital.idfcfirstbank.com/apply/savings?icid=webhomepage-apply_savingsaccount_accounts1"
      },
      {
        "bank_name": "Central Bank of India",
        "link": "https://vkyc.centralbank.co.in/home?client_id=CBI&api_key=CBI&process=U"
      },
      {
        "bank_name": "Union Bank of India",
        "link": "https://www.unionbankofindia.co.in/english/saving-account.aspx"
      },
      {
        "bank_name": "HDFC Bank",
        "link": "https://applyonline.hdfcbank.com/savings-account/insta-savings/open-instant-savings-account-online.html?LGCode=Mktg&mc_id=website_organic_sa_insta_account_desktop#nbb"
      },
      {
        "bank_name": "State Bank of India (SBI)",
        "link": "https://sbi.co.in/web/yono/insta-plus-savings-bank-account"
      },
      {
        "bank_name": "Bank of Baroda (BOB)",
        "link": "https://tabit.bankofbaroda.com/BarodaInstaClick/#/savings/registration"
      }
    ],
    "demat_accounts": [
      {
        "service_provider": "Motilal Oswal",
        "link": "https://moriseapp.page.link/DoWR7HduvjtkyvWr7"
      },
      {
        "service_provider": "Angel One",
        "link": "https://angel-one.onelink.me/Wjgr/xna61v25"
      }
    ]
  }
  
  useEffect(() => {

    if(APP_URLS.AppName ==='Master Bank'){

      setInforeport(masterBankList['accounts'])

      setInforeport2(masterBankList['demat_accounts']);
      setLoading(false)

    }else{
          fetchReports();

    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 2,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [colorAnim]);

  const textColor = colorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['red', 'yellow', 'green'],
  });

  const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, colorScheme === 'dark' ? styles.cardDark : styles.cardLight]}>
      <View style={styles.cardContent}>
        <Text style={[styles.nameText, colorScheme === 'dark' ? styles.textDark : styles.textLight,]}>
            {APP_URLS.AppName ==='Master Bank'? item.bank_name :item.Name } 
        </Text>
        <TouchableOpacity onPress={() => openURL(item.Link ||item.link)} style={styles.btn}>
          <Text style={[styles.buttonText, colorScheme === 'dark' ? styles.textDark : styles.textLight]}>Open Link</Text>
          <Animated.Text style={[styles.animtext, { color: textColor }]}>Click Me</Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderItem2 = ({ item }) => (
    <View style={[styles.card, colorScheme === 'dark' ? styles.cardDark : styles.cardLight]}>
      <View style={styles.cardContent}>
        <Text style={[styles.nameText, colorScheme === 'dark' ? styles.textDark : styles.textLight]}>
          {/* {item.Name} */}
            {item.service_provider} 
        </Text>
        <TouchableOpacity onPress={() => openURL(item.link)} style={styles.btn}>
          <Text style={[styles.buttonText, colorScheme === 'dark' ? styles.textDark : styles.textLight]}>Open Link</Text>
          <Animated.Text style={[styles.animtext, { color: textColor }]}>Click Me</Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.main}>
      <AppBarSecond
        title={ APP_URLS.AppName ==='Master Bank'?"Account Open Links": "Other Links" }
        onActionPress={() => { }}
        actionButton={null}
        onPressBack={() => { }}
      />
      <View style={[styles.container, colorScheme === 'dark' ? styles.containerDark : styles.containerLight,{backgroundColor:colorConfig.secondaryColor}]}>
     
      {  APP_URLS.AppName =="Master Bank"&& <Text> Bank Acount Open links</Text>}

        {loading ? (
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
        ) : (
          <FlatList
            data={inforeport}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.Link}
          />
        )}
      </View> 
      <View style={[styles.container, colorScheme === 'dark' ? styles.containerDark : styles.containerLight,{backgroundColor:colorConfig.secondaryColor}]}>
        
        
     {  APP_URLS.AppName =="Master Bank"&& <Text> Demat Acount Open links</Text>}
        {loading ? (
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
        ) : (
          <FlatList
            data={inforeport2}
            renderItem={renderItem2}
            keyExtractor={(item, index) => item.Link}
          />
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    paddingHorizontal: wScale(15),
    flex: 1,
    paddingVertical: hScale(20),
  },
  containerLight: {
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },

  cardContainer: {
    marginBottom: hScale(10),
  },
  card: {
    borderRadius: 15,
    borderWidth: wScale(1),
    paddingHorizontal: wScale(15),
    paddingVertical: wScale(8),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderColor: '#fff',
    marginBottom: hScale(18),
  },
  cardLight: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    shadowColor: '#ccc',
  },
  cardDark: {
    backgroundColor: '#333',
    borderColor: '#444',
    shadowColor: '#000',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: wScale(16),
    fontWeight: '600',
  },
  btn: {
    paddingVertical: hScale(8),
    paddingHorizontal: wScale(16),
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: wScale(14),
    fontWeight: '500',
  },
  textLight: {
    color: '#000',
  },
  textDark: {
    color: '#fff',
  },
  animtext: {
    fontSize: wScale(12)
  },
});

export default OtherLinks;
