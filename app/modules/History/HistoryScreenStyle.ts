import { StyleSheet } from "react-native";
import { StaticColors } from "../../themes";
import { Font_MontserratBold, Font_MontserratMedium, Font_MontserratRegular } from "../../assets/fonts";

export default StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    backgroundColor: StaticColors.white,
  },
  subContainer:{
    flexGrow:1,
  },
  headingText:{
    fontFamily: Font_MontserratBold,
    // fontSize:28,
    // color:StaticColors.lightGrey,
    // marginTop:18,
    // fontWeight: "bold",
    fontSize: 22, fontWeight: "bold", marginVertical: 10
  },
  customInputStyle : {
    backgroundColor:"#D9D9D9",
    marginVertical:-5
  },
  alignHorizontalCon: {
    flexDirection: "row",
    alignItems: "center",
    marginTop:5
  },
  phoneIconStyle:{
    width: 16,
    height: 18,
    tintColor: "#1E5BB8",
  },
  labelStyle: {
      // fontSize: 16,
      fontFamily: Font_MontserratRegular,
      color: StaticColors.primary,

    },
});
