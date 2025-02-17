import {
  createContext,
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export type FormType = {
  /**
   * 表单默认值
   */
  value?: any;
  /**
   * 表单值变化回调函数
   * @param value
   */
  onChangeValueAll?: (value: any) => void;
  /**
   * 表单提交回调函数
   * @param isValid
   */
  onConfirm?: (isValid: boolean) => void;
  /**
   * 表单子元素
   */
  children: ReactNode;
};

/**
 * 表单上下文
 */
export const FormContext = createContext<{
  formValue: any;
  onChangeValue: (value: any) => void;
  isValidationPending: boolean;
  validationResult: (key: string, status: boolean) => void;
  itemKeyReport: (name: string) => void;
}>({
  formValue: {},
  onChangeValue: () => {},
  isValidationPending: false,
  validationResult: () => {},
  itemKeyReport: () => {},
});

const Form: ForwardRefRenderFunction<any, FormType> = (
    {value, onChangeValueAll, onConfirm, children},
    ref,
) => {
  const [isValidationPending, setIsValidationPending] =
      useState<boolean>(false);
  let isValidationStatus = useRef<{
    [key: string]: boolean;
  }>({});
  const itemNames = useRef<{[key: string]: string}>({});
  const formValueTemp = useRef<any>({});
  const [formValue, setFormValue] = useState<any>({});
  const validationResultCount = useRef(0);

  useEffect(() => {
    if (
        value &&
        Object.keys(value).length !== 0 &&
        value.constructor === Object
    ) {
      formValueTemp.current = {...formValueTemp.current, ...value};
      setFormValue(formValueTemp.current);
    }
  }, [value]);

  const onChangeValue = (v: any) => {
    formValueTemp.current = {...formValueTemp.current, ...v};
    setFormValue({...formValueTemp.current});
    onChangeValueAll?.({...formValueTemp.current});
  };

  const itemKeyReport = (name: string) => {
    itemNames.current[name] = name;
  };

  const validationResult = (key: string, status: boolean) => {
    if (isValidationPending) {
      const newValidationStatus: {[key: string]: boolean} = {
        ...isValidationStatus.current,
        [key]: status,
      };
      isValidationStatus.current = newValidationStatus;
      validationResultCount.current += 1;
      if (
          validationResultCount.current ===
          Object.keys(itemNames.current).length
      ) {
        setIsValidationPending(false);
        validationResultCount.current = 0;
        onConfirm?.(Object.values(newValidationStatus).every(v => v));
      }
    }
  };

  const validateFields = () => {
    setIsValidationPending(true);
  };

  useImperativeHandle(ref, () => ({
    validateFields: validateFields,
  }));

  return (
      <FormContext.Provider
          value={{
            formValue,
            onChangeValue,
            isValidationPending,
            validationResult,
            itemKeyReport,
          }}>
        {children}
      </FormContext.Provider>
  );
};

export default forwardRef(Form);
