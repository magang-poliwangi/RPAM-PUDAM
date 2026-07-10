function PemantauanOperasionalTable({
  items = [],
  searchValue,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  hasMore,
  loading,
  onLoadMore,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-xl bg-white shadow-md border border-gray-200 overflow-hidden">

      {/* HEADER */}
      <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 p-4 md:flex-row md:items-center md:justify-between">

        <input
          type="text"
          placeholder="Cari kode risiko atau apa yang dipantau..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-600 focus:outline-none md:w-80"
        />

        <div className="flex items-center gap-2">

          <label className="text-sm font-medium text-gray-600">
            Urutkan
          </label>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          >
            <option value="createdAt">Tanggal Dibuat</option>
            <option value="kapan">Kapan</option>
            <option value="batasKritis">Batas Kritis</option>
          </select>

          <span className="text-sm text-gray-500">
            {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
          </span>

        </div>

      </div>

      {/* RESPONSIVE */}
      <div className="overflow-x-auto">

        <table className="min-w-[1200px] w-full border-collapse">

          <thead>

            <tr className="bg-blue-900 text-white">

              <th className="border border-gray-300 px-4 py-3 text-left">
                No
              </th>

              <th className="border border-gray-300 px-4 py-3 text-left">
                Kode Risiko
              </th>

              <th className="border border-gray-300 px-4 py-3 text-left">
                Apa yang Dipantau
              </th>

              <th className="border border-gray-300 px-4 py-3 text-left">
                Dimana
              </th>

              <th className="border border-gray-300 px-4 py-3 text-left">
                Kapan
              </th>

              <th className="border border-gray-300 px-4 py-3 text-left">
                Bagaimana
              </th>

              <th className="border border-gray-300 px-4 py-3 text-left">
                Pelaksana
              </th>

              <th className="border border-gray-300 px-4 py-3 text-left">
                Analis
              </th>

              <th className="border border-gray-300 px-4 py-3 text-left">
                Batas Kritis
              </th>

              <th className="border border-gray-300 px-4 py-3 text-center">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {items.length === 0 ? (

              <tr>

                <td
                  colSpan={10}
                  className="border border-gray-300 py-8 text-center text-gray-500"
                >
                  Belum ada data Pemantauan Operasional.
                </td>

              </tr>

            ) : (

              items.map((item, index) => (

                <tr
                  key={item.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-green-50"
                >

                  <td className="border border-gray-300 px-3 py-3">
                    {index + 1}
                  </td>

                  <td className="border border-gray-300 px-3 py-3">
                    {item.kajiUlangRisiko?.penilaianRisiko
                      ?.identifikasiBahaya?.kodeRisiko ?? "-"}
                  </td>

                  <td className="border border-gray-300 px-3 py-3">
                    {item.apaYangDimonitor}
                  </td>

                  <td className="border border-gray-300 px-3 py-3">
                    {item.dimana}
                  </td>

                  <td className="border border-gray-300 px-3 py-3">
                    {item.kapan}
                  </td>

                  <td className="border border-gray-300 px-3 py-3">
                    {item.bagaimana}
                  </td>

                  <td className="border border-gray-300 px-3 py-3">
                    {item.siapaYangMelakukan}
                  </td>

                  <td className="border border-gray-300 px-3 py-3">
                    {item.siapaYangAkanMenganalisisHasilnya}
                  </td>

                  <td className="border border-gray-300 px-3 py-3">
                    {item.batasKritis || "-"}
                  </td>

                  <td className="border border-gray-300 px-3 py-3">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-md bg-amber-500 px-3 py-1 text-sm text-white hover:bg-amber-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => onDelete(item)}
                        className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                      >
                        Hapus
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* LOAD MORE */}

      {hasMore && (

        <div className="border-t border-gray-200 p-4 text-center">

          <button
            onClick={onLoadMore}
            disabled={loading}
            className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>

        </div>

      )}

    </div>
  );
}

export default PemantauanOperasionalTable;