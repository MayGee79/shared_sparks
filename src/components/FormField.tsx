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
  const baseStyles = {
    marginTop: '0.25rem',
    display: 'block',
    width: '100%',
    borderRadius: '0.375rem',
    border: '1px solid #374151',
    backgroundColor: '#1a365d',
    color: 'white',
    padding: '0.5rem 0.75rem'
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={id} style={{ 
        display: 'block', 
        fontSize: '0.875rem', 
        fontWeight: '500', 
        color: 'white',
        marginBottom: '0.25rem'
      }}>
        {label}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          style={baseStyles}
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
          style={{
            ...baseStyles,
            backgroundColor: '#1a365d'
          }}
          multiple={multiple}
          size={size}
          aria-label={label}
          required={required}
        >
          {options?.map(option => (
            <option key={option.value} value={option.value} style={{ backgroundColor: '#1a365d', color: 'white' }}>
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
          style={baseStyles}
          aria-label={label}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  )
}