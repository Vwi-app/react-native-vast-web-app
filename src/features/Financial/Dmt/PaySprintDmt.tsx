import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ToastAndroid, Alert, ActivityIndicator, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { RootState } from '../../../reduxUtils/store';
import DynamicButton from '../../drawer/button/DynamicButton';


const PaysprintDmt = ({ route }) => {
    const { colorConfig } = useSelector((status: RootState) => status.userInfo)
    const navigation = useNavigation<any>();
    const [merchantCode, setMerchantCode] = useState('');
    const [partnerApiKey, setPartnerApiKey] = useState('');
    const [partnerId, setPartnerId] = useState('');
    const { get, post } = useAxiosHook();
    const Paysprint = (() => {
        return NativeModules.AepsModule;
      })();
    useEffect(() => {
        
        getDmtPayload();
       // CheckDmtstatus();
    }, []);
    
const getDmtPayload = async () => {
    try {
      const url = `MoneyDMT/api/PPI/info`
      
      const res = await post({ url: url });
      console.log('**DMT123', JSON.stringify(res));
      //JSON.parse(decryptData(res));
     
        if(res){
            const merchantCode = res?.ADDINFO?.merchantCode || '';
            const partnerApiKey = res?.ADDINFO?.partnerApiKey || '';
            const partnerId = res?.ADDINFO?.partnerId || '';

            setMerchantCode(merchantCode);
            setPartnerApiKey(partnerApiKey);
            setPartnerId(partnerId);
        }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

    return (
        <View style={styles.main}>
           
            <LinearGradient colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}>

                <View style={styles.inercontainer}>


                 
                </View>
                <DynamicButton
                    title={'Next'}

                    onPress={() => {
                        Paysprint.initCredo(merchantCode, partnerApiKey, partnerId);
                    } } styleoveride={undefined}          />

            </LinearGradient>

        </View>

    );
};


const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        paddingHorizontal: wScale(15),
        paddingVertical: wScale(15),
    },
    selecttitle: {
        fontSize: wScale(22),
        paddingBottom: hScale(10),
        paddingTop: hScale(15),
        color: '#000',
        fontWeight: 'bold'
    },
    inercontainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingHorizontal: wScale(10),
        paddingVertical: wScale(0),
        margin: wScale(10)
    },
    button: {
        borderWidth: wScale(1),
        padding: wScale(7),
        borderRadius: 5,
        marginRight: wScale(10),
        fontSize: wScale(15),
        borderBottomColor: '#000',
        color: '#000'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: hScale(5),
    },
    leftContainer: {
    },
    rightContainer: {
        alignItems: 'flex-end',
        flex: 1,
        marginLeft: wScale(10)
    },
    icon: {
        width: wScale(24),
        height: hScale(24),
        tintColor: 'PrimaryColor',
    },

    label: {
        fontSize: wScale(15),
        fontWeight: 'bold',
    },
    Value: {
        fontSize: wScale(14),
        letterSpacing: 1,
    },

});

export default PaysprintDmt;
