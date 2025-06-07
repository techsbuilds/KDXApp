import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Font_MontserratBold } from "../../assets/fonts";
import { StaticColors } from "../../themes";
import { Screens } from "../../constants";
import { CustomButton, CustomTextInput } from "../../components";
import CountryPicker from "react-native-country-picker-modal";
import { ApiService } from "../../api/apiService";
import Toast from "react-native-toast-message";
import axios from "axios";

const SignupScreen = ({ navigation }: any) => {
  const [countryCode, setCountryCode] = useState<string>("IN");
  const [callingCode, setCallingCode] = useState<string>("+91");
  const [isLoading, setIsLoading] = useState(false);

  const signupSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid mobile number")
      .required("Mobile number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    companyName: Yup.string().required("Company name is required"),
    gstNo: Yup.string().optional(),
    address: Yup.string().min(5).required("Address is required"),
  });
    

  const onSignupPress = async (value: any) => {
    if (value.mobile.length === 10) {
      const fullMobileNumber = `${callingCode}${value.mobile}`;
      try {
        setIsLoading(true);
        const response = await ApiService.sendOtpForSignup(
          fullMobileNumber,
          value.email
        );
        Toast.show({
          type: "success",
          text1: "OTP Sent Successfully!",
        });
        navigation.navigate(Screens.Verify, {
          otp: response.data?.otp,
          mobile: `${callingCode}${value.mobile}`,
          address: value.address,
          companyName: value.companyName,
          email: value.email,
          gstNo: value.gstNo,
          name: value.name,
        });
      } catch (error: any) {
        console.log("onSignupPress error", error);
        Toast.show({
          type: "error",
          text1: error?.message,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Enter a valid mobile number",
      });
    }
    // dispatch(userActions.setCurrentUser(values));
    // alert("Signup Successful!");
    // navigation.navigate("Login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <View style={{ marginTop: "5%" }}>
        <Text style={styles.signUpText}>Sign Up</Text>
        <Text style={styles.title}>Hello! Register to get started</Text>
        <Formik
          initialValues={{
            name: "",
            mobile: "",
            email: "",
            companyName: "",
            gstNo: "",
            address: "",
          }}
          validationSchema={signupSchema}
          onSubmit={(values) => onSignupPress(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <CustomTextInput
                placeholder="Full Name"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
              />
              {touched.name && errors.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}

              <CustomTextInput
                placeholder="Mobile Number"
                onChangeText={handleChange("mobile")}
                onBlur={handleBlur("mobile")}
                keyboardType="phone-pad"
                returnKeyType="next"
                error={errors.mobile ?? ""}
                touched={!!touched.mobile}
                leftComponent={
                  <TouchableOpacity>
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
                  </TouchableOpacity>
                }
              />

              <CustomTextInput
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              <CustomTextInput
                placeholder="Company Name"
                onChangeText={handleChange("companyName")}
                onBlur={handleBlur("companyName")}
                value={values.companyName}
              />
              {touched.companyName && errors.companyName && (
                <Text style={styles.error}>{errors.companyName}</Text>
              )}

              <CustomTextInput
                placeholder="GST No (Optional)"
                onChangeText={handleChange("gstNo")}
                onBlur={handleBlur("gstNo")}
                value={values.gstNo}
              />

              <CustomTextInput
                placeholder="Address"
                multiline
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                value={values.address}
              />
              {touched.address && errors.address && (
                <Text style={styles.error}>{errors.address}</Text>
              )}

              <CustomButton
                title="Sign Up"
                onPress={handleSubmit}
                size="xl"
                type="Filled"
                loading={isLoading}
                style={{ alignSelf: "center", marginTop: 20 }}
              />
            </>
          )}
        </Formik>
        <Text style={styles.link}>
          Already have an account?
          <Text
            style={{ color: "blue" }}
            onPress={() => navigation.navigate(Screens.Login)}
          >
            &nbsp;Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: {
    fontSize: 26,
    fontFamily: Font_MontserratBold,
    textAlign: "left",
    marginBottom: 20,
    width: "90%",
    alignSelf: "flex-start",
    color: StaticColors.lightGrey,
  },
  error: { color: "red", fontSize: 12, marginBottom: 5 },
  link: { color: "black", textAlign: "center", marginTop: 20, fontSize: 17 },
  signUpText: {
    fontSize: 26,
    fontFamily: Font_MontserratBold,
    marginBottom: 20,
    color: StaticColors.lightGrey,
  },
});

export default SignupScreen;
