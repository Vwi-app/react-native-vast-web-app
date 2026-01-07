import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Animated, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import useAxiosHook from '../../../utils/network/AxiosClient';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import { hScale } from '../../../utils/styles/dimensions';

const RegisterVM30 = ({ route }) => {
  const { deviceSerial } = route.params;
  const [devicenum, setDeviceNum] = useState(deviceSerial);
  const [validate, setValidate] = useState(false);
  const navigation = useNavigation<any>();
  const [fadeAnim] = useState(new Animated.Value(0)); 
  const { get, post } = useAxiosHook();

  useEffect(() => {
    console.log(deviceSerial)
    deviceSerial
    setDeviceNum(deviceSerial);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [deviceSerial]);

  const deviceRegister = async (serialno) => {
    try {
      const data = JSON.stringify({
        DeviceSnNo: serialno,
      });
      const res = await post({ url: `MICROATM/api/data/SubmitSnNo?DeviceSnNo=${serialno}` });

      const { status, msg } = res;

      if (res.status === 'Success') {
        Alert.alert(
          'Success',
          msg,
          [
            {
              text: 'OK',
              onPress: () =>   navigation.goBack()
              
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('Error', `${msg}!!`, [{ text: 'OK', style: 'cancel' }]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    if (devicenum === '') {
      setValidate(true);
    } else {
      setValidate(false);
      deviceRegister(devicenum);
    }
  };

  return (
    <View style={styles.container}>
      <AppBarSecond title={'Device Activation'} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.row}>
            <Text style={styles.successText}>Merchant Approved Successfully</Text>
            <Text style={styles.icon}>✔️</Text>
          </View>

          <TextInput
            style={[styles.input, validate && styles.errorBorder]}
            value={     devicenum}
            onChangeText={setDeviceNum}
            placeholder="Device Serial"
            keyboardType="default"
            editable={false}
            placeholderTextColor="#888"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Activate Device</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: hScale(10),
  },
  content: {
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hScale(20)
  },
  successText: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: hScale(18),
  },
  icon: {
    marginLeft: hScale(10),
    color: 'green',
    fontSize: hScale(20),
  },
  input: {
    borderColor: '#ced4da',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: hScale(10),
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    color:'green',
    textAlign:'center',
    fontSize:22
  },
  errorBorder: {
    borderColor: 'red',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default RegisterVM30;
