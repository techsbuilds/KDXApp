import { StyleSheet } from "react-native";
import { StaticColors } from "../../themes";
import { Font_MontserratBold, Font_MontserratMedium } from "../../assets/fonts";

export default StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    backgroundColor: StaticColors.primary,
  },
  subContainer:{
    flexGrow:1,
    marginHorizontal: 18
  },
  profileIconView: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    alignSelf:'center',
    marginTop:10
  },
  userIcon: {
    height: 50,
    width: 50,
  },
  updateProfile:{borderWidth:0 , marginTop:10, paddingVertical:9},
  inputLabelTitle:{fontWeight:'bold',textTransform: 'uppercase', fontFamily: Font_MontserratBold, color:StaticColors.white, fontSize:20,marginVertical:5},
  inputLabel:{fontFamily: Font_MontserratBold, color:StaticColors.white, fontSize:20, marginBottom:-5},
  updateInputLabel:{fontFamily: Font_MontserratBold, fontSize:20, color:StaticColors.primary, textAlign:'left', marginBottom:-5},
  homeButton:{borderWidth:0.2 , marginTop:10, paddingVertical:9, borderRadius:0, marginBottom:20},
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign:"center"
  },
  
});
