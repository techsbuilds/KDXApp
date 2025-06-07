import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { styles } from './CustomButtonStyle';
import { moderateScale, StaticColors } from '../../themes';

type ButtonType = 'Filled' | 'Bordered';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: Boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  type = 'Bordered',
  size = 'md',
  style,
  textStyle,
  loading = false
}) => {

    const getWidth = (): ViewStyle => {
    switch (size) {
      case 'xxl': return { width: '100%' };
      case 'xl': return { width: '100%', marginHorizontal: 20 };
      case 'lg': return { width: '70%', marginHorizontal: 50 };
      case 'md': return { alignSelf: 'center' };
      case 'sm': return { width: 120 };
      default: return {};
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === 'Filled' ? styles.filled : styles.bordered,
        getWidth(),
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
     {loading ? (
        <ActivityIndicator
          size={moderateScale(20)}
          color={StaticColors.white}
          style={styles.activityIndicatorStyle}
        />
      ) : (
      <Text style={[styles.buttonText, type === 'Filled' ? styles.filledText : styles.borderedText, textStyle]}>
        {title}
      </Text>
    )}
    </TouchableOpacity>
  );
};

export default CustomButton;
