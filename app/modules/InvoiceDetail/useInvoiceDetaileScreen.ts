import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../api/apiCall";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import { getformattedData } from "../../constants";
import Toast from "react-native-toast-message";
import RNFS from "react-native-fs";

type ItemType = {
  name: string;
  qty: number;
  rate: number;
  amount: number;
};

// Type for API response
type ApiResponse = {
  __v: number;
  _id: string;
  added_by: {
    __v: number;
    _id: string;
    address: string;
    company: string;
    createdAt: string;
    email: string;
    gstno: string | null;
    mobileno: string;
    name: string;
    profile_picture: {
      fileName: string;
      filePath: string;
      fileSize: string;
      fileType: string;
    };
    status: boolean;
    updatedAt: string;
  };
  billing_description: {
    _id: string;
    amount: number;
    name: string;
    qty: number;
    rate: number;
  }[];
  createdAt: string;
  customer: {
    __v: number;
    _id: string;
    customer_mobile_no: string;
    customer_name: string;
    customer_vehicle_km: string;
    customer_vehicle_name: string;
    customer_vehicle_number: string;
  };
  invoice_id: string;
  payment_status: string;
  pending_amount: number;
  total_amount: number;
  updatedAt: string;
};

const useInvoiceDetaileScreen = (data: any) => {
  const token = useSelector((state: RootState) => state.user.token);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [invoice, setInvoice] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchInvoice = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<{ data: ApiResponse }>(
        `${BASE_URL}invoice/getone/${data._id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        setInvoice(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

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
    <h1>${invoice?.added_by?.company}</h1>
    <p class="subheading">${invoice?.added_by?.address}</p>
    <p class="contact">Contact: ${invoice?.added_by?.mobileno}</p>


    <div class="invoice-container">
      <div class="invoice-details">
        <div class="invoice-header">
          <p><strong>Invoice No:</strong> ${invoice?.invoice_id}</p>
          <p><strong>Invoice Date:</strong> ${getformattedData(
            invoice?.added_by.createdAt
          )}</p>
        </div>
        <div class="invoice-header">
          <p><strong>Vehicle Info:</strong></p>
          <p>${invoice?.customer.customer_vehicle_name}</p>
          <p>${invoice?.customer?.customer_vehicle_number}</p>
        </div>
        <div class="bill-to">
          <p><strong>Bill To:</strong> ${invoice?.customer.customer_name}</p>
          <p><strong>Mobile:</strong> ${
            invoice?.customer?.customer_mobile_no
          }</p>
        </div>
      </div>

      <table>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
        ${invoice?.billing_description
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
          <td colspan="3" class="total">Bill Amount</td>
          <td class="total">${invoice?.total_amount}</td>
        </tr>
      </table>
    </div>

    <p class="footer">Thank You for Visit</p>
  </body>
</html>
`;

  const generatePDF = async () => {
    try {
      let options = {
        html: htmlCon,
        fileName: `Invoice_${Date.now()}`,
        directory: "Documents",
      };
      let file = await RNHTMLtoPDF.convert(options);
      const pdfFilePath = `file://${file?.filePath}`;
      const option = {
        url: pdfFilePath,
        type: "application/pdf",
      };

      await Share.open(option);
      // const file = await RNHTMLtoPDF.convert(options);
      // await Share.open(option);
      Alert.alert("PDF Saved", `Invoice saved at: ${file.filePath}`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      Alert.alert("Error", "Failed to generate PDF.");
    }
  };

  const formatDate = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const downloadPDF = async () => {
    try {
      if (Platform.OS === "android") {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );

        if (!hasPermission) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: "Storage Permission Needed",
              message:
                "Your permission is required to save invoices to your device",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );

          if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
              "Permission Required",
              "Storage permission is permanently denied. Please enable it in app settings.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Open Settings",
                  onPress: () => Linking.openSettings(),
                },
              ]
            );
            return;
          }

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Toast.show({
              type: "error",
              text1: "Permission denied",
              text2: "Cannot save PDF without storage permission",
            });
            return;
          }
        }
      }
      const downloadPath = RNFS.DocumentDirectoryPath;

      // Generate PDF options
      const options = {
        html: htmlCon,
        fileName: `Invoice_${invoice?.invoice_id}_${formatDate().replace(
          /-/g,
          ""
        )}`,
        directory: downloadPath,
      };

      const file = await RNHTMLtoPDF.convert(options);

      if (!file.filePath) {
        throw new Error("PDF generation failed");
      }

      Toast.show({
        type: "success",
        text1: "PDF downloaded successfully",
        text2: `Saved to: ${file.filePath}`,
      });

      return file.filePath;
    } catch (error) {
      console.error("PDF download error:", error);
      Toast.show({
        type: "error",
        text1: "Failed to download PDF",
        text2: error?.message,
      });
      return null;
    }
  };

  return {
    invoice,
    currentUser,
    generatePDF,
    isLoading,
    downloadPDF,
  };
};

export default useInvoiceDetaileScreen;
