export default function CheckboxField({ name, label, checked, onChange, disabled }) {
  return (
    <label
      htmlFor={name}
      className="flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed"
    >
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={!!checked}
        disabled={disabled}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 focus:ring-2"
      />
      <span className="text-sm text-gray-700 select-none">{label}</span>
    </label>
  );
}