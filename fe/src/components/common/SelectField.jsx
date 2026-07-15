import Select from "react-select";

export default function SelectField({
  name,
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "-- Pilih --",
}) {
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
        options={options}
        value={options.find((opt) => opt.value === value) || null}
        onChange={(selected) =>
          onChange({
            target: {
              name,
              value: selected?.value || "",
            },
          })
        }
        placeholder={placeholder}
        isSearchable
        isClearable={!required}
        className="text-sm"
        classNamePrefix="react-select"
      />
    </div>
  );
}