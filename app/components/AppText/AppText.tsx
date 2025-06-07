import React from 'react';
import {Text, TextProps} from 'react-native';
import {styles} from './AppTextStyle';

const AppText = (props: TextProps) => {
  const {children, style, ...rest} = props;
  return (
    <Text style={[styles.fontStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

export default AppText;
