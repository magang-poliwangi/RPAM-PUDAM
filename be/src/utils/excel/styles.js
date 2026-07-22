export function headerStyle(cell) {
  cell.font = { bold: true };
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "D9EAD3" },
  };
  cell.border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };
  cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
}

export function dataStyle(cell) {
  cell.border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };
  cell.alignment = { vertical: "middle", wrapText: true };
}


export function columnNumberStyle(cell) {
  cell.font = { italic: true, size: 9, color: { argb: "FF808080" } };
  cell.alignment = { horizontal: "center" };
  cell.border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };
}

export function getSkorRisikoColor(skor) {
    const value = Number(skor);
    if (isNaN(value)) return null;
    if (value <= 5) return "92D050";   // hijau - Rendah
    if (value <= 10) return "00B0F0";  // biru - Medium
    if (value <= 15) return "D9D9D9";  // grey - Tinggi
    if (value <= 20) return "FFFF00";  // kuning - Sangat Tinggi
    return "FF0000";                   // merah - Ekstrem
}

export function riskFillStyle(cell, skor) {
    dataStyle(cell);
    const color = getSkorRisikoColor(skor);
    if (color) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
        if (color === "FF0000") cell.font = { color: { argb: "FFFFFFFF" } };
    }
}
export function getTingkatRisikoColor(tingkat) {
    const map = {
        "Rendah": "92D050",
        "Medium": "00B0F0",
        "Tinggi": "D9D9D9",
        "Sangat Tinggi": "FFFF00",
        "Ekstrem": "FF0000",
    };
    return map[tingkat] ?? null;
}

export function tingkatFillStyle(cell, tingkat) {
    dataStyle(cell);
    const color = getTingkatRisikoColor(tingkat);
    if (color) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
        if (color === "FF0000") cell.font = { color: { argb: "FFFFFFFF" } };
    }
}