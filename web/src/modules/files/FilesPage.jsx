import React, { useEffect, useState } from "react";
import { Folder, Upload, FileText, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    originalName: "",
    fileName: "",
    mimeType: "application/pdf",
    size: 1024,
    url: "",
    category: "BUSINESS_DOC",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiRequest("/files");
      if (res.success && Array.isArray(res.data)) {
        setFiles(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load files repository");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await apiRequest("/files", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          fileName: formData.fileName || formData.originalName,
          size: Number(formData.size),
        }),
      });
      if (res.success) {
        setShowModal(false);
        setFormData({
          originalName: "",
          fileName: "",
          mimeType: "application/pdf",
          size: 1024,
          url: "",
          category: "BUSINESS_DOC",
        });
        await loadFiles();
      }
    } catch (err) {
      alert(err.message || "Failed to register document");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this document?")) return;
    try {
      const res = await apiRequest(`/files/${id}`, { method: "DELETE" });
      if (res.success) await loadFiles();
    } catch (err) {
      alert(err.message || "Failed to delete file");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Document & File Storage</h1>
          <p className="text-sm text-slate-500">Business registration documents, plant catalogs, and tax records</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1b6840] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155433] transition"
        >
          <Upload size={16} /> Register Document
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Folder className="mx-auto mb-3 text-slate-300" size={40} />
          <h3 className="font-semibold text-slate-800">No documents stored</h3>
          <p className="mt-1 text-sm text-slate-500">Attach certificates, licenses, or plant photo records.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <div key={file._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 line-clamp-1">{file.originalName}</h3>
                    <span className="text-[11px] text-slate-400 uppercase font-mono">{file.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(file._id)}
                  className="p-1 text-slate-400 hover:text-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>{(file.size / 1024).toFixed(1)} KB</span>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Open / View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Register File Record</h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Document Title / Name</label>
                <input
                  required
                  value={formData.originalName}
                  onChange={(e) => setFormData({ ...formData, originalName: e.target.value })}
                  placeholder="e.g. Nursery Nursery License 2026.pdf"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                >
                  <option value="BUSINESS_DOC">Business Document / License</option>
                  <option value="PLANT_IMAGE">Plant Botanical Photo</option>
                  <option value="INVOICE_PDF">Non-GST Invoice Copy</option>
                  <option value="RECEIPT_PDF">Payment Receipt</option>
                  <option value="EXPENSE_RECEIPT">Expense Voucher</option>
                  <option value="GENERAL">General Attachment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Document URL / Storage Link</label>
                <input
                  required
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://storage.nurseryos.in/docs/license.pdf"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#1b6840] px-4 py-2 text-sm font-semibold text-white hover:bg-[#155433] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

