# react-native-yu-form
react-native的form组件

## 安装

### npm
```
npm install react-native-yu-form --save
```

### yarn
```
yarn add react-native-yu-form
```

## 使用
```
import {FC, useRef, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {Form, FormItem} from 'react-native-yu-form';

type DemoType = {};

const Demo: FC<DemoType> = () => {
  const formRef = useRef<any>(null);
  const [formValue, setFormValue] = useState<any>({});

  const handleConfirm = async (isValid: boolean) => {
    console.log(isValid);
    console.log(formValue);
  };

  return (
    <View style={styles.container}>
      <Form
        ref={formRef}
        onConfirm={handleConfirm}
        onChangeValueAll={(value: any) => {
          setFormValue(value);
        }}>
        <FormItem name="username" required>
          <DemoInput label="用户名" />
        </FormItem>
        <FormItem name="password" required>
          <DemoInput label="密码" />
        </FormItem>
      </Form>
      <View style={styles.buttonContainer}>
        <Button title={'登 录'} onPress={() => formRef.current.validateFields()} />
      </View>
    </View>
  );
};

type DemoInputType = {
  label?: string;
  formValue?: any;
  onChange?: (value: string) => void;
};

const DemoInput: FC<DemoInputType> = ({label, formValue, onChange}) => {
  return (
      <View style={styles.inputContainer}>
        <View>
          <Text>{label}</Text>
        </View>
        <TextInput onChangeText={onChange} style={styles.input} />
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    paddingTop: 10,
  },
  input:{
    marginTop: 10,
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    borderColor: '#ccc',
  },
  buttonContainer: {
    paddingTop: 10,
    alignItems: 'center',
  },
  button:{
    borderWidth: 1,
    borderRadius: 5,
    width: 100,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Demo;
```

## Form props

| 属性名              | 类型                         | 必填 | 默认值 | 描述                 |
|------------------|----------------------------|----|-----|--------------------|
| value            | any                        | 否  | -   | 表单默认值              |
| onChangeValueAll | (value: any) => void       | 否  | -   | 表单值改变回调函数，参数为表单所有值 |
| onConfirm        | (isValid: boolean) => void | 否  | -   | 表单提交回调函数，参数为表单是否合法 |

## FormItem props

 | 属性名      | 类型                   | 必填 | 默认值   | 描述    |
|----------|----------------------|----|-------|-------|
| name     | string               | 是  | -     | 表单项名称 |
| required | boolean              | 否  | false | 是否必填  |   
 | style    | StyleProp<ViewStyle> | 否  | -     | 表单项样式 |


