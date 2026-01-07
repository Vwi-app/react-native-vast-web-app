import React, { useEffect, useCallback, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ToastAndroid, FlatList, ScrollView } from "react-native";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import AppBarSecond from "../../drawer/headerAppbar/AppBarSecond";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from 'react-native-share';
import { APP_URLS } from "../../../utils/network/urls";
import { playSound } from "../../dashboard/components/Sounds";
import { onReceiveNotification2 } from "../../../utils/NotificationService";

const AepsResponse = ({ route }) => {
  const { ministate, Name, Aadhar, mobileNumber, bankName, TransactionStatus, RequestTransactionTime, BankRrn, TransactionAmount, BalanceAmount } = route.params.ministate;
  const { mode } = route.params;

  const capRef = useRef();
  const addinfo1 = route.params['ministate']['addinfo1'];

  const onShare = useCallback(async () => {
    try {
      const uri = await captureRef(capRef, {
        format: "jpg",
        quality: 0.7,
      });
      await Share.open({
        message: `Hi, I am sharing the transaction details using ${APP_URLS.AppName} app.`,
        url: uri,
      });
    } catch (e) {
      ToastAndroid.show("Transaction details not shared", ToastAndroid.SHORT);
    }
  }, []);
  let mockNotification = {}

  useEffect(() => {
    playSound(TransactionStatus)
    if (mode === 'MINI') {
      mockNotification = {
        notification: {
          title: mode + 'Transaction',
          body: `Transaction Status : ${TransactionStatus}\n Name: ${Name}\n  Mobile No: ${mobileNumber}\nBank Name: ${bankName}\Aadhar: ${Aadhar}`,

        },
      };
    } else {
      mockNotification = {
        notification: {
          title: mode + ' Transaction',
          body: `Transaction Status: ${TransactionStatus}
      Name: ${Name}
      Aadhar: ${Aadhar}
      Mobile No: ${mobileNumber}
      Bank Name: ${bankName}
      Request Transaction Time: ${RequestTransactionTime}
      Bank RRN: ${BankRrn}
      Transaction Amount: ${TransactionAmount}
      Balance Amount: ${BalanceAmount}`,
        },
      };

    }


    // Call the function
    onReceiveNotification2(mockNotification);
  }, []);


  return (
    <View style={styles.main}>
      <AppBarSecond title={mode} actionButton={undefined} onActionPress={undefined} onPressBack={undefined} titlestyle={undefined} />
      <ScrollView>
        <ViewShot style={{ padding: 5 }} ref={capRef} options={{ fileName: "TransactionReciept", format: "jpg", quality: 0.9 }}>
          <View style={styles.container}>
            {mode === 'MINI' && (
              <View style={styles.tableContainer}>
                <Text style={styles.header}>Mini Statement Receipt</Text>
                <Text>{'Mobile          :'}      {mobileNumber}</Text>
                <Text>{'Bank Name :   '}   {bankName}</Text>
                <Text >{'Name           :'}       {Name}</Text>
                <Text >{'Aadhar         :   '}    {Aadhar}</Text>

                <View style={styles.tableHeader}>
                  <Text style={styles.tableText}>Date</Text>
                  <Text style={styles.tableText}>Open</Text>
                  <Text style={styles.tableText}>Type</Text>
                  <Text style={styles.tableText}>Amount</Text>
                  <Text style={styles.tableText}>Close</Text>
                </View>

                {addinfo1 && addinfo1.length > 0 ? (
                  <FlatList
                    data={addinfo1}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // Handle undefined `id`
                    renderItem={({ item }) => (
                      <View style={styles.tableRow}>
                        <Text style={styles.tableItem}>{item.Date || 'N/A'}</Text>
                        <Text style={styles.tableItem}>{item.openbal || 'N/A'}</Text>
                        <Text style={styles.tableItem}>{item.Type || 'N/A'}</Text>
                        <Text style={styles.tableItem}>{item.Amount || 'N/A'}</Text>
                        <Text style={styles.tableItem}>{item.closebal || 'N/A'}</Text>
                      </View>
                    )}
                  />
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No statements available</Text>
                  </View>
                )}
              </View>
            )}

            {(mode === 'AEPS' || mode === 'AP' || mode === 'BAL CHECK') && (
              <View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Name</Text>
                  <Text style={styles.listItemText}>{Name}</Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Aadhar Number</Text>
                  <Text style={styles.listItemText}>{Aadhar}</Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <Text style={styles.listItemText}>{mobileNumber}</Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Bank Name</Text>
                  <Text style={styles.listItemText}>{bankName}</Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Request Transaction Time</Text>
                  <Text style={styles.listItemText}>{RequestTransactionTime}</Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Transaction Status</Text>
                  <Text style={styles.listItemText}>{TransactionStatus}</Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Bank Rrn</Text>
                  <Text style={styles.listItemText}>{BankRrn}</Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Transaction Amount</Text>
                  <Text style={styles.listItemText}>{TransactionAmount}</Text>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.label}>Balance Amount</Text>
                  <Text style={styles.listItemText}>{BalanceAmount}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={onShare}>
              <Text style={styles.buttonText}>Share Transaction Details</Text>
            </TouchableOpacity>
          </View>
        </ViewShot>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  container: {
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(0),
  },
  tableContainer: {
    padding: hScale(3),
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: hScale(20),
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hScale(10),
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hScale(3),
    paddingBottom: hScale(3),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#444',
    width: wScale(60),
    textAlign: 'center',
    paddingVertical: hScale(3),
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hScale(3),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableItem: {
    fontSize: 14,
    color: '#444',
    width: wScale(60),
    textAlign: 'center',
    paddingVertical: hScale(3),
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  itemContainer: {
    marginBottom: hScale(10),
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: hScale(2),
    borderRadius: 6,
    marginTop: hScale(0),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AepsResponse;
