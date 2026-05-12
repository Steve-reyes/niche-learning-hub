"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, User as UserIcon, Phone, MapPin, Eye, Download, ToggleLeft, ToggleRight } from "lucide-react";

interface UserDTO {
  id: string;
  username: string;
  email: string;
  fullName: string;
  mobile: string;
  location: string;
  disabled: boolean;
  createdAt: string;
  _count: { progress: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", fullName: "", mobile: "", location: "" });
  const [error, setError] = useState("");
  const [viewingUser, setViewingUser] = useState<UserDTO | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      setUsers(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ username: "", email: "", password: "", fullName: "", mobile: "", location: "" });
    setError("");
    setShowForm(true);
  };

  const openEdit = (u: UserDTO) => {
    setEditingId(u.id);
    setForm({ username: u.username, email: u.email, password: "", fullName: u.fullName, mobile: u.mobile, location: u.location });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      try {
        if (editingId) {
          const body: any = { username: form.username, email: form.email, fullName: form.fullName, mobile: form.mobile, location: form.location };
          if (form.password) body.password = form.password;
          const res = await fetch(`/api/users/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (!res.ok) { setError("Username or email already taken"); return; }
        } else {
          if (!form.password) { setError("Password is required"); return; }
          const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
          if (!res.ok) { setError("Username or email already taken"); return; }
        }
        setShowForm(false);
        fetchUsers();
      } catch {
        setError("Something went wrong");
      }
    },
    [editingId, form, fetchUsers]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this user and all their progress?")) return;
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      fetchUsers();
    },
    [fetchUsers]
  );

  const handleToggleDisable = useCallback(
    async (u: UserDTO) => {
      await fetch(`/api/users/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled: !u.disabled }),
      });
      fetchUsers();
    },
    [fetchUsers]
  );

  const handleExport = useCallback(() => {
    const headers = ["Username", "Full Name", "Email", "Mobile", "Location", "Disabled", "Progress", "Created At"];
    const rows = users.map((u) => [
      u.username,
      u.fullName,
      u.email,
      u.mobile,
      u.location,
      u.disabled ? "Yes" : "No",
      u._count.progress.toString(),
      new Date(u.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [users]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Users</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {users.length} registered users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-text-tertiary)]">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-[var(--color-text-tertiary)]">No users found.</p>
      ) : (
        <div className="space-y-2">
          {users.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)]">
                <UserIcon className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                  {u.username}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                  {u.fullName || u.username} &middot; {u.email} &middot; {u.mobile || "—"} &middot; {u.location || "—"} &middot; {u._count.progress} completed
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewingUser(u)}
                  className="rounded-lg p-2 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleToggleDisable(u)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                    u.disabled
                      ? "bg-[var(--color-rose-subtle)] text-[var(--color-rose)] hover:bg-[var(--color-rose)] hover:text-white"
                      : "bg-[var(--color-green-subtle)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white"
                  }`}
                  title={u.disabled ? "Enable user" : "Disable user"}
                >
                  {u.disabled ? <ToggleLeft className="h-3.5 w-3.5" /> : <ToggleRight className="h-3.5 w-3.5" />}
                  {u.disabled ? "Disabled" : "Active"}
                </button>
                <div className="h-6 w-px bg-[var(--color-border)]" />
                <button
                  onClick={() => openEdit(u)}
                  className="rounded-lg p-2 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="rounded-lg p-2 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-rose-subtle)] hover:text-[var(--color-rose)]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                {editingId ? "Edit User" : "Add User"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Username"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]"
              />
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Full Name"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]"
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                type="email"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]"
              />
              <input
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="Mobile #"
                type="tel"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]"
              />
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Current Location"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]"
              />
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={editingId ? "New password (leave blank to keep)" : "Password"}
                type="password"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]"
              />
              {error && <p className="text-sm text-[var(--color-rose)]">{error}</p>}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                <Check className="h-4 w-4" />
                {editingId ? "Save Changes" : "Create User"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {viewingUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setViewingUser(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">User Details</h2>
              <button onClick={() => setViewingUser(null)} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)]">
                  <UserIcon className="h-8 w-8 text-[var(--color-accent)]" />
                </div>
              </div>
              {[
                { label: "Username", value: viewingUser.username },
                { label: "Full Name", value: viewingUser.fullName },
                { label: "Email", value: viewingUser.email },
                { label: "Mobile", value: viewingUser.mobile || "—" },
                { label: "Location", value: viewingUser.location || "—" },
                { label: "Status", value: viewingUser.disabled ? "Disabled" : "Active" },
                { label: "Progress", value: `${viewingUser._count.progress} resources completed` },
                { label: "Registered", value: new Date(viewingUser.createdAt).toLocaleDateString() },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">{field.label}</p>
                  <p className="mt-0.5 text-sm text-[var(--color-text-primary)]">{field.value || "—"}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}