import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { userActions } from "../../redux";
import { CustomButton, CustomTextInput } from "../../components";
import { Screens } from "../../constants";
import styles from "./LoginScreenStyle";
import { useFormik } from "formik";
import * as Yup from "yup";
import CountryPicker from "react-native-country-picker-modal";
import OtpInputs from "react-native-otp-inputs";
import { ApiService } from "../../api/apiService";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }: any) => {
  const [mobile, setMobile] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countryCode, setCountryCode] = useState<string>("IN");
  const [callingCode, setCallingCode] = useState<string>("+91");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState(""); // Add state to track OTP

  const otpRef = useRef(null);

  const dispatch = useDispatch();

  const LoginValidationSchema = Yup.object().shape({
    mobileNumber: Yup.string()
      .matches(/^[0-9]+$/, "Only numbers are allowed")
      .min(10, "Must be at least 10 digits")
      .max(15, "Cannot exceed 15 digits")
      .required("Mobile Number is required"),
  });

  const { handleChange, setFieldTouched, touched, errors, handleSubmit, values } =
    useFormik({
      initialValues: {
        mobileNumber: "",
      },
      validationSchema: LoginValidationSchema,
      onSubmit: (values) => sendOtp(values),
    });

  const sendOtp = async (value: any) => {
    if (value.mobileNumber.length === 10) {
      setIsLoading(true)
      const fullMobileNumber = `${callingCode}${value.mobileNumber}`;
      try {
        setIsOtpSent(true);
        const response = await ApiService.sendOtpForLogin(fullMobileNumber);
        console.log('response', response)
        setMobile(fullMobileNumber)
        Toast.show({
          type: "success",
          text1: "OTP Sent Successfully!",
        });
      } catch (error : any) {
        Toast.show({
          type: "error",
          text1: error?.message,
        });
      }finally{
        setIsLoading(false)
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Enter a valid mobile number",
      });
    }
  };
  
  const verifyOtp = async () => {
    if (otp.length !== 4) {
      Toast.show({
        type: "error",
        text1: "Please enter a 4-digit OTP.",
      });
      return
    }
    try {
      setIsLoading(true);
      console.log('otp', otp)
      const response = await ApiService.verifyOtpForLogin(
        mobile,
        otp.toString(),
      );
      console.log('response', response)
      if (response?.status == 200) {
        Toast.show({
          type: "success",
          text1: "OTP Verified Successfully!",
        });
        console.log('response?.data?.token?.toString()', response?.data?.token?.toString())
       await AsyncStorage.setItem("TOKEN" ,response?.data?.token?.toString())

        dispatch(userActions.login(response?.data?.token));     
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{name: "Main"}],
          });
        }, 500);
        } else {
        Toast.show({
          type: "error",
          text1: response?.message || "Invalid OTP",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
   
  };


  return (
    <View style={styles.container}>
      <View style={{ marginTop: "12%" }}>
        <Text style={styles.loginText}>Login</Text>
        <Text style={styles.title}>Welcome back! Glad to see you, Again!</Text>

        {/* Mobile Number Input */}
        <CustomTextInput
          placeholder="Mobile Number"
          onChangeText={handleChange("mobileNumber")}
          onBlur={() => setFieldTouched("mobileNumber")}
          keyboardType="numeric"
          returnKeyType="next"
          error={errors.mobileNumber ?? ""}
          touched={!!touched.mobileNumber}
          editable={!isOtpSent}
          value={values.mobileNumber}
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

        {/* OTP Input */}
        {isOtpSent && (
          <OtpInputs
            ref={otpRef}
            handleChange={(code) => setOtp(code)}
            numberOfInputs={4}
            style={styles.otpContainer}
            inputStyles={styles.otpInput}
          />
        )}

        {/* Send OTP or Verify OTP Button */}
        {!isOtpSent ? (
          <CustomButton
            title="Send OTP"
            onPress={handleSubmit}
            size="xl"
            type="Filled"
            loading={isLoading}
            style={{ alignSelf: "center", marginTop: 20 }}
          />
        ) : (
          <CustomButton
            title="Verify OTP"
            onPress={verifyOtp}
            size="xl"
            type="Filled"
            loading={isLoading}
            style={{ alignSelf: "center", marginTop: 20 }}
          />
        )}
      </View>

      {/* Signup Link */}
      <Text style={styles.link}>
        Don't have an account?
        <Text
          style={{ color: "blue" }}
          onPress={() => navigation.navigate(Screens.Register)}
        >
          &nbsp;Sign up
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;
