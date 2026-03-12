import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface InputTextAreaControllerProps {
  rules: RegisterOptions | null;
  label?: string;
  placeholder?: string;
  name: string;
  control: Control<any>;
}
export default function InputTextAreaController({
  name,
  control,
  rules,
  label,
  placeholder,
}: InputTextAreaControllerProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          <InputTextarea
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
