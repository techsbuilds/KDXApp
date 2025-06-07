import { TextInput } from "react-native";
import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { Screens } from "../../constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

const useInvoiceScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [countryCode, setCountryCode] = useState<string>("IN"); // Default: India
  const [callingCode, setCallingCode] = useState<string>("+91");
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const vehicleNumberRegex = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/;
  const InvoiceValidationSchema = Yup.object().shape({
    customerName: Yup.string().required("Customer Name is required"),
    mobileNumber: Yup.string()
      .matches(/^[0-9]+$/, "Only numbers are allowed")
      .min(10, "Must be at least 10 digits")
      .max(15, "Cannot exceed 15 digits")
      .required("Mobile Number is required"),
      vehicleNumber: Yup.string()
      .matches(vehicleNumberRegex, "Enter a valid vehicle number (e.g., DL 2 AA 1234)")
      .required("Vehicle Number is required"),
    vehicleName: Yup.string().required("Vehicle Name is required"),
    km: Yup.string().matches(/^[0-9]+$/, "Only numbers are allowed").required("KM is required"),
  });

  const customerNameRef = useRef<TextInput>(null);
  const mobileNumberRef = useRef<TextInput>(null);
  const vehicleNumberRef = useRef<TextInput>(null);
  const vehicleNameRef = useRef<TextInput>(null);
  const kmRef = useRef<TextInput>(null);

  const { handleChange, setFieldTouched, touched, errors, handleSubmit , setFieldValue , values} =
  useFormik({
    initialValues: {
      customerName: "",
      mobileNumber: "",
      vehicleNumber: "",
      vehicleName: "",
      km: "",
    },
    validationSchema: InvoiceValidationSchema,
    onSubmit: (values) => navigation.navigate(Screens.GenerateInvoice, {data:values}),
  });

  const formatVehicleNumber = (input: string) => {
    let cleaned = input.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    let formatted = '';
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
      formatted += ' ' + cleaned.substring(2, 4);
    }
    if (cleaned.length > 4) {
      formatted += ' ' + cleaned.substring(4, 6);
    }
    if (cleaned.length > 6) {
      formatted += ' ' + cleaned.substring(6, 10); 
    }
    
    return formatted;
  };

  const handleVehicleNumberChange = (text: string) => {
    const formatted = formatVehicleNumber(text);
    setFieldValue('vehicleNumber', formatted);
  };

  return {
    customerNameRef,
    mobileNumberRef,
    vehicleNameRef,
    vehicleNumberRef,
    kmRef,
    InvoiceValidationSchema,
    handleChange,
    setFieldTouched,
    touched,
    errors,
    handleSubmit,
    countryCode, setCountryCode,
    callingCode, setCallingCode,
    vehicleNumberRegex,
    currentUser,
    handleVehicleNumberChange,
    formatVehicleNumber,
    values,
  };
};

export default useInvoiceScreen;
