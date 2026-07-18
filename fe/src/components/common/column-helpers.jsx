
// akses nested value pakai dot path, misal getByPath(row, 'lokasiSpam.kodeLokasi')
export function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

// kolom teks biasa
export function textColumn(key, label, opts = {}) {
  return { key, label, ...opts };
}

// kolom yang ngambil data dari relasi nested
export function relationColumn(path, label, opts = {}) {
  return {
    key: path, 
    label,
    width: opts.width,
    render: (_, row) => {
      const value = getByPath(row, path);
      return opts.render ? opts.render(value, row) : (value ?? '-');
    },
  };
}

// kolom teks panjang yang di-clamp 2 baris
export function clampColumn(key, label, opts = {}) {
  return {
    key,
    label,
    render: (v) => <span className={`line-clamp-2 ${opts.maxWidth || 'max-w-xs'}`}>{v ?? '-'}</span>,
  };
}

// kolom checkmark boolean tunggal
export function checkColumn(key, label, opts = {}) {
  return {
    key,
    label,
    width: opts.width || '80px',
    render: (v) => (v ? '✓' : ''),
  };
}

// group header (colSpan gabungan)
export function columnGroup(label, children) {
  return { label, children };
}

// SATU field enum -> beberapa kolom checkmark (pola "Validasi", "Skala Prioritas")
export function enumCheckGroup(sourceKey, groupLabel, options) {
  return columnGroup(groupLabel, options.map((opt) => ({
    key: `${sourceKey}__${opt.value}`,
    label: opt.label,
    width: opt.width || '90px',
    render: (_, row) => (row[sourceKey] === opt.value ? '✓' : ''),
  })));
}

// kolom badge status pakai map label+variant
export function badgeColumn(key, label, { labelMap, variantMap }, BadgeComponent) {
  return {
    key,
    label,
    render: (v) => <BadgeComponent label={labelMap?.[v] || v} variant={variantMap?.[v]} />,
  };
}