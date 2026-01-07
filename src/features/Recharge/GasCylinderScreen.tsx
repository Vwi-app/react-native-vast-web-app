
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  FlatList,
  Alert,
  AsyncStorage,
} from 'react-native';
import { BottomSheet, Card, Image } from '@rneui/themed';
import { translate } from '../../utils/languageUtils/I18n';
import { APP_URLS } from '../../utils/network/urls';
import { colors } from '../../utils/styles/theme';
import FlashList from '@shopify/flash-list/dist/FlashList';
import { SCREEN_HEIGHT, hScale, wScale } from '../../utils/styles/dimensions';
import DropdownSvg from '../../utils/svgUtils/DropdownSvg';
import useAxiosHook from '../../utils/network/AxiosClient';
import { useDeviceInfoHook } from '../../utils/hooks/useDeviceInfoHook';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { encrypt } from '../../utils/encryptionUtils';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import ShowLoader from '../../components/ShowLoder';
import FlotingInput from '../drawer/securityPages/FlotingInput';
import OnelineDropdownSvg from '../drawer/svgimgcomponents/simpledropdown';
import DynamicButton from '../drawer/button/DynamicButton';
import RecentHistory from '../../components/RecentHistoryBottomSheet';
import OperatorBottomSheet from '../../components/OperatorBottomSheet';
import Rechargeconfirm from '../../components/Rechargeconfirm';
import ElectricityOperatorBottomSheet from '../../components/ElectricityOperatorBottomSheet';
import ClosseModalSvg2 from '../drawer/svgimgcomponents/ClosseModal2';
import { useNavigation } from '@react-navigation/native';
import { combineSlices } from '@reduxjs/toolkit';
import RecentText from '../../components/RecentText';
import { useLocationHook } from "../../hooks/useLocationHook";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

const GasCylinderScreen = () => {

  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const [CustomerID, setCustomerID] = useState('');
  const [amount, setAmount] = useState('');
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [ProceedSheetVisible, setProceedSheetVisible] = useState(false);
  const [maxlen, setMaxLen] = useState(10);
  const [isInfo, setIsinfo] = useState(true);
  const [dueDate, setDueDate] = useState('Date');
  const [CustomerName, setCustomerName] = useState('N/A');
  const [selectbool, setSelectbool] = useState(true);

  const [GasCylenderBillOpt, setGasCylenderBillOpt] = useState(
    []
  );
  const [district, setdistrict] = useState('Select Your District');
  const [operator, setCylenderBillOpt] = useState('Select Your Operator');
  const [isdist, setIsdist] = useState(true);
  const [distCode, setDistCode] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [reqTime, setReqTime] = useState('');
  const [reqId, setReqId] = useState('')
  const [isrecent, setIsrecent] = useState(false);
  const [historylist, setHistorylist] = useState([]);

  useEffect(() => {
    Statelist();
    // handlePostRequest();
    // handlePostRequest();
  }, []);
  const navigation = useNavigation<any>();

  useEffect(() => {
    recenttransactions();
  }, []);
const [OPtCode,setOPtCode]= useState('')
  const [ops,setOps]=useState([]);
  const recenttransactions = async () => {


    https://native.stdigipe.in/Recharge/api/data/Optcodelist?opttype=LPG Gas
    try {
      const url = `${APP_URLS.recenttransaction}pageindex=1&pagesize=5&retailerid=${userId}&fromdate=${formattedDate}&todate=${formattedDate}&role=Retailer&rechargeNo=ALL&status=ALL&OperatorName=ALL&portno=ALL`
      console.log(url);
      const response = await get({ url: url })


      const ops = await get({url:'Recharge/api/data/Optcodelist?opttype=LPG Gas'})
      console.log('-*************************************', ops);
setOps(ops.myprop2Items)
      setHistorylist(response);
      setReqTime(response[0]['Reqesttime']);
      setReqId(response[0]['Request_ID'])

    } catch (error) {
      console.log(error);

    }
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const day = ('0' + currentDate.getDate()).slice(-2);

  const formattedDate = `${year}-${month}-${day}`;
  const { get, post } = useAxiosHook();
  async function Statelist() {
    const data = {};
    try {
      const url = `${APP_URLS.gasCylinderState}`;
      const res = await post({ url: url, config: null });
      setstatelist(res['data']);
    } catch (error) { }
  }

  async function fatchDist(state: any) {
    console.log(state);
    try {
      const data = {
        statename: state,
      };

      const url = `${APP_URLS.DistrictByState}${state}`;
      const res = await post({ url: url, config: null });

      console.log(res['data']);
      setdistrictData(res['data']);

      //  setshowdistrictData(true);
    } catch (error) { }
  }
  const [statelist, setstatelist] = useState([]);
  const [districtData, setdistrictData] = useState([]);
  const [distributorId, setdistributorId] = useState('');
  const [MobileNumber, setMobileNumber] = useState('');

  const [showdistrictData, setshowdistrictData] = useState(false);
  const [stateData, setStateData] = useState(translate('Select Your State'));
  const [selectedBharat, setSeleectedBharat] = useState(false)
  const handleInfoPress = () => {
    billInfo();
    setBottomSheetVisible(true);
  };
  const [showStateList, setshowStateList] = useState(false);
  const showStateListData = () => {
    return (
      <FlashList
        data={statelist}
        renderItem={({ item }) => {
          return (
            <View
            >
              <TouchableOpacity
                style={[styles.operatorview]}

                onPress={async () => {
                  setshowStateList(false);
                  setStateData(item);
                  fatchDist(item);
                  console.log(item)
                }}>
                <Text style={[styles.operatornametext]}>

                  {item}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        estimatedItemSize={30}
      />
    );
  };

  async function getIn(stateName: string, district: string) {
    console.log(stateName, district);
    try {
      const url = `${APP_URLS.getIndaneAgency}statename=${stateName}&District=${district}`;

      const res = await post({ url: url });
      console.log('getIndaneAgency  **************************', res);

      setGasCylenderBillOpt(res['data']);
    } catch (error) { }
  }

  const [optcode, setOptCode] = useState('');
  const [custBal, setCustBal] = useState();
  async function billInfo() {
    setShowLoader(true);
  
    // Get the OPtCode from selected filter
    const optt = getOptCode(selectedFilter); // Assuming getOptCode is synchronous
    
    console.log("Selected OPtCode: ", optt); // Check what optt is
  
    if (!optt) {
      Alert.alert("Error", "Invalid Operator selected");
      setShowLoader(false);
      return;
    }
  
    try {
      const url = `${APP_URLS.rechargeViewBill}billnumber=${CustomerID}&Operator=${optt}&billunit=&ProcessingCycle=&acno=&lt&ViewBill=Y`;
  
      // Make the GET request
      const res = await get({
        url: url,
      });
  
      console.log('Response:', res);
      console.log('URL:', url);
  
      // Check if the response is successful
      if (res.RESULT === 0) {
        if (res.ADDINFO.IsSuccess) {
          const BillInfo = res.ADDINFO.BillInfo;
          
          // Show the details in an Alert
          const alertMessage = `
            Customer Name: ${BillInfo['customerName']}
            Bill Amount: ${BillInfo.billAmount}
            Due Date: ${BillInfo.billDueDate || "No Due Date Available"}
          `;
          setAmount(BillInfo.billAmount);
          setCustomerName(BillInfo['customerName']);
          setDueDate(BillInfo.billDueDate || "No Due Date Available")
         // Alert.alert("Bill Information", alertMessage);
          
        } else {
          Alert.alert("Info", res.ADDINFO.Message || "An error occurred");
        }
      } else {
        Alert.alert("Error", res.ADDINFO.Message || "Error fetching bill info");
      }
      
      // Hide loader and show proceed sheet
      setShowLoader(false);
      setProceedSheetVisible(true);
  
    } catch (error) {
      console.error('Error fetching bill info:', error);
      Alert.alert("Error", "There was an issue fetching the bill info.");
      setShowLoader(false);
    }
    
    console.log('URL Debugging Ended');
  }
  


  async function ViewbillInfoStatus() {
    console.log(optcode);
    try {
      const config = {};
      const data = {
        Operatorcode: optcode,
      };
      const url = `${APP_URLS.viewbillstatuscheck}${optcode}`;
      const res = await post({ url: url, });
      console.log(':', url);
      const billSts = res['RESULT'];
      if (billSts === 'Y') {
        setIsinfo(true);

      } else {
        // setIsinfo(false);
      }
      console.log(':', res);
    } catch (error) { }
  }
  const showBottomSheetList = () => {
    return (
      <FlashList
        data={selectbool ? districtData : GasCylenderBillOpt}
        renderItem={({ item }) => {
          return (
            <View
            >
              <TouchableOpacity
                style={[styles.operatorview]}

                onPress={async () => {

                  if (selectbool) {
                    setSelectbool(false);
                    setdistrict(item);

                    console.log('stateData', stateData)
                    switch (ddlStatus) {
                      case 'HP Gas':
                        getHpAgency(stateData, item);

                        break;
                      case 'Indane Gas':
                        getIn(stateData, item);

                        break;
                      case 'Bharat Gas':
                        break;
                      default:
                        break;
                    }

                  } else {
                    console.log(item)
                    setDistCode(item['Distcode'])
                    setCylenderBillOpt(item['Name'])
                    setshowdistrictData(false);
                    setSelectbool(true);

                  }

                }}>
                <Text style={[styles.operatornametext]}>

                  {selectbool ? item : item['Name']}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        estimatedItemSize={30}
      />
    );
  };
  const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
    useDeviceInfoHook();
  const { userId  ,Loc_Data} = useSelector((state: RootState) => state.userInfo);
  const { latitude, longitude, getLatLongValue, checkLocationPermissionStatus, getLocation, isLocationPermissionGranted } = useLocationHook();
  const readLatLongFromStorage = async () => {
    try {
      const locationData = await AsyncStorage.getItem('locationData');
      
      if (locationData !== null) {
        const { latitude, longitude } = JSON.parse(locationData);
        console.log('Latitude:', latitude, 'Longitude:', longitude);
        return { latitude, longitude };
      } else {
        console.log('No location data found');
        return null;
      }
    } catch (error) {
      console.error('Failed to read location data from AsyncStorage:', error);
      return null; 
    }
  };

  const onRechargePress = useCallback(async () => {
    ;
    setShowLoader(true)
   const ll=  getLatLongValue()
    const optt = getOptCode(selectedFilter); 

    const mobileNetwork = await getNetworkCarrier();
    const ip = await getMobileIp();
    const encryption = await encrypt([
      userId,
      CustomerID,
      operator,
      amount,
      latitude ??'0.000',
      longitude??'0.111',
      'city',
      'address',
      'postcode',
      mobileNetwork,
      ip,
      '57bea5094fd9082d',
      optt
    ]);
    console.log([
      userId,
      CustomerID,
      operator,
      amount,
      Loc_Data['latitude'],Loc_Data['longitude'],

      'city',
      'address',
      'postcode',
      mobileNetwork,
      ip,
      '57bea5094fd9082d',
      optt
    ]);

    const rd = encodeURIComponent(encryption.encryptedData[0]);
    const n1 = encodeURIComponent(encryption.encryptedData[1]);
    const ok1 = encodeURIComponent(encryption.encryptedData[2]);
    const amn = amount;
    const ip1 = encodeURIComponent(encryption.encryptedData[10]);
    const em = '57bea5094fd9082d';
    const devtoken = encodeURIComponent(encryption.encryptedData[6]);

    const Latitude = encodeURIComponent(encryption.encryptedData[4]);
    const Longitude = encodeURIComponent(encryption.encryptedData[5]);
    const ModelNo = encodeURIComponent(encryption.encryptedData[11]);
    const OPtCode = encodeURIComponent(encryption.encryptedData[12]);
    const City = devtoken;
    const PostalCode = encodeURIComponent(encryption.encryptedData[8]);
    const InternetTYPE = encodeURIComponent(encryption.encryptedData[9]);
    const Addresss = encodeURIComponent(encryption.encryptedData[7]);
    const value1 = encodeURIComponent(encryption.keyEncode);
    const value2 = encodeURIComponent(encryption.ivEncode);
    const url = `${APP_URLS.rechTask}rd=${rd}&n=${n1}&ok=${OPtCode}&amn=${amn}&pc=${distributorId ||distCode}&bu=${MobileNumber}&acno&lt&ip=${ip1}&mc&em=${em}&offerprice&commAmount&Devicetoken=${devtoken}&Latitude=${Latitude}&Longitude=${Longitude}&ModelNo=${ModelNo}&City=${City}&PostalCode=${PostalCode}&InternetTYPE=${InternetTYPE}&Addresss=${Addresss}&value1=${value1}&value2=${value2}&billduedate=${dueDate}`;
    let status, Message;
    try {
      const res = await post({
        url: url,
      });
      console.log(url ,res);
      console.log(status);
      if(res.status ==='False'){
        alert(res.message);
        setShowLoader(false);

        return
      }
      status = res.Response ||res.status;
      Message = res.Message || res.message;
      await recenttransactions();
    } catch (error) {
      console.error("Recharge failed:", error);
      status = "Failed";
      Message = "Recharge failed, please try again";
    }

   

    navigation.navigate('Rechargedetails', {
      mobileNumber: CustomerID ?? '',  // Default to empty string if null or undefined
      Amount: amount ?? 0,             // Default to 0 if null or undefined
      operator: operator ?? 'N/A',     // Default to 'N/A' if null or undefined
      status: status ?? 'Unknown',     // Default to 'Unknown' if null or undefined
      reqId: reqId ?? '',              // Default to empty string if null or undefined
      reqTime: reqTime ?? new Date().toISOString(), // Default to current time if null or undefined
      Message: Message ?? 'No message available'  // Default to 'No message available' if null or undefined
    });
    
    setCustomerID('');
    setCylenderBillOpt('Select Your Operator');
    setAmount('');
    setIsinfo(false)
    setShowLoader(false);
  }, [
    amount,
    getMobileIp,
    getNetworkCarrier,
    latitude,
    longitude,
    CustomerID,
    operator,
    post,
    userId,
  ]);
  
  async function getHpAgency(stateName: string, district: string) {
    console.log(stateName, district);
    try {
      const url = `${APP_URLS.hpAgency}statename=${stateName}&District=${district}`;

      const res = await post({ url: url });
      setGasCylenderBillOpt(res['data']);
      setSelectbool(false);
      console.log(res);
    } catch (error) {

    }
  }
  const [ddlStatus, setDdlStatus] = useState('HP Gas');

  const Options = () => {
    const buttonData = [
      { title: 'Hp', key: 'Hp' },
      { title: 'Indian', key: 'Indian' },
      { title: 'Bharat', key: 'Bharat' },
    ];

    const handlePress = async (key) => {


      setSelectedFilter(key);
      console.log(`Selected Filter: ${key}`);
      setDdlStatus(key);
      setCylenderBillOpt(key)
      switch (key) {
        case "HP Gas":
          setSeleectedBharat(false)
          break;
        case 'Indane Gas':
          setSeleectedBharat(false)

          break;
        case 'Bharat Gas':
          setSeleectedBharat(true)
          break;
        default:
          break;
      }
    };

    return (
      <View style={styles.row}>
        {ops.map((button) => (
          <TouchableOpacity
            key={button.Operatorname}
            style={[
              styles.button,
              { backgroundColor: selectedFilter === button.Operatorname ? 'green' : 'lightgreen' },
            ]}
            onPress={() => handlePress(button.Operatorname)}
          >
            <Text style={styles.buttonText}>{button.Operatorname}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  const [selectedFilter, setSelectedFilter] = useState('HP Gas');



  const getOptCode = (operatorName) => {
    // Looping through items in the data
    const foundItem = ops.find(
      (item) => item.Operatorname === operatorName
    );
  setOPtCode(foundItem ? foundItem.OPtCode : null)
    // Agar match milta hai to OPtCode return karo, otherwise null
    return foundItem ? foundItem.OPtCode : null;
  };
  
  return (


    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.main}>
      <AppBarSecond title={'Gas Cylinder'} />

                 <Options />

      <ScrollView> 
        
      <View style={styles.container}>
        {showLoader && (
          <ShowLoader />
        )}
        <View></View>

        {selectedBharat === false && (

          <TouchableOpacity
            onPress={() => {
              setshowStateList(false);
              setshowStateList(true);
            }}>


            <FlotingInput label={stateData} editable={false} />
            <View style={[styles.righticon2]}>

              <OnelineDropdownSvg />

            </View>

          </TouchableOpacity>

        )}


        {selectedBharat === false && (


          <TouchableOpacity
            onPress={() => {
              setshowdistrictData(true);
            }}>
            <FlotingInput label={district} editable={false} />
            <View style={[styles.righticon2]}>
              <OnelineDropdownSvg />
            </View>
          </TouchableOpacity>
        )}
        {selectedBharat === false && (<View >
          <FlotingInput label={operator} editable={false} />
          <View style={[styles.righticon2]}>
            <OnelineDropdownSvg />
          </View>
        </View>
        )}
        <View>

          {selectedBharat === true && (<FlotingInput label={'Agenct Code'} 
            onChangeTextCallback={(text) => setdistributorId(text)} value={distributorId} />)}

          {selectedBharat === true && (<FlotingInput label={'Mobile Number'} keyboardType="numeric"

            maxlength={10}
            onChangeTextCallback={(text) => setMobileNumber(text)} value={MobileNumber} />)}
          <View>
            <FlotingInput label={'Customer Id'} value={CustomerID} 
              maxLength={maxlen}
              onChangeTextCallback={text => {
                setCustomerID(text);
                if (text.length >= 5) {
                  setIsinfo(true)
                } else {
                  setIsinfo(false)
                }
              }}
            />
            <View style={[styles.righticon2,]}>
              {isInfo && (
                <TouchableOpacity
                  style={styles.infobtn}
             
                  onPress={handleInfoPress}             >

                  <Text style={[styles.infobtntex,]}>Info</Text>

                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <FlotingInput label={'Enter Amount'}
             maxLength={5}
              value={amount} keyboardType="numeric"
          onChangeTextCallback={text => {
            setAmount(text); setAmount(text.replace(/\D/g, ""));
          }} />
        <DynamicButton title={'Next'} onPress={() => { setProceedSheetVisible(true) }} />
        <View >
          <RecentHistory
            isModalVisible={isrecent}
            setModalVisible={setIsrecent}
            historylistdata={historylist}
            onBackdropPress={() => setIsrecent(false)} />
          <TouchableOpacity onPress={() => {
            setIsrecent(true);
          }}
            style={styles.recentviewbtn}>
           <RecentText/>
          </TouchableOpacity>
        </View>
        <Rechargeconfirm
          Lottieimg={require('../../utils/lottieIcons/loan.json')}
          isModalVisible={ProceedSheetVisible}
          onBackdropPress={() => setProceedSheetVisible(false)}
          // status={Status}
          details={[
            { label: 'User Name', value2: CustomerName },
            { label: 'Customer ID', value: CustomerID },
            { label: 'Due Date', value2: dueDate },
            { label: 'Operator Name', value2: operator },
            // { label: 'Customer Status', value2: Status },
            // { label: 'BillAmount', value2: billAmount },

          ]}
          lastlabel={'Transaction Amount'}
          lastvalue={amount}
          onRechargedetails={() => {
            if (amount === '0' || amount === '') {
              ToastAndroid.showWithGravity(
                `Please Enter Amount`,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            } else { onRechargePress() }
          }
          }
        />
        <BottomSheet
          isVisible={showdistrictData} >
          <View style={styles.bottomsheetview}>
            <View style={[styles.StateTitle, { backgroundColor: color1 }]}>
              <View style={styles.titleview}>
                <View>
                  <Text
                    style={
                      selectbool ? styles.stateTitletext : styles.stateTitletext
                    }    >
                    {selectbool ? "Select Your District" : "Select Your Operator"}
                  </Text>
                </View>
              </View>
              {selectbool ? (
                <TouchableOpacity
                  onPress={() => setshowdistrictData(false)}
                  activeOpacity={0.7}
                >
                  <ClosseModalSvg2 />
                </TouchableOpacity>
              ) : !selectbool && district.length === 0 ? <TouchableOpacity
                onPress={() => {
                  setshowdistrictData(false); setSelectbool(true);
                }}
                activeOpacity={0.7}
              >
                <ClosseModalSvg2 />
              </TouchableOpacity> : null}
            </View>
            {showBottomSheetList()}
          </View>
        </BottomSheet>
        <BottomSheet
          isVisible={showStateList} >
          <View style={styles.bottomsheetview}>
            <View style={[styles.StateTitle, { backgroundColor: color1 }]}>
              <View style={styles.titleview}>
                <View>
                  <Text
                    style={styles.stateTitletext}>
                    Select Your State
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setshowStateList(false)}
                activeOpacity={0.7}
              >
                <ClosseModalSvg2 />
              </TouchableOpacity>
            </View>
            {showStateListData()}
          </View>
        </BottomSheet>
      </View>


        
      </ScrollView>
  



    </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    paddingHorizontal: wScale(20),
    paddingTop: wScale(30),
    flex: 1
  },
  righticon2: {
    position: "absolute",
    left: "auto",
    right: wScale(0),
    top: hScale(0),
    height: "85%",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: wScale(12),
  },
  infobtn: {
    alignItems: 'center',
  },
  infobtntex: {
    fontSize: wScale(18),
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'green',
    paddingHorizontal: wScale(13),
    paddingVertical: hScale(5),
    borderRadius: 5
  },
  recentviewbtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row'
  },
  recent: {
    color: '#000',
    textAlign: 'right',
    paddingVertical: hScale(10),
  },
  labelinputstyle: {
    marginTop: hScale(-7),
  },
  circletext: {
    position: "absolute",
    top: hScale(30),
    paddingLeft: wScale(15),
    fontSize: wScale(12),
  },
  operatorview: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: wScale(10),
  },
  operatornametext: {
    textTransform: "capitalize",
    fontSize: wScale(20),
    color: "#000",
    flex: 1,
    borderBottomColor: "#000",
    borderBottomWidth: wScale(0.5),
    alignSelf: "center",
    paddingVertical: hScale(30),
  },
  bottomsheetview: {
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT / 1.3,

    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  titleview: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hScale(17),
  },
  StateTitle: {
    paddingVertical: hScale(10),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: wScale(10),
    marginBottom: hScale(10),
  },
  stateTitletext: {
    fontSize: wScale(22),
    color: "#000",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  button: {
    flex: 1,
    marginHorizontal: hScale(5),
    paddingVertical: hScale(17),
    borderRadius: hScale(5),
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: hScale(17),
  },
});

export default GasCylinderScreen;


