import { columnGroup, textColumn } from "../../utils/column-helpers";
import RiskLevelBadge from "./RiskLevelBadge";

export function risikoColumns(groupLabel, { peluangKey, dampakKey, skorKey, tingkatKey }) {
  return columnGroup(groupLabel, [
    textColumn(peluangKey, 'Peluang Kejadian Bahaya'),
    textColumn(dampakKey, 'Dampak Keparahan'),
    { key: skorKey, label: 'Skor Risiko', render: (v) => <span className="font-semibold text-gray-900">{v}</span> },
    { key: tingkatKey, label: 'Tingkat Risiko', render: (v) => <RiskLevelBadge level={v} /> },
  ]);
}