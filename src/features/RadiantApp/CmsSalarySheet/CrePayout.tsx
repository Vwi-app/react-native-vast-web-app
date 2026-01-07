import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import AppBarSecond from "../../drawer/headerAppbar/AppBarSecond";
import CalendarCmssvg from "../../drawer/svgimgcomponents/CalendarCmssvg";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { APP_URLS } from "../../../utils/network/urls";
import ShowLoader from "../../../components/ShowLoder";

export default function CrePayout() {
    const { post } = useAxiosHook();
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);

    const [salaryData, setSalaryData] = useState<any | null>(null);
    const [allSalary, setAllSalary] = useState<any | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rceId, setRceId] = useState("");

    const getMonthName = (month: number) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[month - 1];
    };

    /* ===================== SUMMARY API ===================== */

    const fetchSalary = async (month: number, year: number) => {
        try {
            setLoading(true);
            const response = await post({
                url: `${APP_URLS.RCETotalSalary}?Month=${month}&Year=${year}`
            });

            const data = response?.Content?.ADDINFO?.[0];
            if (data) {
                setSalaryData(data);
                setRceId(data.ceid);
            }
        } catch (error) {
            console.log("Summary salary API error:", error);
        } finally {
            setLoading(false);
        }
    };


    const fetchAllSalary = async () => {
        if (!rceId) return;

        try {
            setLoading(true);
            const response = await post({
                url: `${APP_URLS.RCETotalSalaryDetails}?RCEID=${rceId}&Month=12&Year=2025`
            });

            const data = response?.Content?.ADDINFO;
            if (data) {
                setAllSalary(data);
                setShowDetails(true);
            }
        } catch (error) {
            console.log("Details salary API error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalary(12, 2025);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <AppBarSecond title="RCE Payout Information" />

            {salaryData && (
                <View style={[styles.monthRow, { backgroundColor: `${colorConfig.secondaryColor}33` }]}>
                    {[1, 2,].map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.monthBox,
                                i === 1 && styles.activeBorder,
                                { borderColor: colorConfig.primaryColor }
                            ]}
                        >
                            <CalendarCmssvg
                                month={getMonthName(salaryData.SalaryMonth).slice(0, 3).toUpperCase()}
                                year={salaryData.SalaryYear.toString()}
                            />
                            <Text style={styles.monthValue}>
                                {getMonthName(salaryData.SalaryMonth)} {salaryData.SalaryYear}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.note}>
                    Note:- All this information is available in the database. The total
                    amount has been calculated based on your payment collection and
                    attendance.
                </Text>

                <View style={styles.tableContainer}>

                    {salaryData && (
                        <Text style={[styles.sectionTitle, { borderColor: colorConfig.secondaryColor, alignSelf: 'center',paddingHorizontal:wScale(10) }]}>
                            {getMonthName(salaryData.SalaryMonth)}{" "}
                            <Text style={{ color: "green" }}>
                                {salaryData.SalaryYear}
                            </Text>{" "}
                            Monthly Payout
                        </Text>
                    )}

                    {/* TABLE HEADER */}
                    <View style={[styles.tableHeader,{borderTopRightRadius:8,borderTopLeftRadius:8}]}>
                        <Text style={[styles.tableHeaderText, { borderRightWidth: .2 }]}>Description</Text>
                        <Text style={styles.tableHeaderText}>Amount / Info</Text>
                    </View>

                    {loading && (
                        <ShowLoader/>
                    )}

                    {salaryData && (
                        <>
                            {/* ===== SUMMARY ===== */}
                            <Row label="Total Pickup Amount" value={`₹ ${salaryData.TotalPickUpAmount}`} />
                            <Row label="Final Minimum Pay" value={`₹ ${salaryData.FinalMinPay}`} />
                            <Row label="Total Commission" value={`₹ ${salaryData.TotalFinalCommission}`} />
                            <Row label="Travel Allowance" value={`₹ ${salaryData.FinalTravels}`} />
                            <Row label="Penalty" value={`₹ ${salaryData.TotalPenlity}`} />
                            <Row label="TDS" value={`₹ ${salaryData.TDS}`} />

                            {/* ===== DETAILS ===== */}
                            {showDetails && allSalary?.PostpaySalary?.map((item: any, index: number) => (
                                <View key={index} style={{ backgroundColor: "#f9fafb" }}>
                                    <View style={styles.tableHeader}>
                                        <Text style={styles.tableHeaderText}>Postpay Salary</Text>
                                    </View>
                                    <Row label="Working Days" value={item.TotalWorkingdays} />
                                    <Row label="Pickup Count" value={item.Totalpickupcount} />
                                    <Row label="Zero Pickup Days" value={item.Zeropickup} />
                                    <Row label="Shop Type" value={item.ShopType} />
                                    <Row label="Work Mode" value={item.WorkMode} />
                                    <Row label="Commission %" value={`${item.Commission}%`} />
                                    <Row label="Original Min Pay" value={`₹ ${item.minpay}`} />
                                    <Row label="Final Commission" value={`₹ ${item.FinalCommission}`} />
                                </View>
                            ))}
                            {/* ===== TRAVELS & PENALTY DETAILS ===== */}
                            {showDetails && allSalary?.TravelsPenalty?.map((item: any, index: number) => (
                                <View key={`travel-${index}`} style={{ backgroundColor: "#fff7ed" }}>
                                    <View style={styles.tableHeader}>
                                        <Text style={styles.tableHeaderText}>Travels Penalty</Text>
                                    </View>
                                    <Row label="Total Travel Amount" value={`₹ ${item.TotalTravels}`} />

                                    <Row
                                        label="Maximum Travel Limit"
                                        value={`₹ ${item.MaximumpayTravles}`}
                                    />

                                    <Row label="Total Days" value={item.TotalDays} />

                                    <Row label="Total Pickup Count" value={item.Totalpickupcount} />

                                    <Row label="Remaining Leaves" value={item.TotalRemainLeave} />

                                    <Row
                                        label="Travel Penalty"
                                        value={`₹ ${item.TotalPenlity}`}
                                        valueStyle={{ color: "red", fontWeight: "bold" }}
                                    />

                                </View>
                            ))}


                            {/* ===== NET SALARY ===== */}
                            <View style={[styles.tableRow, styles.netRow]}>
                                <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                                    Net Salary
                                </Text>
                                <Text style={[styles.tableCell, styles.netSalary]}>
                                    ₹ {salaryData.NetSalary}
                                </Text>
                            </View>
                        </>
                    )}

                    <TouchableOpacity
                        disabled={!rceId}
                        onPress={fetchAllSalary}
                        style={[
                            styles.viewMoreBtn,
                            { backgroundColor: rceId ? "green" : "gray" }
                        ]}
                    >
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>
                            View More Details
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


const Row = ({ label, value }: { label: string; value: any }) => (
    <View style={styles.tableRow}>
        <Text style={[styles.tableCell, { borderRightWidth: .2 }]}>{label}</Text>
        <Text style={styles.tableCell}>{value}</Text>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
    },
    content: {
        paddingHorizontal: wScale(15),
        paddingVertical: hScale(10),
    },
    monthRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    monthBox: {
        width: "33%",
        alignItems: "center",
        paddingVertical: 5,
    },
    monthValue: {
        fontSize: 12,
        color: "#000",
    },
    note: {
        color: "red",
        fontSize: wScale(11),
        marginBottom: 12,
        textAlign: "justify",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 10,
        textAlign: "center",
        borderBottomWidth: 1,

    },
    tableContainer: {
        backgroundColor: "#ddd",
        paddingHorizontal: wScale(10),
        paddingBottom: hScale(20),
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
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
        color: "#333",
    },
    netRow: {
        backgroundColor: "#e6ffe6",
    },
    netSalary: {
        fontWeight: "bold",
        color: "green",
    },
    viewMoreBtn: {
        marginTop: 12,
        padding: 12,
        alignItems: "center",
        borderRadius: 4,
    },
    activeBorder: {
        borderBottomWidth: 1,
    },
});
