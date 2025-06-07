import {ImageSourcePropType} from 'react-native';

export interface UserFormType {
  email: string;
  password: string;
}

export interface UserInfoType {
  name: string;
  email: string;
}

export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  deviceToken: string;
  photoUrl?: string;
}

export interface AuthUser {
  __v: number;
  _id: string;
  address: string;
  company: string;
  createdAt: string; // ISO date string
  email: string;
  gstno: string | null;
  mobileno: string;
  name: string;
  status: boolean;
  updatedAt: string; // ISO date string
  profile_picture: {
    fileName: string;
    filePath: string;
    fileSize: string;
    fileType: string;
},


}

