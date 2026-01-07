import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, ToastAndroid, ActivityIndicator, Keyboard } from "react-native";
import { hScale, SCREEN_HEIGHT, SCREEN_WIDTH, wScale } from "../../../utils/styles/dimensions";
import FlotingInput from "../../drawer/securityPages/FlotingInput";
import DynamicButton from "../../drawer/button/DynamicButton";
import Calendarsvg from "../../drawer/svgimgcomponents/Calendarsvg";
import OnelineDropdownSvg from "../../drawer/svgimgcomponents/simpledropdown";
import { BottomSheet } from "@rneui/base";
import { FlashList } from "@shopify/flash-list";
import { RootState } from "../../../reduxUtils/store";
import { useSelector } from "react-redux";
import CustomCalendar from "../../../components/Calender";
import CheckSvg from "../../drawer/svgimgcomponents/CheckSvg";
import { useNavigation } from "@react-navigation/native";
import { RadiantContext } from "./RadiantContext";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { APP_URLS } from "../../../utils/network/urls";
import ShowLoader from "../../../components/ShowLoder";
import CheckBT from "../../../components/CheckBT";
import OTPModal from "../../../components/OTPModal";
import { log } from "console";

const BasicInfo = () => {
  const [isLoading, setIsloading] = useState(true);
  const [isLoading2, setIsloading2] = useState(false);
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [altmobileNo, setAltMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [religion, setReligion] = useState('');
  const [motherTongue, setMotherTongue] = useState('');
  const [bloud, setBloud] = useState('');
  const [maritalStatus, setMaritalStatus] = useState(false);
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [spouseName, setSpouseName] = useState('');
  const [spouseOccupation, setSpouseOccupation] = useState('');
  const [childrenM, setChildrenM] = useState(0);
  const [childrenF, setChildrenF] = useState(0);
  const [fatherspouseName, setFatherSpouseName] = useState('');
  const [motherspouseName, setMotherSpouseName] = useState('');
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isLanguagesVisible, setIsLanguagesVisible] = useState(false);
  const [iscalendarVisible, setIsCalendarVisible] = useState(false);
  const [gender, setGender] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [knownLanguages, setKnownLanguages] = useState([]); // Stores multiple selected languages
  const [isknowVisible, setIsKnowVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [verifiedMobile, setVerifiedMobile] = useState(false);
  const [verifiedAlternate, setVerifiedAlternate] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');
  const [sendid, setSendID] = useState('');

  const Religions = ['Hinduism', 'Islam', 'Christianity', 'Sikhism', 'Buddhism', 'Jainism', 'Zoroastrianism', 'Judaism'];
  const Languages = ['Odia', 'Hindi', 'English', 'Kannada', 'Gujarati', 'Tamil', 'Bengali', 'Malayalam', 'Marathi'];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Don't Know"];
  const { post } = useAxiosHook();
  const onSelectReligion = (selectedReligion) => {
    setReligion(selectedReligion);
    setIsBottomSheetVisible(false);

  };

  const onSelectLang = (selectedlang) => {
    setMotherTongue(selectedlang);
    setIsLanguagesVisible(false);
  };
  const onSelectBloud = (selectedbloud) => {
    setBloud(selectedbloud);
    setIsVisible(false);
  };

  const handleDateSelected = (data: string) => {
    setIsCalendarVisible(false);
    setSelectedDate(data);
    console.log(selectedDate);
  };

  const onKnowLang = (item) => {
    setKnownLanguages((prev) =>
      prev.includes(item) ? prev.filter(lang => lang !== item) : [...prev, item]
    );
  };


  const handleSendOtp = async (type) => {
    setIsloading(true);

    const targetMobile = type === 'Mobile' ? mobileNo : altmobileNo;
    setSendID(targetMobile); // Track which number is being verified
    console.log('====================================');
    console.log(targetMobile, 'targetMobile', type, 'type');
    console.log('====================================');
    try {
      const url = `${APP_URLS.SendOTPMobile}Mobile=${targetMobile}&Name=${name}&Type=${type}`;
      const res = await post({ url });

      console.log('Request URL:', url);
      console.log('Response:', res);

      if (res.Content?.ADDINFO === 'Send OTP') {
        ToastAndroid.show(`📩 OTP Sent to ${type} Number`, ToastAndroid.SHORT);
        setOtpModalVisible(true);
      } else {
        alert(`⚠ Failed to send OTP. Message: ${res.Content?.ADDINFO}`);
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      alert('❌ Error sending OTP.');
    } finally {
      setIsloading(false);
    }
  };


  const handleVerifyOtp = async () => {
    if (mobileOtp.length !== 4) {
      ToastAndroid.show('Please enter 4-digit OTP', ToastAndroid.BOTTOM);
      return;
    }

    setIsloading(true);
    try {
      const type = sendid === mobileNo ? 'Mobile' : 'Alternate';
      const url = `${APP_URLS.VerifyOTPMobile}Mobile=${sendid}&Name=${name}&Type=${type}&OTP=${mobileOtp}`;

      const res = await post({ url });
      console.log(url, '--', res);

      if (res.Content?.ADDINFO === 'DONE') {
        ToastAndroid.show('✅ OTP Verified Successfully.', ToastAndroid.BOTTOM);
        setOtpModalVisible(false);

        if (type === 'Mobile') {
          setVerifiedMobile(true);
        } else {
          setVerifiedAlternate(true); // Add this state if needed
        }
      } else {
        alert(`⚠ OTP verification failed. Status: ${res.Content?.ADDINFO}`);
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      alert('❌ Error verifying OTP.');
    } finally {
      setIsloading(false);
    }
  };

  const handlemarital = () => {
    setMaritalStatus((prev) => !prev); // Toggle marital status
  };
  useEffect(() => {
    console.log(maritalStatus, '333##');

    if (!maritalStatus) {
      setSpouseName('');
      setSpouseOccupation('');
      setChildrenF(0);
      setChildrenM(0)
    }
  }, [maritalStatus])

  const handleDate = () => {
    setIsCalendarVisible(true)
    ToastAndroid.show("You must be at least 18 years old", ToastAndroid.SHORT);
  }
  const {
    currentPage,
    setCurrentPage,
  } = useContext(RadiantContext);

  useEffect(() => {
    form1Data();


  }, []);

  const form1Data = async () => {
    try {
      const res = await post({ url: APP_URLS.RadiantForm1Data });

      if (res) {
        console.log('====================================');
        console.log(res.verifiedMobileNumber, res.Email, res.Mobile, res.Name, res.MaritalStatus);
        console.log('====================================');
        setVerifiedMobile(res.verifiedMobileNumber);
        setVerifiedAlternate(res.verifiedAlternateNumber);
        setName(res.Name);
        setSelectedDate(res.dob);
        setReligion(res.Religion);
        setMobileNo(res.Mobile || '');
        setEmail(res.Email);
        setGender(res.Gender)
        setMotherTongue(res.MotherTongue);

        const languagesKnown = Array.isArray(res.LanguagesKnown)
          ? res.LanguagesKnown
          : (res.LanguagesKnown ? res.LanguagesKnown.split(', ') : []);
        setKnownLanguages(languagesKnown);
        setKnownLanguages(languagesKnown);
        setMaritalStatus(res.MaritalStatus);
        setSpouseName(res.SpouseName);
        setSpouseOccupation(res.Spouseoccupation);
        setChildrenM(res.NoofChildrenM);
        setChildrenF(res.NoofChildrenF);
        console.warn(res.NoofChildrenM, res.NoofChildrenF);

        setFatherName(res.FatherName);
        setFatherSpouseName(res.FatherOccupation);
        setMotherSpouseName(res.MotherOccupation);
        setMotherName(res.Mothernm);
        setAltMobileNo(res.Alternatemobile || '');
        setBloud(res.Bloodgroup)
      } if (res.Message === "An error has occurred.") {
        alert('Data retrieval failed. Please contact the Admin.');

      }
      setIsloading(false);

    } catch (error) {
      console.error("Error in form1Data:", error);
      setIsloading(false);

    }
  };

  const validateForm = () => {
    if (!name) {
      ToastAndroid.show("Please enter your name", ToastAndroid.SHORT);
      return false;
    }

    if (!selectedDate) {
      ToastAndroid.show("Please select your date of birth", ToastAndroid.SHORT);
      return false;
    }


    if (!verifiedMobile) {
      ToastAndroid.show("Please verified your Mobile No. ", ToastAndroid.SHORT);
      return false;
    }



    if (!gender) {
      ToastAndroid.show("Please select your gender ", ToastAndroid.SHORT);
      return false;
    }
    const today = new Date();
    const birthDate = new Date(selectedDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      ToastAndroid.show("You must be at least 18 years old", ToastAndroid.SHORT);
      return false;
    }
    if (!mobileNo || mobileNo.length !== 10) {
      ToastAndroid.show("Please enter a valid mobile number", ToastAndroid.SHORT);
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      ToastAndroid.show("Please enter a valid email address", ToastAndroid.SHORT);
      return false;
    }
    if (!religion) {
      ToastAndroid.show("Please select your religion", ToastAndroid.SHORT);
      return false;
    }
    if (!motherTongue) {
      ToastAndroid.show("Please select your mother tongue", ToastAndroid.SHORT);
      return false;
    }
    if (knownLanguages.length === 0) {
      ToastAndroid.show("Please select languages you know", ToastAndroid.SHORT);
      return false;
    }
    if (maritalStatus) {
      if (!spouseName) {
        ToastAndroid.show("Please enter your spouse's name", ToastAndroid.SHORT);
        return false;
      }
      if (!spouseOccupation) {
        ToastAndroid.show("Please enter your spouse's occupation", ToastAndroid.SHORT);
        return false;
      }

    }

    if (!bloud) {
      ToastAndroid.show("Please select your Bloud Group", ToastAndroid.SHORT);
      return false;
    }
    if (!altmobileNo) {
      ToastAndroid.show("Please enter a valid alternative mobile number", ToastAndroid.SHORT);
      return false;
    }
    if (!fatherName) {
      ToastAndroid.show("Please enter your father's name", ToastAndroid.SHORT);
      return false;
    }
    if (!motherName) {
      ToastAndroid.show("Please enter your mother's name", ToastAndroid.SHORT);
      return false;
    }
    if (!fatherspouseName) {
      ToastAndroid.show("Please enter your father's occupation", ToastAndroid.SHORT);
      return false;
    };
    if (!motherspouseName) {
      ToastAndroid.show("Please enter your mother's occupation", ToastAndroid.SHORT);
      return false;
    }
    return true;
  };

  const CandiantForm1 = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    setIsloading2(true);

    try {
      const data = {
        Email: email,
        Mobile: mobileNo,
        Gender: gender,
        verifiedMobileNumber: verifiedMobile,
        verifiedAlternateNumber: verifiedAlternate,
        DOB: selectedDate,
        Religion: religion,
        Name: name,
        MotherTongue: motherTongue,
        LanguagesKnown: knownLanguages.join(', '),
        MaritalStatus: maritalStatus,
        SpouseName: spouseName,
        Spouseoccupation: spouseOccupation,
        NoofChildrenM: childrenM,
        NoofChildrenF: childrenF,
        FatherName: fatherName,
        FatherOccupation: fatherspouseName,
        MotherOccupation: motherspouseName,
        Mothernm: motherName,
        BloodGroud: bloud,
        Alternatemobile: altmobileNo
      };

     const res = await post({ url: APP_URLS.RadiantCandiantForm1, data });
  console.log('Response:', res, 'Data Sent:', data, res?.status, res?.Message);

  // Always show status and message via ToastAndroid
  const statusText = res?.status || 'No status';
  const messageText = res?.Message || 'No message';

  ToastAndroid.show(`Status: ${statusText}`, ToastAndroid.SHORT);
  ToastAndroid.show(`Message: ${messageText}`, ToastAndroid.SHORT);

  // Error handling based on response
  if (res.Message === 'An error has occurred.') {
    alert('Internal server error. Please try again later.');
    return;
  }

  if (res.status === 'NOT') {
    alert('Submission failed. Please try again later.');
    return;
  }

  if (res.status === 'Data Insert Successfully') {
setCurrentPage(currentPage + 1);    return;
  }

  // No need to repeat Toasts here — already shown above

} catch (error) {
  console.error("Error in CandiantForm1:", error);
  alert('An unexpected error occurred. Please check your connection and try again.');
} finally {
  setIsloading2(false);
}
  }, [
    email,
    name,
    mobileNo,
    selectedDate,
    gender,
    religion,
    motherTongue,
    knownLanguages,
    maritalStatus,
    spouseName,
    spouseOccupation,
    childrenM,
    childrenF,
    fatherName,
    fatherspouseName,
    motherspouseName,
    motherName,
    altmobileNo,
    bloud,
    verifiedMobile,
    verifiedAlternate
  ]);

  return (
    <View style={styles.main}>
      <ScrollView keyboardShouldPersistTaps={"handled"}>
        <View style={styles.container}>
          <FlotingInput
            label={'Name'}
            onChangeTextCallback={setName}
            value={name}
            editable={false}
            inputstyle={{ backgroundColor: name && '#F2FEF6' }}
          />
          <View>
            <FlotingInput
              label={'Mobile No'}
              onChangeTextCallback={setMobileNo}
              value={mobileNo}
              editable={false}
              keyboardType='numeric'
              inputstyle={{ backgroundColor: mobileNo && '#F2FEF6' }}
              maxLangth={10}

            />
            {mobileNo && mobileNo.length === 10 ? (
              verifiedMobile ? (
                <View style={styles.righticon2}>
                  <View
                    style={[
                      styles.languageEmojiContainer,
                      { backgroundColor: colorConfig.secondaryColor } // Only one backgroundColor should be used
                    ]}
                  >
                    <CheckSvg />
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.righticon2}
                  onPress={() => {
                    handleSendOtp('Mobile');
                  }}
                >
                  <Text style={styles.VerifiedNo}>
                    Verify Now
                  </Text>
                </TouchableOpacity>
              )
            ) : null}

          </View>

          <OTPModal
            inputCount={4}

            setShowOtpModal={setOtpModalVisible}
            disabled={mobileOtp.length !== 4}
            showOtpModal={otpModalVisible}
            setMobileOtp={setMobileOtp}
            verifyOtp={() => {
              handleVerifyOtp();

            }}
            sendID={sendid}
          />

          <FlotingInput
            label={'Email ID'}
            onChangeTextCallback={setEmail}
            value={email}
            editable={false}
            inputstyle={{ backgroundColor: email && '#F2FEF6' }}
            keyboardType='email-address'

          />

          <View>
            <FlotingInput
              label={'Select Gender'}
              value={gender}
              editable={false}
            />
            <View style={[styles.righticon2, { flexDirection: 'row', alignItems: 'center', }]}>
              {['Male', 'Female', 'Others'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.switchRow}
                  onPress={() => setGender(option)}
                >
                  <Text style={styles.switchText}>{option}</Text>
                  {gender === option ? <CheckBT size={12} /> : <View style={styles.checkBtn} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity onPress={handleDate}>
            <FlotingInput
              label={'Date Of Birth'}
              value={selectedDate}
              editable={false}
            />
            <View style={[styles.righticon2,]}>
              <Calendarsvg />
            </View>
          </TouchableOpacity>



          <View>
            <FlotingInput
              label={'Alternative Mobile No'}
              onChangeTextCallback={(text) => {
                setAltMobileNo(text.replace(/[^0-9]/g, ""))
                if (altmobileNo.length === 10) {
                  Keyboard.dismiss(); //
                }
              }}
              value={altmobileNo}
              keyboardType='number-pad'
              maxLength={10}
            />
            {altmobileNo && altmobileNo.length === 10 ? (
              verifiedAlternate ? (
                <View style={styles.righticon2}>
                  <View
                    style={[
                      styles.languageEmojiContainer,
                      { backgroundColor: colorConfig.secondaryColor }
                    ]}
                  >
                    <CheckSvg />
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.righticon2}
                  onPress={() => {
                    handleSendOtp('Alternate'); // ✅ Pass correct type
                  }}
                >
                  <Text style={styles.VerifiedNo}>
                    Verify Now
                  </Text>
                </TouchableOpacity>
              )
            ) : null}



          </View>
          <TouchableOpacity onPress={() => setIsBottomSheetVisible(true)}>
            <FlotingInput
              label={'Religion'}
              onChangeTextCallback={setReligion}
              value={religion}
              editable={false}
            />
            <View style={styles.righticon2}>
              <OnelineDropdownSvg />
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => { setIsVisible(true) }}>
            <FlotingInput
              label={'Blood Group'}
              value={bloud}
              editable={false}
            />
            <View style={styles.righticon2}>
              <OnelineDropdownSvg />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setIsLanguagesVisible(true) }}>
            <FlotingInput
              label={'Mother Tongue'}
              onChangeTextCallback={setMotherTongue}
              value={motherTongue}
              editable={false}
            />
            <View style={styles.righticon2}>
              <OnelineDropdownSvg />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsKnowVisible(true)}>
            <FlotingInput
              label={'Language You Know'}
              value={knownLanguages.join(', ')}  // Display selected languages as comma-separated
              editable={false}
            />
            <View style={styles.righticon2}>
              <OnelineDropdownSvg />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlemarital}>
            <FlotingInput
              label={'Marital Status'}
              editable={false}
            />
            <View style={styles.righticon2}>
              <View
                style={[
                  styles.languageEmojiContainer,
                  { backgroundColor: color1 },
                  maritalStatus && { backgroundColor: colorConfig.secondaryColor }
                ]}
              >
                {maritalStatus && <CheckSvg />}
              </View>
            </View>
          </TouchableOpacity>


          {maritalStatus && (
            <>
              <FlotingInput
                label={'Spouse Name'}
                onChangeTextCallback={(text) => { setSpouseName(text.replace(/[^a-zA-Z]/g, '')) }}
                value={spouseName}

              />
              <FlotingInput
                label={'Spouse Occupation'}
                onChangeTextCallback={(text) => { setSpouseOccupation(text.replace(/[^a-zA-Z]/g, '')) }}
                value={spouseOccupation}
              />
              <FlotingInput
                label={'Male Child'}
                onChangeTextCallback={(text) => {
                  setChildrenM(text.replace(/\D/g, ""))
                }
                }
                value={(childrenM ?? '').toString()}
                keyboardType={'numeric'}
                maxLength={2}

              />
              <FlotingInput
                label={'Female Child'}
                onChangeTextCallback={(text) => {
                  setChildrenF(text.replace(/\D/g, ""))
                }
                }
                value={(childrenF ?? '').toString()}
                keyboardType={'numeric'}
                maxLength={2}

              />
            </>
          )}
          <FlotingInput label={'Mother Name'}
            onChangeTextCallback={(text) => { setMotherName(text.replace(/[^a-zA-Z]/g, '')) }}
            value={motherName} />
          <FlotingInput label={'Mother Occupation'}
            onChangeTextCallback={(text) => { setMotherSpouseName(text.replace(/[^a-zA-Z]/g, '')) }}
            value={motherspouseName} />
          <FlotingInput label={'Father Name'}
            onChangeTextCallback={(text) => { setFatherName(text.replace(/[^a-zA-Z]/g, '')) }}
            value={fatherName}
          />
          <FlotingInput label={'Father Occupation'}
            onChangeTextCallback={(text) => { setFatherSpouseName(text.replace(/[^a-zA-Z]/g, '')) }}
            value={fatherspouseName} />

          <DynamicButton title={isLoading2 ?
           <ActivityIndicator size={'large'} color={colorConfig.labelColor} /> : 'Submit'}
            onPress={() => {
              CandiantForm1();
            }} />

          <BottomSheet isVisible={iscalendarVisible} onBackdropPress={() => setIsCalendarVisible(false)}>
            <View style={styles.bottomSheetContainer}>
              <CustomCalendar onDateSelected={handleDateSelected} />
            </View>
          </BottomSheet>

          <BottomSheet isVisible={isBottomSheetVisible} onBackdropPress={() => setIsBottomSheetVisible(false)}>
            <View style={styles.bottomSheetContainer}>
              <Text style={[styles.header, { backgroundColor: colorConfig.secondaryColor }]}>
                Select Your Religion
              </Text>
              <FlashList
                data={Religions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.religionItem} onPress={() => onSelectReligion(item)}>
                    <View
                      style={[
                        styles.languageEmojiContainer,
                        {
                          backgroundColor: religion === (item)
                            ? colorConfig.secondaryColor
                            : color1,
                          marginRight: wScale(20),
                        }
                      ]}
                    >
                      {religion === item && <CheckSvg />}
                    </View>

                    <Text style={styles.languageText}>
                      {item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </BottomSheet>

          <BottomSheet isVisible={isLanguagesVisible} onBackdropPress={() => setIsLanguagesVisible(false)}>
            <View style={[styles.bottomSheetContainer, { height: SCREEN_WIDTH / .9 }]}>
              <Text style={[styles.header, { backgroundColor: colorConfig.secondaryColor }]}>
                Select Your Language
              </Text>
              <FlashList
                data={Languages}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.religionItem} onPress={() => onSelectLang(item)}>
                    <View
                      style={[styles.languageEmojiContainer, { backgroundColor: color1, marginRight: wScale(20), },
                      { backgroundColor: motherTongue === item && colorConfig.secondaryColor }
                      ]}
                    >
                      {motherTongue === item && <CheckSvg />}
                    </View>
                    <Text style={styles.languageText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </BottomSheet>

          <BottomSheet isVisible={isknowVisible} onBackdropPress={() => setIsKnowVisible(false)}>
            <View style={[styles.bottomSheetContainer, { height: SCREEN_WIDTH / .9 }]}>
              <Text style={[styles.header, { backgroundColor: colorConfig.secondaryColor }]}>
                Select Languages You Know
              </Text>
              <FlashList
                data={Languages}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.religionItem}
                    onPress={() => onKnowLang(item)}>
                    <View
                      style={[
                        styles.languageEmojiContainer,
                        {
                          backgroundColor: knownLanguages.includes(item)
                            ? colorConfig.secondaryColor
                            : color1,
                          marginRight: wScale(20),
                        }
                      ]}
                    >
                      {knownLanguages.includes(item) && <CheckSvg />}
                    </View>

                    <Text style={styles.languageText}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </BottomSheet>

          <BottomSheet isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
            <View style={[styles.bottomSheetContainer, { height: SCREEN_WIDTH / .9 }]}>
              <Text style={[styles.header, { backgroundColor: colorConfig.secondaryColor }]}>
                Select Your Blood Group
              </Text>
              <FlashList
                data={bloodGroups}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.religionItem} onPress={() => onSelectBloud(item)}>
                    <View
                      style={[styles.languageEmojiContainer, { backgroundColor: color1, marginRight: wScale(20), },
                      { backgroundColor: bloud === item && colorConfig.secondaryColor }
                      ]}
                    >

                      {bloud === item && <CheckSvg />}
                    </View>
                    <Text style={styles.languageText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </BottomSheet>
        </View>
        {isLoading && <ShowLoader />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#fff' },
  container: { marginTop: hScale(10), marginBottom: hScale(10), paddingHorizontal: wScale(10) },
  righticon2: {
    position: "absolute",
    left: "auto",
    right: wScale(0),
    top: hScale(0),
    height: "85%",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: wScale(12)
  },
  bottomSheetContainer: { backgroundColor: 'white', height: 350, marginHorizontal: wScale(10), borderTopRightRadius: 10, borderTopLeftRadius: 10 },
  religionItem: { paddingHorizontal: wScale(10), flexDirection: 'row', alignItems: 'center' },
  religionText: { fontSize: 16, color: '#333' },
  header: { fontSize: 16, color: '#fff', paddingVertical: hScale(10), borderTopRightRadius: 10, borderTopLeftRadius: 10, textAlign: 'center', fontWeight: 'bold' },
  languageEmojiContainer: { borderWidth: wScale(.5), borderRadius: 25, height: wScale(30), width: wScale(30), alignItems: 'center', justifyContent: 'center' },
  languageText: {
    textTransform: 'capitalize',
    fontSize: wScale(22),
    color: '#000',
    paddingTop: hScale(10),
    flex: 1,
    paddingBottom: hScale(10),
    borderBottomColor: "rgba(0,0,0,.4)",
    borderBottomWidth: wScale(.4),
  },
  switchText: {
    color: '#000',
    fontSize: wScale(15),
    paddingLeft: wScale(5)
  },
  switchRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
    // width: wScale(75), // 
    paddingHorizontal: wScale(3),
    height: hScale(27),
    borderRadius: wScale(100),
    paddingLeft: wScale(10)
  },
  checkBtn: {
    borderWidth: wScale(1),
    borderColor: '#000',
    borderRadius: wScale(20),
    height: wScale(18),
    width: wScale(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  VerifiedNo: {
    borderWidth: wScale(.4),
    borderColor: '#000',
    borderRadius: wScale(5),
    color: 'red',
    fontWeight: 'bold',
    paddingHorizontal: wScale(5),
    paddingVertical: hScale(7),
    backgroundColor: '#ffcfd7',
    elevation: 3
  },


});

export default BasicInfo;