interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'textarea' | 'select' | 'url';
  value: string | string[];
  onChange: (value: any) => void;
  options?: { value: string; label: string; }[];
  multiple?: boolean;
  size?: number;
  placeholder?: string;
  required?: boolean;
}

export function FormField({ 
  label, 
  id, 
  type = 'text', 
  value, 
  onChange,
  options,
  multiple,
  size,
  placeholder,
  required
}: FormFieldProps) {
  const baseClasses = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
          rows={4}
          aria-label={label}
          placeholder={placeholder}
          required={required}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={(e) => {
            if (multiple) {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              onChange(values);
            } else {
              onChange(e.target.value);
            }
          }}
          className={baseClasses}
          multiple={multiple}
          size={size}
          aria-label={label}
          required={required}
        >
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
          aria-label={label}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  )
}