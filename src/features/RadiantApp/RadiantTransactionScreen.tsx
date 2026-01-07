import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, Alert, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { wScale, hScale, SCREEN_WIDTH } from '../../utils/styles/dimensions';
import RadintPickupSvg from '../drawer/svgimgcomponents/RadintPickupSvg';
import { colors } from '../../utils/styles/theme';
import RadintDepositSvg from '../drawer/svgimgcomponents/RadintDepositSvg';
import RadintChequeSvg from '../drawer/svgimgcomponents/RadintChequeSvg';
import RadintDeliverySvg from '../drawer/svgimgcomponents/RadintDeliverySvg';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import LinearGradient from 'react-native-linear-gradient';
import NextErrowSvg2 from '../drawer/svgimgcomponents/NextErrowSvg2';
import { APP_URLS } from '../../utils/network/urls';
import useAxiosHook from '../../utils/network/AxiosClient';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import WalletCard from './RadiantTrxn/WalletCard';
import CmsTab from './CmsTab';
import PvcCheckPickupstatusModel from '../../components/PvcCheckPickupstatusModel';
import CmsQrAddMoney from './RadiantTrxn/CmsQrAddMoney';
import AllBalance from '../../components/AllBalance';
import useRadiantHook from '../Financial/hook/useRadiantHook';
import { log } from 'console';

const RadiantTransactionScreen = () => {
  const { colorConfig, userId, fcmToken, rctype } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [showModal, setshowModal] = useState(false);
  const [pvcStatus, setPvcStatus] = useState('O')
  const { post } = useAxiosHook()
  const { cashPickUpTransactionList, fetchCashPickupTransactionList } = useRadiantHook();
  console.log('0-0-0-0-0-0-0-0-0-0-0');

  useEffect(() => {
    const checkCE_status = async () => {
      try {
        const res = await post({ url: APP_URLS.RCEID });
        console.log('Raw response:', res);

        // Handle clearly invalid response structure
        if (typeof res !== 'object' || !res.Content || !res.Content.ADDINFO) {
          Alert.alert(
            'Invalid Response',
            '',
            [
              {
                text: 'Go Back',
                onPress: () => navigation.goBack(),
              },
            ],
            { cancelable: false }
          );
          return;
        }

        const addInfo = res.Content.ADDINFO;
        const status = addInfo.sts;
        const message = addInfo.message || 'CEID not available';

        // Check if CEID or status is missing or false
        if (!status) {
          Alert.alert(
            message,
            '',
            [
              {
                text: 'Go Back',
                onPress: () => navigation.goBack(),
              },
            ],
            { cancelable: false }
          );
          return;
        }

        // Optional: Success toast or further logic
        ToastAndroid.show('CE Status Verified', ToastAndroid.SHORT);
        console.log('CE Status:', status);

      } catch (error) {
        console.error('Error fetching CE status:', error);
        Alert.alert(
          'Network Error',
          'Failed to fetch CE status.',
          [
            {
              text: 'Go Back',
              onPress: () => navigation.goBack(),
            },
          ],
          { cancelable: false }
        );
      }
    };

    // checkCE_status();
  }, []);
  const transactions = [
    {
      id: '1', title: 'Cash Pickup Request',
      description: 'Through this function, you are required to enter the pickup time, slip number and full details of the currency picked up from the customer point, as well as correctly enter the count of all types of notes which should match the total amount perfectly.',
      nav: 'CashPickup',
      img: <RadintPickupSvg />
    },
    {
      id: '2', title:
        "Pay Due's & Add Slips",
      description: 'Through this function, you will see a list of all payments to be transferred to the company, as per the uploaded pickup slip. All these payments can be made separately or together.',

      nav: 'InprocessReportCms', img: <RadintDeliverySvg />
    },
    {
      id: '3', title: 'Cash Deposit A/C List',
      description: 'Through this function we are sharing with you the list of Radiant Cash Management Services Limited bank accounts and QR Codes in which you can Deposit Cash, Online Transfer and QR Code Scan.',

      nav: 'CmsACList', img: <RadintChequeSvg />
    },
    {
      id: '4', title: 'Cash Pickup Report',
      description: 'Hamari mobile application ek powerful aur user-friendly tool hai jo aapke dincharya ko behtar banane aur productivity badhane ke liye design ki gayi hai. Is app ke madhyam se',

      nav: 'CashPicUpReport', img: <RadintDepositSvg />
    },

  ];

  const handleTransactionPress = (item) => {

    console.log(item)
    navigation.navigate(item.nav);
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity style={[styles.card,
    ]} activeOpacity={0.7} onPress={() => handleTransactionPress(item)}>
      <View style={[styles.svgimg, { backgroundColor: color1 }]}>
        {item.img}
      </View>
      <View style={styles.inveiw}>
        <Text style={styles.cardText}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>

      </View>
      <NextErrowSvg2 color='#000' />

    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <AppBarSecond title={'R A D I A N T   C M S'} />
      {rctype === 'PrePay' && <AllBalance />
      }

      {rctype === 'PostPay' &&
        <View >

          <WalletCard />
        </View>

      }
      <View style={{ marginTop: hScale(15), flex: 1 }}>
        <CmsTab />
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingTop: hScale(4)
  },
  LinearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: wScale(8),
  },
  textstyle: {
    fontSize: wScale(18),
    color: colors.white,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: hScale(5),
    paddingHorizontal: wScale(5),
    marginBottom: hScale(10),
    shadowColor: '#000',
    elevation: 5,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    borderColor: colors.black_primary_blur,
    borderRadius: 5,
    justifyContent: 'space-between'
  },
  cardText: {
    color: 'black',
    fontSize: wScale(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inveiw: {
    flex: 1,
    paddingLeft: wScale(10)
  },
  description: {
    color: 'black',
    fontSize: wScale(11),
    textAlign: 'justify',
  },
  imgstyle: {
    width: wScale(90),
    height: wScale(90),
  },
  svgimg: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(5)
  },
  topcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(8),
    borderRadius: 5,
    borderWidth: 4,
    marginBottom: hScale(10)
  },
  column: {
  },
  title:
  {
    fontSize: wScale(55),
    fontWeight: 'bold',
    color: '#322254',
    textTransform: 'uppercase',
    letterSpacing: wScale(3),
    lineHeight: 60
  },
  title2: {
    fontSize: 17,
    color: '#322254',
    marginTop: hScale(-6),
    fontWeight: 'bold'
  },

});

export default RadiantTransactionScreen;
