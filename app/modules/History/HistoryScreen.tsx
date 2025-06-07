import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./HistoryScreenStyle";
import { AppText, CustomTextInput } from "../../components";
import { Images } from "../../assets";
import { StaticColors } from "../../themes";
import { Font_MontserratSemiBold } from "../../assets/fonts";
import { BASE_URL } from "../../api/apiCall";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import axios from "axios";
import Toast from "react-native-toast-message";
import { formatDate, Screens } from "../../constants";
import { ParamListBase, useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface BillingDescription {
  name: string;
  qty: string;
  rate: string;
  amount: string;
}

interface Customer {
  customer_mobile_no: string;
  customer_name: string;
  customer_vehicle_km: string;
  customer_vehicle_name: string;
  customer_vehicle_number: string;
}

interface Invoice {
  _id: string;
  added_by: string;
  billing_description: BillingDescription[][];
  createdAt: string;
  customer: Customer;
  invoice_id: string;
  payment_status: boolean;
  pending_amount: string;
  total_amount: string;
}

const HistoryScreen = (): React.JSX.Element => {
  const [contact, setContact] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [invoicesData, setInvoicesData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.user.token);
  const isFocus = useIsFocused();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

  const fetchInvoice = async () => {
    const url = `${BASE_URL}invoice`;
    setIsLoading(true);
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
        text1: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [isFocus]);

  useEffect(() => {
    if (contact.length >= 3 || vehicleNo.length >= 3) {
      fetchInvoice();
    } else if (contact.length === 0 && vehicleNo.length === 0) {
      console.log('calll>>>>>>>')
      fetchInvoice();
    }
  }, [contact, vehicleNo]);

  const onHistoryItemPress = (item : any) => {
    navigation.navigate(Screens.InvoiceDetail , item)
  }
  return (
    <SafeAreaView style={styles.rootContainerStyle}>
      <ScrollView
        style={styles.subContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={[styles.headingText, { marginHorizontal: 18 }]}>
          HISTORY
        </AppText>

        <View style={{ marginHorizontal: 18 }}>
          <CustomTextInput
            placeholder="Enter Contact No."
            value={contact}
            onChangeText={setContact}
          />
          <CustomTextInput
            placeholder="Enter Vehicle No."
            value={vehicleNo}
            onChangeText={setVehicleNo}
          />
        </View>
        <FlatList
          data={invoicesData}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderWidth: 1,
                  borderColor: "#1E5BB8",
                  borderRadius: 5,
                  marginBottom: 10,
                  padding: 12,
                  marginHorizontal: 18,
                }}
                onPress={() => onHistoryItemPress(item)}
              >
                <View style={{ alignItems: "flex-start" }}>
                  <AppText
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      fontFamily: Font_MontserratSemiBold,
                    }}
                  >
                  {index+1}. {item?.customer?.customer_name}
                  </AppText>
                  <View style={[styles.alignHorizontalCon]}>
                    <Image 
                      source={Images.phoneIcon}
                      style={styles.phoneIconStyle}
                    resizeMode="contain"
                    />
                    <Text style={styles.labelStyle}>
                      &nbsp;{item?.customer?.customer_mobile_no}
                    </Text>
                  </View>
                  <AppText style={{  fontSize: 16,color: "gray", marginTop: 5  }}>
                    {item?.customer?.customer_vehicle_name?.toUpperCase()}
                  </AppText>
                  <Text
                    style={{color: "gray", marginTop: 3, letterSpacing: 0.3 }}
                  >
                    {item?.invoice_id}&nbsp;|&nbsp;{formatDate(item?.createdAt)}
                  </Text>
                </View>
                <AppText style={{fontSize: 16,
                  fontWeight: "bold",}}>₹{item?.total_amount}</AppText>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            isLoading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <ActivityIndicator size={"large"} />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 100,
                }}
              >
                <AppText
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  No Data Found
                </AppText>
                <AppText
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    fontWeight: "500",
                  }}
                >
                  Search using contact no or vehicle no
                </AppText>
              </View>
            )
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
