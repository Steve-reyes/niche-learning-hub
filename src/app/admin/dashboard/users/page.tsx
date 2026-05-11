"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, User as UserIcon } from "lucide-react";

interface UserDTO {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  _count: { progress: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

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
    setForm({ username: "", email: "", password: "" });
    setError("");
    setShowForm(true);
  };

  const openEdit = (u: UserDTO) => {
    setEditingId(u.id);
    setForm({ username: u.username, email: u.email, password: "" });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      try {
        if (editingId) {
          const body: any = { username: form.username, email: form.email };
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Users</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {users.length} registered users
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
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
                  {u.email} &middot; {u._count.progress} resources completed
                </p>
              </div>
              <div className="flex items-center gap-1">
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
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                type="email"
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
    </div>
  );
}