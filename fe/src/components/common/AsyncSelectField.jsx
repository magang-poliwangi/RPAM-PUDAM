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
  size = "42px",
  fontSize = "12px",
  styles = {},
}) {
  const timeoutRef = useRef(null);


  const debouncedLoadOptions = useCallback(
    (inputValue, callback) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        const options = await loadOptions(inputValue);
        callback(options);
      },1000);
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
        className="text-sm z-50"
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: size,
            height: size,
            fontSize,
            borderColor: state.isFocused ? "#14b8a6" : "#d1d5db",
            boxShadow: "none",
            "&:hover": {
              borderColor: "#14b8a6",
            },
          }),

          valueContainer: (base) => ({
            ...base,
            height: size,
            padding: "0 8px",
          }),

          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
          }),

          indicatorsContainer: (base) => ({
            ...base,
            height: size,
          }),

          clearIndicator: (base) => ({
            ...base,
            padding: 4,
          }),

          dropdownIndicator: (base) => ({
            ...base,
            padding: 4,
          }),

          menu: (base) => ({
            ...base,
            fontSize,
            zIndex: 9999,
          }),

          menuPortal: (base) => ({
            ...base,
            zIndex: 99999,
          }),

          option: (base, state) => ({
            ...base,
            fontSize,
            backgroundColor: state.isFocused ? "#f0fdfa" : "#fff",
            color: "#111827",
          }),

          ...styles,
        }}
      />
    </div>
  );
}