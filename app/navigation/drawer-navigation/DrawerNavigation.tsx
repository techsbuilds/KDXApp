import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  View,
  Pressable,
} from "react-native";
import { Images } from "../../assets";
import { StaticColors } from "../../themes";
import { AppText, CustomButton } from "../../components";
import { RootState, userActions } from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HOST_URL } from "../../api/apiCall";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DrawerParamList = {
  HomeStack: undefined;
};

const FullScreenDrawer = (props: any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
  const user = useSelector((state: RootState) => state.user.currentUser);

  const handleLogout = async() => {
    dispatch(userActions.logout());
    await AsyncStorage.removeItem("TOKEN")
    navigation.replace('Login');
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => props.navigation.closeDrawer()}
        style={styles.closeBtnContainer}
      >
        <Image style={styles.closeIcon} source={Images.closeIcon} />
      </TouchableOpacity>

      <View style={styles.contentView}>
        <View style={{ alignSelf: "center" ,alignItems:"center"}}>
          <View style={styles.profileIconView}>
                      {user?.profile_picture ? (
                        <Image
                          source={{ uri: `${HOST_URL}${user?.profile_picture?.filePath}` }}
                          style={{height: '100%' , width:"100%",borderRadius: 50,}}
                        />
                      ) : (
                        <Image source={Images.user} style={styles.userIcon} />
                      )}
          </View>
          <AppText style={{ fontSize: 18, marginVertical: 10 }}>{user?.company}</AppText>
        </View>

        <View style={styles.drawerBtnContainer}>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => props.navigation.navigate("ProfileScreen")}>
            <Image source={Images.userIcon} style={styles.buttonIconStyle} />
            <AppText style={styles.buttonText}>My Profile</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}  onPress={() => navigation.navigate("Home")}>
            <Image source={Images.homeIcon} style={styles.buttonIconStyle} />
            <AppText style={styles.buttonText}>Home</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}>
            <Image source={Images.helpIcon}  style={styles.buttonIconStyle} />
            <AppText style={styles.buttonText}>Help</AppText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.buttonContainer,styles.logoutButton]} onPress={handleLogout}>
            <Image source={Images.logoutIcon}  style={styles.buttonIconStyle} />
            <AppText style={styles.buttonText}>Log Out</AppText>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FullScreenDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9d9d9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeBtnContainer: {
    alignSelf: "flex-end",
    margin: 20,
  },
  closeIcon: {
    height: 20,
    width: 20,
    tintColor: StaticColors.black,
  },
  contentView: {
    flex: 1,
    marginTop: 30,
  },
  profileIconView: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: StaticColors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  userIcon: {
    height: 50,
    width: 50,
  },
  buttonContainer: {
    backgroundColor: "#4c90de",
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    alignSelf: "flex-start",
    width: "60%",
    marginVertical:11
  },
  buttonIconStyle: { height: 30, width: 28, marginEnd: 10 , tintColor:"#004492" },
  buttonText: { color: StaticColors.white, fontSize: 18 },
  drawerBtnContainer: { marginLeft: 20, marginTop: 30 , flex:1},
  logoutButton:  {alignSelf:"center",justifyContent:"center", borderWidth:0, paddingVertical:8, marginBottom:40}
});
