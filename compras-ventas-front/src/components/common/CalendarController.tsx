import { Calendar } from "primereact/calendar";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface CalendarControllerProps {
    rules: RegisterOptions | null;
    label?: string;
    placeholder?: string;
    name: string;
    control: Control<any>;
    dateFormat?: string;
    minDate?: Date;
    maxDate?: Date;
}
export default function CalendarController({
  name,
  control,
  rules,
  label,
  placeholder,
  dateFormat, 
  minDate,
  maxDate
}: CalendarControllerProps){

return (
    <Controller
      control={control}
      name={name}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          <Calendar
            id={field.name}
            {...field}
            placeholder={placeholder}
            dateFormat={dateFormat}
            minDate={minDate}
            maxDate={maxDate}
          />
          {fieldState.error && <small>{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}