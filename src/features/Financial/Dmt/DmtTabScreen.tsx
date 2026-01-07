import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, ToastAndroid, Image } from 'react-native';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {
  getDeviceInfo,
  captureFinger,
} from 'react-native-rdservice-fingerprintscanner';
import { hScale, SCREEN_WIDTH, wScale } from '../../../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { Toast } from 'react-native-alert-notification';
import { RootState } from '../../../reduxUtils/store';
import DmtGetBeneficiaryScreen from './DmtGetBeneficiaryScreen';
import { DmtContext } from './DmtContext';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import { colors } from '../../../utils/styles/theme';
import GetBenifiaryScreen from '../VastDMT/GetBenifiaryScreen'
import RadiantGetBenifiaryScreen from '../RadiantDMT/GetRadiantBeneficiaryScreen';
import DmtSvg from '../../drawer/svgimgcomponents/DmtSvg';
import PayOutSvg from '../../drawer/svgimgcomponents/PayOutSvg';
import { ActivityIndicator } from 'react-native-paper';
import PaysprintDmt from './PaySprintDmt';
import ShowLoader from '../../../components/ShowLoder';
import ScanSvg from '../../drawer/svgimgcomponents/ScanSvg';
import QRScanScreen from '../ScanQr/QRScanScreen';

const DmtTabScreen = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.primaryColor}20`;
  const navigation = useNavigation<unknown>();
  const [fingerprintData, setFingerprintData] = useState<unknown>();
  const [aadharNumber, setAadharNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [consumerName, setConsumerName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { get, post } = useAxiosHook();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [dmttext, setDmtText] = useState([]);

  const [DMT1, setDmt1] = useState(false);
  const [DMT2, setDmt2] = useState(false);
  const [DMT3, setDmt3] = useState(false);
  // const [routes] = useState([
  //   DMT1 && { key: 'DMT1', title: 'DMT 1' } ,
  //   DMT2 && { key: 'DMT2', title: 'DMT 2' },
  //   DMT3 && { key: 'DMT3', title: 'PayOut' },
  // ]);
  // const [dmttext] = useState([
  //   DMT1 && { key: 'DMT1', title: '1' },
  //   DMT2 && { key: 'DMT2', title: '2' },
  //   DMT3 && { key: 'DMT3', title: '' },
  // ]);
  const renderScene = SceneMap({
    'DMT1': DmtGetBeneficiaryScreen,
   
    'DMT2': RadiantGetBenifiaryScreen,
    'DMT3': GetBenifiaryScreen,
    'DMT4': PaysprintDmt,
    'Scan': QRScanScreen,
  });


  useEffect(() => {
    async function Api() {
      try {
        const response = await get({ url: `Retailer/api/data/DMTStatusCheck` });
        const response2 = await get({ url: `Retailer/api/data/DMTStatusCheck1` });
        const response3 = await get({ url: `Retailer/api/data/PAYOUTStatusCheck` });
        const response4 = await post({ url: `MoneyDMT/api/PPI/info` });
        console.log({

          response,
          response2,
          response3,
          response4
        })
        const DMT1Status = response?.Response === 'Success';
        const DMT2Status = response2?.Response === 'Success';
        const DMT3Status = response3?.Response === 'Success';
        const DMT4Status = response4?.RESULT === true;

        if (DMT1Status || DMT2Status || DMT3Status) {
          console.log(true);

          setDmt1(DMT1Status);
          setDmt2(DMT2Status);
          setDmt3(DMT3Status);

          console.log(response, response2, response3, response4);

          const updatedRoutes = [
            DMT1Status && { key: 'DMT1', title: 'DMT 1' },
            DMT2Status && { key: 'DMT2', title: 'DMT 2' },
            DMT3Status && { key: 'DMT3', title: 'Self PayOut' },
            DMT4Status && { key: 'DMT4', title: 'PPI(fast)' },
            { key: 'Scan', title: 'Scan & Pay' },

          ].filter(Boolean);

          const updatedText = [
            DMT1Status && { key: 'DMT1', title: '1' },
            DMT2Status && { key: 'DMT2', title: '2' },
            DMT3Status && { key: 'DMT3', title: '' },
            DMT4Status && { key: 'DMT4', title: 'PPI' },

          ].filter(Boolean);

          setRoutes(updatedRoutes);
          setDmtText(updatedText);
          setIsLoading(false);
        } else {
          ToastAndroid.showWithGravity(response?.Message || 'Something went wrong', ToastAndroid.LONG, ToastAndroid.CENTER);
        }
        setIsload(false)
      } catch (error) {
        console.error(error);
        ToastAndroid.showWithGravity('An error occurred', ToastAndroid.LONG, ToastAndroid.CENTER);
      }
    }

    Api();
  }, []);




  const getSvgimg = (key: string) => {
    switch (key) {
      case 'DMT1':
        return <DmtSvg color={colorConfig.primaryColor} />

      case 'Scan':
        return <ScanSvg color={colorConfig.secondaryColor} color2={colorConfig.primaryColor} />
      case 'DMT2':
        return <DmtSvg color={colorConfig.secondaryColor} />
      case 'DMT3':
        return <PayOutSvg color={colorConfig.primaryColor} color2={colorConfig.secondaryColor} />

      case 'DMT4':
        return <PayOutSvg color={colorConfig.primaryColor} color2={colorConfig.secondaryColor} />
      default:
        return null;
    }
  }

  const [isSuccess, setIsSucess] = useState(false);
  const [PidData, setPiDData] = useState('');
  const start = (callback) => {

    callback?.();
    getDeviceInfo()
      .then(async (res) => {
        const deviceInfoString = JSON.stringify(res, null, 2);
        const isReady = res.rdServiceInfoJson.RDService.status;
        const rdServicePackage = res.rdServicePackage;
        // await post({ url: 'AEPS/api/Aeps/ErrorMessage', data: { Message: JSON.stringify(res) } });

        console.log(rdServicePackage);

        const pidOptions = getPidOptions(rdServicePackage);
        if (pidOptions) {
          setPiDData(pidOptions);
        } else {
          console.error('Unknown RD service package');
        }

        if (isReady === 'READY') {


          capture(rdServicePackage, callback);


          console.log('Device is ready:', isReady);
        } else {
          Alert.alert(
            'Device Status',
            isReady === 'NOTREADY'
              ? 'Device is not ready. Error while scanning the finger. Please check if the device is connected properly.'
              : 'Device is ready.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          );
          console.log('Device is', isReady === 'NOTREADY' ? 'not ready' : 'ready');

          setFingerprintData(720);
        }

        // const path = `${RNFS.DownloadDirectoryPath}/deviceInfo-today-${rdServicePackage}.json`;

        // RNFS.writeFile(path, deviceInfoString, 'utf8')
        //   .then(() => {
        //     console.log('JSON saved to Download directory');
        //   })
        //   .catch((error) => {
        //     console.error('Error writing file:', error);
        //   });
      })
      .catch(async (error) => {
        // await post({ url: 'AEPS/api/Aeps/ErrorMessage', data: { Message: JSON.stringify({
        //   message: error?.message,
        //   line: error?.line,
        //   column: error?.column
        // }) } });
        Alert.alert(
          'Error',
          'Error while scanning the finger. Please check if the device is connected properly'
        );
        // console.error('Error while fetching device info:', error);
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



  const p = '<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType=""+fType+"" iCount="0" pCount="0" pgCount="2" format="0"   pidVer="2.0" timeout="10000" pTimeout="20000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>"'

  // captureFinger('<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0"   pidVer="2.0" timeout="10000" pTimeout="20000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>"'
  // captureFinger(p
  //  ) //you can pass pidOptions to "captureFinger(pidOptions)"" method otherwise it takes DEFAULT_PID_OPTIONS

  // captureFinger('<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>') //you can pass pidOptions to "captureFinger(pidOptions)"" method otherwise it takes DEFAULT_PID_OPTIONS 

  const capture = (rdServicePackage, callback) => {
    let pidOptions = '';
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
    // switch (rdServicePackage) {
    //   case 'com.mantra.mfs110.rdservice':
    //     pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh="" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
    //     break; case 'com.mantra.rdservice':
    //     pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh="" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
    //     break;
    //   case 'com.acpl.registersdk_l1':
    //     pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh=""/> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
    //     break; case 'com.acpl.registersdk':
    //     pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh=""/> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
    //     break;
    //   case 'com.idemia.l1rdservice':
    //     pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh=""/> <Demo></Demo> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
    //     break; case 'com.scl.rdservice':
    //     pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh=""/> <Demo></Demo> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
    //     break;
    //   default:
    //     console.error('Unsupported rdServicePackage');
    //     return;
    // }

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
          console.log('setFingerprintData', res.errInfo, res.message);
        } else if (res.status === -1) {
          setFingerprintData(-1);
        } else if (res.errorCode === 0) {

          setFingerprintData(res.pidDataJson);
          console.log('setFingerprintData', res);

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
  const kycCapture = (rdServicePackage) => {
    let pidOptions = '';

    switch (rdServicePackage) {
      case 'com.mantra.mfs110.rdservice':
        pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
        break;
      case 'com.acpl.registersdk_l1':
        pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="  /> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
        break;

      case 'com.idemia.l1rdservice':
        pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" /> <Demo></Demo> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
        break;
      default:
        console.error('Unsupported rdServicePackage');
        return;
    }

    captureFinger(pidOptions)
      .then(async (res) => {
        const deviceInfoString = JSON.stringify(res, null, 2);
        //  await post({ url: 'AEPS/api/Aeps/ErrorMessage', data: { Message: JSON.stringify(res) } });

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
          console.log('setFingerprintData', res.errInfo, res.message);
        } else if (res.status === -1) {
          setFingerprintData(-1);
        } else if (res.errorCode === 0) {

          setFingerprintData(res.pidDataJson);
          console.log('setFingerprintData', res);

          const responseString = JSON.stringify(res.pidDataJson, null, 2);
          //Alert.alert('Tab Fingerprint Data   ekkyc scan', responseString);
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
  const [isload, setIsload] = useState(true)
  return (

    <DmtContext.Provider value={{
      fingerprintData,
      setFingerprintData,
      aadharNumber,
      setAadharNumber,
      consumerName,
      setConsumerName,
      mobileNumber,
      bankName,
      setBankName,
      scanFingerprint: start,
      setMobileNumber
    }}>


      <View style={styles.container}>
        <AppBarSecond
          title="Money Transfer"
          actionButton={undefined}
          onActionPress={undefined}
          onPressBack={undefined}
        />
        {isload && <ShowLoader />}
        <TabView
          lazy
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: SCREEN_WIDTH }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={[styles.indicator, { backgroundColor: colorConfig.secondaryColor }]}
              style={[styles.tabbar, { backgroundColor: color1 }]}
              renderLabel={({ route, focused }) => (
                <View style={styles.labelview}>
                  <Text style={[styles.labelstyle2,]}>
                    {dmttext.find(item => item.key === route.key)?.title || ''}
                  </Text>
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
    </DmtContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  tabbar: {
    elevation: 0,
    height: hScale(60)
  },
  indicator: {
  },
  labelstyle: {
    fontSize: wScale(13),
    color: colors.black,
    width: "100%",
    textAlign: 'center',
    marginTop: hScale(-5)
  },
  labelstyle2: {
    fontSize: wScale(15),
    fontWeight: 'bold',
    color: 'red',
    width: "100%",
    textAlign: 'center',
    position: 'absolute',
    zIndex: 9,
    top: 13
  },
  labelview: {
    alignItems: 'center',
    flex: 1,
    marginTop: hScale(-4)
  }
});

export default DmtTabScreen;