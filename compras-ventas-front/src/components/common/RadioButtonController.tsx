import { RadioButton } from "primereact/radiobutton";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface RadioButtonControllerProps {
  rules?: RegisterOptions | null;
  label?: string;
  name: string;
  control: Control<any>;
  options: any[];
  optionLabel?: string;
  optionValue?: string;
}
export default function RadioButtonController({
  name,
  control,
  rules,
  label,
  options,
  optionLabel,
  optionValue,
}: RadioButtonControllerProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          {options.map((option) => (
            <div key={option[optionValue || "value"]}>
              <RadioButton
                id={field.name}
                {...field}
                value={option[optionValue || "value"]}
                checked={field.value === option[optionValue || "value"]}
                onChange={(e) => field.onChange(e.value)}
              />
              <label htmlFor={field.name}>
                {option[optionLabel || "label"]}
              </label>
            </div>
          ))}
          {fieldState.error && <small>{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
