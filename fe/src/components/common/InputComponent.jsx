import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function formatThousand(val) {
    if (val === "" || val === null || val === undefined) return "";
    const digits = String(val).replace(/\D/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("id-ID");
}

export default function InputComponent({
    name,
    toggle,
    onChangeToggle,
    type = "text",
    placeholder,
    label,
    value,
    onChangeValue,
    leftIcon: LeftIcon,
    error,
    required = false,
    thousandSeparator = false,
}) {
    function handleChange(e) {
        if (!thousandSeparator) {
            onChangeValue(e);
            return;
        }
        const raw = e.target.value.replace(/\D/g, "");
        onChangeValue({ ...e, target: { ...e.target, name, value: raw } });
    }

    const displayValue = thousandSeparator ? formatThousand(value) : value;
    const inputType = thousandSeparator ? "text" : type;

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={name} className="text-sm font-semibold text-brand-900">
                    {label}
                </label>
            )}

            <div className="flex items-center w-full relative">
                {LeftIcon && (
                    <LeftIcon className="absolute left-3 text-lg text-brand-600 pointer-events-none" />
                )}

                <input
                    id={name}
                    name={name}
                    required={required}
                    type={inputType}
                    inputMode={thousandSeparator ? "numeric" : undefined}
                    className={`w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors ${
                        LeftIcon ? "pl-9" : "pl-3"
                    } ${toggle ? "pr-9" : "pr-3"} placeholder:text-neutral-400 transition-colors
                    ${
                        error
                            ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                            : "border-brand-100 focus:ring-2 focus:ring-brand-200 focus:border-brand-500"
                    } focus:outline-none`}
                    placeholder={placeholder}
                    value={displayValue}
                    onChange={handleChange}
                    aria-invalid={!!error}
                />

                {toggle && (
                    <button
                        type="button"
                        onClick={onChangeToggle}
                        aria-label={type === "password" ? "Tampilkan password" : "Sembunyikan password"}
                        className="absolute right-3 text-brand-600 hover:text-brand-700 cursor-pointer"
                    >
                        {type === "password" ? <IoEyeOutline /> : <IoEyeOffOutline />}
                    </button>
                )}
            </div>

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}