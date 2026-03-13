import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface MultiselectControllerProps {
  rules?: RegisterOptions | null;
  label?: string;
  placeholder?: string;
  name: string;
  control: Control<any>;
  options: any[];
  optionLabel?: string;
  optionValue?: string;
  maxSelectLabels?: number;
  display?: 'comma' | 'chip'
}
export default function MultiselectController({
  name,
  control,
  rules,
  label,
  placeholder,
  options,
  optionLabel,
  optionValue,
  maxSelectLabels,
  display
}: MultiselectControllerProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          <MultiSelect
            id={field.name}
            {...field}
            placeholder={placeholder}
            options={options}
            optionLabel={optionLabel}
            optionValue={optionValue}
            maxSelectedLabels={maxSelectLabels}
            display={display}
          />
          {fieldState.error && <small>{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
