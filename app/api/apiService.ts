import apiClient from './apiCall';

interface SendOtpResponse {
  success: boolean;
  message: string;
}

interface VerifyOtpResponse {
  success: boolean;
  token?: string;
}

const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: object,
  params?: object
): Promise<T> => {
  try {
    const response = await apiClient({
      method,
      url: endpoint,
      data,
      params,
    });
    console.log('response', response)
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const ApiService = {
  sendOtpForLogin: (mobileno: string): Promise<SendOtpResponse> =>
    apiRequest<SendOtpResponse>('POST', '/auth/sendotp', { mobileno }),

  verifyOtpForLogin: (mobileno: string, otp: string): Promise<VerifyOtpResponse> =>
    apiRequest<VerifyOtpResponse>('POST', '/auth/verifyotp', { mobileno, otp }),

  sendOtpForSignup: (mobileno: string, email: string): Promise<SendOtpResponse> =>
    apiRequest<SendOtpResponse>('POST', '/auth/sendotp/signup', { mobileno, email }),
  
  verifyOtpForSignup: (
    name: string,
    mobileno: string,
    email: string,
    company: string,
    address: string,
    otp: string,
    gstNo: string
  ): Promise<VerifyOtpResponse> =>  apiRequest<VerifyOtpResponse>('POST', '/auth/verifyotp/signup', {
    name,
    mobileno,
    email,
    company,
    address,
    otp,
    gstNo
  }),
  
  createUser: (mobileno: string, email: string): Promise<SendOtpResponse> =>
    apiRequest<SendOtpResponse>('POST', '/user', { mobileno, email }),
  
  createInvoice: (invoice_id: string, billing_description: any, total_amount:string , customer_name:string , customer_mobile_no:string,  customer_vehicle_number:string, customer_vehicle_name:string , customer_vehicle_km:string): Promise<SendOtpResponse> =>
    apiRequest<SendOtpResponse>('POST', '/invoice', { invoice_id, billing_description,total_amount , customer_name,customer_mobile_no, customer_vehicle_number, customer_vehicle_name , customer_vehicle_km}),

  getInvoicesByContact: (contactNo: string): Promise<SendOtpResponse> =>
    apiRequest<SendOtpResponse>(
      'GET',
      '/invoice',
      {},
      { contactno: contactNo },
    ),
};