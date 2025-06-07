import React, { useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import { CustomButton } from "../../components";
import styles from "./HomeScreenStyle";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Routes } from "../../constants";
import axios from "axios";
import { BASE_URL } from "../../api/apiCall";
import { useDispatch, useSelector } from "react-redux";
import { RootState, userActions } from "../../redux";
import Toast from "react-native-toast-message";

const HomeScreen = (): React.JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}user`, {
        headers: {
          Authorization: token,
        },
      });

      if (response?.status === 200) {
        dispatch(userActions.setCurrentUser(response?.data?.data));
      }
    } catch (error) {
      Toast.show({
        type: "success",
        text1: error?.message ?? "Error fetching user data",
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.rootContainerStyle}>
      <View style={styles.buttonContainer}>
        <CustomButton
          title={"Invoice"}
          size="lg"
          style={styles.buttonStyle}
          textStyle={styles.buttonLabel}
          onPress={() => navigation.navigate(Routes.Invoice)}
        />
        <CustomButton
          title={"History"}
          size="lg"
          type="Filled"
          style={styles.buttonStyle}
          textStyle={styles.buttonLabel}
          onPress={() => navigation.navigate(Routes.History)}
        />
        <CustomButton
          title={"Report"}
          size="lg"
          style={styles.buttonStyle}
          textStyle={styles.buttonLabel}
          onPress={() => navigation.navigate(Routes.Report)}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
