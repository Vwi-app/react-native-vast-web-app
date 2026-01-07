


import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';
import DateRangePicker from '../../../components/DateRange';
import AppBarSecond from '../headerAppbar/AppBarSecond';
import { hScale } from '../../../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';

const LoginReport = () => {
      const { IsDealer } = useSelector((state: RootState) => state.userInfo);

  const { get } = useAxiosHook();
  const [inforeport, setInforeport] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('100'); // Default status
  const [searchnumber, setSearchnumber] = useState(''); // Default search number

  useEffect(() => {
    recentTransactions(selectedDate.from, selectedDate.to, selectedStatus);
  }, [selectedDate, selectedStatus]); // Add dependencies to re-fetch on date or status change

  const recentTransactions = async (from, to, status) => {
    setLoading(true);
    try {
      const formattedFrom = new Date(from).toISOString().split('T')[0];
      const formattedTo = new Date(to).toISOString().split('T')[0];
      const url = 
      `${APP_URLS.LoginDetailsRetailer}?txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&ddltop=${status}`;
    const url2 =       `${APP_URLS.LoginDetailsDealer}?txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&ddltop=${status}`;

    
      const response = await get({ url: IsDealer? url2 :url });
      setInforeport(response.Report);
      console.log(response);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle URL opening
  const handlePress = (city) => {
    setLoading(true);
    // Simulate opening the URL
    setTimeout(() => {
      console.log(`Navigating to: google.navigation?q=${city}`);
      setLoading(false);
    }, 1000);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => handlePress(item.City1)}>
        <View style={styles.cardContent}>
          <View style={styles.locationSection}>
            <Text style={styles.label}>Location/City</Text>
            {item.City1 ? (
              <Text style={styles.text}>{item.City1}</Text>
            ) : (
              <Text style={styles.text}>Unknown location</Text>
            )}
          </View>
          
      
          
          <View style={styles.loginSection}>
            <Text style={styles.label}>{`${IsDealer?'User':'Login By'}`}</Text>
            {(item.Logintype || item.User) ? (
              <Text style={styles.text}>{`${IsDealer ? item.User:item.Logintype}`}</Text>
            ) : (
              <ActivityIndicator size="small" color="#0000ff" />
            )}
          </View>
          
          <View style={styles.loginTimeSection}>
            <Text style={styles.label}>Login Time</Text>
            {item.Currentlogin ? (
              <Text style={styles.text}>{item.Currentlogin}</Text>
            ) : (
              <ActivityIndicator size="small" color="#0000ff" />
            )}
          </View>
          
          <View style={styles.loginTimeSection}>
            <Text style={styles.label}>Last Login</Text>
            {item.LastLogin ? (
              <Text style={styles.text}>{item.LastLogin}</Text>
            ) : (
              <Text style={styles.text}>No last login time</Text>
            )}
          </View>
          
          <View style={styles.loginTimeSection}>
            <Text style={styles.label}>User ID</Text>
            {item.ID ? (
              <Text style={styles.text}>{item.ID}</Text>
            ) : (
              <Text style={styles.text}>No ID available</Text>
            )}
          </View>
  
          <View style={styles.loginTimeSection}>
            <Text style={styles.label}>IP Address</Text>
            {item.IP ? (
              <Text style={styles.text}>{item.IP}</Text>
            ) : (
              <Text style={styles.text}>No IP available</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={{ flex: 1 }}>

<AppBarSecond title={'Login History'} />

      <DateRangePicker
        onDateSelected={(from, to) => setSelectedDate({ from, to })}
        SearchPress={(from, to, status) => recentTransactions(from, to, status)}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        searchnumber={searchnumber}
        setSearchnumber={setSearchnumber}
        isStShow={false}
        retailerID={() => {}}
        isshowRetailer={false}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={inforeport}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={loading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: hScale(10),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: hScale(10),
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    padding:hScale(5),
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginSection: {
    marginTop:hScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loginTimeSection: {
    marginTop: hScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    color: '#6c757d',
  },
  text: {
    fontSize: 16,
    color: '#495057',
  },
});

export default LoginReport;