import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import AppBarSecond from "../drawer/headerAppbar/AppBarSecond";
import CalendarCmssvg from "../drawer/svgimgcomponents/CalendarCmssvg";
import { wScale } from "../../utils/styles/dimensions";

export default function RCEPayoutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AppBarSecond title={'RCE Payout Information'} />


      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.monthRow}>
            <View style={styles.monthBox}>
            <CalendarCmssvg />
            <View style={{}}>
              <Text style={styles.monthValue}>Previous Month</Text>
              <Text style={styles.monthValue}>Your PayOut Info</Text>
            </View>
          </View>

          <View style={styles.monthBox}>
            <CalendarCmssvg />
            <View style={{}}>
              <Text style={styles.monthValue}>Previous Month</Text>
              <Text style={styles.monthValue}>Your PayOut Info</Text>
            </View>
          </View>

          <View style={styles.monthBox}>
            <CalendarCmssvg />
            <View>
              <Text style={styles.monthValue}>Current Month</Text>
              <Text style={styles.monthValue}>Your PayOut Info</Text>
            </View>
          </View>
        </View>

        {/* Note */}
        <Text style={styles.note}>
          Note:- All this information is available in the database. The total
          amount has been calculated based on your payment collection and
          attendance. If you have any questions or concerns, please contact the
          accounts team immediately.
        </Text>

        {/* Monthly Payout */}
        <Text style={styles.sectionTitle}>December 2025 Monthly Payout</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Your Work Method</Text>
          <Text style={styles.tableHeaderText}>Employment Type</Text>
        </View>

        {/* Table Row */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Wallet / Deposit / Mixed</Text>
          <Text style={styles.tableCell}>Day Pickup - All Days</Text>
        </View>

        {/* Empty rows (for layout like image) */}
        {[1, 2, 3].map((_, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Text style={styles.navItem}>Home</Text>
        <Text style={styles.navItem}>Wallet</Text>
        <Text style={styles.navItem}>Account</Text>
        <Text style={styles.navItemActive}>Report</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  header: {
    backgroundColor: "#4a6ee0",
    padding: 16,
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  content: {
    padding: 16,
  },

  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  monthBox: {
    width: "33%",
    backgroundColor: "#e8ebff",
    paddingHorizontal: wScale(5),
    borderRadius: 10,
    alignItems: "center",
    flexDirection: 'row',
    paddingVertical: 5,
    justifyContent: 'space-between',

  },

  monthLabel: {
    fontSize: 12,
    color: "#555",
  },

  monthValue: {
    fontSize: 12,
    color: '#000'
  },

  note: {
    color: "red",
    fontSize: 12,
    marginVertical: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1f2937",
    padding: 10,
  },

  tableHeaderText: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  tableCell: {
    flex: 1,
    padding: 14,
    textAlign: "center",
    color: "#333",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  navItem: {
    color: "#777",
  },

  navItemActive: {
    color: "#4a6ee0",
    fontWeight: "bold",
  },
});
