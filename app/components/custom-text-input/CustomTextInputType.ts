import React, {Dispatch, ForwardedRef, SetStateAction} from 'react';
import {StyleProp, TextInput, TextInputProps, ViewStyle} from 'react-native';

interface CustomInputPropType {
  error: string;
  touched: boolean;
  setSecureEntryText?: Dispatch<SetStateAction<boolean>>;
  leftComponent?: React.JSX.Element
  customInputStyle?: ViewStyle
}

export type CustomInputType = (
  props: TextInputProps & CustomInputPropType,
  ref: ForwardedRef<TextInput>,
) => React.JSX.Element;
