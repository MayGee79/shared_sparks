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
    border: '1px solid #cbd5e0',
    backgroundColor: 'white',
    color: 'var(--primary)',
    padding: '0.5rem 0.75rem'
  }

  // Handle checkbox toggling for multi-select
  const handleCheckboxChange = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? [...value] : [];
    
    if (currentValues.includes(optionValue)) {
      // Remove if already selected
      onChange(currentValues.filter(v => v !== optionValue));
    } else {
      // Add if not selected
      onChange([...currentValues, optionValue]);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.25rem'
      }}>
        <label htmlFor={id} style={{ 
          display: 'block', 
          fontSize: '0.875rem', 
          fontWeight: '500', 
          color: 'white'
        }}>
          {label}
        </label>
        {multiple && <span style={{ marginLeft: '0.5rem', color: 'var(--accent)', fontSize: '0.75rem' }}>(select multiple)</span>}
      </div>
      
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
      ) : type === 'select' && multiple ? (
        <div 
          style={{
            backgroundColor: 'white',
            border: '1px solid #cbd5e0',
            borderRadius: '0.375rem',
            padding: '0.5rem',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {options?.map(option => (
            <div 
              key={option.value} 
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.375rem 0.5rem',
                marginBottom: '0.25rem',
                backgroundColor: Array.isArray(value) && value.includes(option.value) 
                  ? 'rgba(var(--accent-rgb), 0.1)' 
                  : 'transparent',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
              onClick={() => handleCheckboxChange(option.value)}
            >
              <input
                type="checkbox"
                id={`${id}-${option.value}`}
                checked={Array.isArray(value) && value.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
                style={{
                  marginRight: '0.5rem',
                  cursor: 'pointer'
                }}
              />
              <label 
                htmlFor={`${id}-${option.value}`}
                style={{
                  color: 'var(--primary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      ) : type === 'select' ? (
        <select
          id={id}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          style={baseStyles}
          aria-label={label}
          required={required}
        >
          {options?.map(option => (
            <option key={option.value} value={option.value} style={{ backgroundColor: 'white', color: 'var(--primary)' }}>
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