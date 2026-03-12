import { InputText } from "primereact/inputtext";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface InputTextControllerProps {
  rules: RegisterOptions | null;
  label?: string;
  placeholder?: string;
  name: string;
  control: Control<any>;
}
export default function InputTextController({
  name,
  control,
  rules,
  label,
  placeholder,
}: InputTextControllerProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          <InputText
            id={field.name}
            {...field}
            placeholder={placeholder}
          />
          {fieldState.error && <small>{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
