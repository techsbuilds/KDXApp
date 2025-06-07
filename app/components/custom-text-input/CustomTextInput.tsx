import {TextInput, View} from 'react-native';
import React from 'react';
import {CustomInputType} from './CustomTextInputType';
import {AppText} from '../AppText';
import { StaticColors } from '../../themes';
import styles from './CustomTextInputStyle'

const CustomTextInput: CustomInputType = (
  {
    placeholder,
    onSubmitEditing,
    onChangeText,
    onBlur,
    keyboardType,
    returnKeyType,
    defaultValue,
    error,
    touched,
    setSecureEntryText,
    secureTextEntry,
    multiline = false,
    leftComponent,
    editable,
    customInputStyle,
    autoCapitalize = 'none',
    value
  },
  ref,
) => {
  
  return (
    <View style={[styles.inputTextViewStyle, customInputStyle]}>
      <View style={styles.inputViewStyle}>
      {leftComponent && <View style={styles.leftComponent}>{leftComponent}</View>}
        <TextInput
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          placeholder={placeholder}
          style={[styles.inputStyle]}
          placeholderTextColor={StaticColors.lightGrey}
          ref={ref}
          onSubmitEditing={onSubmitEditing}
          defaultValue={defaultValue}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          keyboardAppearance="dark"
          editable={editable}
          value={value}
        />
      </View>
      <>
        {error && touched && (
          <AppText style={styles.errorTextStyle}>{error}</AppText>
        )}
      </>
    </View>
  );
};

export default React.forwardRef(CustomTextInput);
