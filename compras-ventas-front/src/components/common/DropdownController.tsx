import { Dropdown } from "primereact/dropdown";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface DropdownControllerProps {
  rules?: RegisterOptions | null;
  label?: string;
  placeholder?: string;
  name: string;
  control: Control<any>;
  options: any[];
  optionLabel?: string;
  optionValue?: string;
}
export default function DropdownController({
  name,
  control,
  rules,
  label,
  placeholder,
  options,
  optionLabel,
  optionValue,
}: DropdownControllerProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          <Dropdown
            id={field.name}
            {...field}
            placeholder={placeholder}
            options={options}
            optionLabel={optionLabel}
            optionValue={optionValue}
          />
          {fieldState.error && <small>{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
