import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Easing, ToastAndroid, Alert } from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { useSelector } from 'react-redux';
import RecentHistory from '../../components/RecentHistoryBottomSheet'; // Ensure this is used or remove it
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import DateRangePicker from '../../components/DateRange';
import { hScale, wScale } from '../../utils/styles/dimensions';
import { useNavigation } from '@react-navigation/native';
import NoDatafound from '../drawer/svgimgcomponents/Nodatafound';
import { FontSize } from '../../utils/styles/theme';
import { RootState } from '../../reduxUtils/store';
import OnelineDropdownSvg from '../drawer/svgimgcomponents/simpledropdown';
import ShareSvg from '../drawer/svgimgcomponents/sharesvg';
import AepsReportSvg from '../drawer/svgimgcomponents/AepsReportSvg';
import MStateMentReporSvg from '../drawer/svgimgcomponents/MStateMentReporSvg';
import AadharReporSvg from '../drawer/svgimgcomponents/AadharReporSvg';
import CheckBalSvg from '../drawer/svgimgcomponents/CheckBlreporSvg';
import Upisvg from '../drawer/svgimgcomponents/Upisvg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from "react-native-share";
import { APP_URLS } from '../../utils/network/urls';
import moment from 'moment';
import OTPModal from '../../components/OTPModal';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

const ImpsNeftScreen = () => {
  const navigation = useNavigation();
  const { colorConfig, IsDealer } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const color2 = `${colorConfig.primaryButtonColor}60`;

  const [transactions, setTransactions] = useState([]);
  const [isRefundOTP, setIsRefundOTP] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ShowOtpModal, setShowOtpModal] = useState(false);
  const [isotp, setIsOtp] = useState('');
  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchnumber, setSearchnumber] = useState('');
  const [heightview, setHeightview] = useState(false); 0
  const [borderColor] = useState(new Animated.Value(0));
  const capRef = useRef();
const [tid, setId]= useState('')
  const { get, post } = useAxiosHook();
  const { userId } = useSelector((state) => state.userInfo);
  useEffect(() => {
    recentTransactions(selectedDate.from, selectedDate.to, selectedStatus);
    Animated.loop(
      Animated.sequence([

        Animated.timing(borderColor, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,

        }),

        Animated.timing(borderColor, {
          toValue: 0,
          duration: 1000, // Duration for red to black transition
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();
    convertImageToBase64()
  }, [borderColor]);

  const animatedBorder = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [color1, color2]
  })
  const [expandedTransactionId, setExpandedTransactionId] = useState(null); // Track expanded item

  const handlePress = (item) => {
    // Toggle expanded view for the specific transaction
    if (expandedTransactionId === item.TransactionId) {
      setExpandedTransactionId(null);  // Collapse if the same item is clicked
    } else {
      setExpandedTransactionId(item.TransactionId);  // Expand if a new item is clicked
    }
  };
  const recentTransactions = async (from, to, status) => {
    setLoading(true);
    try {
      const formattedFrom = new Date(from).toISOString().split('T')[0];
      const formattedTo = new Date(to).toISOString().split('T')[0];
      const url2 = `${APP_URLS.dealer_rem_MoneyTransferReport}pageindex=1&txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&allretailer=&allapiuser=&ddl_status=${status}&ddl_Type=ALL`
      const url = `Money/api/Money/GetBeneIMPSReport?pageindex=1&pagesize=500&role=Retailer&Id=${userId}&txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&status=${status}&transtype=ALL&senderno=${searchnumber}`;
      const response = await get({ url: IsDealer ? url2 : url });
      setTransactions(response);
      console.log(response[0]);

    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const RefundOTP = async (TransactionId) => {
    console.log(`${APP_URLS.RefundOTP}tid=${tid}&otp=${isotp}` )
    try {
  
      if (isotp) {
     const   res = await get({ 
          url: `${APP_URLS.RefundOTP}Txnid=${tid}&otp=${isotp}` 
        });
        
        console.log(res);
        if (res) {
          ToastAndroid.show(res.ADDINFO||'', ToastAndroid.LONG);

        } else {
          ToastAndroid.show(res.ADDINFO||'try again', ToastAndroid.LONG);
        }
        return;  
  
      } else {
        const  res = await post({ 
          url: `${APP_URLS.Report_RefundOTP}Txnid=${TransactionId}` 
        });   if (res.status) {
          setShowOtpModal(true);
        } else {
          ToastAndroid.show(res.ADDINFO, ToastAndroid.LONG);
        }
      }
  
      setIsRefundOTP(res);
  
   
  
    } catch (error) {
      console.error('Error occurred:', error);
      ToastAndroid.show('An error occurred. Please try again later.', ToastAndroid.LONG);
    }
  };
  
  const onShare2 = useCallback(async () => {
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
  const renderItem = ({ item }) => (
    <ViewShot
      ref={capRef} style={{ flex: 1, backgroundColor: 'white' }}
      options={{ format: "jpg", quality: 0.7 }}>

      <TouchableOpacity activeOpacity={0.4} style={[styles.card, {
        backgroundColor: color1,
        borderColor: IsDealer ? item.status : item.Status === 'SUCCESS' ? 'green' : IsDealer ? item.status : item.Status === 'FAILED'||item.Status === 'Failed' ? 'red' : item.Status.startsWith('R') ? '#2830bf' :'#e6b42c'
      }]}
        onPress={() => handlePress(item)} >
        <View >

          <View style={styles.rowview}>

            <View style={styles.drporow}>

              <View style={{ paddingLeft: wScale(10), }}>
                <Text style={styles.timetex}>{IsDealer ? item.bank_nm : item.BankName === "" ? ('No Name') : IsDealer ? item.bank_nm : item.BankName}
                </Text>
                <Text style={styles.amounttex}>{IsDealer ? item.accountno : item.AccountNo === '' ? "....." : IsDealer ? item.accountno : item.AccountNo}</Text>

              </View>
            </View>


            <View>
              <Text style={[styles.statusText, styles.textrit,
              { color: IsDealer ? item.status : item.Status === 'SUCCESS' ? 'green' : IsDealer ? item.status : item.Status === 'FAILED'||item.Status === 'Failed' ? 'red' :item.Status.startsWith('R')? '#2830bf' : '#e6b42c' }]}>
                {item.Status}</Text>
              <Text style={[styles.amounttex, styles.textrit,
              {
                color: IsDealer ? item.status : item.Status === 'SUCCESS' ? 'green' :
                  item.Status === 'FAILED'||item.Status === 'Failed' ? 'red' : item.Status.startsWith('R') ? '#2830bf' :'#e6b42c'
              }]}>₹ {`${IsDealer ? item.amount : item.Amount}`}</Text>

            </View>
          </View>

          <View style={[styles.rowview,]}>

            <Text style={[styles.smstex,
            {
              flex: 0,
              letterSpacing: 0,

              backgroundColor: IsDealer ? item.Trans_type : item.TransactionType === 'IMPS_VERIFY' ?
                'green' :
                'red',

            }]}>{IsDealer ? item.Trans_type : item.TransactionType === 'IMPS_VERIFY' ?
              'Verified A/C' :
              ' Non Verify A/C'}
            </Text>
            <Text style={[styles.smstex,
            {
              backgroundColor: IsDealer ? item.status : item.Status === 'SUCCESS' ?
                'green' : IsDealer ? item.status : item.Status === 'FAILED' ||item.Status === 'Failed'?
                  'red' :item.Status.startsWith('R')? '#2830bf' : '#e6b42c',
            }]} numberOfLines={1} ellipsizeMode='tail'>Your Transaction is {IsDealer ? item.status : item.Status}
            </Text>
          </View>
          <View style={[styles.rowview]}>
            <View >
              <Text style={styles.statusText}>IFS CODE</Text>
              <Text style={styles.timetex}>
                {item.IFSC ? item.IFSC : 'ifs code..'}
              </Text>
            </View>
            <View style={styles.drporow}>
              <View style={styles.dropview}>
                <Text style={[styles.statusText, styles.textrit]}>Sender Info</Text>
                <Text style={[styles.amounttex, styles.textrit]}>
                  {IsDealer ?
                    item.senderno :
                    item.Sender}
                </Text>
              </View>
              <View style={[{ transform: [{ rotate: expandedTransactionId === item.TransactionId  ? '180deg' : '0deg' }] }]}>
                <OnelineDropdownSvg />
              </View>
            </View>

          </View>
          <View style={[styles.border, { marginTop: 0 }]} />

          <View style={styles.rowview}>
            <Text style={[styles.statusText, styles.textrit]}>Receiver Name</Text>
            <Text style={[styles.timetex,]}>
              {IsDealer ? item.recivername : item.Receiver}
            </Text>

          </View>
          <View style={styles.rowview}>
            <Text style={[styles.statusText, styles.textrit]}>Bank RRn</Text>
            <Text style={[styles.timetex,]}>
              {item.BankRefId ? item.BankRefId : 'BankRRN'}
            </Text>

          </View>
          <View style={[styles.border,]} />

          <View style={styles.rowview}>
            <View >
              <Text style={styles.statusText}>Request Time</Text>
              <Text style={styles.timetex}>{IsDealer ? item.trans_time : item.M_Date}</Text>
            </View>
            {
              item.Dmttype === 'DMTN'
                // && item.Status === 'Pending'
                ?
                <TouchableOpacity onPress={() => {
                  setId(item.TransactionId)
                  RefundOTP(item.TransactionId)
                }} >
                  <Animated.View style={[styles.refbut, { backgroundColor: animatedBorder }]}>
                    <Text style={[styles.reftext, {}]}>Refund</Text>
                  </Animated.View>
                </TouchableOpacity>
                : null
            }

            <TouchableOpacity style={styles.shearbtn}
              onPress={()=>onShare(item)}
            >
              <ShareSvg size={wScale(20)} color='#000' />
              <Text style={[styles.sheartext, { backgroundColor: colorConfig.secondaryColor }]}>
                Share
              </Text>
            </TouchableOpacity>
          </View>

          {expandedTransactionId === item.TransactionId ? <View>
            <View style={[styles.border,]} />
            <View style={[styles.rowview,]}>
              <Text style={styles.statusText}>Transaction ID</Text>
              <Text style={styles.statusText}>Transaction Mode</Text>
            </View>
            <View style={[styles.rowview,]}>
              <Text style={[styles.timetex,]}>{`${IsDealer ? item.trans_id : item.TransactionId}`}</Text>
              <Text style={[styles.timetex,]}>{`${IsDealer ? item.Trans_type : item.TransactionType}`}</Text>
            </View>

            <View style={[styles.border,]} />
            <View style={[styles.rowview,]}>
              <Text style={[styles.statusText, { flex: 1 }]}>Pre Balance</Text>
              <Text style={[styles.statusText, { flex: 1, textAlign: 'center' }]}>Debit</Text>
              <Text style={[styles.statusText, { flex: 1, textAlign: 'center' }]}>Post Balance</Text>
              <Text style={[styles.statusText, styles.textrit, { flex: 1, }]}>My Earn</Text>
            </View>

            <View style={[styles.rowview,]}>
              <Text style={[styles.timetex, { flex: 1, }]}>
                ₹ {`${IsDealer ? item.dlm_remain_pre : item.REM_Remain_Pre}`}
              </Text>
              <Text style={[styles.timetex, { flex: 1, textAlign: 'center' }]}>₹ {`${item.Debit}`}</Text>
              <Text style={[styles.timetex, { flex: 1, textAlign: 'center' }]}>₹ {`${IsDealer ? item.dlm_remain : item.REM_Remain_Post}`}</Text>
              <Text style={[styles.timetex, styles.textrit, { flex: 1 }]}>₹ {`${IsDealer ? item.dlm_income : item.Dealer_Income}`}</Text>
            </View>
          </View> : null}

        </View>
      </TouchableOpacity>
    </ViewShot>
  );

  const convertImageToBase64 = async () => {
    const path = RNFS.MainBundlePath + '/assets/images/app_logo.png'; // Image ka path
    console.log(path)
    try {
      const base64String = await RNFS.readFile(path, 'base64');
      console.log(base64String); // Yeh Base64 string hai
    } catch (error) {
      console.error(error);
    }
  };





  const onShare = async (item) => {
    const pdfOptions = {
      html: `
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 20px;
              background-color: #f0f8ff;
              color: #333;
            }
            h1 {
              text-align: center;
              color: #2e8b57;
              margin-bottom: 20px;
              font-size: 24px;
              text-shadow: 1px 1px 2px #aaa;
            }
            .container {
              border: 1px solid #ccc;
              padding: 20px;
              border-radius: 8px;
              background-color: #ffffff;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              margin-bottom: 20px;
            }
            p {
              line-height: 1.6;
              margin: 10px 0;
              font-size: 16px;
            }
            strong {
              color: #2e8b57;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 0.9em;
              color: #555;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
            .divider {
              border-bottom: 2px solid #2e8b57;
              margin: 20px 0;
            }
            .logo {
              display: block;
              margin: 0 auto 20px;
              width: 150px; /* Adjust size as needed */
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Transaction Details</h1>
            <div class="divider"></div>
            <p><strong>Bank Name:</strong> ${IsDealer ? item.bank_nm : item.BankName || 'No Name'}</p>
            <p><strong>Account No:</strong> ${IsDealer ? item.accountno : item.AccountNo || '.....'}</p>
            <p><strong>Status:</strong> ${item.Status}</p>
            <p><strong>Amount:</strong> ₹ ${IsDealer ? item.amount : item.Amount}</p>
            <p><strong>IFS Code:</strong> ${item.IFSC || 'ifs code..'}</p>
            <p><strong>Receiver Name:</strong> ${IsDealer ? item.recivername : item.Receiver}</p>
            <p><strong>Bank RRN:</strong> ${item.BankRefId || 'BankRRN'}</p>
            <p><strong>Request Time:</strong> ${IsDealer ? item.trans_time : item.M_Date}</p>
            <p><strong>Transaction ID:</strong> ${IsDealer ? item.trans_id : item.TransactionId}</p>
            <p><strong>Transaction Mode:</strong> ${IsDealer ? item.Trans_type : item.TransactionType}</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing our service!</p>
          </div>
        </body>
        </html>
      `,
      fileName: 'TransactionDetails',
      directory: 'Documents',
    };
  
    try {
      const file = await RNHTMLtoPDF.convert(pdfOptions);
      await sharePDF(file.filePath);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate PDF.');
    }
  };
  
  


  const sharePDF = (filePath) => {
    if (filePath) {
      const shareOptions = {
        title: 'Share PDF',
        url: 'file://' + filePath,
      };

      Share.open(shareOptions).catch(error => {
        Alert.alert('Error', 'Failed to share PDF: ' + error.message);
      });
    }
  };
  return (
    <View style={styles.main}>
      <AppBarSecond title={'IMPS History'} />
      <DateRangePicker
        onDateSelected={(from, to) => setSelectedDate({ from, to })}
        SearchPress={(from, to, status) => recentTransactions(from, to, status)}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        searchnumber={searchnumber}
        setSearchnumber={setSearchnumber}
        isStShow={true}
        retailerID={() => {

        }}
        isshowRetailer={IsDealer}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={colorConfig.primary} />
        ) : (
          <>
            {transactions.length === 0 ? (
              <NoDatafound />
            ) : (
              <FlatList
                data={transactions}
                renderItem={renderItem}
                keyExtractor={(item) => item.Idno}
              />
            )}
          </>
        )}

        <OTPModal
          setShowOtpModal={setShowOtpModal}
          disabled={isotp.length !== 4}
          showOtpModal={ShowOtpModal}
          setMobileOtp={setIsOtp}
          verifyOtp={() => {
            RefundOTP(isotp)
          }}
          inputCount={4}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },
  container: { flex: 1, paddingHorizontal: wScale(10), paddingVertical: hScale(20), },
  card: {
    marginBottom: hScale(10),
    borderWidth: wScale(.7),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(8)
  },
  rowview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  border: {
    borderBottomWidth: wScale(.7),
    borderColor: '#000',
    paddingVertical: hScale(4)
  },
  amounttex: {
    fontSize: wScale(18),
    color: '#000',
    fontWeight: 'bold'
  },
  statusText: {
    fontSize: FontSize.small,
    color: '#000',
    fontWeight: 'bold'
  },
  timetex: {
    fontSize: FontSize.regular,
    color: '#000',
  },
  dropview: {
    paddingRight: wScale(10),
  },
  textrit: {
    textAlign: 'right',

  },
  drporow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shearbtn: {
    alignItems: 'center'
  },
  sheartext: {
    fontSize: FontSize.tiny,
    color: '#FFF',
    paddingHorizontal: wScale(4),
    borderRadius: 10,
    paddingVertical: hScale(2)
  },
  smstex: {
    fontSize: FontSize.tiny,
    color: '#FFF',
    letterSpacing: wScale(1),
    textAlign: 'center',
    flex: 1,
    marginVertical: hScale(4),
    borderRadius: 10,
    paddingHorizontal: wScale(5)
  },
  refbut: {
    width: wScale(90),
    borderWidth: wScale(1),
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: hScale(2)
  },
  reftext: {
    fontSize: wScale(14),
    color: '#000',
    fontWeight: 'bold'
  },

});

export default ImpsNeftScreen;
