import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  useColorScheme,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import AepsTabScreen from './AepsTabScreen';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import CheckSvg from '../../drawer/svgimgcomponents/CheckSvg';
import { setActiveAepsLine } from '../../../reduxUtils/store/userInfoSlice';
import ShowLoader from '../../../components/ShowLoder';

const AepsScreen = () => {
  const { post } = useAxiosHook();
  const dispatch = useDispatch();
  const { width } = Dimensions.get('window');
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const isFirstLoad = useRef(true); // Prevent auto-switch on first render

  const routes = [
    { key: 'green', title: 'Green Line AEPS' },
    { key: 'yellow', title: 'Yellow Line AEPS' },
  ];

  const checkAeps = async (requestedLine: number) => {

    //setIsLoading(true); // START LOADING

    try {
      const response = await post({ url: APP_URLS.AepsStatusCheck });

      const { status1, status2 } = response;

      console.log("AEPS Status from API", status1, status2, ' -------------------  LINE -------------------');

      // ------------------- GREEN LINE -------------------
      if (requestedLine === 1) {
        if (status1 === true) {
          dispatch(setActiveAepsLine(true));
           ToastAndroid.show(
          'You are using the Green Line AEPS.',
          ToastAndroid.BOTTOM
        );
        } else {
          Alert.alert(
            "Service Notice",
            "Green Line AEPS is closed. Please try Yellow Line AEPS."
          );
          setIndex(1);
        }
      }

      // ------------------- YELLOW LINE -------------------
      if (requestedLine === 2) {
        if (status2 === true) {
          dispatch(setActiveAepsLine(false));
          ToastAndroid.show(
          'You are using the Yellow Line AEPS.',
          ToastAndroid.BOTTOM
        );
        } else {
          Alert.alert(
            "Service Notice",
            "Yellow Line AEPS is closed. Please try Green Line AEPS."
          );
          setIndex(0);
        }
      }

    } catch (error) {
      console.log("AEPS Status API Error:", error);
      Alert.alert("Error", "Something went wrong while checking AEPS");
    } finally {
      setIsLoading(false); // ALWAYS STOP LOADING
    }
  };


  // ------------------- RUN CHECK ON TAB CHANGE -------------------
  // ------------------- RUN CHECK ON TAB CHANGE -------------------
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      // 👇 Initial tab ke liye bhi API call karo
      checkAeps(index === 0 ? 1 : 2);
      return;
    }

    checkAeps(index === 0 ? 1 : 2);
  }, [index]);

  // ------------------- SCREENS -------------------
  const GreenRoute = () =>
    <AepsTabScreen />

    ;
  const YellowRoute = () =>
    <AepsTabScreen />
    ;

  const renderScene = SceneMap({
    green: GreenRoute,
    yellow: YellowRoute,
  });

  // ------------------- CUSTOM TAB BAR -------------------
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#000' }}
      style={{ backgroundColor: 'transparent', elevation: 0 }}
      renderLabel={({ route, focused }) => {
        const isGreen = route.key === 'green';

        return (
          <View
            style={[
              styles.tabButton, { width: width * 0.48 }, // dynamic width
              { backgroundColor: isGreen ? '#1FAA59' : '#F4C430' },
              focused && (isGreen ? styles.greenSelected : styles.yellowSelected),
            ]}
          >
            {focused && (
              <View style={styles.check}>
                <CheckSvg color={isGreen ? '#1FAA59' : '#F4C430'} size={17} />
              </View>
            )}

            <Text style={styles.tabText}>{route.title}</Text>
          </View>
        );
      }}
    />
  );

  return (
    <View style={styles.container}>
      <AppBarSecond title="AEPS / AADHAAR PAY" />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
      />
      {isLoading && <ShowLoader />}
    </View>
  );
};

export default AepsScreen;

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  container: { flex: 1, },
  tabButton: {
    flexDirection: 'row',
    paddingVertical: hScale(8),
    borderRadius: 6,
    justifyContent: 'center',
  },
  greenSelected: { backgroundColor: 'green' },
  yellowSelected: { backgroundColor: '#e8de80' },

  tabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  check: {
        backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wScale(8),
    padding: wScale(2)
  },
});
