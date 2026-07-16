/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import useModalForm from "../hooks/useModalForm";
import useConfirmDialog from "../hooks/useConfirmDialog";
import { omitFields } from "../utils/omit-fields";
import DataTable from "../components/common/DataTable";
import AddButton from "../components/common/AddButton";
import IconButton from "../components/common/IconButton";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Badge from "../components/common/Badge";
import { formatRupiah } from "../utils/format-rupiah";
import { DeleteIcon, EditIcon } from "../components/common/icons";
import RencanaPerbaikanFormComponent from "../components/rencanaPerbaikan/RencanaPerbaikanFormComponent";
import { useDispatch, useSelector } from "react-redux";
import { asyncAddRencanaPerbaikan, asyncDeleteRencanaPerbaikan, asyncReceiveRencanaPerbaikan, asyncUpdateRencanaPerbaikan } from "../states/rencanaPerbaikan/action";
import { asyncReceiveKajiUlangRisiko } from "../states/kajiUlangRisiko/action";

const EMPTY_FORM = {
  kajiUlangRisikoId: '', rencanaPerbaikan: '', penanggungJawab: '',
  jadwal: '', biaya: '', sumberPembiayaan: '',
  statusKemajuan: '', kendala: '', prioritas: '',
};


const STATUS_LABEL = { BELUM_MULAI: 'Belum Mulai', SEDANG_BERJALAN: 'Sedang Berjalan', SELESAI: 'Selesai', TERTUNDA: 'Tertunda' };
const STATUS_VARIANT = { BELUM_MULAI: 'gray', SEDANG_BERJALAN: 'blue', SELESAI: 'green', TERTUNDA: 'yellow' };
const READONLY_FIELDS = ['id', 'createdAt', 'updatedAt', 'kajiUlangRisiko'];


export default function RencanaPerbaikanPage() {
  const dispatch = useDispatch();
  const { items, pagination } = useSelector(
    (state) => state.rencanaPerbaikan || { items: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
  );
  const kajiUlangRisikoState = useSelector(
    (state) => state.kajiUlangRisiko
  );

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(false);

  const { modal, openAdd, openEdit, close: closeModal, setForm } = useModalForm(EMPTY_FORM);
  const { confirm, open: openConfirm, close: closeConfirm, confirmAction } = useConfirmDialog({
    delete: (row) => dispatch(asyncDeleteRencanaPerbaikan(row.id)),
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dispatch(asyncReceiveRencanaPerbaikan({ page, limit: 10, search })),
      dispatch(asyncReceiveKajiUlangRisiko({ limit: 1000 }))
    ])
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [dispatch, page, search]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);



  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      setSaveLoading(true);
      try {
        const payload = omitFields(modal.form, READONLY_FIELDS);
        if (modal.mode === 'edit') {
          await dispatch(asyncUpdateRencanaPerbaikan({ id: modal.form.id, payload }));
        } else {
          await dispatch(asyncAddRencanaPerbaikan(payload));
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

  const columns = [
    { key: 'rencanaPerbaikan', label: 'Rencana Perbaikan', render: (v) => <span className="line-clamp-2 max-w-xs">{v}</span> },
    { key: 'penanggungJawab', label: 'Penanggung Jawab' },
    { key: 'jadwalPelaksanaan', label: 'Jadwal Pelaksanaan' },
    { key: 'biaya', label: 'Biaya', render: (v) => <span className="text-xs">{formatRupiah(v)}</span> },
    { key: 'sumberPembiayaan', label: 'Sumber Pembiayaan' },
    { key: 'statusKemajuan', label: 'Status Kemajuan', render: (v) => <Badge label={STATUS_LABEL[v] || v} variant={STATUS_VARIANT[v]} /> },
    { key: 'kendalaKeuangan', label: 'Kendala Keungan', render: (v) => <span className="text-xs capitalize">{v ? 'Iya' : '-'}</span> },
    { key: 'kendalaTenagaKerja', label: 'Kendala Tenaga Kerja', render: (v) => <span className="text-xs capitalize">{v ? 'Iya' : '-'}</span> },
    { key: 'prioritas', label: 'Skala Prioritas', render: (v) => <span className="text-xs capitalize">{v?.toLowerCase() || '-'}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Rencana Perbaikan</h1>
        <p className="text-sm text-gray-500 mt-0.5">Perencanaan tindakan perbaikan risiko</p>
      </div>
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari..."
        emptyMessage="Data tidak ditemukan"
        headerExtra={<AddButton id="btn-add-kaji-ulang" onClick={openAdd} />}
        actions={(row) => (
          <>
            <IconButton onClick={() => openEdit(row)} title="Edit" colorClass="hover:text-teal-700 hover:bg-teal-50"><EditIcon /></IconButton>
            <IconButton onClick={() => openConfirm(row)} title="Hapus" colorClass="hover:text-red-600 hover:bg-red-50"><DeleteIcon /></IconButton>
          </>
        )}
      />
      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Rencana Perbaikan' : 'Tambah Rencana Perbaikan'} size="lg">
        <RencanaPerbaikanFormComponent 
          kajiUlangRisiko={kajiUlangRisikoState} 
          usedKajiUlangRisikoIds={items.map(rp => rp.kajiUlangRisikoId)}
          form={modal.form} 
          onChange={setForm} 
          onSubmit={handleSave} 
          onCancel={closeModal} 
          loading={saveLoading} 
          mode={modal.mode} 
        />
      </Modal>
      <ConfirmDialog open={confirm.open} title="Hapus Data?" message="Data rencana perbaikan ini akan dihapus." onConfirm={confirmAction} onCancel={closeConfirm} />
    </>
  );
}