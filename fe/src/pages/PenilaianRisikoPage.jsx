/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useModalForm from "../hooks/useModalForm";
import { asyncAddPenilaianRisiko, asyncDeletePenilaianRisiko, asyncReceivePenilaianRisiko, asyncUpdatePenilaianRisiko } from "../states/penilaianRisiko/action";
import { omitFields } from "../utils/omit-fields";
import DataTable from "../components/common/DataTable";
import AddButton from "../components/common/AddButton";
import IconButton from "../components/common/IconButton";
import Modal from "../components/common/Modal";
import PenilaianRisikoFormComponent from "../components/penilaianRisiko/PenilaianRisikoFormComponent";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { DeleteIcon, EditIcon } from "../components/common/icons";
import useConfirmDialog from "../hooks/useConfirmDialog";
import { penilaianRisikoColumns } from "../components/penilaianRisiko/penilaianRisiko.columns";
import { RELATION_COLUMN_GROUPS, RELATION_ORDER } from "../components/penilaianRisiko/penilaianRisiko.relationColumns";
import { createAsyncOptionsLoader } from "../utils/option-loader";
import { lokasiSpamApi } from "../api/lokasi-spam";
import { bahayakontaminasiApi } from "../api/bahaya-kontaminasi";
import FilterPanelComponent from "../components/common/FilterPanelComponent";


const EMPTY_FORM = { identifikasiBahayaId: '', peluangKejadianBahaya: '', dampakKeparahan: '' };
const READONLY_FIELDS = ['id', 'skorRisiko', 'tingkatRisiko', 'warnaTingkatRisiko', 'createdAt', 'updatedAt', 'identifikasiBahaya'];


export default function PenilaianRisikoPage() {
  const dispatch = useDispatch();
  const { items, pagination } = useSelector(
    (state) => state.penilaianRisiko || { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
  );

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]); const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
  const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
    delete: (row) => dispatch(asyncDeletePenilaianRisiko(row.id)),
  });
  const [filters, setFilters] = useState({
    search: "",
    // sortOrder: "",
    startDate: "",
    endDate: "",
    lokasi: null,
    bahaya: null
  })



  useEffect(() => {
    const params = {
      page,
      limit: 10,
      search: filters.search || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      kodeLokasi: filters.lokasi?.raw?.kodeLokasi || undefined,
      kodeRisiko: filters.bahaya?.raw?.kodeRisiko || undefined,
    };

    setLoading(true);
    dispatch(asyncReceivePenilaianRisiko(params))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [dispatch, page, filters]);





  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      setSaveLoading(true);
      try {
        const payload = omitFields(modal.form, READONLY_FIELDS);
        if (modal.mode === 'edit') {
          await dispatch(asyncUpdatePenilaianRisiko({ id: modal.form.id, payload }));
        } else {
          await dispatch(asyncAddPenilaianRisiko(payload));
        }
        closeModal();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menyimpan data');
      } finally {
        setSaveLoading(false);
      }
    },
    [dispatch, modal, closeModal]
  );
  const columnOptions = Object.entries(RELATION_COLUMN_GROUPS).map(([value, group]) => ({
    value,
    label: group.label,
  }));
  const columns = useMemo(() => {
    const sorted = [...selectedColumns].sort(
      (a, b) => RELATION_ORDER.indexOf(a.value) - RELATION_ORDER.indexOf(b.value)
    );
    return [
      ...penilaianRisikoColumns,
      ...sorted.flatMap(({ value }) => RELATION_COLUMN_GROUPS[value]?.columns ?? []),
    ];
  }, [selectedColumns]);

  const loadLokasiSpamOptions = useMemo(
    () =>
      createAsyncOptionsLoader(
        lokasiSpamApi,
        (item) => `${item.kodeLokasi} - ${item.namaLokasi} `
      ),
    []
  );
  const loadBahayaKontaminasiOptions = useMemo(
    () =>
      createAsyncOptionsLoader(
        bahayakontaminasiApi,
        (item) => `${item.kodeRisiko} - ${item.kontaminasiX} - ${item.tipeBahaya}`
      ),
    []
  );

  const handleResetFilter = () => {
    setFilters({
      search: "",
      // sortOrder: "",
      startDate: "",
      endDate: "",
      lokasi: null,
      bahaya: null,

    });
    setSelectedColumns([]);
    setPage(1);
  };
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  }, []);

  const handleSearchChange = useCallback(
    (value) => updateFilter("search", value),
    [updateFilter]
  );

  const handleSelectFilter = useCallback((key, e) => {
    updateFilter(key, e?.target?.selectedOption ?? null);
  }, [updateFilter]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Penilaian Risiko</h1>
        <p className="text-sm text-gray-500 mt-0.5">Penilaian peluang dan dampak untuk setiap bahaya</p>
      </div>
      <FilterPanelComponent
        lokasiValue={filters.lokasi}
        onLokasiChange={(e) => handleSelectFilter("lokasi", e)}
        loadLokasiOptions={loadLokasiSpamOptions}
        bahayaValue={filters.bahaya}
        onBahayaChange={(e) => handleSelectFilter("bahaya", e)}
        loadBahayaOptions={loadBahayaKontaminasiOptions}
        // sortOrder={filters.sortOrder}
        // onSortOrderChange={(v) => updateFilter("sortOrder", v)}
        startDate={filters.startDate}
        onStartDateChange={(v) => updateFilter("startDate", v)}
        endDate={filters.endDate}
        onEndDateChange={(v) => updateFilter("endDate", v)}
        columnOptions={columnOptions}
        selectedColumns={selectedColumns}
        onSelectedColumnsChange={setSelectedColumns}
        onReset={handleResetFilter}
      />
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        search={filters.search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari..."
        emptyMessage="Data tidak ditemukan"
        headerExtra={
          <AddButton id="btn-add-kaji-ulang" onClick={openAdd} />
        }
        actions={(row) => (
          <>
            <IconButton onClick={() => openEdit(row)} title="Edit" colorClass="hover:text-teal-700 hover:bg-teal-50"><EditIcon /></IconButton>
            <IconButton onClick={() => openConfirm(row)} title="Hapus" colorClass="hover:text-red-600 hover:bg-red-50"><DeleteIcon /></IconButton>
          </>
        )}
      />
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Penilaian Risiko' : 'Tambah Penilaian Risiko'}>
        <PenilaianRisikoFormComponent form={modal.form} onChange={setForm} onSubmit={handleSave} onCancel={closeModal} loading={saveLoading} mode={modal.mode} />
      </Modal>
      <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data penilaian risiko ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
    </>
  );
}