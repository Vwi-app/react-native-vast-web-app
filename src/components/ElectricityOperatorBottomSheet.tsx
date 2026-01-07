import { BottomSheet } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet, TextInput } from "react-native";

import { useSelector } from "react-redux";
import { RootState } from "../reduxUtils/store";
import { SCREEN_HEIGHT, hScale, wScale } from "../utils/styles/dimensions";
import ClosseModalSvg from "../features/drawer/svgimgcomponents/ClosseModal";
import NoDatafound from "../features/drawer/svgimgcomponents/Nodatafound";
import ClosseModalSvg2 from "../features/drawer/svgimgcomponents/ClosseModal2";
import { colors } from "../utils/styles/theme";

const ElectricityOperatorBottomSheet = ({
  operatorData,
  stateData,
  isModalVisible,
  setModalVisible,
  setOperatorcode,
  setState,
  setOperator,
  GetOptlist,
  handleItemPress,
}) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;

  const [selectbool, setSelectbool] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = (selectbool ? stateData : operatorData).filter(item =>
    selectbool
      ? item["State Name"].toLowerCase().includes(searchQuery.toLowerCase())
      : item["Operatorname"].toLowerCase().includes(searchQuery.toLowerCase())
  );


  const showBottomSheetList = () => {
    return (
      !selectbool && operatorData.length === 0 ? (<View>
        <NoDatafound />
      </View>
      ) : (
        <FlashList
          data={filteredData}
          renderItem={({ item }: { item: any }) => {
            return (
              <View
              >
                <TouchableOpacity
                  style={[styles.operatorview]}

                  onPress={async () => {
                    handleItemPress(item);
                    if (selectbool) {
                      setSelectbool(false)
                      setState(item['State Name']);
                      GetOptlist(item['Sate Id']);
                      setSearchQuery('')

                    } else {
                      if (operatorData.length === 0) {
                        setSelectbool(true);
                      }

                      else {
                        setSelectbool(true);
                       
                        setOperatorcode(item['OPtCode'])
                        setOperator(item['Operatorname']);
                        setModalVisible(false);
                        setSearchQuery('')

                      }
                    }
                  }}>
                  <Text style={[styles.operatornametext]}>
                    {selectbool ? item['State Name'] : item['Operatorname']}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          estimatedItemSize={30}
        />)
    );
  };
  return (
    <BottomSheet isVisible={isModalVisible}>
      <View style={styles.bottomsheetview}>
        <View style={[styles.StateTitle, { backgroundColor: color1 }]}>
          <View style={styles.titleview}>
            {/* {selectbool ? null : (
              <View style={{ marginRight: wScale(20) }}>
                <Image
                  style={styles.rightimg}
                  source={{ uri: path }}
                />
              </View>
            )} */}
            <View>
              {/* {selectbool ? null : (
                <Text style={styles.stateTitletext}>{selectedOperator}</Text>
              )} */}
              <Text
                style={
                  selectbool ? styles.stateTitletext : styles.stateTitletext
                }
              >
                {selectbool ? "Select Your State" : "Select Your Operator"}
              </Text>
            </View>
          </View>
          {selectbool ? (
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <ClosseModalSvg2 />
            </TouchableOpacity>
          ) : !selectbool && operatorData.length === 0 ? <TouchableOpacity
            onPress={() => {
              setModalVisible(false); setSelectbool(true);
            }}
            activeOpacity={0.7}
          >
            <ClosseModalSvg2 />
          </TouchableOpacity> : null}
        </View>
        <TextInput
          placeholder="Search..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          style={styles.searchBar}
          placeholderTextColor={colors.black75}
          cursorColor={'colors.black'}
        />
        {showBottomSheetList()}
      </View>
    </BottomSheet>
  );
};
const styles = StyleSheet.create({
  bottomsheetview: {
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT / 1.3,

    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
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
  stateTitletext2: {
    fontSize: wScale(17),
    color: "#000",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  titleview: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  rightimg: {
    height: wScale(45),
    width: wScale(45),
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
  operatioimg: {
    width: wScale(45),
    height: wScale(45),
    marginRight: wScale(20),
  },
  searchBar: {
    borderColor: 'gray',
    borderWidth: wScale(1),
    paddingHorizontal: wScale(15),
    marginHorizontal: wScale(10),
    marginBottom: hScale(10),
    borderRadius: 5,
    color: colors.black75,
    fontSize: wScale(16),

  },
});
export default ElectricityOperatorBottomSheet;
