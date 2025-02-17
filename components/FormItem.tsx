import React, {
  cloneElement,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {StyleSheet} from 'react-native';
import {FormContext} from './Form';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring, withTiming,
} from 'react-native-reanimated';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type FormItemType = {
  /**
   * 表单项名称
   */
  name: string;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 表单项样式
   */
  style?: StyleProp<ViewStyle> | undefined;
  /**
   * 表单项子元素
   */
  children: ReactNode;
};

const FormItem: FC<FormItemType> = ({name, required, style, children}) => {
  const {formValue, onChangeValue, isValidationPending, validationResult,itemKeyReport} =
      useContext(FormContext);
  const [value, setValue] = useState<any>();
  const translateX = useSharedValue(0);


  const validate = () => {
    if (required && !value && value !== 0) {
      validationResult(name, false); // 触发表单验证错误
      translateX.value = withTiming(10, {duration: 100},()=>{
        translateX.value = 0;
      });

    } else {
      validationResult(name, true);
    }
  };

  useEffect(() => {
    if (isValidationPending) {
      validate();
    }
  }, [isValidationPending]);

  useEffect(() => {
    if (!value && JSON.stringify(value) !== JSON.stringify(formValue?.[name])) {
      setValue(formValue[name]); // 初始值
    }
  }, [formValue?.[name]]);

  useEffect(() => {
    if (name){
      itemKeyReport(name);
    }
  }, [name]);

  const handleChildChange = (child: ReactElement) => {
    const originalOnChange = child.props.onChange;
    const originalOnOtherChange = child.props.onOtherChange;

    return cloneElement(child, {
      formValue: formValue,
      value: value,
      onChange: (e: any) => {
        setValue(e);
        onChangeValue({[name]: e});
        if (originalOnChange) {
          originalOnChange(e);
        }
      },
      onOtherChange: (e: {[key: string]: any}) => {
        onChangeValue(e);
        if (originalOnOtherChange) {
          originalOnOtherChange(e);
        }
      },
    });
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(translateX.value, {
            damping: 5,
            stiffness: 300,
          }),
        },
      ],
    };
  });

  return (
      <Animated.View style={[styles.container, animatedStyle, style]}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return handleChildChange(child); // 处理每个有效的 React 元素
          }
          return child;
        })}
      </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default FormItem;
