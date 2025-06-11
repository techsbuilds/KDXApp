import { Alert, Linking, PermissionsAndroid, Platform, TextInput } from "react-native";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import { BASE_URL } from "../../api/apiCall";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import Toast from "react-native-toast-message";
import RNFS from 'react-native-fs';

type ItemType = {
  name: string;
  qty: number;
  rate: number;
  amount: number;
};

const useGenerateInvoiceScreen = (data: any) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [itemsList, setItemsList] = useState<ItemType[]>([]);
  const [buttonVisible, setButtonVisible] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const qtyRef = useRef<TextInput>(null);
  const rateRef = useRef<TextInput>(null);
  const token = useSelector((state: RootState) => state.user.token);
  console.log('token', token)
  const totalDue = itemsList.reduce((total, item) => total + item.amount, 0);
  const currentUser = useSelector((state: RootState) => state.user.currentUser) 
  const generateInvoiceNumber = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `INV${randomDigits}`;
  };

  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber());
  }, []);

  const formatDate = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const validationSchema = Yup.object().shape({
    description: Yup.string().required("Description is required"),
    qty: Yup.number()
      .typeError("QTY must be a number")
      .positive("QTY must be greater than 0")
      .integer("QTY must be a whole number")
      .required("QTY is required"),
    rate: Yup.number()
      .typeError("Rate must be a number")
      .positive("Rate must be greater than 0")
      .required("Rate is required"),
  });

  const onSubmit = (values: any) => {
    if (editingIndex !== null) {
      handleUpdateItem();
    } else {
      const newItem = {
        name: values.description,
        qty: Number(values.qty),
        rate: Number(values.rate),
        amount: Number(values.qty) * Number(values.rate),
      };
      setItemsList([...itemsList, newItem]);
      setModalVisible(false);
      resetForm();
    }
  };

  const {
    handleChange,
    setFieldTouched,
    touched,
    errors,
    values,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      description: "",
      qty: "",
      rate: "",
    },
    validationSchema,
    onSubmit: onSubmit,
  });

  const handleEditItem = (index: number) => {
    const item = itemsList[index];
    setEditingIndex(index);
    setFieldValue('description', item.name);
    setFieldValue('qty', item.qty.toString());
    setFieldValue('rate', item.rate.toString());
    setModalVisible(true);
  };

  const handleUpdateItem = () => {
    if (editingIndex !== null) {
      const updatedItems = [...itemsList];
      updatedItems[editingIndex] = {
        name: values.description,
        qty: Number(values.qty),
        rate: Number(values.rate),
        amount: Number(values.qty) * Number(values.rate),
      };
      setItemsList(updatedItems);
      setEditingIndex(null);
      resetForm();
      setModalVisible(false);
    }
  };

  useEffect(() => {
    const calculatedAmount = Number(values.qty || 0) * Number(values.rate || 0);
    setTotalAmount(calculatedAmount);
  }, [values.qty, values.rate]);

  const handleModalVisibility = () => {
    if (modalVisible && editingIndex !== null) {
      setEditingIndex(null);
      resetForm();
    }
    setModalVisible(!modalVisible);
  };
  const handleButtonVisibility = async () => {
    await sendInvoiceData();
  };

const htmlCon = `<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
      h1 { margin-bottom: 5px; }
      .subheading { color: #555555; font-size: 12px; margin-bottom: 2px; }
      .contact { color: #555555; font-size: 12px; }
      
      /* Wrap the entire invoice in a wider container */
      .invoice-container {
        width: 70%; /* Increased from 50% to 70% */
        margin: 0 auto;
      }
      
      .invoice-details, .invoice-header, .bill-to, table { 
        width: 100%;  /* Ensure all elements take up full width of .invoice-container */
      }
      
      .invoice-details { 
        margin-top: 20px; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        padding-top: 10px; 
        padding-bottom: 10px; 
      }

      .invoice-header, .bill-to { 
        text-align: left; 
        padding: 5px; 
        border-bottom: 1px solid #000; 
      }

      .bill-to { border-bottom: none; }

      table { 
        border-collapse: collapse; 
        margin-top: 20px; 
      }
      
      th, td { padding: 8px; text-align: left; border-bottom: 1px solid #000; }
      th { background-color: #f2f2f2; }
      .total { font-weight: bold; text-align: right; }
      .footer { text-align: center; margin-top: 20px; font-size: 12px; }
    </style>
  </head>
  <body>
    <h1>${currentUser?.company}</h1>
    <p class="subheading">${currentUser?.address}</p>
    <p class="contact">Contact: ${currentUser?.mobileno}</p>


    <div class="invoice-container">
      <div class="invoice-details">
        <div class="invoice-header">
          <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
          <p><strong>Invoice Date:</strong> ${formatDate()}</p>
        </div>
        <div class="invoice-header">
          <p><strong>Vehicle Info:</strong></p>
          <p>${data?.vehicleName}</p>
          <p>${data?.vehicleNumber}</p>
        </div>
        <div class="bill-to">
          <p><strong>Bill To:</strong> ${data?.customerName}</p>
          <p><strong>Mobile:</strong> ${data?.mobileNumber}</p>
        </div>
      </div>

      <table>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
        ${itemsList
          .map(
            (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.qty}</td>
              <td>${item.rate}</td>
              <td>${item.amount}</td>
            </tr>
          `
          )
          .join("")}
        <tr>
          <td colspan="3" style="text-align: right; font-weight: bold;">Bill Amount</td>
          <td style="font-weight: bold;">${totalDue}</td>
        </tr>
      </table>
    </div>

    <p class="footer">Thank You for Visit</p>
  </body>
</html>
`;

  const sendInvoiceData = async () => {
    if (itemsList.length === 0) {
      Toast.show({
        type: "info",
        text1: "Please Add Billing Items",
      });
      return
    }
    try {
      setLoading(true);
      const url = `${BASE_URL}invoice`;
      const requestData = {
        invoice_id: invoiceNumber,
        billing_description: itemsList,
        total_amount: totalDue?.toString(),
        customer_name: data?.customerName,
        customer_mobile_no: "+91" + data?.mobileNumber,
        customer_vehicle_number: data?.vehicleNumber,
        customer_vehicle_name: data?.vehicleName,
        customer_vehicle_km: data?.km,
      };
      try {
        const response = await axios.post(url, requestData, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          Toast.show({
            type: "success",
            text1: response?.data?.message,
          });
          setButtonVisible(true);
        }
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: error?.message,
        });
        console.error("Error:", error.response?.data || error.message);
      }
      // const response = ApiService.createInvoice(requestData.invoice_id, requestData.billing_description, requestData.total_amount, requestData.customer_name, "+91"+requestData.customer_mobile_no, requestData.customer_vehicle_number, requestData.customer_vehicle_name, requestData.customer_vehicle_km)
    } catch (error) {
      console.error("Error:", error.response);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    { /*  // let options = {
      //   html: htmlCon,
      //   fileName: `Invoice_${Date.now()}`,
      //   directory: "Documents",
      // };
      // let file = await RNHTMLtoPDF.convert(options);
      // const pdfFilePath = `file://${file?.filePath}`;
      // const option = {
      //   url: pdfFilePath,
      //   type: "application/pdf",
      // };
      // await Share.open(option);*/}
      const phoneNumber = data?.mobileNumber; // Change this to your target number
      const message = 'Hello there';
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      

      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            Alert.alert('Error', 'WhatsApp is not installed on your device');
          } else {
            return Linking.openURL(url);
          }
        })
        .catch((err) => Alert.alert('Error', err.message));
      Toast.show({
        type: "success",
        text1: "Invoice saved",
      });
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = [...itemsList];
    updatedItems.splice(index, 1);
    setItemsList(updatedItems);
  };

  const downloadPDF = async () => {
    try {
      if (Platform.OS === 'android') {

        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
  
        if (!hasPermission) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Needed',
              message: 'Your permission is required to save invoices to your device',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
  
          if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
              'Permission Required',
              'Storage permission is permanently denied. Please enable it in app settings.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings(),
                },
              ]
            );
            return;
          }
  
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Toast.show({
              type: 'error',
              text1: 'Permission denied',
              text2: 'Cannot save PDF without storage permission',
            });
            return;
          }
        }
      }
      const downloadPath = RNFS.DocumentDirectoryPath
  
      // Generate PDF options
      const options = {
        html: htmlCon,
        fileName: `Invoice_${invoiceNumber}_${formatDate().replace(/-/g, '')}`,
        directory: downloadPath,
      };
  
      const file = await RNHTMLtoPDF.convert(options);
      
      if (!file.filePath) {
        throw new Error('PDF generation failed');
      }
  
      Toast.show({
        type: 'success',
        text1: 'PDF downloaded successfully',
        text2: `Saved to: ${file.filePath}`,
      });
  
      return file.filePath;
  
    } catch (error) {
      console.error('PDF download error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to download PDF',
        text2: error?.message,
      });
      return null;
    }
  };
  return {
    modalVisible,
    handleChange,
    setFieldTouched,
    touched,
    errors,
    values,
    handleSubmit,
    qtyRef,
    rateRef,
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
    handleEditItem,
    handleUpdateItem,
    editingIndex,
    handleDeleteItem,
    downloadPDF
  };
};

export default useGenerateInvoiceScreen;
