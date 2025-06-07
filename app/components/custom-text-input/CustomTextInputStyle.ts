import {StyleSheet} from 'react-native';
import {horizontalScale, moderateScale, StaticColors, verticalScale} from '../../themes';

export default StyleSheet.create({
    inputTextViewStyle: {
      marginVertical: verticalScale(11),
      width: '100%',
      alignSelf:"center",
      shadowColor: '#000',
      borderRadius: moderateScale(6),
    },
    inputViewStyle: {
      borderWidth: moderateScale(1),
      borderColor: StaticColors.lightGrey,
      borderRadius: moderateScale(6),
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:"#FBF9F9",
    },
    inputStyle: {
      flex: 1,
      color: StaticColors.lightGrey,
      fontSize:18,
      paddingVertical: verticalScale(15),
      paddingHorizontal: horizontalScale(12),
    },
    eyeImageViewStyle: {
      height: verticalScale(18),
      width: horizontalScale(18),
      marginRight: horizontalScale(10),
    },
    eyeImageStyle: {
      width: '100%',
      height: '100%',
      tintColor: StaticColors.white,
    },
    errorTextStyle: {
      marginTop: verticalScale(5),
      fontSize: moderateScale(13),
      color: StaticColors.red,
    },
    leftComponent:{
      paddingLeft:5
    }
  });
