import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import PemantauanOperasionalTable from "../Features/components/PemantauanOperasionalTable.jsx";
import PemantauanOperasionalForm from "../Features/components/PemantauanOperasionalForm.jsx";

import {
  fetchList,
  fetchDropdown,
  createItem,
  updateItem,
  deleteItem,
  setSearch,
  setSort,
  selectPemantauanItems,
  selectPemantauanStatus,
  selectPemantauanQuery,
  selectPemantauanDropdown,
  selectPemantauanHasMore,
} from "../Features/pemantauanOperasional/pemantauanOperasionalSlice.js";

function PemantauanOperasionalPage() {
  const dispatch = useDispatch();

  const items = useSelector(selectPemantauanItems);
  const status = useSelector(selectPemantauanStatus);
  const query = useSelector(selectPemantauanQuery);
  const dropdownOptions = useSelector(selectPemantauanDropdown);
  const hasMore = useSelector(selectPemantauanHasMore);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const searchDebounceRef = useRef(null);

  useEffect(() => {
    dispatch(fetchList());
    dispatch(fetchDropdown());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchList());
  }, [dispatch, query.search, query.sortBy, query.sortOrder]);

  const handleSearchChange = (value) => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      dispatch(setSearch(value));
    }, 400);
  };

  const handleSortChange = (key) => {
    dispatch(setSort(key));
  };

  const handleLoadMore = () => {
    if (status !== "loading") {
      dispatch(fetchList());
    }
  };

  const openCreateForm = () => {
    setEditingRow(null);
    dispatch(fetchDropdown());
    setFormOpen(true);
  };

  const openEditForm = (row) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const handleSubmit = async (form) => {
    setSubmitting(true);

    const action = editingRow
      ? updateItem({
          id: editingRow.id,
          payload: form,
        })
      : createItem(form);

    const result = await dispatch(action);

    setSubmitting(false);

    if (result.meta.requestStatus === "fulfilled") {
      setFormOpen(false);
      setEditingRow(null);
      dispatch(fetchList());
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    await dispatch(deleteItem(deleteTarget.id));

    setDeleteTarget(null);

    dispatch(fetchList());
  };

  return (
    <div className="mx-auto max-w-7xl p-6">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Pemantauan Operasional (M6.2)
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitoring Data Operasional
          </p>

        </div>

        <button
          onClick={openCreateForm}
          className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white shadow hover:bg-green-700"
        >
          + Tambah Data
        </button>

      </div>

      {/* TABLE */}
      <PemantauanOperasionalTable
        items={items}
        searchValue={query.search}
        sortBy={query.sortBy}
        sortOrder={query.sortOrder}
        hasMore={hasMore}
        loading={status === "loading"}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onLoadMore={handleLoadMore}
        onEdit={openEditForm}
        onDelete={setDeleteTarget}
      />

      {/* MODAL */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="mx-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-semibold">

                {editingRow
                  ? "Edit Pemantauan Operasional"
                  : "Tambah Pemantauan Operasional"}

              </h2>

              <button
                onClick={() => {
                  setFormOpen(false);
                  setEditingRow(null);
                }}
                className="text-3xl text-gray-500 hover:text-red-500"
              >
                ×
              </button>

            </div>

            <PemantauanOperasionalForm
              initialValues={editingRow}
              dropdownOptions={dropdownOptions}
              onSubmit={handleSubmit}
              onCancel={() => {
                setFormOpen(false);
                setEditingRow(null);
              }}
              submitting={submitting}
            />

          </div>

        </div>
      )}

      {/* DELETE */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Data?"
        message="Apakah Anda yakin ingin menghapus data ini?"
        confirmLabel="Hapus"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
}

export default PemantauanOperasionalPage;