import React, { useState } from 'react';
import { View, Alert, StyleSheet, ScrollView, Button, ToastAndroid, Modal, Touchable, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlotingInput from '../../drawer/securityPages/FlotingInput';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import DynamicButton from '../../drawer/button/DynamicButton';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import CalendarPicker from 'react-native-calendar-picker';
import CloseSvg from '../../drawer/svgimgcomponents/CloseSvg';
import ShowLoader from '../../../components/ShowLoder';

const PancardManual = ({ navigation }) => {
  const { get } = useAxiosHook();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobile2, setMobile2] = useState('');
  const [father, setFather] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [dob, setDob] = useState('Select DOB');
  const [email, setEmail] = useState('');
  const [adharno, setAdharno] = useState('');
const [isLoading,setisLoading] = useState(false)
  const getCurrentYear = () => new Date().getFullYear();

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if single digit
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1) and pad
    const year = date.getFullYear(); // Get the full year
  console.log(`${year}/${month}/${day}`)
    return `${year}/${month}/${day}`; // Return formatted string
  };
  const [selectedDate, setSelectedDate] = useState(null);
  
  // State to manage modal visibility
  const [isModalVisible, setModalVisible] = useState(false)
  const handleManualPan = async () => {
    // Validate required fields
    if (!name || !mobile || !father || !gender || !state || !dob || !email || !adharno) {
      Alert.alert('Missing Information', 'Please fill out all fields.');
      return;
    }
  
    // Validate mobile number
    if (!/^\d{10}$/.test(mobile)) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setisLoading(true)
    try {

      const  url =`${APP_URLS.PancardManual}msts=''&state=${state}&gender=${gender}&cmobile=${mobile2}&Email=${email}&father=${father}&mobile=${mobile}&dob=${dob}&name=${name}&adharno=${adharno}`
  console.log(url)
      const response = await get({ url });
      console.log(response);
      // LOG  {"message": "Balance Low", "status": "Failed"}
      if (response && response.message) {
        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER);
      }
      setisLoading(false)

    } catch (error) {
      console.error('Error making request:', error);
      Alert.alert('Error', 'An error occurred while processing your request. Please try again later.');
    }
  };
  
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const onDateChange = (date) => {
    const formattedDate = formatDate(date);
console.log(formattedDate)
    setModalVisible(false);
  
    setDob(formattedDate);
    console.log(formattedDate)

  };
  return (
    <View style={{ flex: 1 }}>
      <AppBarSecond
        title="Pancard Manual Form"
        actionButton={<Button title="Back" onPress={() => navigation.goBack()} />}
      />
      <ScrollView>
        <View style={styles.container}>
          <FlotingInput
            label="Enter Name"
            value={name}
            onChangeTextCallback={setName}
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Mobile"
            value={mobile}
            onChangeTextCallback={setMobile}
            keyboardType="phone-pad"
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Aadhar Reg. Mobile"
            value={mobile2}
            onChangeTextCallback={setMobile2}
            keyboardType="phone-pad"
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Father's Name"
            value={father}
            onChangeTextCallback={setFather}
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Gender"
            value={gender}
            onChangeTextCallback={setGender}
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter State"
            value={state}
            onChangeTextCallback={setState}
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Email"
            value={email}
            onChangeTextCallback={setEmail}
            keyboardType="email-address"
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Aadhaar Number"
            value={adharno}
            onChangeTextCallback={setAdharno}
            keyboardType="numeric"
            maxLength={12}
            inputstyle={styles.input}
          />

        <TouchableOpacity  onPress={()=>setModalVisible(true)}>
        <FlotingInput
            label="Enter Date of Birth (DD/MM/YYYY)"
            value={dob}
            onChangeTextCallback={formatDate}
            keyboardType="numeric"
            maxLength={12}
            inputstyle={styles.input}
            editable={false}
          />
          </TouchableOpacity> 
          
          

<Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* <Text style={styles.modalHeader}>Pick a Date</Text> */}

            {/* CalendarPicker Component */}
            <CalendarPicker
              onDateChange={onDateChange}
              selectedDayColor="#00BFFF" // Customize the selected day color
              selectedDayTextColor="#FFF" // Customize the selected day text color
            />

            {/* Close Modal Button */}

            <TouchableOpacity onPress={toggleModal}>
 <CloseSvg color='red'  size={hScale(20)}/>

            </TouchableOpacity>
           
          </View>
        </View>
      </Modal>
{isLoading && <ShowLoader/>}
          {/* <FlotingInput
            label="Enter Amount"
            value={reamount}
            onChangeTextCallback={setReamount}
            keyboardType="numeric"
            maxLength={8}
            inputstyle={{ borderColor: amount === reamount ? 'black' : 'red' }}
          /> */}
          <DynamicButton
            title={'Submit'}
            styleoveride={{ marginTop: hScale(10) }}
            onPress={handleManualPan}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wScale(10),
    backgroundColor: '#fff',
    paddingVertical: hScale(10)
  },
  input: {
    // marginBottom: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  selectedDateText: {
    fontSize: 18,
    marginTop: 20,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: hScale(350),
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default PancardManual;
