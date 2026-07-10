// Risk level badge component - colors must match backend getRiskLevel()
const RISK_CONFIG = {
  RENDAH: { label: 'Rendah', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  MEDIUM: { label: 'Medium', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  TINGGI: { label: 'Tinggi', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-500' },
  SANGAT_TINGGI: { label: 'Sangat Tinggi', bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  EKSTREM: { label: 'Ekstrem', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

export default function RiskLevelBadge({ level }) {
  const config = RISK_CONFIG[level] || { label: level || '-', bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
