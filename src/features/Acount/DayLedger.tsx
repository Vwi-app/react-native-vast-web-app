import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { hScale, wScale } from '../../utils/styles/dimensions';
import DateRangePicker from '../../components/DateRange';
import NoDatafound from '../drawer/svgimgcomponents/Nodatafound';
import { FlashList } from '@shopify/flash-list';  

const DayLedgerReport = () => {
  const { colorConfig ,IsDealer} = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`
  const [inforeport, setInforeport] = useState([]);
  const [loading, setLoading] = useState(false);
  const { get } = useAxiosHook();
  const colorScheme = useColorScheme();
  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const retailerLedgerReport = async (from, to, status) => {
    setLoading(true);

    try {
      const formattedFrom = new Date(from).toISOString().split('T')[0];
      const formattedTo = new Date(to).toISOString().split('T')[0];

    const url = `${APP_URLS.DealerLedger}${formattedFrom}`
      const response = await get({ url: IsDealer?url: `${APP_URLS.dayLedger}from=${formattedFrom}&to=${formattedTo}` });
      if (!response) {
        throw new Error('Network response was not ok');
      }
      setInforeport(IsDealer ?response.Report :response);
      console.log(response, 'resssss');
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retailerLedgerReport(selectedDate.from, selectedDate.to, selectedStatus);
  }, [selectedDate, selectedStatus]); 

  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  const keyExtractor = (item, index) => index.toString();  

  const renderItem = ({ item, index }) => (
    <View style={[styles.transactionContainer, { backgroundColor: color1 }]}>
      <View key={index} style={styles.transactionrow}>
        <View>
          <Text style={styles.timetext}>Transaction Time</Text>
          <Text style={styles.timenumber}>{item.Date}</Text>
        </View>

        <View style={styles.postview}>
          <Text style={styles.timetext}>Amount</Text>
          <Text style={styles.timenumber}>₹ {item.Amount}</Text>
        </View>
      </View>

      <View style={styles.descriptionview}>
        <Text style={styles.transactionText}>Description:</Text>
        <Text style={[styles.transactionText, { color: colorConfig.secondaryColor, paddingLeft: wScale(10) }]}>{item.Particulars}</Text>
      </View>

      <View style={styles.transactionrow}>
        <Text style={styles.transactionText}>
          {item.debit === 0.0 && item.credit === 0.0
            ? null
            : item.debit === 0.0
              ? 'Credit Balance: ₹ ' + item.credit
              : 'Debit Balance: ₹ ' + item.debit}
        </Text>

        <View style={styles.postview}>
          <Text style={styles.timetext}>Post Balance</Text>
          <Text style={styles.timenumber}>₹ {item.Balance}</Text>
        </View>

      </View>
    </View>
  );

  return (
    <View style={styles.main}>
      <AppBarSecond title={'Ledger Report'} />

      <DateRangePicker
        onDateSelected={(from, to) => setSelectedDate({ from, to })}
        SearchPress={(from, to, status) => retailerLedgerReport(from, to, status)}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        isStShow={false}
        isshowRetailer={false}
      />

      <View style={styles.container}>

        {loading ?
          <ActivityIndicator size="large" color={colorConfig.secondaryColor} />
          :
          inforeport.length === 0 ? (
            <NoDatafound />
          ) :
            <FlashList
              data={inforeport}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              estimatedItemSize={200}
            />

        }
      </View>
    </View>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  main: { flex: 1 },

  container: {
    flex: 1,
    padding: wScale(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wScale(10),
    borderRadius: 5,
  },
  datePickerButton: {
    paddingHorizontal: wScale(10),
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: wScale(1),
    borderColor: '#fff',
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wScale(15),
    backgroundColor: '#007bff',
    borderRadius: 5,
    borderWidth: wScale(1),
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: wScale(14),
  },
  dateText: {
    color: '#fff',
    fontSize: wScale(14),
  },
  timetext: {
    color: '#000',
    fontSize: wScale(14),
  },
  timenumber: {
    color: '#000',
    fontSize: wScale(16),
    fontWeight: 'bold'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: wScale(18),
    color: isDarkMode ? '#cccccc' : '#777777',
    marginTop: hScale(20),
  },
  transactionContainer: {
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(5),
    borderRadius: 5,
    marginBottom: hScale(15),
  },
  transactionText: {
    fontSize: wScale(16),
    color: '#000',
  },
  transactionrow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  descriptionview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: wScale(1),
    borderBottomWidth: wScale(1),
    alignItems: 'center',
    paddingVertical: hScale(3)
  },
  postview: {
    alignItems: 'flex-end'
  },
});

export default DayLedgerReport;
