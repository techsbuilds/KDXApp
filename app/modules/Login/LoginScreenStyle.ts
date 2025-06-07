import { StyleSheet } from "react-native";
import { Font_MontserratBold } from "../../assets/fonts";
import { StaticColors } from "../../themes";

export default StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: "20%",
    width: "90%",
    alignSelf: "flex-start",
    color: StaticColors.lightGrey,
  },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  link: { color: "black", textAlign: "center", marginTop: 20, fontSize: 17 },
  loginText: {
    fontSize: 26,
    fontFamily: Font_MontserratBold,
    marginBottom: 20,
    color: StaticColors.lightGrey,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
  },
});
