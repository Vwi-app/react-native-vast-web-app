import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Keyboard } from 'react-native';
import FlotingInput from '../../drawer/securityPages/FlotingInput';
import AlertSvg from '../../drawer/svgimgcomponents/AlertSvg';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import AllBalance from '../../../components/AllBalance';
import ShowLoaderBtn from '../../../components/ShowLoaderBtn';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { useNavigation } from '../../../utils/navigation/NavigationService';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import { useDispatch } from 'react-redux';
import { setCmsAddMFrom, setRcPrePayAnomut } from '../../../reduxUtils/store/userInfoSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import { useFocusEffect } from '@react-navigation/native';

const CmsPrePay = ({ route }) => {
    const { colorConfig, Loc_Data, cmsVerify, rctype,radiantList } = useSelector((state: RootState) => state.userInfo);

    const { item } = route.params
    console.log(item, '099090');
    console.log(radiantList,'-=radiantList');
    


    const [amount, setAmount] = useState('');
    const [Ramount, setRAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState('');
    const [amountneed, setAmountneed] = useState('');

    const [adminiStatus, setAdminiStatus] = useState({});
    const [supportData, setSuppportData] = useState([]);
    const navigation = useNavigation();

    const { post, get } = useAxiosHook();
    useEffect(() => {
        if (!amount || !Ramount) {
            setStatus('');
            return;
        }

        if (Number(amount) > 0 && Number(amount) === Number(Ramount)) {
            setStatus('MATCHED');
        } else {
            setStatus('MISMATCH');
        }
    }, [amount, Ramount]);

    const showMismatch = Ramount !== '' && amount !== '' && Number(amount) !== Number(Ramount);
    useEffect(() => {
        if (
            Number(amount) > 0 &&
            Number(amount) === Number(Ramount)
        ) {
            fatchData();
        }
    }, [amount, Ramount]);

    const fatchData = async () => {
        setLoading(true);

        try {
            const url = `${APP_URLS.CashPickupRemainBalVerify}?Amount=${amount}`;
            console.log("API URL 👉", url);

            const response = await post({ url });
            console.log("API RESPONSE 👉", response);

            setAmountneed(response.amountneeded);
            setAdminiStatus(response);  // store full response
            if (response?.apiremainstatus && response?.sts) {
                navigation.navigate('CmsCoustomerInfo', { item,setAmount,setRAmount });
             
            }

            return response;

        } catch (error) {
            console.log("API ERROR ❌", error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     console.log('0-0-0==');

    //     if (!amount) {
    //         setRAmount('')
    //     }
    //     if (amount === Ramount) {
    //         console.log('0-0-0==11');

    //         fatchData();
    //     }
    // }, [amount, Ramount]);
    useFocusEffect(
    useCallback(() => {
        console.log('Screen is focused, fetch data if needed*+-');

        if (amount && Number(amount) === Number(Ramount)) {
            fatchData();
        }

        return () => {
            console.log('Screen is unfocused, cleanup if needed-+*');
        };
    }, [amount, Ramount])
);


    const handleAddMoney = () => {
        if (!amount) {
            alert("Please enter amount");
            return;
        }
        dispatch(setCmsAddMFrom('CmsPrePay'))
        navigation.navigate("AddMoneyOptions", { amount: amountneed, paymentMode: 'UPI', from: 'PrePay' });

    };
    useEffect(() => {
        const getData = async () => {

            try {

                const response = await get({ url: APP_URLS.Support_Information });
                setSuppportData(response)
                console.log(response)
            } catch (error) {

            }
        };

        getData();
    }, []);
    const openPhoneApp = () => {
        Linking.openURL(`tel:${supportData.adminmobile}`);
        console.log(supportData.adminmobile, '=-=-=-==');

    };

    const dispatch = useDispatch()
    if (rctype === 'PrePay') {
        dispatch(setRcPrePayAnomut(amount))
    } else {
        dispatch(setRcPrePayAnomut(null))

    }


    return (
        <View style={styles.main}>

            <AppBarSecond title={'Pickup Amount'} />
            <AllBalance />
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.disc}>
                        Please enter the amount you want to collect through Customer Points in the field below. Also,
                        please check that you have sufficient wallet balance. If Customer Points have online payments,
                        add them to your wallet via UPI beforehand.
                    </Text>
                    <FlotingInput
                        keyboardType="numeric"
                        label="Enter Pickup Amount"
                        value={amount}
                        onChangeTextCallback={(t) => setAmount(t)}
                    />

                    <View >
                        <FlotingInput
                            keyboardType="numeric"
                            label="Enter Re-Amount"
                            value={Ramount}
                            editable={!!amount}
                            onChangeTextCallback={(t) => {
                                if (Number(t) <= Number(amount)) {
                                    setRAmount(t);

                                }

                            }}
                        />

                        {showMismatch && (
                            <View style={styles.righticon2}>
                                <AlertSvg />
                                <Text style={styles.miss}>Mismatch</Text>
                            </View>
                        )}
                        {Number(amount) > 0 && amount === Ramount && (
                            <View style={styles.righticon2}>
                                {loading ? (
                                    <ShowLoaderBtn color="red" />
                                ) : (
                                    null
                                )}
                            </View>
                        )}
                    </View>
                    {/* First condition */}
                    {adminiStatus?.sts === false && (
                        <View style={styles.amountView}>
                            <View>
                                <Text style={styles.discNeedA}>
                                    Your wallet balance is short by
                                    <Text style={styles.amountN}> ₹ {amountneed} </Text>
                                    to complete the transaction. Please enter the remaining amount by clicking below:-
                                </Text>

                                <TouchableOpacity onPress={handleAddMoney} style={styles.btnstyle}>
                                    <Text style={styles.btntxt}>Click on me to add the remaining amount</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Second condition */}
                    {adminiStatus?.apiremainstatus === false && adminiStatus?.sts === true && (
                        <View style={styles.amountView}>
                            <Text style={styles.discNeedA}>
                                Administrator is running low on balance to complete the transaction.
                                Please notify the administrator by calling the mobile number provided below.
                            </Text>

                            <TouchableOpacity
                                onPress={openPhoneApp}
                                activeOpacity={0.7}
                                style={styles.btnstyle}
                            >
                                <Text style={styles.btntxt}>
                                    {/* +91 {supportData.adminmobile} */}
                                    Click Me to Call Administrator Now
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </View>
            </ScrollView >
        </View >
    );
};

export default CmsPrePay;



const styles = StyleSheet.create({

    main: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        paddingHorizontal: wScale(15),
        paddingTop: hScale(20),
    },

    righticon2: {
        position: "absolute",
        right: wScale(0),
        top: hScale(0),
        height: "85%",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: wScale(12),
        width: wScale(44),
        marginRight: wScale(-2),
    },
    miss: {
        color: 'red',
        fontSize: wScale(9),
        width: wScale(60),
        textAlign: 'right',
        marginTop: hScale(-4)
    },
    disc: {
        color: '#000',
        fontSize: wScale(13),
        textAlign: 'justify',
        marginBottom: hScale(10)
    },
    discNeedA: {
        color: '#000',
        fontSize: wScale(15),
        textAlign: 'justify',
    },
    amountN: {
        color: '#000',
        fontSize: wScale(16),
        fontWeight: 'bold',

    },
    btntxt: {
        color: "#fff",
        fontWeight: "bold",
        textTransform: 'uppercase',
        fontSize: wScale(16)
    },
    btnstyle: {
        backgroundColor: '#FF3B30',
        borderRadius: wScale(6),
        alignItems: 'center',
        paddingVertical: 3,
        marginLeft: wScale(5),
        marginBottom: hScale(4),
        marginTop: hScale(5)
    },


    amountView: {
        marginBottom: hScale(10),
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        paddingHorizontal: wScale(10),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'red',
        marginTop: hScale(20),
    },

});
