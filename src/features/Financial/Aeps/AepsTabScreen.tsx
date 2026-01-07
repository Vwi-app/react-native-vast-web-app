import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, AsyncStorage } from 'react-native';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {
  getDeviceInfo,
  captureFinger,
} from 'react-native-rdservice-fingerprintscanner';
import AdharPay from './aadharpay';
import BalanceCheck from './Balancecheck';
import { hScale, SCREEN_WIDTH, wScale } from '../../../utils/styles/dimensions';
import AepsMinistatement from './AepsMinistatement';
import AepsCW from './AepsCashwithdrawl';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import { AepsContext } from './context/AepsContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import { colors } from '../../../utils/styles/theme';
import CheckBlance from '../../../utils/svgUtils/CheckBlance';
import Aeps from '../../../utils/svgUtils/Aeps';
import AadharPaysvg from '../../../utils/svgUtils/AadhaarPaysvg';
import StatementSvg from '../../../utils/svgUtils/StatementSvg';

const AepsTabScreen = ({  }) => {
    const { colorConfig,activeAepsLine } = useSelector((state: RootState) => state.userInfo);

  console.log('====================================23423234444444',activeAepsLine);
  console.warn('Green flag:', activeAepsLine);
  console.log('====================================254423342545');
  const color1 = `${colorConfig.primaryColor}20`;
  const navigation = useNavigation<any>();
  const [fingerprintData, setFingerprintData] = useState<any>();
  const [aadharNumber, setAadharNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [consumerName, setConsumerName] = useState('');
  const { get, post } = useAxiosHook();
  const [index, setIndex] = useState(0);
  const [isValid, setIsValid] = useState(false);

  const [routes] = useState([

    { key: 'AepsCW', title: 'Aeps' },
    { key: 'BalanceCheck', title: 'Check Bal' },
    { key: 'AepsMiniStatement', title: 'M. Statement' },

    { key: 'AadharPay', title: 'Aadhar Pay' },
  ]);

  const getSvgimg = (key: string) => {
    switch (key) {
      case 'AepsCW':
        return <AadharPaysvg />
      case 'BalanceCheck':
        return <CheckBlance />
      case 'AadharPay':
        return <Aeps />
      case 'AepsMiniStatement':
        return <StatementSvg />
      default:
        return null;
    }
  }

  const [isSuccess, setIsSucess] = useState(false);
  const CheckAeps = async () => {

    try {
      const url = `AEPS/api/data/AepsStatusCheck`;
      const url2 = `AEPS/api/Nifi/data/AepsStatusCheck`;

      const response = await get({ url: activeAepsLine ? url2 : url });

      const msg = response.Message;
      const status = response.Response;
      if (response.Response == 'Success') {
        //start();

        setUserStatus('Success');
        setIsSucess(status === 'Success')
        if (fingerprintData === 720) {
          // start();
        }
      } else if (status === 'BOTHNOTDONE' || status === 'NOTOK' || status === 'ALLNOTDONE' || msg === 'PURCHASE') {


        navigation.navigate('ServicepurchaseScreen', { typename: 'AEPS' });
      } else if (msg === 'OTPREQUIRED') {

      } else {
        Alert.alert('', msg, [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ], { cancelable: false });
      }

    } catch (error) {

      console.log(error);
    } finally {
    }
  };
  const [isReady, setIsReady] = useState(false);

  const fetchDeviceInfo = async () => {
    try {
      const res = await getDeviceInfo();
      const deviceInfoString = JSON.stringify(res, null, 2);
      const rdServicePackage = res.rdServicePackage;
      const status = res.rdServiceInfoJson.RDService.status;
      if (status === 'READY') {
        setIsReady(true);
      }




    } catch (error) {
      console.error("Error fetching device info:", error);
    }
  };
  const [PidData, setPiDData] = useState('');
  const start = (callback) => {
    callback?.();

    // Fetch device information
    getDeviceInfo()
      .then(async (res) => {
        const deviceInfoString = JSON.stringify(res, null, 2);
        const isReady = res.rdServiceInfoJson.RDService.status;
        const rdServicePackage = res.rdServicePackage;


        if (isReady === 'READY') {
          setIsReady(true);
        }

        const deviceNames = {
          "com.scl.rdservice": 'Morpho L0',
          "com.acpl.registersdk": 'Startek L0',
          "com.acpl.registersdk_l1": 'Startek L1',
          "com.mantra.rdservice": 'Mantra L0',
          "com.mantra.mfs110.rdservice": 'Mantra L1',
          "com.idemia.l1rdservice": 'Morpho L1',
        };


        if (isReady === 'READY') {
          capture(rdServicePackage, callback);
        } else {
          const alertMessage = isReady === 'NOTREADY'
            ? `Device is not ready. The ${deviceName} RD service is available on the mobile. Please install only the finger scanner app you are going to use on your phone. Uninstall the other apps.`
            : `${deviceName} Device is ready.`;

          Alert.alert('Device Status', alertMessage, [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ], { cancelable: false });

          setFingerprintData(720);
        }

        // Optionally save the device info to a file
        // const path = `${RNFS.DownloadDirectoryPath}/deviceInfo-today-${rdServicePackage}.json`;
        // try {
        //   await RNFS.writeFile(path, deviceInfoString, 'utf8');
        // } catch (error) {
        //   console.error('Error writing file:', error);
        // }

      })
      .catch(async (error) => {
        // Handle fetch errors by alerting the user
        console.error('Error while fetching device info:', error);

        // Log error details for debugging
        // await post({
        //   url: 'AEPS/api/Aeps/ErrorMessage',
        //   data: { Message: JSON.stringify({ message: error?.message, line: error?.line, column: error?.column }) }
        // });

        setFingerprintData(720);  // 

        // Show alert to user
        Alert.alert('Error', 'Error while scanning the finger. Please check if the device is connected properly.');
      });
  };


  const getPidOptions = (rdServicePackage) => {
    switch (rdServicePackage) {
      case 'com.mantra.mfs110.rdservice':
        //return `<PidOptions ver="1.0"><Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /><CustOpts><Param name="mantrakey" value="" /></CustOpts></PidOptions>`;
        return '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>'
      case 'com.acpl.registersdk_l1':
        return `<PidOptions ver="1.0">
                  <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" wadh="" posh="UNKNOWN" env="P" />
                  <CustOpts>
                    <Param name="" value="" />
                  </CustOpts>
                </PidOptions>`;

      case 'com.scl.rdservice':
        return `<PidOptions ver="1.0">
                  <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" />
                  <CustOpts>
                    <Param name="" value="" />
                  </CustOpts>
                </PidOptions>`;

      case 'com.acpl.registersdk_l1':
        return `<PidOptions ver="1.0">
                  <Opts fCount="1" fType="2" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="20000" otp="" env="P" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh="UNKNOWN" />
                  <CustOpts>
                    <Param name="" value="" />
                  </CustOpts>
                </PidOptions>`;

      default:
        return null;
    }
  };

  const renderScene = SceneMap({
    'BalanceCheck': BalanceCheck,
    'AepsMiniStatement': AepsMinistatement,
    'AepsCW': AepsCW,
    'AadharPay': AdharPay,

  });
  // const renderScene = ({ route }) => {
  //   switch (route.key) {
  //     case 'BalanceCheck':
  //       return <BalanceCheck activeAepsLine={activeAepsLine} />;
  //     case 'AepsMiniStatement':
  //       return <AepsMinistatement activeAepsLine={activeAepsLine} />;
  //     case 'AepsCW':
  //       return <AepsCW activeAepsLine={activeAepsLine} />;
  //     case 'AadharPay':
  //       return <AdharPay activeAepsLine={activeAepsLine} />;
  //     default:
  //       return null;
  //   }
  // };

  const p = '<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType=""+fType+"" iCount="0" pCount="0" pgCount="2" format="0"   pidVer="2.0" timeout="10000" pTimeout="20000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>"'

  // captureFinger('<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0"   pidVer="2.0" timeout="10000" pTimeout="20000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>"'
  // captureFinger(p
  //  ) //you can pass pidOptions to "captureFinger(pidOptions)"" method otherwise it takes DEFAULT_PID_OPTIONS

  // captureFinger('<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>') //you can pass pidOptions to "captureFinger(pidOptions)"" method otherwise it takes DEFAULT_PID_OPTIONS 

  const capture = async (rdServicePackage, callback) => {
    let pidOptions = '';

    switch (rdServicePackage) {
      case 'com.mantra.mfs110.rdservice':
        pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
        break; case 'com.mantra.rdservice':
        pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
        break;
      case 'com.acpl.registersdk_l1':
        pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh=""/> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
        break; case 'com.acpl.registersdk':
        pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh=""/> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
        break;
      case 'com.idemia.l1rdservice':
        //pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <Demo></Demo> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
        pidOptions = `<PidOptions ver="1.0"><Opts env="P" fCount="1" fType="2" iCount="0" iType="" pCount="0" pType="" format="0" pidVer="2.0" timeout="20000" wadh="" posh="UNKNOWN" /><Demo></Demo><CustOpts><Param name="" value="" /></CustOpts></PidOptions>`;
        break; case 'com.scl.rdservice':
        // pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pType="" pCount="0"  format="0" pidVer="2.0" timeout="20000"  posh="UNKNOWN" env="P" /> <Demo></Demo> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
        pidOptions = `<PidOptions ver="1.0"><Opts env="P" fCount="1" fType="2" iCount="0" iType="" pCount="0" pType="" format="0" pidVer="2.0" timeout="20000" wadh="" posh="UNKNOWN" /><Demo></Demo><CustOpts><Param name="" value="" /></CustOpts></PidOptions>`;
        break;
      default:
        console.error('Unsupported rdServicePackage');
        return;
    }

    captureFinger(pidOptions)
      .then(async (res) => {
        const deviceInfoString = JSON.stringify(res, null, 2);
        // await post({ url: 'AEPS/api/Aeps/ErrorMessage', data: { Message: JSON.stringify(res) } });

        // const path = RNFS.DownloadDirectoryPath + `/deviceInfo-capture-today--Finger.json`;

        // Write the response to a file
        // RNFS.writeFile(path, deviceInfoString, 'utf8')
        //   .then(() => {
        //     console.log('JSON saved to Download directory');
        //   })
        //   .catch((error) => {
        //     console.error('Error writing file:', error);
        //     // Alert.alert('Error', 'Failed to save file');
        //   });

        // Handle different response cases
        if (res.errorCode === 720) {
          setFingerprintData(720);
        } else if (res.status === -1) {
          setFingerprintData(-1);
        } else if (res.errorCode === 0) {

          setFingerprintData(res.pidDataJson);

          const responseString = JSON.stringify(res.pidDataJson, null, 2);
          //    Alert.alert('Tab Fingerprint Data', responseString);
          callback?.();
        }
      })
      .catch(async (error) => {
        // await post({ url: 'AEPS/api/Aeps/ErrorMessage', data: { Message: JSON.stringify({
        //   message: error?.message,
        //   line: error?.line,
        //   column: error?.column
        // }) } });
        setFingerprintData(720);
        Alert.alert('Please check if the device is connected.');
      });
  };

  const [UserStatus, setUserStatus] = useState('');


  const CheckEkyc = async () => {
  try {
    const url1 = APP_URLS.checkekyc;
    const url2 = `AEPS/api/Nifi/data/CheckEkyc`;

    const finalUrl = activeAepsLine ? url2 : url1;
    console.log("🔗 Final URL:", finalUrl);

    let response;
    try {
      response = await get({ url: finalUrl });
    } catch (axiosErr: any) {
      // Agar status code 200 nahi hai → message yahan hoga
      const fallbackResponse = axiosErr?.response?.data;

      if (fallbackResponse?.Message) {
        response = fallbackResponse;
      } else {
        throw axiosErr; // agar kuch bhi nahi mila toh generic error
      }
    }

    const msg = response?.Message;
    const status = response?.Status;

    console.log("📩 EKYC Response:", response);

    // --------------------
    // SUCCESS
    // --------------------
    if (status === true) {
      CheckAeps();
      return;
    }

    // --------------------
    // REQUIRED 2FA
    // --------------------
    if (msg === '2FAREQUIRED') {
      setUserStatus('Success');
      // navigation.replace("TwoFAVerify");
      return;
    }

    // --------------------
    // OTP REQUIRED
    // --------------------
    if (msg === 'REQUIREDOTP') {
      setUserStatus(msg);
      navigation.replace("Aepsekyc");
      return;
    }

    // --------------------
    // SCAN REQUIRED
    // --------------------
    if (msg === 'REQUIREDSCAN') {
      setUserStatus(msg);
      navigation.replace("Aepsekycscan");
      return;
    }

    // --------------------
    // UNHANDLED MESSAGES
    // --------------------
    Alert.alert(
      "",
      msg || "Unknown server error",
      [{ text: "OK", onPress: () => navigation.goBack() }],
      { cancelable: false }
    );

  } catch (error) {
    console.log("❌ CheckEkyc Error:", error);

    Alert.alert(
      "Error",
      "Something went wrong. Please try again.",
      [{ text: "OK" }]
    );
  }
};

 useEffect(() => {
  console.log('✅ useEffect triggered');

  CheckEkyc();

  if (fingerprintData) {
    return;
  }
}, []);

  const [deviceName, setDeviceName] = useState('Device');
  const [bankid, setBankId] = useState('');
  return (

    <AepsContext.Provider value={{
      fingerprintData,
      setFingerprintData,
      aadharNumber,
      setAadharNumber,
      consumerName,
      setConsumerName,
      mobileNumber,
      bankName,
      setBankName,
      scanFingerprint: null,
      setMobileNumber,
      setIsValid,
      isValid,
      setDeviceName,
      deviceName,
      setBankId,
      bankid
    }}>

      <View style={styles.container}>


        {(() => {
          switch (UserStatus) {
            case 'Success':
              return (
                <View style={styles.container}>

                  <TabView
                    lazy
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: SCREEN_WIDTH }}
                    renderTabBar={(props) => (
                      <TabBar
                        {...props}
                        indicatorStyle={[styles.indicator, { backgroundColor: colorConfig.primaryColor }]}
                        style={[styles.tabbar, { backgroundColor: color1 }]}
                        renderLabel={({ route, focused }) => (
                          <View style={styles.labelview}>
                            {getSvgimg(route.key)}
                            <Text style={[styles.labelstyle, { color: focused ? colors.dark_black : colors.black75 }]}>
                              {route.title}
                            </Text>
                          </View>
                        )}
                      />
                    )}
                  />

                </View>
              );

            default:
              // navigation.navigate("Home");
              return null; // Return null for the default case
          }
        })()}
      </View>


    </AepsContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  tabbar: {
    elevation: 0,
    marginBottom: hScale(10),
    height: hScale(60)
  },
  indicator: {
  },
  labelstyle: {
    fontSize: wScale(13),
    color: colors.black,
    width: "100%",
    textAlign: 'center',
  },
  labelview: {
    alignItems: 'center',
    flex: 1,
  }
});

export default AepsTabScreen;