import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import IconButton from '../components/common/IconButton';
import AddButton from '../components/common/AddButton';
import { EditIcon, DeleteIcon } from '../components/common/icons';
import useModalForm from '../hooks/useModalForm';
import useConfirmDialog from '../hooks/useConfirmDialog';
import { omitFields } from '../utils/omit-fields';
import {
  asyncAddKajiUlangRisiko,
  asyncDeleteKajiUlangRisiko,
  asyncReceiveKajiUlangRisiko,
  asyncUpdateKajiUlangRisiko,
} from '../states/kajiUlangRisiko/action';
import KajiUlangRisikoFormComponent from '../components/kajiUlangRisiko/KajiUlangRisikoFormComponent';
import { RELATION_COLUMN_GROUPS, RELATION_ORDER } from '../components/kajiUlangRisiko/kajiUlangRisiko.relationColumns';
import { kajiUlangRisikoColumns } from '../components/kajiUlangRisiko/kajiUlangRisiko.columns';
import { lokasiSpamApi } from '../api/lokasi-spam';
import { bahayakontaminasiApi } from '../api/bahaya-kontaminasi';
import FilterPanelComponent from '../components/common/FilterPanelComponent';
import { createAsyncOptionsLoader } from '../utils/option-loader';

const EMPTY_FORM = { penilaianRisikoId: '', tindakanPengendalian: '', referensi: '', validasi: '', peluangSetelah: 0, dampakSetelah: 0 };


const READONLY_FIELDS = ['id', 'skorSetelah', 'tingkatRisikoSetelah', 'createdAt', 'updatedAt', 'penilaianRisiko'];


export default function KajiUlangRisikoPage() {
  const dispatch = useDispatch();
  const { items, pagination } = useSelector(
    (state) => state.kajiUlangRisiko || { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
  );


  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    sortOrder: "",
    startDate: "",
    endDate: "",
    lokasi: null,
    bahaya: null
  });

  const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
  const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
    delete: (row) => dispatch(asyncDeleteKajiUlangRisiko(row.id)),
  });
  const [selectedColumns, setSelectedColumns] = useState([]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  }, []);



  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const params = {
      page,
      limit: 10,
      search: filters.search || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      kodeLokasi: filters.lokasi?.raw?.kodeLokasi || undefined,
      kodeRisiko: filters.bahaya?.raw?.kodeRisiko || undefined,
    };
    if (filters.sortOrder) {
      params.sortBy = "kodeRisiko";
      params.sortOrder = filters.sortOrder;
    }
    dispatch(asyncReceiveKajiUlangRisiko(params))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [dispatch, page, filters]);

  const handleSearchChange = useCallback(
    (value) => updateFilter("search", value),
    [updateFilter]
  );

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      setSaveLoading(true);
      try {
        const payload = omitFields(modal.form, READONLY_FIELDS);
        if (modal.mode === 'edit') {
          await dispatch(asyncUpdateKajiUlangRisiko({ id: modal.form.id, payload }));
        } else {
          await dispatch(asyncAddKajiUlangRisiko(payload));
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
      ...kajiUlangRisikoColumns,
      ...sorted.flatMap(({ value }) => RELATION_COLUMN_GROUPS[value]?.columns ?? []),
    ];
  }, [selectedColumns]);

  const handleSelectFilter = useCallback((key, e) => {
    updateFilter(key, e?.target?.selectedOption ?? null);
  }, [updateFilter]);



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

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kaji Ulang Risiko</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tindakan pengendalian dan evaluasi efektivitas</p>
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
        headerExtra={<>
          <div className="flex flex-wrap items-end justify-end gap-2.5">
            <AddButton id="btn-add-kaji-ulang" onClick={openAdd} />
          </div>
        </>}
        actions={(row) => (
          <>
            <IconButton onClick={() => openEdit(row)} title="Edit" colorClass="hover:text-teal-700 hover:bg-teal-50"><EditIcon /></IconButton>
            <IconButton onClick={() => openConfirm(row)} title="Hapus" colorClass="hover:text-red-600 hover:bg-red-50"><DeleteIcon /></IconButton>
          </>
        )}
      />
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Kaji Ulang Risiko' : 'Tambah Kaji Ulang Risiko'}>
        <KajiUlangRisikoFormComponent
          form={modal.form}
          onChange={setForm}
          mode={modal.mode}
          onSubmit={handleSave}
          onCancel={closeModal}
          loading={saveLoading}
        />
      </Modal>
      <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data kaji ulang risiko ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
    </>
  );
}