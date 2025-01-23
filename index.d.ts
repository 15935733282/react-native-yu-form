// index.d.ts





declare module 'react-native-yu-form' {
    import {FormType} from "./Form";
    import {FormItemType} from "./FormItem";

    export const Form: React.FC<FormType>;

    export const FormItem: React.FC<FormItemType>;
}
