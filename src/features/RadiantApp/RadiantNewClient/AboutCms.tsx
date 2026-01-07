import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Linking, ScrollView, Image, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import DynamicButton from '../../drawer/button/DynamicButton';
import BackSvg from '../../drawer/svgimgcomponents/BackSvg';
import { useNavigation } from '../../../utils/navigation/NavigationService';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import ShowLoader from '../../../components/ShowLoder';

const AboutCms = () => {
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}100`;
    const [stslist, setStslist] = useState(null);
    const [isLoading, setIsloading] = useState(false);

    const handleGoBack = () => {
        navigation.goBack()
    };
    const { post } = useAxiosHook();
    const navigation = useNavigation<any>();
    useEffect(() => {


    })
    const check_Interest = async () => {
        try {
            setIsloading(true)
            const res = await post({ url: APP_URLS.RadiantCEIntersetinfo });
            const status = res?.Content?.ADDINFO?.sts;
            const message = res?.Content?.ADDINFO?.message;
            const res2 = await post({ url: 'api/Radiant/RadiantDocstatus' });

            console.log(res, res2);
            setStslist(res);
            setIsloading(false)

            if (status) {
                navigation.navigate('Requirementscms');
            } else {
                ToastAndroid.showWithGravity(
                    message || status,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM
                );
                setIsloading(false)

                // ToastAndroid.show('statusasdfasfsa', ToastAndroid.LONG);
                //  Alert.alert(message);
            }
        } catch (error) {
            setIsloading(false)
        }

    }
    const handleWebsiteLink = () => {

        Linking.openURL('https://www.radiantcashservices.com/');
    };


    const handleHelpLink = () => {
        console.log('Help/How can I work clicked');
        // Linking.openURL('https://www.radiantcashservices.com/');
    };

    return (

        <ScrollView style={{}}>
            <View style={[styles.topcontainer,]}>
                <Image source={require('../../../../assets/images/radiant.png')}
                    style={styles.imgstyle}
                    resizeMode="contain" />
                <View style={styles.column}>
                    <Text style={styles.title}>Radiant</Text>
                    <Text style={styles.title2}>Cash Management Services</Text>
                </View>
            </View>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <Text style={[styles.aboutTitle, { color: colorConfig.secondaryColor, borderBottomColor: colorConfig.secondaryColor }]}>ABOUT THE COMPANY</Text>
                </View>
                <Text style={styles.aboutText}>   Radiant Cash Management Services Limited cater to broad set of outsourcing
                    requirements pertaining to cash management services for banks, financial
                    institutions, organized retail and e-commerce companies in India. Company
                    operate our business across five verticals.
                </Text>

                <Text style={styles.aboutText}>   Depending on the volume, the company uses multiple modes of transport for
                    movement of cash and valuables, two wheelers, hired vehicles and specially
                    built armoured vans. The company handles cash transactions of around Rs 5000 -
                    6000 million daily from all the customers.
                </Text>
                <View style={styles.mapview}>
                    <View style={styles.mapcontant}>

                        <Text style={[styles.aboutText, { marginBottom: 0 }]}>   The Company services under this segment consist of
                        </Text>
                        <Text style={[styles.aboutText, { marginBottom: 0 }]}>
                            cash collection from end
                            user and deposit into company
                        </Text>
                        <Text style={[styles.aboutText, { marginBottom: 0 }]}>
                            current accounts and subsequent
                        </Text>
                        <Text style={[styles.aboutText, { marginBottom: 0 }]}>
                            transfer to the client’s accounts either
                        </Text>
                        <Text style={[styles.aboutText, { marginBottom: 0 }]}>
                            on the same day or on the next
                        </Text>
                        <Text style={[styles.aboutText, { marginBottom: 0 }]}>
                            working day. The
                            Company
                        </Text>
                        <Text style={[styles.aboutText, { marginBottom: 0 }]}>
                            believes that our network of more
                        </Text>
                        <Text style={[styles.aboutText, { marginBottom: 0 }]}>
                            than 60,000 touch points and a

                        </Text>
                        <Text style={[styles.aboutText, { marginBottom: 0 }]}>

                            wide network of bank accounts with
                        </Text>
                        <Text style={[styles.aboutText, { marginBottom: 0 }]}>
                            various banks across the country
                        </Text>
                        <Text style={[styles.aboutText, { marginBottom: 0 }]}>
                            allows use to offer a unique value
                        </Text>
                        <Text style={[styles.aboutText, { marginBottom: 0 }]}>
                            proposition to company clients,
                        </Text>
                        <Text style={[styles.aboutText,]}>
                            especially
                            private sector and foreign banks, with limited branch networks.
                        </Text>
                    </View>
                    <View style={styles.matimg}>

                        <Image source={require('../../../../assets/images/map.png')}
                            style={styles.mapstyle}
                            resizeMode="contain" />
                    </View>

                </View>
                <DynamicButton
                    onPress={() => {
                        // handleHelpLink();
                        // check_Interest()
                        navigation.navigate('Requirementscms');
                    }}
                    title={isLoading ? <ActivityIndicator color={colorConfig.labelColor} size={'large'} /> : 'Yes, how can i work?'}
                />

                <View style={styles.linksContainer}>
                    <Button
                        mode="text"
                        onPress={handleGoBack}
                        icon={() => <BackSvg size={15} color={colorConfig.primaryColor} />}
                    >
                        <Text style={[styles.goBackText, { color: colorConfig.primaryColor, }]}>{'Go Back'}</Text>
                    </Button>

                    <Button
                        mode="text"
                        onPress={handleWebsiteLink}
                    >
                        <Text style={[styles.websiteLinkText, { color: colorConfig.secondaryColor, textDecorationColor: colorConfig.secondaryColor }]}>Company Website Link</Text>
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wScale(10),
    },
    heading: {
        fontSize: wScale(32),
        fontWeight: 'bold',
        color: 'red',
        marginBottom: hScale(5),
    },
    subHeading: {
        fontSize: wScale(18),
        color: 'gray',
        marginBottom: hScale(20),
    },
    aboutTitle: {
        fontSize: wScale(22),
        marginBottom: hScale(10),
        textAlign: 'center',
        borderBottomWidth: 1,
        paddingHorizontal: wScale(15),
    },
    aboutText: {
        fontSize: wScale(14),
        color: 'black',
        marginBottom: hScale(10),
        textAlign: 'justify'
    },
    mapview: {
        flexDirection: 'row',
    },
    matimg: {
        position: 'absolute',
        right: 0,
        height: '90%',
        justifyContent: 'center',
        zIndex: -9
    },
    mapcontant: {

    },
    mapstyle: {
        width: wScale(170),
        height: wScale(190),

    },
    button: {
        marginTop: hScale(20),
        paddingVertical: hScale(10),
        width: '80%',
        backgroundColor: '#6200ee',
    },
    linksContainer: {
        marginTop: hScale(10),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    goBackText: {
        color: 'blue',
        fontSize: wScale(16),
    },
    websiteLinkText: {
        color: 'blue',
        fontSize: wScale(16),
        textDecorationLine: 'underline'
    },

    svgimg: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 10,
        paddingHorizontal: wScale(10),
        paddingVertical: hScale(5),
    },
    topcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wScale(10),
        paddingVertical: hScale(8),
        borderRadius: 5,
        borderWidth: 4,
        marginBottom: hScale(10),
        backgroundColor: '#ffe066',
        borderColor: '#fccb0a'
    },
    imgstyle: {
        width: wScale(90),
        height: wScale(90),
    },
    column: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'transparent',
        paddingLeft: wScale(5),

    },
    title: {
        fontSize: wScale(55),
        fontWeight: 'bold',
        color: '#322254',
        textTransform: 'uppercase',
        letterSpacing: wScale(3),
        lineHeight: wScale(60),
    },
    title2: {
        fontSize: wScale(19.3),
        color: '#322254',
        marginTop: hScale(-6),
        fontWeight: 'bold',
        paddingLeft: wScale(3),
    }
});

export default AboutCms;
