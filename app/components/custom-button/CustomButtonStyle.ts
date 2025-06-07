import {StyleSheet} from 'react-native';
import {StaticColors} from '../../themes';

export const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  filled: {
    backgroundColor: StaticColors.primary,
    borderColor: StaticColors.primary,
  },
  bordered: {
    backgroundColor: '#FBF9F9',
    borderColor: StaticColors.lightGrey,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  filledText: {
    color: 'white',
  },
  borderedText: {
    color: StaticColors.primary,
  },
  activityIndicatorStyle: {
    
  }
});