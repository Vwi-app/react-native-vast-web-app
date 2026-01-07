import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image, Platform, PermissionsAndroid, Animated, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';
import DeviceInfo from 'react-native-device-info';
import UpdateSvg from '../../drawer/svgimgcomponents/UpdateSvg';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import DynamicButton from '../../drawer/button/DynamicButton';
import RNFetchBlob from "rn-fetch-blob";

const UpdateScreen = ({ isPlay }) => {
  const { colorConfig, } = useSelector((state: RootState) => state.userInfo);

  const { get } = useAxiosHook();
  const [latestVersion, setLatestVersion] = useState([]);
  const [currentVersion, setCurrentVersion] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const animateProgress = (p) => {
    Animated.timing(animatedWidth, {
      toValue: p,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const version = await get({ url: APP_URLS.current_version });
        setLatestVersion(version);
        setCurrentVersion(APP_URLS.version);
      } catch (error) {
        console.error('Version fetch error:', error);
      }
    };
    fetchVersion();
  }, []);

  const openUnknownSourceSettings = async () => {
    if (Platform.OS !== "android") return;
    try {
      await Linking.openSettings();
    } catch {
      Linking.openSettings();
    }
  };


  const downloadAndInstall = async () => {
    try {
      const apkUrl = `http://${APP_URLS.baseWebUrl + APP_URLS.DownloadAPK}`;
      console.log(apkUrl)
      if (Platform.OS === "android" && Platform.Version < 30) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
      }

      const { fs, android } = RNFetchBlob;
      const apkPath = `${fs.dirs.CacheDir}/${APP_URLS.AppName}-update.apk`;

      setDownloading(true);
      setProgress(0);
      animatedWidth.setValue(0);

      RNFetchBlob.config({
        path: apkPath,
        fileCache: true,
        trusty: true, // ⚠️ SSL ignore

      })
        .fetch("GET", apkUrl, { "Cache-Control": "no-store" })
        .progress((received, total) => {
          let percent = Math.round((received / total) * 100);
          setProgress(percent);
          animateProgress(percent);
        })
        .then((res) => {
          setDownloading(false);

          try {
            android.actionViewIntent(
              res.path(),
              "application/vnd.android.package-archive"
            );
          } catch {
            Alert.alert(
              "Permission Required",
              "Please allow 'Install Unknown Apps' permission.",
              [
                { text: "Cancel" },
                { text: "Open Settings", onPress: openUnknownSourceSettings },
              ]
            );
          }
        })
        .catch((err) => {
          setDownloading(false);
          console.log("APK Download Error:", err);
          Alert.alert("Error", "Download failed!");
        });
    } catch (e) {
      console.log("Install Error:", e);
    }
  };

  const handleUpdate = () => {
    if (isPlay) {
      Linking.openURL(APP_URLS.playUrl);
    } else {
      downloadAndInstall();
    }
  };
  return (
    <LinearGradient
      colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
      style={styles.container}
    >
      <View style={styles.content}>

        <View style={{ backgroundColor: '#fff', borderRadius: 100, padding: wScale(30) }}>
          <UpdateSvg color2={colorConfig.primaryColor} color={colorConfig.secondaryColor} />

        </View>
        <Text style={styles.title}>
          New Update Required
        </Text>

        {/* Version Info */}
        <View style={styles.versionBox}>
          <Text style={styles.availableText}>
            Now Available Version is : <Text style={styles.versionValue}>V{latestVersion.currentversion}</Text>
          </Text>
        </View>

        <Text style={styles.prevText}>
          Your Previously Installed Version : V{currentVersion}
        </Text>



        {downloading && (
          <View style={styles.progressBox}>
            <Text style={styles.progressText}>
              Downloading... {progress}%
            </Text>

            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: animatedWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}

        {!downloading && (
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              Note: To install this update you must allow{" "}
              <Text style={{ fontWeight: "700" }}>Install Unknown Apps</Text>{" "}
              permission. If permission is denied you will be redirected to
              settings.
            </Text>
          </View>
        )}
        <View style={styles.updateBox}>
          <Text style={styles.updateTitle}>What's improved in this update?</Text>

          <View style={styles.bulletContainer}>
            {[
              'Fixed minor bugs and crashes',
              'Improved performance and speed',
              'Enhanced design and usability',
              'Security updates for better protection',
            ].map((item, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Update Button */}
        {/* <TouchableOpacity onPress={handleUpdate} style={styles.button}>
          <Text style={styles.buttonText}>
            Update Now
          </Text>
        </TouchableOpacity> */}
      </View>
      <View style={{ width: '90%', alignSelf: 'center', marginBottom: hScale(30) }}>
        <DynamicButton title={'Download & Update Now'}
          onPress={handleUpdate} />
        <Text style={styles.note}>
          If the update doesn’t start, please uninstall and reinstall the app manually.
        </Text>
      </View>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '90%',
    paddingTop: hScale(40),
    alignSelf: 'center'
  },
  icon: {
    width: wScale(150),
    height: hScale(150),
    marginBottom: hScale(20),
  },
  title: {
    fontSize: wScale(32),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hScale(10),
  },
  highlight: {
    color: '#1B5E20',
  },
  versionBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: wScale(20),
    paddingVertical: hScale(6),
    paddingHorizontal: wScale(15),
    marginBottom: hScale(6),
  },
  availableText: {
    fontSize: wScale(16),
    color: '#388E3C',
    fontWeight: '600',
  },
  versionValue: {
    fontWeight: 'bold',
  },
  prevText: {
    fontSize: wScale(15),
    color: '#fff',
    marginBottom: hScale(20),
  },
  updateBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: '100%',
    borderRadius: wScale(15),
    paddingVertical: hScale(15),
    paddingHorizontal: wScale(15),
    marginBottom: hScale(25),
  },
  updateTitle: {
    fontSize: wScale(16),
    fontWeight: '600',
    color: '#000',
    marginBottom: hScale(10),
  },
  bulletContainer: {
    marginLeft: wScale(5),
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: hScale(5),
  },
  bulletSymbol: {
    fontSize: wScale(16),
    color: '#2196F3',
    marginRight: wScale(6),
  },
  bulletText: {
    color: '#444',
    fontSize: wScale(14),
    flex: 1,
  },
  note: {
    color: '#fff',
    fontSize: wScale(10),
    marginTop: hScale(10),
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: wScale(30),
    paddingVertical: hScale(12),
    paddingHorizontal: wScale(50),
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wScale(16),
  },
  noteBox: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: wScale(12),
    borderRadius: 10,
    marginBottom: hScale(15),
    width: "100%",
  },
  noteText: {
    fontSize: 13,
    color: "#444",
    textAlign: "justify",
  },
  progressBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    marginTop: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressBarBackground: {
    marginTop: 10,
    width: "100%",
    height: 12,
    backgroundColor: "#d4d4d4",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2196F3",
  },

});

export default UpdateScreen;
