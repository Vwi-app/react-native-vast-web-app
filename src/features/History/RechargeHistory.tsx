import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard, TextInput, Alert, ToastAndroid, Linking } from 'react-native';
import { hScale, wScale } from '../../utils/styles/dimensions';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import LottieView from 'lottie-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import DynamicButton from '../drawer/button/DynamicButton';
import PaddingSvg from '../drawer/svgimgcomponents/Paddingimg';
import FailedSvg from '../drawer/svgimgcomponents/Failedimg';
import { BottomSheet } from '@rneui/themed';
import Share from "react-native-share";
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import { useNavigation } from '../../utils/navigation/NavigationService';
import ViewShot, { captureRef } from 'react-native-view-shot'
import Refund from '../drawer/svgimgcomponents/Refund';
import PDFGenerator from '../../components/Pdf_Print';
const RechargeHistory = ({ route }) => {
  const navigation = useNavigation();

  const { colorConfig, IsDealer } = useSelector((state: RootState) => state.userInfo);
  const {
    Status, Debitamount, Reqesttime, Recharge_number,
    Operator_name, Request_ID, operator_type, Circle,
    Commision, Recharge_amount, Operatorid, RemainPost,
    RemainPre, Idno, frm_name
  } = route.params;
  const { get, post } = useAxiosHook();
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  useEffect(() => { console.log(operator_type) }, [])
  const copyto = () => {
    Clipboard.setString( APP_URLS.AppName==='Smart Pay Money' ?Recharge_number:Operatorid);
    ToastAndroid.show('Copied to clipboard!  : ' + Operatorid, ToastAndroid.LONG);
  };

  const handleDisputeSubmit = async () => {
    try {
      const url = `${APP_URLS.heavyreq}optname=${Operator_name}&mobileno=${disputeReason}`
      console.log(url)
      console.log('Dispute Reason:', disputeReason);
      const res = await post({ url: operator_type == 'DTH' ? url : `${APP_URLS.dispute}id=${Idno}&comment=${disputeReason}&mobileno=${Recharge_number}&optname=${Operator_name}&amount=${Recharge_amount}` });
console.log("******************",`${APP_URLS.dispute}id=${Idno}&comment=${disputeReason}`)
      setBottomSheetVisible(false);
      setDisputeReason('');

      if (operator_type == 'DTH') {
        Alert.alert("Success", 'Heavy Request Success!!');
      } else {
        Alert.alert("Success", res.Message || "Dispute submitted successfully!");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred while submitting the dispute.");
    }
  };
  
    const capRef = useRef();
  const onShare = useCallback(async () => {
    try {

      const filename = `TXN-Reciept-${APP_URLS.AppName}.jpg`;

      const uri = await captureRef(capRef, {
        format: 'jpg',
        quality: 0.7,
        result: 'tmpfile',
      });

      await Share.open({
        message: `Hi, I am sharing the transaction details using ${APP_URLS.AppName} App.`,
        url: uri,
        filename: filename,
      });
    } catch (e) {
      console.log(e);
      ToastAndroid.show("Transaction details not shared", ToastAndroid.SHORT);
    }
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ViewShot ref={capRef} style={{ flex: 1, backgroundColor: 'white' }} options={{ format: "jpg", quality: 0.7 }}>
    <View style={styles.container}>
    <View style={styles.topview}>
  {Status === 'SUCCESS' ? (
    <LottieView
      source={require('../../utils/lottieIcons/greensuccess.json')}
      style={styles.lotiimg}
      autoPlay={true}
      loop={false}
    />
  ) : Status === 'FAILED' ? (
    <FailedSvg />
  ) : Status.startsWith("P") ? (
    <PaddingSvg />
  ) : Status.startsWith("R") ? (
    <Refund size={100} color={''} />
  ) : null} 

  <Text style={styles.title}>Transaction {Status}</Text>
  <Text style={styles.label}>{Reqesttime}</Text>
</View>
      <View style={[styles.detailContainer, { alignItems: 'flex-end' }]}>
        <View>
          <Text style={styles.label}>Retailer Firm Name</Text>
          <Text style={styles.value}>{frm_name}</Text>
        </View>

      </View>



      <View style={[styles.detailContainer, { alignItems: 'flex-end' }]}>
        <View>
          <Text style={styles.label}>Transaction ID</Text>
          <Text style={styles.value}>{Request_ID}</Text>
        </View>
        <TouchableOpacity onPress={copyto}>
          <Text style={[styles.value, { color: colorConfig.secondaryColor }]}>Copy</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.label}>Operator ID</Text>
        <Text style={styles.value}>{Operatorid}</Text>
      </View>
      <View style={[styles.detailContainer, { alignItems: 'center' }]}>
        <View>
          <Text style={styles.label}>Recharge Number</Text>
          <Text style={styles.number}>{Recharge_number}</Text>
        <Text style={styles.value}>{Operator_name}{!IsDealer&& '/'} {Circle}</Text>
        </View>
        <Text style={styles.value}>₹ {Debitamount}</Text>
      </View>

      <View style={[styles.detailContainer, { alignItems: 'center' }]}>
        <View>
          <Text style={styles.label}>Commision</Text>
          <Text style={styles.value}>₹ {Commision}</Text>
        </View>
        <View>
          <Text style={styles.label}>Debit₹</Text>
          <Text style={[styles.value, { textAlign: 'right' }]}>₹ {Recharge_amount}</Text>
        </View>
      </View>

      <View style={[styles.detailContainer, { alignItems: 'flex-end', paddingBottom: hScale(30) }]}>
        <View>
          <Text style={styles.label}>Pre Balance</Text>
          <Text style={styles.value}>₹ {RemainPre}</Text>
        </View>
        <View>
          <Text style={styles.label}>Post Balance</Text>
          <Text style={[styles.value, { textAlign: 'right' }]}>₹ {RemainPost}</Text>
        </View>
      </View>
      {!IsDealer && <>
        {Status === 'SUCCESS' && <TouchableOpacity
          style={[styles.disputeButton, { backgroundColor: colorConfig.secondaryColor }]}
          onPress={() => setBottomSheetVisible(true)}
        >
          <Text style={styles.buttonText}>Dispute</Text>
        </TouchableOpacity>}

      </>}
      <Text style={styles.buttonText}></Text>

      <PDFGenerator route={{ params:  route.params}} />


      {/* <DynamicButton title={'Share'} onPress={() => onShare()} /> */}

      <BottomSheet isVisible={isBottomSheetVisible} onBackdropPress={() => setBottomSheetVisible(false)}>
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.sheetTitle}>{Status && operator_type === 'DTH' ? 'Heavy Request' : 'Enter Dispute Reason'}</Text>

          <TextInput
            style={styles.input}
            value={disputeReason}
            onChangeText={setDisputeReason}
            placeholder={operator_type == 'DTH' ?  'Type your reason here...' : "Type your reason here..."}
            multiline
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleDisputeSubmit}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      </View>
      </ViewShot>
       </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wScale(20),
    justifyContent: 'center',
    flex: 1,
  },
  topview: {
    alignItems: 'center',
    paddingBottom: hScale(15),
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: wScale(16),
    marginBottom: hScale(5),
    color: '#333',
  },
  title: {
    fontSize: wScale(25),
    marginBottom: hScale(5),
    color: '#000',
    fontWeight: 'bold',
  },
  lotiimg: {
    height: wScale(120),
    width: wScale(120),
  },
  value: {
    fontSize: wScale(18),
    marginBottom: hScale(10),
    color: '#000',
    fontWeight: 'bold',
  },
  number: {
    fontSize: wScale(14),
    color: '#000',
    fontWeight: 'bold',
  },
  disputeButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: wScale(16),
    fontWeight: 'bold',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
  },
  input: {
    color:'black',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default RechargeHistory;
