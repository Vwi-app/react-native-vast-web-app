import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/styles/theme';
import { hScale, wScale } from '../../utils/styles/dimensions';
import DashboardHeader from './components/DashboardHeader';
import LinearGradient from 'react-native-linear-gradient';
import { RootState } from '../../reduxUtils/store';
import { useSelector } from 'react-redux';
import Aeps from '../../utils/svgUtils/Aeps';
import StatementSvg from '../../utils/svgUtils/StatementSvg';
import RechargeSvg from '../drawer/svgimgcomponents/RechargeSvg';
import IMPSsvg from '../drawer/svgimgcomponents/IMPSsvg';
import AadharPay from '../drawer/svgimgcomponents/AdharPaysvg';
import MPOSsvg from '../drawer/svgimgcomponents/M-POSsvg';
import Matmsvg from '../drawer/svgimgcomponents/Matmsvg';
import Bussvg from '../drawer/svgimgcomponents/Bussvg';
import Flightsvg from '../drawer/svgimgcomponents/Flightsvg';
import Cashsvg from '../drawer/svgimgcomponents/Cashsvg';
import Paymentsvg from '../drawer/svgimgcomponents/Paymentsvg';
import Possvg from '../drawer/svgimgcomponents/Possvg';
import Walletansvg from '../drawer/svgimgcomponents/Walletansvg';
import Finosvg from '../drawer/svgimgcomponents/Finosvg';
import Airtalsvg from '../drawer/svgimgcomponents/Airtalsvg';
import Aepschargsvg from '../drawer/svgimgcomponents/Aepschargsvg';
import Pansvg from '../drawer/svgimgcomponents/Pansvg';
import { playSound } from './components/Sounds';
import RadintTransactSvg from '../drawer/svgimgcomponents/RadintTransactSvg';
import RadintPickupSvg from '../drawer/svgimgcomponents/RadintPickupSvg';

const ReportScreen = () => {
  const navigation = useNavigation<any>();
  const { colorConfig, IsDealer, fcmToken } = useSelector((state: RootState) => state.userInfo);

  const getSvgComponent = (item) => {
    switch (item) {
      case 'Recharge & Utilities':
        return <RechargeSvg color='#000' />
      case 'IMPS/NEFT':
        return <IMPSsvg color='#000' />
      case 'AEPS/AadharPay':
        return <AadharPay color='#000' />

      case 'M-POS':
        return <MPOSsvg color='#000' />
      case 'M-ATM':
        return <Matmsvg color='#000' />
      case 'PAN Card':
        return <Pansvg color='#000' />
      case 'Cash Deposit':
        return <Cashsvg color='#000' />
      case 'Flight Booking':
        return <Flightsvg color='#000' />
      case 'Bus Booking':
        return <Bussvg color='#000' />
      case 'Payment Gateway':
        return <Paymentsvg color='#000' />
      case 'POS Wallet':
        return <Possvg color='#000' />
      case 'Wallet Unload':
        return <Walletansvg color='#000' />
      case 'Cash Pikup':
        return <RadintPickupSvg color='#000' size={40} />
      case 'FINO CMS':
        return <Finosvg color='#000' />

      case 'Airtel Report':
        return <Airtalsvg color='#000' />

      // case 'AEPS Charges':
      //   return <Aepschargsvg color='#000' />

      case 'Cms Wallet Transfer':
        return <Walletansvg color='#000' />
    
    case 'Cash Pickup Prepay Report':
        return <Walletansvg color='#000' />
    }
  
  };
  const getSvgComponent2 = (item) => {
    switch (item) {
      case 'Recharge & Utilities':
        return <RechargeSvg color='#000' />
      case 'Money Transfer':
        return <IMPSsvg color='#000' />
      case 'AEPS/AadharPay':
        return <AadharPay color='#000' />
      case 'POS ATM':
        return <MPOSsvg color='#000' />
      case 'PAN Card':
        return <Pansvg color='#000' />
      case 'Cash Deposit':
        return <Cashsvg color='#000' />
      case 'Flight Booking':
        return <Flightsvg color='#000' />
      case 'Travel':
        return <Bussvg color='#000' />

      case 'Add Money':
        return <Walletansvg color='#000' />
      case 'Security':
        return <Finosvg color='#000' />

      case 'MicroATM Rental Report':
        return <Matmsvg color='#000' />


    }
  };


  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity style={[styles.imgview, { elevation: item === '' ? 0 : 5 }]} onPress={() => IsDealer ? handleItemClick2(item) : handleItemClick(item)}>

        <View  >
          {IsDealer ? getSvgComponent2(item) : getSvgComponent(item)}
        </View>
        <Text style={[styles.itemText, { color: colorConfig.secondaryColor }]}>{item}</Text>

      </TouchableOpacity>

    </View>




  );

  const handleItemClick2 = (item) => {

    switch (item) {
      case 'Recharge & Utilities':
        navigation.navigate('DealerRechargeHistory');
        break;
      case 'Money Transfer':
        navigation.navigate('ImpsNeftScreen');
        break;
      case 'AEPS/AadharPay':
        navigation.navigate('AEPSAdharPayR');
        break;
      case 'POS ATM':
        navigation.navigate('MPosScreenR');
        break;
      case 'MicroATM Rental Report':
        navigation.navigate('MatmReport');
        break;
      case 'PAN Card':
        navigation.navigate('PanReport');
        break;
      case 'Cash Deposit':
        navigation.navigate('cashDepReport');
        break;

      case 'Flight Booking':
        navigation.navigate('FlightBookReport');
        break;

      case 'Bus Booking':
        navigation.navigate('BusBookReport');
        break;
      case 'Add Money':
        navigation.navigate('PaymentGReport');
        break;
      case 'POS Wallet':
        navigation.navigate('posreport');
        break;
      case 'Wallet Unload':
        navigation.navigate('Walletunloadreport');
        break;
      case 'FINO CMS':
        navigation.navigate('finocmsReport');
        break;
      case 'Airtel Report':
        navigation.navigate('finocmsReport');
        break;
      // case 'AEPS Charges':
      //   navigation.navigate('finocmsReport');
      //   break;
      
      default:
        break;
    }
  };

  const handleItemClick = (item) => {

    switch (item) {
      case 'Recharge & Utilities':
        navigation.navigate('RechargeUtilitisR');
        break;
      case 'IMPS/NEFT':
        navigation.navigate('ImpsNeftScreen');
        break;
      case 'AEPS/AadharPay':
        navigation.navigate('AEPSAdharPayR');
        break;
      case 'M-POS':
        navigation.navigate('MPosScreenR');
        break;
      case 'M-ATM':
        navigation.navigate('MatmReport');
        break;
      case 'PAN Card':
        navigation.navigate('PanReport');
        break;
      case 'Cash Deposit':
        navigation.navigate('cashDepReport');
        break;

      case 'Flight Booking':
        navigation.navigate('FlightBookReport');
        break;

      case 'Bus Booking':
        navigation.navigate('BusBookReport');
        break;
      case 'Payment Gateway':
        navigation.navigate('PaymentGReport');
        break;
      case 'POS Wallet':
        navigation.navigate('posreport');
        break;
      case 'Wallet Unload':
        navigation.navigate('Walletunloadreport');
        break;
      case 'FINO CMS':
        navigation.navigate('finocmsReport');
        break;
      case 'Cash Pikup':
        navigation.navigate('CashPicUpReport');
        break;
      case 'Airtel Report':
        navigation.navigate('finocmsReport');
        break;
      case 'AEPS Charges':
        navigation.navigate('finocmsReport');
        break;
      case 'Cms Wallet Transfer':
        navigation.navigate('WalletTransferReport');
        break;
case 'Cash Pickup Prepay Report':
        navigation.navigate('RadiantPrepayReport');
        break;

      default:
        break;
    }
  };
  const gridItems2 = [
    'Recharge & Utilities',
    'AEPS/AadharPay',
    'Money Transfer',
    'Add Money',
    'POS ATM',
    'PAN Card',
    'Travel',
    'Security',
    'MicroATM Rental Report',
  ];


  const gridItems = [
    'Recharge & Utilities',
    'IMPS/NEFT',
    'AEPS/AadharPay',
    'M-POS',
    'M-ATM',
    'PAN Card',
    'Cash Deposit',
    'Flight Booking',
    'Bus Booking',
    'Payment Gateway',
    'POS Wallet',
    'Wallet Unload',
    'Cash Pikup',
    'FINO CMS',
    'Airtel Report',
    // 'AEPS Charges'
    'Cms Wallet Transfer',
    'Cash Pickup Prepay Report',
    ''

  ];
  console.log(fcmToken)
  return (
    <View style={styles.main}>
      <LinearGradient
        style={{ paddingBottom: wScale(5) }}
        colors={[
          colorConfig.primaryColor, colorConfig.secondaryColor
        ]} >
        <DashboardHeader />

      </LinearGradient>

      <ScrollView>
        <View style={styles.container}>
          <FlatList
            data={IsDealer ? gridItems2 : gridItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />

        </View>
      </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    paddingVertical: hScale(10),
    paddingTop: hScale(30)
  },
  item: {
    alignItems: 'center',
    marginBottom: hScale(20),
    flex: 1,
  },
  itemText: {
    fontSize: wScale(14),
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold'
  },
  imgview: {
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    height: hScale(105),
    alignItems: 'center',
    marginBottom: hScale(5),
    elevation: 5,
    backgroundColor: '#fff'

  },
});

export default ReportScreen;
