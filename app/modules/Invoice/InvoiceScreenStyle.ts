import { StyleSheet } from "react-native";
import { StaticColors } from "../../themes";
import { Font_MontserratBold } from "../../assets/fonts";

export default StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    backgroundColor: StaticColors.white,
  },
  headingText:{
    fontFamily: Font_MontserratBold,
    // fontSize:28,
    // color:StaticColors.lightGrey,
    // marginTop:18,
    // fontWeight: "bold",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10
  },
  subContainer:{
    flexGrow:1,
    marginHorizontal:18
  },
  emptySpace:{
    height:44
  },
  submitButtonStyle : {
    alignSelf:"flex-end",
    marginTop:50,
    marginBottom:30
  }
});
