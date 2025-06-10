import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Images } from "../../assets";
import { AppText, CustomButton } from "../../components";
import { StaticColors } from "../../themes";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-native-date-picker";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import axios from "axios";
import { BASE_URL } from "../../api/apiCall";
import styles from "./ReportScreenStyle";
import Toast from "react-native-toast-message";

type Customer = {
  customer_name: string;
  customer_mobile_no: string;
  customer_vehicle_number: string;
};

type Invoice = {
  invoice_id: string;
};

type Transaction = {
  _id: string;
  invoice: Invoice;
  paid_amount: number;
  discount_amount: number;
  createdAt: string;
  customer: Customer;
};

type ApiResponse = {
  message: string;
  data: Transaction[];
  status: number;
};

type TransactionData = {
  invoice: string;
  paid_amount: number;
  discount_amount: number;
};

interface BillingDescription {
  name: string;
  qty: string;
  rate: string;
  amount: string;
}

interface InvoiceCustomer {
  customer_mobile_no: string;
  customer_name: string;
  customer_vehicle_km: string;
  customer_vehicle_name: string;
  customer_vehicle_number: string;
}

interface InvoiceType {
  _id: string;
  added_by: string;
  billing_description: BillingDescription[][];
  createdAt: string;
  customer: InvoiceCustomer;
  invoice_id: string;
  payment_status: boolean;
  pending_amount: string;
  total_amount: string;
}

const ReportScreen = (): React.JSX.Element => {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [contact, setContact] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoicesData, setInvoicesData] = useState<InvoiceType[]>([]);
  const [bill, setBill] = useState("0");
  const [pay, setPay] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [createTransModalVisible, setCreateTransModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const token = useSelector((state: RootState) => state.user.token);
  const formatDateWithTimezone = (date: Date) => {
    const adjustedDate = new Date(date);
    adjustedDate.setMinutes(
      adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset()
    );
    return adjustedDate.toISOString().split("T")[0];
  };
  const fetchInvoice = async () => {
    const url = `${BASE_URL}invoice`;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (contact) params.append("contactno", `+91${contact}`);
      if (vehicleNo) params.append("vehicleno", vehicleNo);
      const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
      const response = await axios.get(fullUrl, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        setInvoicesData(response.data?.data);
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (fromDate && toDate) {
        const fromDateStr = formatDateWithTimezone(fromDate);
        const toDateStr = formatDateWithTimezone(toDate);
        console.log("toDateStr", toDateStr);
        console.log("fromDateStr", fromDateStr);
        params.append("from", fromDateStr);
        params.append("to", toDateStr);
      }
      console.log("params after append", Object.fromEntries(params.entries()));
      if (contact) params.append("mobileno", `+91${contact}`);
      if (vehicleNo) params.append("vehicleno", vehicleNo);
      console.log("final params", Object.fromEntries(params.entries()));
      const response = await axios.get<ApiResponse>(`${BASE_URL}transaction`, {
        params,
        headers: {
          Authorization: token,
        },
      });
      console.log("Transction API Response:::", response);
      if (response.status === 200) {
        setTransactions(response.data?.data ?? []);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error?.message ?? "Something went wrong!",
      });
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = () => {
    switch (selectedTab) {
      case "ALL":
        fetchInvoice();
        break;
      case "OUTSTANDING":
        fetchInvoice();
        break;
      case "PAID":
        fetchTransactions();
        break;
      default:
        fetchInvoice();
    }
  };
  useEffect(() => {
    // Fetch data based on selected tab whenever contact, vehicleNo, or selectedTab changes
    fetchData();
  }, [contact, vehicleNo, selectedTab, fromDate, toDate]);

  //Create Transaction
  const createTransaction = async (transactionData: TransactionData) => {
    setSubmitLoader(true);
    try {
      const response = await axios.post(
        `${BASE_URL}transaction`,
        transactionData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        setSubmitLoader(false);
        setBill("0");
        setPay("0");
        setDiscount("0");
        fetchData();
      }
      response.data;
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error?.message ?? "Something went wrong!, try again",
      });
      console.error("Error creating transaction:", JSON.stringify(error));
      throw error;
    } finally {
      setCreateTransModalVisible(false);
      setSubmitLoader(false);
      setBill("0");
      setPay("0");
      setDiscount("0");
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [contact, vehicleNo]);

  useEffect(() => {
    if (selectedTab === "PAID") {
      fetchTransactions();
    }
  }, [contact, vehicleNo, selectedDate, selectedTab]);

  const applyDateRange = async () => {
    setSelectedDate(fromDate);
    setShowDateModal(false);
    if (selectedTab === "PAID") {
      await fetchTransactions();
    } else if (selectedTab === "OUTSTANDING") {
      await fetchTransactions();
    } else {
      await fetchTransactions();
    }
  };

  const getData = () => {
    switch (selectedTab) {
      case "ALL":
        return invoicesData;
      case "OUTSTANDING":
        return invoicesData.filter((invoice) => invoice?.pending_amount > 0);
      case "PAID":
        return transactions;
      default:
        return invoicesData;
    }
  };

  const handleCreateTranModal = (item: any) => {
    if (parseFloat(item?.pending_amount) > 0) {
      setSelectedItem(item);
      setBill(item?.pending_amount);
      setCreateTransModalVisible(true);
      setPay("0");
      setDiscount("0");
      setCreateTransModalVisible(true);
    }
  };

  const closeCreateTranModal = () => {
    setCreateTransModalVisible(false);
    setBill("0");
    setPay("0");
    setDiscount("0");
  };

  const handleSubmitPress = () => {
    createTransaction({
      discount_amount: Number(discount),
      paid_amount: Number(pay),
      invoice: selectedItem?._id,
    });
  };
  const totalDue = invoicesData.reduce(
    (total, item) => total + item?.total_amount,
    0
  );
  const totalPaid = transactions.reduce(
    (total, item) => total + item?.paid_amount,
    0
  );
  const totalOutStanding = invoicesData.reduce(
    (total, item) => total + item?.pending_amount,
    0
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 6 }} bounces={false}>
        {/* Title */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 10,
          }}
        >
          <Text
            style={{ fontSize: 22, fontWeight: "bold", marginVertical: 10 }}
          >
            REPORT
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: StaticColors.primary,
              alignSelf: "flex-end",
              borderRadius: 8,
            }}
            onPress={() => setShowDateModal(true)}
          >
            <AppText
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              Date
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={{ marginHorizontal: 10 }}>
          <TextInput
            style={{
              backgroundColor: "#E0E0E0",
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
            }}
            placeholder="Enter Contact No."
            value={contact}
            onChangeText={setContact}
          />
          <TextInput
            style={{
              backgroundColor: "#E0E0E0",
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
            }}
            placeholder="Enter Vehicle No."
            value={vehicleNo}
            onChangeText={setVehicleNo}
          />
        </View>
        <View style={{ marginHorizontal: 2 }}>
          {/* Tab Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
              gap: 5,
            }}
          >
            {["ALL", "OUTSTANDING", "PAID"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: "#1E5BB8",
                  backgroundColor: selectedTab === tab ? "#1E5BB8" : "white",
                  alignItems: "center",
                  borderRadius: 5,
                  // marginHorizontal: 5,
                }}
              >
                <Text
                  style={{
                    color: selectedTab === tab ? "white" : "#1E5BB8",
                    fontWeight: "bold",
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {loading ? (
            <View style={{ flex: 1, height: "auto", width: "auto" }}>
              <ActivityIndicator size={"large"} color={StaticColors.primary} />
            </View>
          ) : (
            <>
              {/* List Items */}
              <FlatList
                data={getData()}
                keyExtractor={(item) => item?._id}
                extraData={selectedTab}
                renderItem={({ item, index }) => {
              
                  if (selectedTab === "ALL" || selectedTab === "OUTSTANDING") {
                    return (
                      <Pressable
                        onPress={() => handleCreateTranModal(item)}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          borderWidth: 1,
                          borderColor: "#1E5BB8",
                          borderRadius: 5,
                          marginBottom: 10,
                          padding: 12,
                        }}
                      >
                        <View>
                          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                          {index+1}. {item?.customer?.customer_name}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: 5,
                            }}
                          >
                            <Image
                              source={Images.phoneIcon}
                              style={{
                                width: 16,
                                height: 18,
                                tintColor: "#1E5BB8",
                              }}
                              resizeMode="contain"
                            />
                            <Text style={{ color: "#1E5BB8", marginLeft: 2 }}>
                              {item?.customer?.customer_mobile_no}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 16,color: "gray", marginTop: 5  }}>
                          {item?.customer?.customer_vehicle_name?.toUpperCase()}
                          </Text>
                          <Text style={{ color: "gray", marginTop: 5 }}>
                            {item?.invoice_id} |{" "}
                            {formatDateWithTimezone(item?.createdAt as any)}
                          </Text>
                        </View>
                        <View>
                          {selectedTab === "ALL" && (
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                marginTop: 5,
                              }}
                            >
                              Total Ammount: ₹ {item?.total_amount}
                            </Text>
                          )}
                         {item?.pending_amount > 0 && item?.total_amount !== item?.pending_amount && (
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                marginTop: 5,
                                color: "green",
                              }}
                            >
                              Paid: ₹ {item?.total_amount - item?.pending_amount}
                            </Text>
                          )}
                          {item?.pending_amount > 0 && (
                            <Text
                              style={{
                                fontSize: 14,
                                color: "red",
                                fontWeight: "bold",
                              }}
                            >
                              {selectedTab === "OUTSTANDING"
                                ? `₹ ${item?.pending_amount}`
                                : `OUTSTANDING: ₹ ${item?.pending_amount}`}
                            </Text>
                          )}
                        </View>
                      </Pressable>
                    );
                  } else {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          borderWidth: 1,
                          borderColor: "#1E5BB8",
                          borderRadius: 5,
                          marginBottom: 10,
                          padding: 12,
                        }}
                      >
                        <View>
                          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                            {item?.customer?.customer_name}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: 5,
                            }}
                          >
                            <Image
                              source={Images.phoneIcon}
                              style={{
                                width: 16,
                                height: 18,
                                tintColor: "#1E5BB8",
                              }}
                              resizeMode="contain"
                            />
                            <Text style={{ color: "#1E5BB8", marginLeft: 2 }}>
                              {item?.customer?.customer_mobile_no}
                            </Text>
                          </View>
                          <Text style={{ color: "gray", marginTop: 5 }}>
                            {item?.invoice?.invoice_id} |{" "}
                            {formatDateWithTimezone(item?.createdAt)}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "bold",
                              marginTop: 5,
                            }}
                          >
                            {`PAID: ₹ ${item?.paid_amount}`}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "bold",
                              marginTop: 5,
                            }}
                          >
                            {`DISCOUNT: ₹ ${item?.discount_amount}`}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                }}
                ListEmptyComponent={
                  <View
                    style={{
                      flex: 1,
                      minHeight: 200,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppText style={{ fontSize: 16, fontWeight: "800" }}>
                      No Data Available
                    </AppText>
                  </View>
                }
              />

              {/* Total Amount */}
              <View
                style={{
                  backgroundColor: "#E0E0E0",
                  padding: 10,
                  alignItems: "flex-end",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", color: "black",  }}
                >
                  ₹{" "}
                  {`${
                    selectedTab === "ALL"
                      ? totalDue
                      : selectedTab === "OUTSTANDING"
                      ? totalOutStanding
                      : totalPaid
                  }`}
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Date Range</Text>
            <View
              style={{
                height: 1,
                width: "90%",
                backgroundColor: "black",
                marginBottom: 10,
                alignSelf: "center",
              }}
            />

            {/* FROM Date Field */}
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.dateFieldLabel}>FROM:</Text>
              <TouchableOpacity
                onPress={() => setShowFromDatePicker(true)}
                style={styles.dateInput}
              >
                <Text>
                  {fromDate ? fromDate.toLocaleDateString() : "Select date"}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={showFromDatePicker}
                date={fromDate || new Date()}
                mode="date"
                onConfirm={(date) => {
                  setShowFromDatePicker(false);
                  setFromDate(date);
                }}
                onCancel={() => {
                  setShowFromDatePicker(false);
                }}
                maximumDate={toDate || new Date()}
              />
            </View>

            {/* TO Date Field */}
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.dateFieldLabel}>TO:</Text>
              <TouchableOpacity
                onPress={() => setShowToDatePicker(true)}
                style={styles.dateInput}
              >
                <Text>
                  {toDate ? toDate.toLocaleDateString() : "Select date"}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={showToDatePicker}
                date={toDate || new Date()} // Fallback to current date if null
                mode="date"
                onConfirm={(date) => {
                  setShowToDatePicker(false);
                  setToDate(date);
                }}
                onCancel={() => {
                  setShowToDatePicker(false);
                }}
                minimumDate={fromDate} // Can't select dates before fromDate
                maximumDate={new Date()} // Can't select future dates
              />
            </View>
            {/* Action Buttons */}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDateModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]}
                onPress={applyDateRange}
              >
                <Text style={[styles.modalButtonText, { color: "white" }]}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={createTransModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            {/* Bill */}
            <View style={styles.row}>
              <View style={styles.labelBox}>
                <Text style={styles.label}>Bill :</Text>
              </View>
              <TextInput
                style={styles.valueBox}
                placeholder="₹ 0"
                placeholderTextColor="#999"
                value={bill !== "0" ? `₹ ${bill}` : ""}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^\d]/g, "");
                  setBill(numericValue || "0");
                }}
                keyboardType="numeric"
              />
            </View>

            {/* Pay */}
            <View style={styles.row}>
              <View style={styles.labelBox}>
                <Text style={styles.label}>Pay :</Text>
              </View>
              <TextInput
                style={styles.valueBox}
                placeholder="₹ 0"
                placeholderTextColor="#999"
                value={pay !== "0" ? `₹ ${pay}` : ""}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^\d]/g, "");
                  setPay(numericValue || "0");
                }}
                keyboardType="numeric"
              />
            </View>

            {/* Discount */}
            <View style={styles.row}>
              <View style={styles.labelBox}>
                <Text style={styles.label}>Discount :</Text>
              </View>
              <TextInput
                style={styles.valueBox}
                placeholder="₹ 0"
                placeholderTextColor="#999"
                value={discount !== "0" ? `₹ ${discount}` : ""}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^\d]/g, "");
                  setDiscount(numericValue || "0");
                }}
                keyboardType="numeric"
              />
            </View>
            <CustomButton
              title="SUBMIT"
              type="Filled"
              size="md"
              onPress={handleSubmitPress}
              style={{ marginTop: 10 }}
              loading={submitLoader}
            />
            <Text onPress={closeCreateTranModal} style={styles.submitText}>
              Cancel
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ReportScreen;
