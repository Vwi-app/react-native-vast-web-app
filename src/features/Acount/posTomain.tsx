import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { BottomSheet } from '@rneui/themed';
import { Icon } from '@rneui/base';
import useAxiosHook from '../../utils/network/AxiosClient';
import { decryptData } from '../../utils/encryptionUtils';
import { FlashList } from '@shopify/flash-list';
import { hScale, SCREEN_WIDTH, wScale } from '../../utils/styles/dimensions';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import { TabBar, TabView } from 'react-native-tab-view';
import { colors } from '../../utils/styles/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import Aeps from '../../utils/svgUtils/Aeps';
import CheckBlance from '../../utils/svgUtils/CheckBlance';
import AadharPaysvg from '../../utils/svgUtils/AadhaarPaysvg';
import FlotingInput from '../drawer/securityPages/FlotingInput';
import DynamicButton from '../drawer/button/DynamicButton';
import DropdownSvg from '../../utils/svgUtils/DropdownSvg';
import OnelineDropdownSvg from '../drawer/svgimgcomponents/simpledropdown';
import DistributorWalletSvg from '../drawer/svgimgcomponents/DistributorWalletSvg';
import MainWalletSvg from '../drawer/svgimgcomponents/MainWalletSvg';
import BankWalletUnloadSvg from '../drawer/svgimgcomponents/BankWalletUnloadSvg';

const PostoMain = () => {
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.primaryColor}20`;
    const [selectedTab, setSelectedTab] = useState('bank');
    const [paymentMethod, setPaymentMethod] = useState('IMPS');
    const [selectedAccNo, setSelectedAccNo] = useState('');
    const [transactionPin, setTransactionPin] = useState('');
    const [amount, setAmount] = useState('');
    const [isPaymentMethodVisible, setPaymentMethodVisible] = useState(false);
    const [isAccountNumberVisible, setAccountNumberVisible] = useState(false);
    const [decryptedBankDetails, setDecryptedBankDetails] = useState([]);
    const [balance, setBalance] = useState([]);

    const { get, post } = useAxiosHook();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const fetchBankDetails = async () => {
            const res = await get({ url: 'WalletUnload/api/data/ShowbankdetailsforWalletToBank' });
            const balance = await get({ url: 'Retailer/api/data/Show_ALL_balanceremRem' });
            setBalance(balance.data[0]);
            if (res) {
                const decryptedData = JSON.parse(decryptData(res.vvvv, res.kkkk, res.bankdetails));
                setDecryptedBankDetails(decryptedData.data);
                console.log(decryptedData.data, 'Decrypted Bank Details');
            }
        };

        fetchBankDetails();
    }, []);

    const handlePress = (item) => {
        setSelectedAccNo(item.BankAccountNo);
        setAccountNumberVisible(false);
        console.log(item);
    };

    const renderAdditionalInputs = () => {
        if (index ===0) {
            return (
                <>
                    <TouchableOpacity onPress={() => setPaymentMethodVisible(true)} >
                        {/* <Icon name="chevron-down" size={20} color="#333" /> */}
                        <FlotingInput label={'Select Payment Method'} value={paymentMethod} editable={false} />
                        <View style={styles.righticon2}>
                            <OnelineDropdownSvg />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setAccountNumberVisible(true)}>
                        <FlotingInput label={'Select Account Number'} value={selectedAccNo} editable={false} />
                        <View style={styles.righticon2}>
                            <OnelineDropdownSvg />
                        </View>

                    </TouchableOpacity>
                    <FlotingInput
                        value={transactionPin}
                        onChangeTextCallback={(text) => {
                            setTransactionPin(text);
                        }}
                        keyboardType="numeric"
                        label="Enter Transaction Pin"
                        secureTextEntry
                    />
                </>
            );
        }
        return null;
    };

    const mainbank = async (id) => {
        try {
            const res = await post({ url: `WalletUnload/api/data/AddWalletToBankRequest?Amount=${amount}&Type=${paymentMethod}&transid=${id}&dmtpin=${transactionPin}&BankAccountNo=${selectedAccNo}` });
          console.log(res)
            if (res.Response) {

                setAmount('');
                setTransactionPin('');
                setSelectedAccNo('');
                Alert.alert(res.Response, res.Message);
            } else {
                setAmount('');
                setTransactionPin('');
                setSelectedAccNo('');
                Alert.alert(res.Response, res.Message);
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleTransfer = async () => {
        if (!amount) {
            Alert.alert("Error", "Please enter amount and transaction pin.");
            return;
        }
        let transferResult;
        try {
            switch (index) {
                case 0:
                    if (!selectedAccNo) {
                        Alert.alert("Error", "Please select an account number.");
                        return;
                    }
                    transferResult = await post({ url: `WalletUnload/api/data/GenerateWalletTransectiongenerateid?Amount=${amount}&Type=${paymentMethod}&AccountNo=${selectedAccNo}` });
                    break;
                case 1:
                    transferResult = await post({ url: `MPOS/api/mPos/pos_to_Wallet_TransferAmount?amount=${amount}` });
                    break;
                case 2:
                    transferResult = await ToDist({ Amount: amount });
                    break;
                default:
                    Alert.alert("Error", "Invalid transfer type.");
                    return;
            }

            if (transferResult) {
                if (transferResult.sts === 'Success' && index === 0) {
                    mainbank(transferResult.transferid);
                } else {
                    Alert.alert(transferResult.Status, transferResult.msg);
                    setAmount('');
                    setTransactionPin('');
                    setSelectedAccNo('');
                }
            }
        } catch (error) {
            Alert.alert("Error", "Transfer failed. Please try again.");
            console.error(error);
        }
    };

    const ToDist = async ({ Amount }) => {
        try {
            const res = await post({ url: `MPOS/api/mPos/pos_to_Distributor_TransferAmount?amount=${Amount}` });
            console.log(res)
            if (res?.Status === 'Success') {
                Alert.alert(res.Status, res.msg);
            }else{
                Alert.alert(res.Status, res.msg);

            }
        } catch (error) {
            console.error(error);
        }
    };
    const renderScene = ({ route }) => {
        // setSelectedTab(route.key)
        switch (route.key) {
            case 'bank':
                return (
                    <View style={[styles.container,]}>
                        <FlotingInput label={'Enter Amount'}
                            onChangeTextCallback={(text) => {
                                setAmount(text);
                            }}
                            value={amount}
                            keyboardType="numeric"
                        />
                        {renderAdditionalInputs()}


                        <BottomSheet isVisible={isPaymentMethodVisible} onBackdropPress={() => setPaymentMethodVisible(false)}>
                            <View style={styles.bottomSheetContainer}>
                                <Text style={styles.sheetTitle}>Select Payment Method</Text>

                                {['IMPS', 'NEFT'].map(method => (
                                    <TouchableOpacity key={method} onPress={() => { setPaymentMethod(method); setPaymentMethodVisible(false); }} style={styles.sheetItem}>
                                        <Text style={styles.sheetItemText}>{method}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </BottomSheet>

                        <BottomSheet isVisible={isAccountNumberVisible} onBackdropPress={() => setAccountNumberVisible(false)}>
                            <View style={styles.bottomSheetContainer}>
                                <Text style={styles.sheetTitle}>Select Account Number</Text>
                                <FlashList
                                    data={decryptedBankDetails}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => handlePress(item)} style={styles.sheetItem}>
                                            <Text style={styles.sheetItemText}>{item.BankAccountNo}</Text>
                                            <Text style={styles.sheetItemText}>{item.AcconutHolderName}</Text>
                                        </TouchableOpacity>
                                    )}
                                    estimatedItemSize={50}
                                    keyExtractor={(item) => item.BankAccountNo}
                                />
                            </View>
                        </BottomSheet>
                        <DynamicButton title={'Transfer'} onPress={handleTransfer} />

                    </View>
                );


            case 'mainWallet':
                return (
                    <View style={styles.container}>
                        <FlotingInput label={'Enter Amount'}
                            onChangeTextCallback={(text) => {
                                setAmount(text);
                            }}
                            value={amount}
                            keyboardType="numeric"
                        />
                        <DynamicButton title={'Transfer'} onPress={handleTransfer} />
                    </View>
                );
            case 'distributor':
                return (
                    <View style={styles.container}>
                        <FlotingInput label={'Enter Amount'}
                            onChangeTextCallback={(text) => {
                                console.log('**ENCRY', text)
                                setAmount(text);
                            }}
                            value={amount}
                            keyboardType="numeric"
                        />
                        <DynamicButton title={'Transfer'} onPress={handleTransfer} />

                    </View>
                );
            default:
                return null;
        }
    };

    const [routes] = useState([

        { key: 'bank', title: 'To Bank' },
        { key: 'mainWallet', title: 'Main Wallet' },
        { key: 'distributor', title: 'Distributor' },
    ]);
    const getSvgimg = (key: string) => {
        switch (key) {
            case 'bank':
                return <BankWalletUnloadSvg />
            case 'mainWallet':
                return <MainWalletSvg />
            case 'distributor':
                return <DistributorWalletSvg />
            default:
                return null;
        }
    }
    return (
        <View style={styles.main}>
            <View>
                <AppBarSecond title={'wallet'} titlestyle={styles.titlestyle} />
                <View style={styles.PossOrWall}>

                    <View style={styles.poscontainer}>
                        <Text style={styles.balenstext}>Pos Bal ₹</Text>
                        <Text style={styles.balensnumber}>{balance.posremain}</Text>
                    </View>
                    <Text>  </Text>
                    <View style={[styles.poscontainer, { minWidth: wScale(100), marginLeft: wScale(2) }]}>
                        <Text style={[styles.balenstext, {}]}>Main Wallet ₹</Text>
                        <Text style={styles.balensnumber}>{balance.remainbal}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <TabView
                    lazy
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    // initialLayout={{ width: SCREEN_WIDTH }}
                    renderTabBar={(props) => (
                        <TabBar
                            {...props}
                            indicatorStyle={[styles.indicator, { backgroundColor: colorConfig.primaryColor }]}
                            style={[styles.tabbar, { backgroundColor: color1 }]}
                            renderLabel={({ route, focused }) => (
                                <View style={styles.labelview}>
                                    {getSvgimg(route.key)}
                                    <Text style={[styles.labelstyle, { color: focused ? colors.dark_black : colors.black75 }]}>
                                        {route.title}
                                    </Text>
                                </View>
                            )}
                        />
                    )}
                />
            </View>

        </View>


    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        paddingHorizontal: wScale(20),
        backgroundColor: '#fff',
        paddingVertical: hScale(20)
    },
    bottomSheetContainer: {
        backgroundColor: 'white',
        padding: 20,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#007bff',
    },
    sheetItem: {
        paddingVertical: 15,
    },
    sheetItemText: {
        fontSize: 16,
        color: '#333',
    },
    PossOrWall: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        right: wScale(10),
        top: wScale(12),
    },
    poscontainer: {
        height: hScale(35),
        minWidth: wScale(85),
        borderWidth: wScale(1),
        borderColor: '#fff',
        borderRadius: 15,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        marginLeft: wScale(5),
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    balenstext: {
        fontSize: wScale(11),
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        textAlign: 'center',
        height: 'auto',
        paddingTop: hScale(1),
    },
    balensnumber: {
        fontSize: wScale(13, 1),
        color: '#fff',
        alignSelf: 'center',
        paddingHorizontal: wScale(5),
    },
    titlestyle: {
        textAlign: 'left',
        paddingLeft: wScale(15),
    },
    tabbar: {
        elevation: 0,
        marginBottom: hScale(10)
    },
    indicator: {
    },
    labelstyle: {
        fontSize: wScale(13),
        color: colors.black,
        width: "100%",
        textAlign: 'center',
    },
    labelview: {
        alignItems: 'center',
        flex: 1,
    },
    righticon2: {
        position: "absolute",
        left: "auto",
        right: wScale(0),
        top: hScale(0),
        height: "85%",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: wScale(12),
    },

});

export default PostoMain;
