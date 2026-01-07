import { BottomSheet } from "@rneui/themed";
import React, { useState } from "react";
import { Image, View, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../reduxUtils/store";
import { SCREEN_HEIGHT, hScale, wScale } from "../utils/styles/dimensions";
import NoDatafound from "../features/drawer/svgimgcomponents/Nodatafound";
const ImageUploadBottomSheet = ({
imagePath,
isModalVisible,
setModalVisible,
modalTitle,
setImagePath,
}) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  return (
    <BottomSheet
      isVisible={isModalVisible}
      onBackdropPress={() => setModalVisible(false)}
      containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.8)', }}>
      <View style={styles.bottomsheetview}>
      <Text style={styles.headerText}>{modalTitle}</Text>
      {imagePath ? 
        <Image
          source={{ uri: imagePath }}
          onError={(e) => setImagePath('')}
          style={{ height: SCREEN_HEIGHT / 1.2,  marginHorizontal: wScale(10) }}
          resizeMode='contain'/>
          : 
          <View style={{alignItems: 'center', marginTop: wScale(90)}}>
          <NoDatafound size={wScale(200)} />
          <Text style={styles.headerText}>{'No Data Found'}</Text>
          </View>
      }

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
  header: {
    alignSelf: 'center',
    paddingBottom: hScale(5),
    borderBottomWidth: wScale(1),
    width: '80%',
    alignItems: 'center',
    paddingTop: hScale(20),
  },
  headerText: {
    fontSize: wScale(28),
    textAlign: 'center',
    paddingTop: hScale(6),
    color: '#000'
  },
  detailsContainer: {
    marginTop: hScale(30),
    borderRadius: 10,
    paddingHorizontal: wScale(20),
    marginVertical: hScale(18),
    fontWeight: 'bold'
  },
  detailItem: {
    justifyContent: 'space-between',
    marginBottom: hScale(10),
    borderBottomWidth: wScale(.5),
    paddingVertical: hScale(8),
  },
  detailItem2: {
    borderBottomWidth: wScale(0),
    paddingBottom: hScale(0),
    marginBottom: hScale(20),

  },
  label: {
    fontSize: wScale(15),
    paddingBottom: hScale(5),
    color: '#000'
  },
  value: {
    fontSize: wScale(40),
    fontWeight: 'bold',
    color: '#000'
  },
  value2: {
    fontSize: wScale(30),
    color: '#000'
  },
  lotiimg2: {
    height: hScale(80),
    width: wScale(80),
    marginRight: wScale(-2)
  },

});
export default ImageUploadBottomSheet;
