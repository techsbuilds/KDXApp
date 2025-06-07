import React from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import { CustomButton } from "../../components";
import styles from "./InvoiceScreenStyle";
import { AppText, CustomTextInput } from "../../components";
import useInvoiceScreen from "./useInvoiceScreen";
import CountryPicker from "react-native-country-picker-modal";

const InvoiceScreen = (): React.JSX.Element => {
  const {
    handleSubmit,
    customerNameRef,
    kmRef,
    mobileNumberRef,
    vehicleNameRef,
    vehicleNumberRef,
    errors,
    handleChange,
    setFieldTouched,
    touched,
    countryCode,
    setCallingCode,
    setCountryCode,
    handleVehicleNumberChange,
    values,
  } = useInvoiceScreen();
  return (
    <SafeAreaView style={styles.rootContainerStyle}>
      <ScrollView
        style={styles.subContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={styles.headingText}>INVOICE</AppText>

        <CustomTextInput
          ref={customerNameRef}
          placeholder="Customer Name"
          onChangeText={handleChange("customerName")}
          onBlur={() => setFieldTouched("customerName")}
          returnKeyType="next"
          error={errors.customerName ?? ""}
          touched={!!touched.customerName}
          onSubmitEditing={() => mobileNumberRef.current?.focus()}
        />

        <CustomTextInput
          ref={mobileNumberRef}
          placeholder="Mobile Number"
          onChangeText={handleChange("mobileNumber")}
          onBlur={() => setFieldTouched("mobileNumber")}
          keyboardType="numeric"
          returnKeyType="next"
          error={errors.mobileNumber ?? ""}
          touched={!!touched.mobileNumber}
          onSubmitEditing={() => vehicleNumberRef.current?.focus()}
          leftComponent={
            <CountryPicker
              countryCode={countryCode}
              withFlag
              withCallingCode
              withCallingCodeButton
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
            />
          }
        />

        <View style={styles.emptySpace} />

        <CustomTextInput
          ref={vehicleNumberRef}
          placeholder="Vehicle Number"
          autoCapitalize="characters"
          onChangeText={handleVehicleNumberChange}
          value={values.vehicleNumber}
          onBlur={() => setFieldTouched("vehicleNumber")}
          returnKeyType="next"
          error={errors.vehicleNumber ?? ""}
          touched={!!touched.vehicleNumber}
          onSubmitEditing={() => vehicleNameRef.current?.focus()}
          maxLength={13}
          keyboardType="default"
        />

        <CustomTextInput
          ref={vehicleNameRef}
          placeholder="Vehicle Name"
          onChangeText={handleChange("vehicleName")}
          onBlur={() => setFieldTouched("vehicleName")}
          returnKeyType="next"
          error={errors.vehicleName ?? ""}
          touched={!!touched.vehicleName}
          onSubmitEditing={() => kmRef.current?.focus()}
        />

        <CustomTextInput
          ref={kmRef}
          placeholder="KM"
          onChangeText={handleChange("km")}
          onBlur={() => setFieldTouched("km")}
          keyboardType="numeric"
          returnKeyType="done"
          error={errors.km ?? ""}
          touched={!!touched.km}
          onSubmitEditing={handleSubmit}
        />

        <CustomButton
          title="Submit"
          type="Filled"
          size="md"
          style={styles.submitButtonStyle}
          onPress={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvoiceScreen;
