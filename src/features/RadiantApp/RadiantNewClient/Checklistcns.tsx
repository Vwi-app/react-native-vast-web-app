import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { FlashList } from '@shopify/flash-list';
import DynamicButton from '../../drawer/button/DynamicButton';
import { useNavigation } from '@react-navigation/native';
import CheckSvg from '../../drawer/svgimgcomponents/CheckSvg';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import BackSvg from '../../drawer/svgimgcomponents/BackSvg';
import { Button } from 'react-native-paper';

const Checklistcms = () => {
  const { colorConfig, userId } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}100`;
  const navigation = useNavigation<any>();

  const requirementtext = [
    'Employee Application Form',
    'Background Verification Form',
    'Pre-Employment verification Form',
    'Reference Check & Finger Impression Form',
    'Code of Conduct & Confidentiality Agreement',
    'Induction Training Form',

  ];

  const Inductionform = [
    'Police Verification (Mandatory)',
    'Copy of Bank Passbook with IFSC code (Salary Account will be opened by Customer)',
    'Educational Document',
    'Pan Card (Mandatory)',
    'Aadhaar card (Mandatory)',
    'Voters Identity Card /Passport/ Ration Card /Driving License/ Electricity Bill/Gas Bill (Anyone)',
    'As proof of address, if they have different permanent address & Current Address',
    'CIBIL/CREDIT SCORE',
    'Signature Verification Letter by Authorized Branch',
    'Yourself, bank security cheque',
  ];

  const handleWebsiteLink = () => {

    Linking.openURL('https://www.radiantcashservices.com/');
  };


  const handleGoBack = () => {
    navigation.goBack()
  };
  const renderItem = ({ item, index }) => (
    <View style={styles.paragraphContainer}>
      <Text style={styles.number}>
        {`${index + 1}`}
      </Text>
      {/* <View style={[styles.number, { backgroundColor: colorConfig.secondaryColor }]}>

        <CheckSvg size={15} />
      </View> */}

      <Text style={styles.paragraph}>{item}</Text>
    </View>
  );
  const renderItem2 = ({ item, index }) => (
    <View style={styles.paragraphContainer}>
      <Text style={styles.number}>
        {`${index + 1}`}
      </Text>
      {/* <View style={[styles.number, { backgroundColor: colorConfig.secondaryColor }]}>

        <CheckSvg size={15} />
      </View> */}

      <Text style={styles.paragraph}>{item}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.topcontainer,]}>
        <Image source={require('../../../../assets/images/radiant.png')}
          style={styles.imgstyle}
          resizeMode="contain" />
        <View style={styles.column}>
          <Text style={styles.title}>Radiant</Text>
          <Text style={styles.title2}>Cash Management Services</Text>
        </View>
      </View>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>
          Checklist for onboarding RCE
        </Text>
        <FlashList
          data={requirementtext}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}

        />
        <Text style={[styles.header, { marginTop: hScale(10) }]}>
          Copy of Certificates & Documents
        </Text>
        <FlashList
          data={Inductionform}
          renderItem={renderItem2}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={styles.footer}>
            <DynamicButton
              title={'Next'}
              onPress={() => { navigation.navigate('Availabilitybusiness'); }}
            />
          </View>}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wScale(15),
    flex: 1,
    paddingVertical: hScale(5),
  },
  paragraphContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hScale(3),
  },
  number: {
    borderWidth: 1,
    backgroundColor: '#000',
    borderRadius: 5,
    marginRight: wScale(10),
    color: '#fff',
    height: wScale(20),
    width: wScale(20),
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: hScale(1),
    alignItems: 'center',
    fontSize: wScale(12)
  },
  paragraph: {
    marginBottom: 0,
    color: '#000',
    textAlign: 'justify',
    flex: 1,
    fontSize: wScale(15),
  },
  footer: {
    marginTop: 4,
  },
  header: {
    fontSize: wScale(18),
    fontWeight: 'bold',
    color: '#322254',
    textTransform: 'uppercase',
    marginBottom: hScale(4)
  },
  topcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(8),
    borderRadius: 5,
    borderWidth: wScale(4),
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
  },
  linksContainer: {
    marginTop: hScale(4),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goBackText: {
    color: 'blue',
    fontSize: wScale(16),
  },
  websiteLinkText: {
    color: 'blue',
    fontSize: wScale(16),
    textDecorationLine: 'underline',
  },

});

export default Checklistcms;
