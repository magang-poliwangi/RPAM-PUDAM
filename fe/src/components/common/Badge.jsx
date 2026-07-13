const VARIANTS = {
  teal: 'bg-teal-100 text-teal-700',
  gray: 'bg-gray-100 text-gray-600',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-600',
  yellow: 'bg-yellow-100 text-yellow-700',
  blue: 'bg-blue-100 text-blue-700',
};

export default function Badge({ label, variant = 'gray' }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant] || VARIANTS.gray}`}>
      {label}
    </span>
  );
}