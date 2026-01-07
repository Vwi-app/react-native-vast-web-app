import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  AsyncStorage,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import DynamicButton from '../../drawer/button/DynamicButton';
import { useSelector } from 'react-redux';
import { useDeviceInfoHook } from '../../../utils/hooks/useDeviceInfoHook';
import { AepsContext } from './context/AepsContext';
import RNFS from 'react-native-fs';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { captureFinger, getDeviceInfo, isDriverFound } from 'react-native-rdservice-fingerprintscanner';
import { useNavigation } from '@react-navigation/native';
import { APP_URLS } from '../../../utils/network/urls';
import ShowLoader from '../../../components/ShowLoder';
import CheckBlance from '../../../utils/svgUtils/CheckBlance';
import { colors } from '../../../utils/styles/theme';
import { useRdDeviceConnectionHook } from '../../../hooks/useRdDeviceConnectionHook';
import { useLocationHook } from '../../../hooks/useLocationHook';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import SelectDevice from './DeviceSelect';
import { RootState } from '../../../reduxUtils/store';

const Aepsekycscan = () => {
  const { isDeviceConnected } = useRdDeviceConnectionHook();
  const { activeAepsLine } = useSelector((state: RootState) => state.userInfo);

  const [isLoading, setIsLoading] = useState(false);
  const { aadharNumber, setAadharNumber, mobileNumber, setFingerprintData, setMobileNumber, consumerName, setConsumerName, bankName, setBankName, fingerprintData, scanFingerprint } = useContext(AepsContext);
  const { get, post } = useAxiosHook();
  const navigation = useNavigation<any>();
  const [isReady, setIsReady] = useState(false);

  const [deviceName, setDeviceName] = useState('');
    const [setttdeviceName, setdeviceName] = useState();


  // useEffect(() => {
  //   let intervalId;

  //   const fetchDeviceInfo = async () => {
  //     try {
  //       const res = await getDeviceInfo();
  //       const deviceInfoString = JSON.stringify(res, null, 2);
  //       const rdServicePackage = res.rdServicePackage;
  //       const status = res.rdServiceInfoJson.RDService.status;
  //       console.log(res)
  //       if (status ==='READY') {
  //         setIsReady(true);
  //       }

  //       switch (rdServicePackage) {
  //         case "com.scl.rdservice":
  //           setDeviceName('Morpho L0');
  //           break;
  //         case "com.acpl.registersdk":
  //           setDeviceName(`Startek L0 `);
  //           break;
  //         case "com.acpl.registersdk_l1":
  //           setDeviceName(`Startek L1`);
  //           break;
  //         case "com.mantra.rdservice":
  //           setDeviceName(`Mantra L0`);
  //           break;
  //         case "com.mantra.mfs110.rdservice":
  //           setDeviceName(`Mantra L1`);
  //           break;
  //         case "com.idemia.l1rdservice":
  //           setDeviceName(`Morpho L1`);
  //           break;
  //         default:
  //           setDeviceName('Device Not Connected');
  //           break;
  //       }

  //       console.log(deviceInfoString, status, rdServicePackage);

  //     } catch (error) {
  //       console.error("Error fetching device info:", error);
  //     }
  //   };

  //   if (!isReady) {
  //     intervalId = setInterval(() => {
  //       fetchDeviceInfo();
  //     }, 5000);
  //   }

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [isReady]); 
  useEffect(() => {
    if (fingerprintData == 720) {
      if (fingerprintData === 720) {
        return;
      } else if (fingerprintData["PidData"].Resp.errCode === 0) {
        OnPressEnq(fingerprintData);
      }
    }
  }, []);





  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const dayOfWeek = days[now.getDay()];
  const dayOfMonth = now.getDate();
  const month = months[now.getMonth()];
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const formattedDate = `${dayOfWeek} ${dayOfMonth} ${month} ${hours}:${minutes}:${seconds}`;

  const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
    useDeviceInfoHook();
  const { userId, Loc_Data } = useSelector((state: RootState) => state.userInfo);
  const { latitude, longitude } = Loc_Data;

  const start = () => {
    getDeviceInfo()
      .then((res) => {
        const deviceInfoString = JSON.stringify(res, null, 2);
        const isReady = res.rdServiceInfoJson.RDService.status;
        const rdServicePackage = res.rdServicePackage;
        console.log(rdServicePackage, '>>>>>>>>>>>>>>>>>>>>>');

        // Toast.show({
        //   title: rdServicePackage
        // });

        //const pidOptions = getPidOptions(rdServicePackage);
        // if (pidOptions) {
        //   setPiDData(pidOptions);
        // } else {
        //   console.error('Unknown RD service package');
        // }

        if (isReady === 'READY') {
          capture(rdServicePackage);
          console.log('Device is ready:', isReady);
        } else {
          Alert.alert(
            'Error',
            'Error while scanning the finger. Please check if the device is connected properly'
          );
          setFingerprintData(720);
        }

        // const path = `${RNFS.DownloadDirectoryPath}/deviceInfo${rdServicePackage}.json`;

        // RNFS.writeFile(path, deviceInfoString, 'utf8')
        //   .then(() => {
        //     console.log('JSON saved to Download directory');
        //   })
        //   .catch((error) => {
        //     console.error('Error writing file:', error);
        //   });
      })
      .catch((error) => {

        console.error('Error while fetching device info:', error);
      });
  };
  const capture = async (rdServicePackage) => {
    let pidOptions = '';
    const aepscode = await AsyncStorage.getItem('aepscode');
    // Select the appropriate PidOptions based on rdServicePackage
    switch (rdServicePackage) {
      case 'com.mantra.mfs110.rdservice':
        pidOptions = `<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" pTimeout="20000" posh="UNKNOWN" env="P"  /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>`;
        break;
      case 'com.mantra.rdservice':
        pidOptions = `<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" pTimeout="20000" posh="UNKNOWN" env="P"  /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>`;
        break;
      case 'com.acpl.registersdk_l1':
        pidOptions = `<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" timeout="10000"  otp="" pTimeout="20000" posh="UNKNOWN" env="P" />  <Demo/> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>`;
        break;
      case 'com.acpl.registersdk':
        pidOptions = `<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" timeout="10000"  otp="" pTimeout="20000" posh="UNKNOWN" env="P" />  <Demo/> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>`;
        break;
      case 'com.idemia.l1rdservice':
        pidOptions = `<PidOptions ver="1.0"><Opts env="P" fCount="1" fType="2" iCount="0" iType="" pCount="0" pType="" format="0" pidVer="2.0" timeout="20000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh="UNKNOWN" /><Demo></Demo><CustOpts><Param name="" value="" /></CustOpts></PidOptions>`;
        break;
      case 'com.scl.rdservice':
        //  pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" iType="" pCount="0" pType="" format="0" pidVer="2.0" timeout="20000"  posh="UNKNOWN" env="P" /> <Demo></Demo> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
        pidOptions = `<PidOptions ver="1.0"><Opts env="P" fCount="1" fType="2" iCount="0" iType="" pCount="0" pType="" format="0" pidVer="2.0" timeout="20000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh="UNKNOWN" /><Demo></Demo><CustOpts><Param name="" value="" /></CustOpts></PidOptions>`;
        break;
      default:
        console.error('Unsupported rdServicePackage');
        return;
    }
    captureFinger(pidOptions)
      .then((res) => {

        if (res.errorCode === 720) {
          setFingerprintData(720);
          console.log('setFingerprintData', res.errInfo, res.message);
          alert(res.errInfo || res.message || 'Please check if the device is connected.');

        } else if (res.status === -1) {
          setFingerprintData(-1);
        } else if (res.errorCode === 0) {
          setFingerprintData(res.pidDataJson);

          OnPressEnq(res.pidDataJson,res.pidDataXML);
          console.log('setFingerprintData', res);
          //  alert(res||'Please check if the device is connected.');

          const responseString = JSON.stringify(res.pidDataJson, null, 2);
        }
      })
      .catch((e) => {
        setFingerprintData(720);

        Alert.alert('Please check if the device is connected.');
      });
  };


  const saveData = async (data) => {
  try {
    const jsonValue = (data);
    await AsyncStorage.setItem('@captured_benq_data', jsonValue);
    console.log('✅ Data saved in AsyncStorage');
  } catch (e) {
    console.error('❌ Error saving data', e);
  }
};
  const OnPressEnq = async (fingerprintData,pidDataXx) => {
    setIsLoading(true);
    await saveData(fingerprintData.PidData);
    const pidData = fingerprintData.PidData;
    console.log(pidData,"++++++++++++")
    const DevInfo = pidData.DeviceInfo;
    const Resp = pidData.Resp;
    const pidDataX = pidDataXx;
    const cardnumberORUID = {
      adhaarNumber: aadharNumber,
      indicatorforUID: "0",
      nationalBankIdentificationNumber: ''
    };

    const captureResponse = {
      Devicesrno: DevInfo.additional_info.Param[0].value,
      PidDatatype: "X",
      Piddata: pidData.Data.content,
      ci: pidData.Skey.ci,
      dc: DevInfo.dc,
      dpID: DevInfo.dpId,
      errCode: Resp.errCode,
      errInfo: Resp.errInfo,
      fCount: Resp.fCount,
      fType: Resp.fType,
      hmac: pidData.Hmac,
      iCount: Resp.fCount,
      iType: "0",
      mc: DevInfo.mc,
      mi: DevInfo.mi,
      nmPoints: Resp.nmPoints,
      pCount: "0",
      pType: "0",
      qScore: Resp.qScore,
      rdsID: DevInfo.rdsId,
      rdsVer: DevInfo.rdsVer,
      sessionKey: pidData.Skey.content
    };
    BEnQ(captureResponse, cardnumberORUID,pidDataX,pidData);

    try {

    } catch (error) {
      console.error('Error writing files:', error);
    }

  };
  const openFace = () => {
    console.log(userId, '=-=-=-=-=-=-=-=')

    openFaceAuth('')
      .then(async (response) => {
        console.log('Face Auth Response:', response);
        if (response.errorCode === 892) {
          return;
        }
        OnPressEnq(response);
      })
      .catch((error) => {
        console.error('Error during face authentication:', error);
        return null;
      });
  };
  const getSavedBenqData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@captured_benq_data');
    const parsedValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    console.log('📦 Saved BENQ Data:', parsedValue);

    return parsedValue;
  } catch (e) {
    console.error('❌ Error reading data', e);
  }
};
  const handleSelection =async (selectedOption) => {
    await getSavedBenqData();
    if (deviceName === 'Device') {
      return;
    }


    const captureMapping = {
      'Mantra L0': 'com.mantra.rdservice',
      'Mantra L1': 'com.mantra.mfs110.rdservice',
      'Startek L0': 'com.acpl.registersdk',
      'Startek L1': 'com.acpl.registersdk_l1',
      'Morpho L0': 'com.scl.rdservice',
      'Morpho L1': 'com.idemia.l1rdservice',
      // 'Aadhaar Face RD': 'Aadhaar Face RD',
    };

    const selectedCapture = captureMapping[selectedOption];
    if (selectedCapture) {

      if (selectedOption === 'Aadhaar Face RD') {
        //setIsFace(selectedOption === 'Aadhaar Face RD')
        openFace();
      } else {
        isDriverFound(selectedCapture)
          .then((res) => {
            capture(selectedCapture);
          })
          .catch((error) => {
            console.error('Error finding driver:', error);
            alert('Error: Could not find the selected driver.');
          });
      }
    } else {
      alert('Invalid option selected');
    }
  };

  const BEnQ = useCallback(async (captureResponse1, cardnumberORUID1,pidDataX,piddata) => {
    setIsLoading(true);
    try {
      const Model = await getMobileDeviceId();
      const address = 'vwi';
      const jdata = {
        capxml:pidDataX,
        captureResponse: captureResponse1,
        cardnumberORUID: cardnumberORUID1,
        languageCode: 'en',
        latitude: latitude,
        longitude: longitude,
        mobileNumber: '',
        merchantTranId: userId,
        merchantTransactionId: userId,
        paymentType: 'B',
        otpnum: '',
        requestRemarks: 'TN3000CA06532',
        subMerchantId: 'A2zsuvidhaa',
        timestamp: formattedDate,
        transactionType: 'M',
        name: '',
        Address: 'Address',
        transactionAmount: ''
      };

      const headers = {
        'trnTimestamp': formattedDate,
        'deviceIMEI': Model,
        "Content-type": "application/json",
        "Accept": "application/json",
      };

      console.log('headers', headers);
      console.log('headers', jdata);
      const data = JSON.stringify(jdata);
      console.log('Request Data:', data);
//await saveData(jdata);
      const response = await post({
        url: activeAepsLine ? APP_URLS.AepsKycFinScanNifi : APP_URLS.AepsKycFinScan,
        data,
        config: {
          headers,
        },
      });

      const { Message, Status } = response;
    
      if (response) {
        setIsLoading(false);
        Alert.alert(
          'Message:',
          `\n${Status === true ? 'Success' : 'Failed'}\n${Message}`,
          [
            Status === true?{ text: 'OK', onPress: () => navigation?.navigate("AepsTabScreen") }:{ text: 'OK', onPress: () => navigation?.navigate("ReportScreen") },
          ]
        );

      } else {
        Alert.alert(`Message:`, `\n${Status == true ? 'Success' : 'Failed'}\n${Message}`);
        setIsLoading(false);
      }

      setFingerprintData(720);

    } catch (error) {
      console.error('Error during balance enquiry:', error);
    }
  }, [latitude, longitude, userId, formattedDate, navigation]); // d

  const colorScheme = useColorScheme();
  const getDynamicStyles = () => {
    if (colorScheme === 'dark') {
      return {
        container: {
          ...styles.container,
          backgroundColor: '#333',
        },
        title: {
          ...styles.title,
          color: '#fff',
        },
        textContainer: {
          ...styles.textContainer,
        },
        text: {
          ...styles.text,
          color: '#ddd',
        },
      };
    } else {
      return {
        container: {
          ...styles.container,
          backgroundColor: '#fff',
        },
        title: {
          ...styles.title,
          color: '#000',
        },
        textContainer: {
          ...styles.textContainer,
        },
        text: {
          ...styles.text,
          color: '#000',
        },
      };
    }
  };

  const dynamicStyles = getDynamicStyles();

  return (
    <View style={styles.main}>
      <AppBarSecond title={'E-kyc Scan'} />
      <View style={dynamicStyles.container}>
        {/* 
{isReady === false ? (
            <ActivityIndicator size={'large'}/>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,padding:hScale(10)}}>
              <CheckBlance />
            </View>
          )}
          <Text style={styles.deviceConnectionText}>{`Device Connection- is ${deviceName} ${isReady?'Ready':"Not Ready"}`}</Text> */}

        <Text style={dynamicStyles.title}>E-KYC is Not Completed</Text>
        <View style={dynamicStyles.textContainer}>
          <Text style={dynamicStyles.text}>
            1. Dear Customer, Your E - KYC is Not Completed. So Firstly Complete Your E - KYC.
          </Text>
          <Text style={dynamicStyles.text}>
            2. For Complete Your E - KYC please Click to 'Ok' Button, after click you receive an otp on Your Register Mobile Number
          </Text>
          <Text style={dynamicStyles.text}>
            3. Please firstly Connect Your Mobile with Finger Print Scanner Device (Morpho, Mantra, Startek).
          </Text>
        </View>
        {isLoading ? <ShowLoader /> : null}
        <SelectDevice setDeviceName={setDeviceName}
          device={'Device'}
          isface2={true}

          opPress={() => { setDeviceName(deviceName); }} />

        <DynamicButton title='Scan'
          onPress={async() => {
            await getSavedBenqData()
            handleSelection(deviceName);
          }}
          styleoveride={undefined}
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  deviceConnectionText: {
    fontSize: wScale(18),
    marginBottom: hScale(10),
    textAlign: 'center',
    color: colors.black75

  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    paddingHorizontal: hScale(20),
    paddingTop: hScale(20),

  },
  main: {
    flex: 1,
  },
  title: {
    fontSize: hScale(20),
    fontWeight: 'bold',
    marginBottom: hScale(10),
  },
  textContainer: {
    marginBottom: hScale(20),
  },
  text: {
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: hScale(10),

  },
});

export default Aepsekycscan;
