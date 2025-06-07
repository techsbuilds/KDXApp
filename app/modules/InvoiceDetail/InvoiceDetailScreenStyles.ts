import { StyleSheet } from "react-native";
import { StaticColors } from "../../themes";
import {
  Font_MontserratBold,
  Font_MontserratMedium,
  Font_MontserratRegular,
  Font_MontserratSemiBold,
} from "../../assets/fonts";

export default StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    backgroundColor: StaticColors.white,
  },
  subContainer: {
    flexGrow: 1,
    marginHorizontal: 18,
  },
  heading: {
    fontSize: 14,
    fontFamily: Font_MontserratBold,
    color: StaticColors.lightGrey,
    marginTop: 5,
  },
  labelStyle: {
    fontSize: 14,
    fontFamily: Font_MontserratRegular,
    color: StaticColors.lightGrey,
    marginTop: 5,
  },
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  alignTextAtEnd: {
    textAlign: "right",
  },
  alignHorizontalCon: {
    flexDirection: "row",
    alignItems: "center",
  },
  horizontalLine: {
    height: 0.5,
    backgroundColor: StaticColors.lightGrey,
    marginTop: 24,
  },
  mt13Label: {
    marginTop: 13,
  },
  phoneIconStyle: {
    height: 13,
    width: 8,
    marginTop: 4,
    marginEnd: 5,
  },
  plusIconStyle: {
    height: 23,
    width: 23,
  },
  addNoteContainer: {
    height: 37,
    width: 37,
    backgroundColor: StaticColors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    alignSelf:'flex-end',
    marginTop:20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  listHeader:{
    flexDirection:"row",
    borderTopWidth:0.8,
    borderBottomWidth:0.8,
    borderColor:StaticColors.lightGrey,
    paddingVertical:7,
    marginTop:20
  },
  listHeading: {
    fontFamily:Font_MontserratBold,
    fontSize:12,
    color:StaticColors.lightGrey,
    textAlign:'center'
  },
  listItem: {
    fontFamily:Font_MontserratMedium,
    fontSize:10,
    color:StaticColors.lightGrey,
    textAlign:'center',
    borderBottomWidth: 0.4,
    borderColor: StaticColors.lightGrey,
    paddingVertical: 10

  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalHeading :{
    fontSize:14,
    fontFamily:Font_MontserratSemiBold,
  },

  itemRow: {
    flexDirection: "row",
  },
  closeModalBtnStyle:{
    marginTop:10,
    paddingVertical:3,
    fontFamily: Font_MontserratMedium,
    fontSize:15
  },
  totalDueContainer: {
    marginTop: 20,
    padding: 10,
    borderBottomWidth: 1,
    alignSelf:"flex-end",
    borderColor: StaticColors.lightGrey,
  },
  totalDueText: {
    fontSize: 16,
    fontWeight: "600",
    color: StaticColors.black,
  },
});
