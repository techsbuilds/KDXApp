import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import useInvoiceDetaileScreen from "./useInvoiceDetaileScreen";
import { AppText, CustomButton } from "../../components";
import styles from "./InvoiceDetailScreenStyles";
import { StaticColors } from "../../themes";
import { Images } from "../../assets";
import { getformattedData } from "../../constants";

const InvoiceDetailScreen = (Props: any): React.JSX.Element => {
  const data = Props.route.params;
  const { isLoading, invoice, generatePDF, downloadPDF } =
    useInvoiceDetaileScreen(data);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"} color={StaticColors.primary} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.rootContainerStyle}>
      <ScrollView contentContainerStyle={styles.subContainer}>
        <View style={[styles.horizontalContainer, { marginTop: 18 }]}>
          <View style={{ width: "35%" }}>
            <AppText style={styles.heading}>INVOICE</AppText>
          </View>
          <View style={{ alignItems: "flex-end", width: "65%" }}>
            <AppText style={styles.heading}>
              {invoice?.added_by?.company}
            </AppText>
            <AppText style={styles.labelStyle}>
              {invoice?.added_by?.address}
            </AppText>
            <AppText style={styles.labelStyle}>
              {invoice?.added_by?.mobileno}
            </AppText>
            <View style={styles.alignHorizontalCon}>
              <AppText style={styles.heading}>INVOICE NO:</AppText>
              <AppText style={styles.labelStyle}>
                &nbsp;{invoice?.invoice_id}
              </AppText>
            </View>
            <View style={styles.alignHorizontalCon}>
              <AppText style={styles.heading}>DATE:</AppText>
              <AppText style={styles.labelStyle}>
                &nbsp;{getformattedData(invoice?.createdAt)}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.horizontalLine} />
        {/* Bill TO Section */}
        <View style={[styles.horizontalContainer, { marginTop: 18 }]}>
          <View style={{ width: "35%" }}>
            <AppText style={styles.labelStyle}>BILL TO</AppText>
            <AppText style={[styles.heading, styles.mt13Label]}>
              {invoice?.customer?.customer_name}
            </AppText>
            <View style={[styles.alignHorizontalCon, styles.mt13Label]}>
              <Image
                source={Images.phoneIcon}
                style={styles.phoneIconStyle}
                resizeMode="contain"
              />
              <AppText style={styles.labelStyle}>
                &nbsp;{invoice?.customer?.customer_mobile_no}
              </AppText>
            </View>
          </View>
          <View style={{ alignItems: "flex-end", width: "65%" }}>
            <AppText style={styles.labelStyle}>
              {" "}
              {invoice?.customer?.customer_vehicle_number}
            </AppText>
            <AppText style={[styles.labelStyle, styles.mt13Label]}>
              {invoice?.customer?.customer_vehicle_name}
            </AppText>
            <View style={[styles.alignHorizontalCon, styles.mt13Label]}>
              <AppText style={styles.heading}>KM :</AppText>
              <AppText style={styles.labelStyle}>
                &nbsp;&nbsp;{invoice?.customer?.customer_vehicle_km}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.listHeader}>
          <AppText
            style={[styles.listHeading, { width: "50%", textAlign: "left" }]}
          >
            DISCRIPTION
          </AppText>
          <AppText style={[styles.listHeading, { width: "12%" }]}>QTY</AppText>
          <AppText style={[styles.listHeading, { width: "13%" }]}>RATE</AppText>
          <AppText style={[styles.listHeading, { width: "25%" }]}>
            AMOUNT
          </AppText>
        </View>

        {/* Items List Display */}
        {invoice?.billing_description?.length > 0 && (
          <View>
            {invoice?.billing_description?.map((item, index) => (
              <Pressable key={index.toString()} style={styles.itemRow}>
                <AppText
                  style={[styles.listItem, { width: "50%", textAlign: "left" }]}
                >
                  {item.name}
                </AppText>
                <AppText style={[styles.listItem, { width: "12%" }]}>
                  {item.qty}
                </AppText>
                <AppText style={[styles.listItem, { width: "13%" }]}>
                  {item.rate}
                </AppText>
                <AppText style={[styles.listItem, { width: "25%" }]}>
                  {item.amount}
                </AppText>
              </Pressable>
            ))}
          </View>
        )}
        <View style={styles.totalDueContainer}>
          <AppText style={styles.totalDueText}>
            Total Amount :{" "}
            <AppText style={{ color: StaticColors.red }}>
              {invoice?.total_amount}
            </AppText>
          </AppText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            marginVertical: 20,
            marginTop: 50,
          }}
        >
          <CustomButton
            title="PRINT"
            size="md"
            type="Filled"
            style={{ marginHorizontal: 10, marginTop: 30 }}
            onPress={downloadPDF}
          />
          <CustomButton
            title="SEND"
            size="md"
            type="Filled"
            style={{ marginHorizontal: 10, marginTop: 30 }}
            onPress={generatePDF}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvoiceDetailScreen;
