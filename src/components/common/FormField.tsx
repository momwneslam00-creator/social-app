import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { FieldError, Input, Label, TextField } from '@heroui/react'

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
}

/** react-hook-form + HeroUI TextField with an inline error message. */
export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  autoComplete,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          fullWidth
          name={field.name}
          type={type}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={!!fieldState.error}
          autoComplete={autoComplete}
        >
          <Label>{label}</Label>
          <Input placeholder={placeholder} />
          <FieldError>{fieldState.error?.message}</FieldError>
        </TextField>
      )}
    />
  )
}
