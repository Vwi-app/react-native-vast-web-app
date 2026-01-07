import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { APP_URLS } from "../../../utils/network/urls";
import useAxiosHook from "../../../utils/network/AxiosClient";
import AppBarSecond from "../../drawer/headerAppbar/AppBarSecond";
import DateRangePicker from "../../../components/DateRange";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Entypo from "react-native-vector-icons/Entypo";
import NoDatafound from "../../drawer/svgimgcomponents/Nodatafound";
import ShowLoader from "../../../components/ShowLoder";

const RadiantPrepayReport = () => {

    // Always store clean YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState({
        from: today,
        to: today,
    });

    const [status, setStatus] = useState("");
    const [data, setData] = useState([]);
    const { post } = useAxiosHook();

    // Helper to clean any date input
    const normalizeDate = (date) => {
        return new Date(date).toISOString().split("T")[0];
    };

    const fetchData = async (from, to, status) => {
        setLoading(true)
        try {
            const url = `${APP_URLS.RadiantPrepayReport}?from=${from}&to=${to}&Status=${status}`;

            const response = await post({ url });
            console.log("API CALL:", url, from, to);

            const list = Array.isArray(response)
                ? response
                : response?.data || [];

            setData(list);
        } catch (error) {
            console.log("API Error:", error);
        }  finally {
      setLoading(false);
    }
    };

    useEffect(() => {
        const cleanFrom = normalizeDate(selectedDate.from);
        const cleanTo = normalizeDate(selectedDate.to);

        fetchData(cleanFrom, cleanTo, status);
    }, [selectedDate, status]);

    const renderItem = ({ item, index }) => {
        const itemStatus = item.sts?.toLowerCase();

        const color =
            itemStatus === "pending"
                ? "#fa9507"
                : itemStatus === "failed"
                    ? "red"
                    : itemStatus === "success"
                        ? "green"
                        : itemStatus?.startsWith("r")
                            ? "blue"
                            : "#555";

        const isLastRow = index === data.length - 1;

        return (
            <View style={[styles.card, { borderColor: color }]}>
                <View style={[styles.row, { borderColor: color }]}>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                        {itemStatus === "pending" ? (
                            <FontAwesome6 name="clock" size={30} color={color} />
                        ) : itemStatus === "failed" ? (
                            <Entypo name="circle-with-cross" size={30} color={color} />
                        ) : itemStatus === "success" ? (
                            <Ionicons name="checkmark-done-circle-sharp" size={30} color={color} />
                        ) : (
                            <Ionicons name="checkmark-done-circle" size={30} color={color} />
                        )}

                        <Text style={[styles.sts, { color }]}>{item.sts}</Text>
                    </View>

                    <Text style={styles.amo}>₹ {item.Amount}</Text>
                </View>

                <View style={[styles.row, { borderColor: color }]}>
                    <Text style={styles.label}>CEID</Text>
                    <Text style={styles.value}>{item.CEID}</Text>
                </View>

                <View style={[styles.row, { borderColor: color }]}>
                    <Text style={styles.label}>Request ID</Text>
                    <Text style={styles.value}>{item.RequestID}</Text>
                </View>

                <View style={[styles.row, { borderColor: color }]}>
                    <Text style={styles.label}>Insert Date</Text>
                    <Text style={styles.value}>{item.Insertdate}</Text>
                </View>

                <View style={[styles.row, { borderColor: isLastRow ? color : "#fff" }]}>
                    <Text style={styles.label}>Update Date</Text>
                    <Text style={styles.value}>{item.Updatedate}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.main}>
            <AppBarSecond title={'Cash Pickup Prepay Report'}/>

            <DateRangePicker
                isStShow={true}
                isshowRetailer={false}
                cmsStatu={false}
                setStatus={setStatus}

                onDateSelected={(from, to) => {
                    setSelectedDate({
                        from: normalizeDate(from),
                        to: normalizeDate(to),
                    });
                }}

                SearchPress={(from, to, status) => {
                    fetchData(normalizeDate(from), normalizeDate(to), status);
                }}

            />

            <View style={styles.container}>
                {loading ? (
                    <ShowLoader />
                ) : data.length === 0 ? (
                    <NoDatafound />
                ) : (
                    <FlashList
                        data={data}
                        renderItem={renderItem}
                        estimatedItemSize={120}
                    />
                )}
            </View>
        </View>
    );
};

export default RadiantPrepayReport;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    container: {
        flex: 1,
        paddingVertical: wScale(10),
        paddingHorizontal: wScale(10),
    },
    card: {
        backgroundColor: "#FFF",
        paddingTop: wScale(15),
        borderRadius: wScale(10),
        marginBottom: hScale(12),
        elevation: 3,
        borderWidth: 0.5,
        paddingHorizontal: wScale(10),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: hScale(10),
        borderBottomWidth: 0.5,
        paddingBottom: hScale(10),
    },
    label: {
        fontSize: wScale(14),
        fontWeight: "600",
        color: "#555",
    },
    value: {
        fontSize: wScale(14),
        fontWeight: "500",
        color: "#222",
        textAlign: "right",
    },
    sts: {
        fontSize: wScale(16),
        fontWeight: "bold",
        marginLeft: wScale(3),
        flex: 1,
    },
    amo: {
        fontSize: wScale(16),
        fontWeight: "bold",
        textAlign: "right",
        color: "#000",
    },
});
