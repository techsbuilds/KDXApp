import { StyleSheet } from "react-native";
import { StaticColors } from "../../themes";
import { Font_MontserratMedium } from "../../assets/fonts";

export default StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    backgroundColor: StaticColors.white,
  },
  buttonContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:"center"
  },
  buttonStyle: { alignSelf: "center", marginVertical: 15 },
  buttonLabel: { fontSize: 28, fontFamily: Font_MontserratMedium },
});
