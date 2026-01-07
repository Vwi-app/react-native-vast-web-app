import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, ToastAndroid } from "react-native";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import FlotingInput from "../../drawer/securityPages/FlotingInput";
import DynamicButton from "../../drawer/button/DynamicButton";
import { BottomSheet } from "@rneui/base";
import CustomCalendar from "../../../components/Calender";
import Calendarsvg from "../../drawer/svgimgcomponents/Calendarsvg";
import CheckSvg from "../../drawer/svgimgcomponents/CheckSvg";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import { RadiantContext } from "./RadiantContext";
import { useNavigation } from "@react-navigation/native";
import { APP_URLS } from "../../../utils/network/urls";
import useAxiosHook from "../../../utils/network/AxiosClient";
import ShowLoader from "../../../components/ShowLoder";
import { ActivityIndicator } from "react-native";

const AddressRadiant = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const [isLoading, setIsloading] = useState(true);
  const [isLoading2, setIsloading2] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [policeStation, setPoliceStation] = useState('');
  const [postOffice, setPostOffice] = useState('');
  const [residence, setResidence] = useState('');
  const [iscalendarVisible, setIsCalendarVisible] = useState(false);
  const [isown, setIsOwn] = useState(false);
  const [isrented, setIsRented] = useState(false);
  const [samevalu, setSamevalu] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [education, setEducation] = useState('');
  const { post } = useAxiosHook();

  const handleDateSelected = (data: string) => {
    setIsCalendarVisible(false);
    setSelectedDate(data);
  };

useEffect(() => {
  if (!currentAddress) {
    setSamevalu(false);
  } else {
    setSamevalu(permanentAddress === currentAddress);
  }
}, [permanentAddress, currentAddress]);

  const handlesame = () => {
    setSamevalu((prev) => {
      if (!prev) {
        setPermanentAddress(currentAddress);
        setPinCode(postcode)
      } else {
        setPermanentAddress('');
        setPinCode('')
      }
      return !prev;
    });
  };
  const { currentPage, setCurrentPage } = useContext(RadiantContext);
  useEffect(() => {
    if (residence === 'Own') {
      setIsOwn(true);
      setIsRented(false);
    } else if (residence === 'Rented') {
      setIsRented(true);
      setIsOwn(false);
    } else {
      setIsOwn(false);
      setIsRented(false);
    }
  }, [residence]);

  useEffect(() => {
    formData();
    console.warn(isown, isrented, '000');

  }, [post]);

  const formData = async () => {
    try {
      const res = await post({ url: APP_URLS.RadiantForm2Data });
      console.log('API Response:', res);

      // Check for error message
      if (res?.Message === "An error has occurred.") {
        alert('Data retrieval failed. Please contact the Admin.');
        return;
      }

      // Safely access and set data
      setCurrentAddress(res?.CAddress || '');
      setLandmark(res?.Landmark || '');
      setCity(res?.City || '');
      setState(res?.State || '');
      setPostcode(res?.Postcode || '');
      setPoliceStation(res?.PoliceStation || '');
      setPostOffice(res?.PostOffice || '');
      setResidence(res?.ResidenceType || '');
      setSelectedDate(res?.StayingSince || '');
      setPermanentAddress(res?.PAddress || '');
      setPinCode(res?.PermanentPincode || '');
      setEducation(res?.EducationalQualification || '');
    } catch (error) {
      console.error("Error in formData:", error);
      alert('Something went wrong while fetching the form data.');
    } finally {
      setIsloading(false);
    }
  };

  const validateForm = () => {
    let errors = [];

    if (!currentAddress) errors.push("Current Address");
    if (!landmark) errors.push("Landmark");
    if (!city) errors.push("City");
    if (!state) errors.push("State");
    if (!postcode || !/^\d{6}$/.test(postcode)) errors.push("Valid Postcode");
    if (!pinCode || !/^\d{6}$/.test(pinCode)) errors.push("Permanent Valid Pin Code");
    if (!policeStation) errors.push("Police Station");
    if (!postOffice) errors.push("Post Office");
    if (!residence) errors.push("Residence Type");
    if (!selectedDate) errors.push("Staying Since Date");
    if (!permanentAddress) errors.push("Permanent Address");
    if (!education) errors.push("Educational Qualification");

    if (errors.length > 0) {
      ToastAndroid.show(`Please enter: ${errors.join(", ")}`, ToastAndroid.SHORT);
      return false;
    }
    return true;
  };


  const CandiantForm = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setIsloading2(true);
      const data = {
        CurrentAddress: currentAddress,
        Landmark: landmark,
        City: city,
        State: state,
        Postcode: postcode,
        PoliceStation: policeStation,
        PostOffice: postOffice,
        ResidenceType: residence,
        StayingSince: selectedDate,
        PermanentAddress: permanentAddress,
        EducationalQualification: education,
        PermanentPincode: pinCode,
      };

      const res = await post({ url: APP_URLS.RadiantCandiantForm2, data });
      console.log(res, data, '--*-*-**');

      if (res.status === 'Data Insert Successfully') {
        setCurrentPage(currentPage + 1);
        ToastAndroid.show(res.status || '', ToastAndroid.SHORT);
      } else {

        throw new Error(res.status || "Something went wrong!");

      }
      if (res.status === 'NOT' || res.Message === 'An error has occurred.' || res.status === 'An error has occurred.') {
        alert('Submission failed. Please contact admin.');
        return;
      }
    } catch (error) {
      console.error("Error in CandiantForm:", error);
      ToastAndroid.show(error.message || "Submission failed!", ToastAndroid.SHORT);
    } finally {
      setIsloading2(false);
    }
  }, [
    currentAddress, landmark, city, state, postcode,
    policeStation, postOffice, residence, selectedDate,
    permanentAddress, currentPage, pinCode, education
  ]);


  return (
    <View style={styles.main}>
      <ScrollView>
        <View style={styles.container}>
          <FlotingInput
            label={'Current Address'}
            onChangeTextCallback={setCurrentAddress}
            value={currentAddress}
          />
          <FlotingInput
            label={'Landmark'}
            onChangeTextCallback={setLandmark}
            value={landmark}
          />
          <FlotingInput
            label={'City'}
            onChangeTextCallback={(text) => { setCity(text.replace(/[^a-zA-Z]/g, '')) }}
            value={city}
          />
          <FlotingInput
            label={'State'}
            onChangeTextCallback={(text) => { setState(text.replace(/[^a-zA-Z\s]/g, '')) }}
            value={state}
          />
          <FlotingInput
            label={'Postcode'}
            onChangeTextCallback={(text) => {
              setPostcode(text.replace(/[^0-9]/g, ""))
            }}
            value={postcode.toString()}
            keyboardType="number-pad"
            maxLength={6}
          />
          <FlotingInput
            label={'Police Station Name'}
            onChangeTextCallback={(text) => { setPoliceStation(text.replace(/[^a-zA-Z\s]/g, '')) }}
            value={policeStation}
          />
          <FlotingInput
            label={'Post Office'}
            onChangeTextCallback={(text) => { setPostOffice(text.replace(/[^a-zA-Z]/g, '')) }}
            value={postOffice}
          />
          <View>
            <FlotingInput
              label={'Residence Type'}
              value={residence}
              editable={false}
            />
            <View style={[styles.righticon2]}>
              <TouchableOpacity
                onPress={() => {
                  setIsOwn(!isown);
                  setIsRented(false);
                  setResidence(isown ? '' : 'Own');
                }}
                style={[styles.deviceItem, { marginRight: wScale(30) }]}
              >
                <View
                  style={[
                    styles.languageEmojiContainer,
                    { backgroundColor: color1 },
                    isown && { backgroundColor: colorConfig.secondaryColor },
                  ]}
                >
                  {isown && <CheckSvg />}
                </View>
                <Text style={styles.deviceItemText}>Own</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setIsRented(!isrented);
                  setIsOwn(false);
                  setResidence(isrented ? '' : 'Rented'); // Toggle residence value
                }}
                style={styles.deviceItem}
              >
                <View
                  style={[
                    styles.languageEmojiContainer,
                    { backgroundColor: color1 },
                    isrented && { backgroundColor: colorConfig.secondaryColor },
                  ]}
                >
                  {isrented && <CheckSvg />}
                </View>
                <Text style={styles.deviceItemText}>Rented</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
            <FlotingInput
              label={'Staying Since'}
              value={selectedDate}
              editable={false}
            />
            <View style={styles.righticon2}>
              <Calendarsvg />
            </View>
          </TouchableOpacity>
          <View>
            <FlotingInput
              label={'Permanent Address'}
              onChangeTextCallback={setPermanentAddress}
              value={permanentAddress}
            />

            <TouchableOpacity style={styles.righticon2} onPress={handlesame}>
              <View
                style={[
                  styles.languageEmojiContainer,
                  { backgroundColor: color1 },
                  samevalu && { backgroundColor: colorConfig.secondaryColor },
                ]}
              >
                {samevalu && <CheckSvg />}
              </View>
            </TouchableOpacity>
          </View>


          <View>
            <FlotingInput
              label={'Permanent Pin Code'}
              onChangeTextCallback={setPinCode}
              value={pinCode.toString()}
            />

            <TouchableOpacity style={styles.righticon2} onPress={handlesame}>
              <View
                style={[
                  styles.languageEmojiContainer,
                  { backgroundColor: color1 },
                  samevalu && { backgroundColor: colorConfig.secondaryColor },
                ]}
              >
                {samevalu && <CheckSvg />}
              </View>
            </TouchableOpacity>
          </View>
          <FlotingInput
            label={'Educational Qualification'}
            onChangeTextCallback={setEducation}
            value={education}
          />
          <DynamicButton
            title={isLoading2 ? <ActivityIndicator size={'large'} color={colorConfig.labelColor} /> : 'Submit'}
            onPress={CandiantForm}
          />
          <BottomSheet
            onBackdropPress={() => setIsCalendarVisible(false)}
            isVisible={iscalendarVisible}
          >
            <View style={styles.bottomSheetContainer}>
              <CustomCalendar onDateSelected={handleDateSelected} />
            </View>
          </BottomSheet>
        </View>
        {isLoading && <ShowLoader />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    marginTop: hScale(10),
    marginBottom: hScale(10),
    paddingHorizontal: wScale(10),
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    height: hScale(320),
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  righticon2: {
    position: "absolute",
    left: "auto",
    right: wScale(0),
    top: hScale(0),
    height: "85%",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: wScale(12),
    flexDirection: 'row',
  },
  deviceItem: {
    paddingVertical: hScale(12),
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceItemText: {
    color: '#000',
    fontSize: wScale(16),
    textAlign: 'center',
    textTransform: 'capitalize',
    paddingLeft: wScale(10),
  },
  languageEmojiContainer: {
    borderWidth: wScale(.5),
    borderRadius: 25,
    height: wScale(30),
    width: wScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddressRadiant;