import { useCallback, useRef } from "react";
import AsyncSelect from "react-select/async";

export default function AsyncSelectField({
  name,
  label,
  required,
  value,          
  loadOptions,    
  onChange,
  placeholder = "Ketik untuk mencari...",
}) {
  const timeoutRef = useRef(null);


  const debouncedLoadOptions = useCallback(
    (inputValue, callback) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        const options = await loadOptions(inputValue);
        callback(options);
      }, 400);
    },
    [loadOptions]
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-semibold text-brand-900">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <AsyncSelect
        inputId={name}
        name={name}
        value={value}
        loadOptions={debouncedLoadOptions}
        defaultOptions
        onChange={(selected) =>
          onChange({
            target: { name, value: selected?.value || "", selectedOption: selected },
          })
        }
        placeholder={placeholder}
        noOptionsMessage={() => "Data tidak ditemukan"}
        loadingMessage={() => "Mencari..."}
        isClearable={!required}
        className="text-sm"
        classNamePrefix="react-select"
      />
    </div>
  );
}