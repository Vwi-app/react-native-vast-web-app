import { BottomSheet } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../reduxUtils/store";
import { SCREEN_HEIGHT, hScale, wScale } from "../utils/styles/dimensions";
import NoDatafound from "../features/drawer/svgimgcomponents/Nodatafound";
import LottieView from "lottie-react-native";

const ImageBottomSheet = ({
  imagePath,
  isModalVisible,
  setModalVisible,
  modalTitle,
  setImagePath,
  isUri,
  ReUpload
}: {
  imagePath: string;
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  modalTitle: string;
  setImagePath: React.Dispatch<React.SetStateAction<string>>;
  isUri: boolean;
  ReUpload: boolean;
}) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imagePath) {
      setIsLoading(false);
    }
  }, [imagePath]);

  return (
    <BottomSheet
      isVisible={isModalVisible}
      onBackdropPress={() => setModalVisible(false)}
      containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.8)' }}
    >
      <View style={styles.bottomsheetview}>
        <View style={[styles.topheader, { backgroundColor: color1 }]}>
          <TouchableOpacity onPress={() => { setModalVisible(false) }} >
            <Text style={styles.donestyle}>
              Done
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerText]}>{`${modalTitle}`}</Text>
          {isUri && <TouchableOpacity onPress={ReUpload}>
            <LottieView
                                         autoPlay={true}
                                         loop={true}
                                         style={styles.lotiimg}
                                      //   source={require('../../utils/lottieIcons/upload-file.json')}
           
                                        source={require('../utils/lottieIcons/upload-file.json')}
                                       />
          </TouchableOpacity>}
        </View>
        {isloading ? (
          <ActivityIndicator size={"large"} color={colorConfig.secondaryColor} />
        ) : (
          imagePath ? (
            <Image
              source={{
                uri: imagePath
              }}
              onError={() => setImagePath('')}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <NoDatafound />
          )
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomsheetview: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: SCREEN_HEIGHT / 1.2
  },
  headerText: {
    fontSize: wScale(18),
    textAlign: 'center',
    paddingVertical: hScale(8),
    color: '#000',
    fontWeight: 'bold',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1
  },  lotiimg: {
    height: hScale(44),
    width: wScale(44),
  },
  topheader: {
    flexDirection: 'row',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wScale(20)
  },
  image: {
    height: SCREEN_HEIGHT / 1.2,
    marginHorizontal: wScale(10),
  },
  donestyle: {
    fontSize: wScale(16),
    color: '#000'
  },
});

export default ImageBottomSheet;
