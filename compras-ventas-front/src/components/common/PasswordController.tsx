import { Password } from "primereact/password";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface PasswordControllerProps {
  rules?: RegisterOptions | null;
  label?: string;
  placeholder?: string;
  name: string;
  control: Control<any>;
  feedback?: boolean;
  toggleMask?: boolean;
}
export default function PasswordController({
  name,
  control,
  rules,
  label,
  placeholder,
  feedback,
  toggleMask,
}: PasswordControllerProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          <Password
            id={field.name}
            {...field}
            placeholder={placeholder}
            feedback={feedback}
            toggleMask={toggleMask}
          />
          {fieldState.error && <small>{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
