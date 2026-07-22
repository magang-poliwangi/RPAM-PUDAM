import Select from "react-select";

export default function SelectField({
  name,
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "-- Pilih --",
  size = "sm",
  styles = {},
  isMulti = false,
}) {
  const SIZE = {
    sm: {
      height: "32px",
      fontSize: "12px",
    },
    md: {
      height: "38px",
      fontSize: "14px",
    },
    lg: {
      height: "44px",
      fontSize: "16px",
    },
  };

  const current = SIZE[size] ?? SIZE.sm;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-semibold text-brand-900">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <Select
        inputId={name}
        name={name}
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isSearchable
        isClearable={!required}
        className="text-sm"
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: current.height,
            fontSize: current.fontSize,
            borderColor: state.isFocused ? "#14b8a6" : "#d1d5db",
            boxShadow: "none",
            "&:hover": {
              borderColor: "#14b8a6",
            },
          }),

          valueContainer: (base) => ({
            ...base,
            padding: "0 8px",
          }),

          indicatorsContainer: (base) => ({
            ...base,
            minHeight: current.height,
          }),

          menuPortal: (base) => ({
            ...base,
            zIndex: 99999,
          }),

          menu: (base) => ({
            ...base,
            zIndex: 99999,
            fontSize: current.fontSize,
          }),

          option: (base, state) => ({
            ...base,
            fontSize: current.fontSize,
            backgroundColor: state.isFocused ? "#f0fdfa" : "#fff",
            color: "#111827",
          }),

          ...styles,
        }}
      />
    </div>
  );
}