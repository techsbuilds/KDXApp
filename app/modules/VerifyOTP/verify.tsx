import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import OtpInputs from "react-native-otp-inputs";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CustomButton } from "../../components";
import { Screens } from "../../constants";
import { ApiService } from "../../api/apiService";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { userActions } from "../../redux";

const VerifyOtpScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const { mobile, address, companyName, email, gstNo, name } = route.params;
  console.log('route.params', route.params)
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter a 4-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      const response = await ApiService.verifyOtpForSignup(
        name,
        mobile,
        email,
        companyName,
        address,
        otpValue.toString(),
        gstNo
      );
      if (response?.status == 200) {
        Toast.show({
          type: "success",
          text1: "OTP Verified Successfully!",
        });
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
          text1: response.message || "Invalid OTP",
        });
      }
    } catch (error) {
      console.log("error", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>We've sent an OTP to {mobile}</Text>
      <OtpInputs
        handleChange={setOtpValue}
        numberOfInputs={4}
        style={styles.otpContainer}
        inputStyles={styles.otpInput}
      />
      <CustomButton
        title="Verify OTP"
        onPress={handleVerifyOtp}
        size="xl"
        type="Filled"
        style={{ marginTop: 20 }}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "gray", marginBottom: 20 },
  otpContainer: { flexDirection: "row", justifyContent: "center" },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    textAlign: "center",
    fontSize: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default VerifyOtpScreen;
