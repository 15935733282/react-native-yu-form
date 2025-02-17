// index.d.ts





declare module 'react-native-yu-form' {
    import {FormType} from "./components/Form";
    import {FormItemType} from "./components/FormItem";

    export const Form: React.FC<FormType>;

    export const FormItem: React.FC<FormItemType>;
}
