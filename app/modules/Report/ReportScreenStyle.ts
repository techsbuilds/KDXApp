import { StyleSheet } from "react-native";
import { StaticColors } from "../../themes";
import { Font_MontserratMedium } from "../../assets/fonts";

export default StyleSheet.create({
  rootContainerStyle: {
    flex: 1,
    backgroundColor: StaticColors.white,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: StaticColors.primary,
  },
  dateFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  dateFieldLabel: {
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  dateFieldValue: {
    flex: 1,
    color: '#555',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  applyButton: {
    backgroundColor: StaticColors.primary,
  },
  modalButtonText: {
    fontWeight: 'bold',
  },

  overlay: {
    flex: 1,
    backgroundColor: '#00000077',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: 300,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  labelBox: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,    borderWidth:1,
    borderColor: 'rgba(85, 85, 85, 0.44)',
    minWidth: 100,
    alignItems:"center"
  },
  label: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  valueBox: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    minWidth: 100,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    elevation: 3,
  },
  submitText: {
    color: StaticColors.black,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign:"center",
    marginTop:10
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginTop: 5,
  },
  
  
});
