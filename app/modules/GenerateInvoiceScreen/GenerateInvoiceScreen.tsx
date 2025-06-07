import {
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import React from "react";
import styles from "./GenerateInvoiceScreenStyles";
import { AppText, CustomButton, CustomTextInput } from "../../components";
import { Images } from "../../assets";
import useGenerateInvoiceScreen from "./useGenerateInvoiceScreen";
import { StaticColors, width } from "../../themes";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

const GenerateInvoiceScreen = (Props: any): React.JSX.Element => {
  const data = Props?.route?.params?.data;
  const {
    errors,
    handleChange,
    handleSubmit,
    modalVisible,
    qtyRef,
    rateRef,
    setFieldTouched,
    touched,
    values,
    handleModalVisibility,
    itemsList,
    totalDue,
    handleButtonVisibility,
    buttonVisible,
    generatePDF,
    invoiceNumber,
    formatDate,
    totalAmount,
    loading,
    editingIndex,
    handleEditItem,
    handleUpdateItem,
    handleDeleteItem,
    downloadPDF
  } = useGenerateInvoiceScreen(data);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  return (
    <SafeAreaView style={styles.rootContainerStyle}>
      <ScrollView contentContainerStyle={styles.subContainer}>
        <View style={[styles.horizontalContainer, { marginTop: 18 }]}>
          <View style={{ width: "35%" }}>
            <AppText style={styles.heading}>INVOICE</AppText>
          </View>
          <View style={{ alignItems: "flex-end", width: "65%" }}>
            <AppText style={styles.heading}>{currentUser?.company}</AppText>
            <AppText style={styles.labelStyle}>
              {currentUser?.address}
            </AppText>
            <AppText style={styles.labelStyle}>{currentUser?.mobileno}</AppText>
            <View style={styles.alignHorizontalCon}>
              <AppText style={styles.heading}>INVOICE NO:</AppText>
              <AppText style={styles.labelStyle}>&nbsp;{invoiceNumber}</AppText>
            </View>
            <View style={styles.alignHorizontalCon}>
              <AppText style={styles.heading}>DATE:</AppText>
              <AppText style={styles.labelStyle}>&nbsp;{formatDate()}</AppText>
            </View>
          </View>
        </View>
        <View style={styles.horizontalLine} />
        {/* Bill TO Section */}
        <View style={[styles.horizontalContainer, { marginTop: 18 }]}>
          <View style={{ width: "35%" }}>
            <AppText style={styles.labelStyle}>BILL TO</AppText>
            <AppText style={[styles.heading, styles.mt13Label]}>
              {data?.customerName}
            </AppText>
            <View style={[styles.alignHorizontalCon, styles.mt13Label]}>
              <Image
                source={Images.phoneIcon}
                style={styles.phoneIconStyle}
                resizeMode="contain"
              />
              <AppText style={styles.labelStyle}>
                &nbsp;{data?.mobileNumber}
              </AppText>
            </View>
          </View>
          <View style={{ alignItems: "flex-end", width: "65%" }}>
            <AppText style={styles.labelStyle}>{data?.vehicleNumber}</AppText>
            <AppText style={[styles.labelStyle, styles.mt13Label]}>
              {data?.vehicleName}
            </AppText>
            <View style={[styles.alignHorizontalCon, styles.mt13Label]}>
              <AppText style={styles.heading}>KM :</AppText>
              <AppText style={styles.labelStyle}>
                &nbsp;&nbsp;{data?.km}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.listHeader}>
          <AppText
            style={[styles.listHeading, { width: "45%", textAlign: "left" }]}
          >
            DISCRIPTION
          </AppText>
          <AppText style={[styles.listHeading, { width: "12%" }]}>QTY</AppText>
          <AppText style={[styles.listHeading, { width: "12%" }]}>RATE</AppText>
          <AppText style={[styles.listHeading, { width: "25%" }]}>
            AMOUNT
          </AppText>
        </View>

        {/* Items List Display */}
        {itemsList.length > 0 && (
  <View>
    {itemsList.map((item, index) => (
      <Pressable
        key={index.toString()}
        style={styles.itemRow}
        onPress={() => handleEditItem(index)}
      >
        <AppText style={[styles.listItem, { width: "45%", textAlign: "left" }]}>
          {item.name}
        </AppText>
        <AppText style={[styles.listItem, { width: "12%" }]}>
          {item.qty}
        </AppText>
        <AppText style={[styles.listItem, { width: "12%" }]}>
          {item.rate}
        </AppText>
        <AppText style={[styles.listItem, { width: "25%" }]}>
          {item.amount}
        </AppText>
       {!buttonVisible && <TouchableOpacity 
          onPress={() => handleDeleteItem(index)}
          hitSlop={30}
          style={{ width: '6%', justifyContent: 'center', alignItems: 'center', }}
        >
          <Image 
            source={Images.closeIcon}
            style={{ width: 16, height: 16, tintColor: StaticColors.red }}
          />
        </TouchableOpacity>}
      </Pressable>
    ))}
  </View>
)}
       {!buttonVisible && <TouchableOpacity
          style={styles.addNoteContainer}
          activeOpacity={0.7}
          onPress={handleModalVisibility}
        >
          <Image source={Images.plusIcon} style={styles.plusIconStyle} />
        </TouchableOpacity>}
        <View style={styles.totalDueContainer}>
          <AppText style={styles.totalDueText}>
            Total Due :{" "}
            <AppText style={{ color: StaticColors.red }}>{totalDue}</AppText>
          </AppText>
        </View>

        {buttonVisible ? (
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginVertical: 20,
              marginTop:50
            }}
          >
            <CustomButton
              title="PRINT"
              size="md"
              type="Filled"
              style={{ marginHorizontal: 10 }}
              onPress={downloadPDF}
            />
            <CustomButton
              title="SEND"
              size="md"
              type="Filled"
              style={{ marginHorizontal: 10 }}
              onPress={generatePDF}
            />
          </View>
        ) : (
          <CustomButton
            title="SUBMIT"
            size="md"
            type="Filled"
            style={{ marginVertical: 20 }}
            onPress={handleButtonVisibility}
            loading={loading}
          />
        )}

        <Modal transparent visible={modalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <AppText style={styles.modalTitle}>
                {editingIndex !== null ? "Edit Item" : "Add Item"}
              </AppText>

              {/* Description Field */}

              <AppText
                style={[styles.modalHeading, { alignSelf: "flex-start" }]}
              >
                Description
              </AppText>
              <CustomTextInput
                placeholder="Enter Description"
                onChangeText={handleChange("description")}
                onBlur={() => setFieldTouched("description")}
                error={errors.description}
                touched={!!touched.description}
                returnKeyType="next"
                onSubmitEditing={() => qtyRef.current?.focus()}
                value={values.description}
                defaultValue={values.description}
                customInputStyle={{maxHeight: 60}}
              />
              <View
                style={{
                  marginTop: errors.description ? 15 : 0,
                  flexDirection: "row",
                  maxWidth: width,
                  width: width * 0.8,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* QTY Field */}
                <View>
                  <AppText style={styles.modalHeading}>QTY</AppText>
                  <CustomTextInput
                    ref={qtyRef}
                    placeholder="Enter Quantity"
                    keyboardType="numeric"
                    onChangeText={handleChange("qty")}
                    onBlur={() => setFieldTouched("qty")}
                    error={errors.qty}
                    touched={!!touched.qty}
                    returnKeyType="next"
                    onSubmitEditing={() => rateRef.current?.focus()}
                    customInputStyle={{ width: width * 0.4 - 10 ,maxHeight: 60 }}
                    value={values.qty} 
                    defaultValue={values.qty}

                  />
                </View>

                {/* Rate Field */}
                <View>
                  <AppText style={styles.modalHeading}>Rate</AppText>
                  <CustomTextInput
                    ref={rateRef}
                    placeholder="Enter Rate"
                    keyboardType="numeric"
                    onChangeText={handleChange("rate")}
                    onBlur={() => setFieldTouched("rate")}
                    error={errors.rate}
                    touched={!!touched.rate}
                    returnKeyType="done"
                    customInputStyle={{ width: width * 0.4 - 10 ,maxHeight: 60 }}
                    value={values.rate} 
                    defaultValue={values.rate}
                  />
                </View>
              </View>
              {/* Rate Field */}
              <AppText style={[styles.modalHeading, { alignSelf: "left", marginTop: errors.qty || errors.rate ? 15 : 0,
 }]}>
                Amount
              </AppText>
              <CustomTextInput
                placeholder="Amount"
                keyboardType="numeric"
                defaultValue={totalAmount.toString()}
                editable={false}
              />
              {/* Add Button */}
              <CustomButton
                title={editingIndex !== null ? "Update" : "Add"}
                type="Filled"
                size="md"
                onPress={handleSubmit}
              />

              {/* Close Button */}
              <TouchableOpacity onPress={handleModalVisibility}>
                <AppText style={styles.closeModalBtnStyle}>Close</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GenerateInvoiceScreen;
