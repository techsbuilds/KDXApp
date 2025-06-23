import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AppText, CustomButton, CustomTextInput } from "../../components";
import styles from "./ProfileScreenStyle";
import { Images } from "../../assets";
import { StaticColors } from "../../themes";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState, userActions } from "../../redux";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { BASE_URL, HOST_URL } from "../../api/apiCall";
import Toast from "react-native-toast-message";

const ProfileScreen = (): React.JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const token = useSelector((state: RootState) => state.user.token);
  const [profileData, setProfileData] = useState({
    name: "",
    contact: "",
    email: "",
    company: "",
    address: "",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    contact: "",
    company: "",
    address: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const dispatch = useDispatch();

  const fetchProfileData = async () => {
    // TODO: Replace this with actual API call
    const apiResponse = {
      name: user?.name,
      contact: user?.mobileno,
      email: user?.email,
      company: user?.company,
      address: user?.address,
    };

    setProfileData(apiResponse);
    setSelectedImage(user?.profile_picture);
    setUpdatedProfile({
      name: apiResponse.name ?? "",
      contact: apiResponse.contact ?? "",
      company: apiResponse.company ?? "",
      address: apiResponse.address ?? "",
    });
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchUserData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}user`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status === 200) {
      const userData = response.data?.data;
      dispatch(userActions.setCurrentUser(userData));
      
      const profile = {
        name: userData?.name ?? "",
        contact: userData?.mobileno ?? "",
        email: userData?.email ?? "",
        company: userData?.company ?? "",
        address: userData?.address ?? "",
      };
      setProfileData(profile);
      setUpdatedProfile(profile);
      setSelectedImage(userData?.profile_picture ?? null);
      // Update local state directly
    }
  } catch (error) {
    console.log('error', error)
    Toast.show({
      type: "error", // Changed from "success" to "error"
      text1: error?.message ?? "Error fetching user data",
    });
  }
};

  const updateProfileImage = async (imageUri: string) => {
    try {
      const fileType = imageUri.endsWith(".png") ? "image/png" : "image/jpeg";
      const formData = new FormData();

      formData.append("user", {
        uri: imageUri.startsWith("file://") ? imageUri : `file://${imageUri}`,
        type: fileType,
        name: "profile.jpg",
      } as any);

      formData.append("name", updatedProfile.name);
      formData.append("company", updatedProfile.company);
      formData.append("address", updatedProfile.address);

      const response = await axios.put(`${BASE_URL}user`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("response profile image", response);

      if (response.status === 200) {
        await fetchUserData();
        Toast.show({
          type: "success",
          text1: "Profile image updated successfully",
        });
      }
    } catch (error) {

      console.log("UPLOAD ERROR:", JSON.stringify(error));
      Toast.show({
        type: "error",
        text1: error?.message ?? "Something went wrong! try again",
      });
    }
  };

  const updateProfileUser = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", updatedProfile.name);
      formData.append("mobileno", updatedProfile.contact);
      formData.append("company", updatedProfile.company);
      formData.append("address", updatedProfile.address);

      const response = await axios.put(`${BASE_URL}user`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        },
      });

      console.log("response>>>>>", response);
      if (response.status === 200) {
        await fetchUserData();
        Toast.show({
          type: "success",
          text1: "Profile info updated successfully",
        });
      }
    } catch (error) {
      if (error?.status === 409) {
        Toast.show({
          type: "error",
          text1: "Mobile or Email already exist!",
        });
      }else {
        Toast.show({
          type: "error",
          text1: error?.message ?? "Error updating profile",
        });
      }
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
      fetchProfileData()
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7, // Compress image for better performance
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      updateProfileImage(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    await updateProfileUser();
    await fetchUserData(); // This updates both Redux and local UI
  };

  return (
    <SafeAreaView style={styles.rootContainerStyle}>
      <ScrollView
        style={styles.subContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={pickImage} style={styles.profileIconView}>
          {selectedImage ? (
            <Image
              source={{ uri: `${HOST_URL}${selectedImage?.filePath}` }}
              style={{ height: "100%", width: "100%", borderRadius: 50 }}
            />
          ) : (
            <Image source={Images.user} style={styles.userIcon} />
          )}
        </TouchableOpacity>

        {/* Update Profile Button */}
        <CustomButton
          type="Bordered"
          title="Update Profile"
          size="md"
          style={styles.updateProfile}
          onPress={() => setIsModalVisible(true)}
        />

        <>
        <AppText style={[styles.inputLabelTitle,{ marginTop: 10}]}>personal details</AppText>
          {/* Profile Details (Non-editable) */}
          <View>
            <AppText style={styles.inputLabel}>Name :</AppText>
            <CustomTextInput defaultValue={profileData.name} editable={false} />
          </View>

          <View>
            <AppText style={styles.inputLabel}>Contact :</AppText>
            <CustomTextInput
              defaultValue={profileData.contact}
              editable={false}
            />
          </View>

          <AppText style={styles.inputLabelTitle}>Company details</AppText>
          <View>
            <AppText style={styles.inputLabel}>Email :</AppText>
            <CustomTextInput
              defaultValue={profileData.email}
              editable={false}
            />
          </View>

          <View>
            <AppText style={styles.inputLabel}>Company :</AppText>
            <CustomTextInput
              defaultValue={profileData.company}
              editable={false}
            />
          </View>

          <View>
            <AppText style={styles.inputLabel}>Address :</AppText>
            <CustomTextInput
              defaultValue={profileData.address}
              editable={false}
            />
          </View>

          {/* Home Button */}
          <CustomButton
            type="Bordered"
            title="Home"
            size="md"
            style={styles.homeButton}
            textStyle={{ color: StaticColors.black }}
            onPress={() => navigation.navigate("Home")}
          />
        </>
      </ScrollView>

      {/* Update Profile Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <AppText style={styles.modalTitle}>Edit Profile</AppText>

            <AppText style={styles.updateInputLabel}>Name :</AppText>
            <CustomTextInput
              placeholder="Name"
              defaultValue={updatedProfile.name}
              onChangeText={(text) =>
                setUpdatedProfile({ ...updatedProfile, name: text })
              }
            />

            <AppText style={styles.updateInputLabel}>Contact :</AppText>
            <CustomTextInput
              placeholder="Contact"
              defaultValue={updatedProfile.contact}
              onChangeText={(text) =>
                setUpdatedProfile({ ...updatedProfile, contact: text })
              }
            />

            <AppText style={styles.updateInputLabel}>Company :</AppText>
            <CustomTextInput
              placeholder="Company"
              defaultValue={updatedProfile.company}
              onChangeText={(text) =>
                setUpdatedProfile({ ...updatedProfile, company: text })
              }
            />

            <AppText style={styles.updateInputLabel}>Address :</AppText>
            <CustomTextInput
              placeholder="Address"
              defaultValue={updatedProfile.address}
              onChangeText={(text) =>
                setUpdatedProfile({ ...updatedProfile, address: text })
              }
            />

            {/* Submit Button */}
            <CustomButton
              title="Submit"
              type="Filled"
              onPress={handleUpdateProfile}
              style={{ marginTop: 10 }}
              loading={isLoading}
            />

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(false)
                fetchUserData(); // This will now fetch fresh user data and update the state
              }}
              style={{ marginTop: 10 }}
            >
              <AppText
                style={[styles.modalTitle, { color: StaticColors.lightGrey }]}
              >
                Cancel
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
