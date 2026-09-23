import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Entry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string | null;
  created_at: string;
};

// Shared giveaway admin account. The login screen only asks for the password,
// which lives in Supabase Auth, never in this repo.
const ADMIN_EMAIL = "admin@madmonkeyhostels.com";

const formatDate = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const field =
  "w-full rounded-xl border-4 border-[hsl(var(--orange))] bg-white px-4 py-3 text-[16px] font-bold text-[hsl(var(--ink))] placeholder:text-[hsl(var(--ink))]/45 outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--cream))]";
const btn =
  "rounded-xl border-4 border-[hsl(var(--orange))] bg-[hsl(var(--cream))] px-4 py-2.5 text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--orange))] transition hover:bg-white active:scale-[0.99] disabled:opacity-60";
const btnPrimary =
  "rounded-xl border-4 border-[hsl(var(--orange-deep))] bg-[hsl(var(--orange))] px-4 py-2.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60";

function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
    setBusy(false);
    if (error) setError(error.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--sky))] px-5">
      <form onSubmit={onSubmit} className="bubble w-full max-w-sm px-7 py-8">
        <h1 className="graffiti text-5xl leading-none">Admin</h1>
        <p className="mt-2 text-sm font-bold text-[hsl(var(--ink))]/70">Mad Monkey x Stoketoberfest giveaway</p>
        <label htmlFor="password" className="sr-only">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
          className={`${field} mt-6`}
        />
        {error && <p className="mt-3 text-sm font-bold text-[hsl(var(--destructive))]">{error}</p>}
        <button type="submit" disabled={busy} className={`${btnPrimary} mt-5 w-full py-3`}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [winner, setWinner] = useState<Entry | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("stoketober_entries")
      .select("*")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setLoadError(error.message);
        else setEntries((data as Entry[]) ?? []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const sources = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of entries) {
      const key = e.source || "direct";
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = q
      ? entries.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.phone.toLowerCase().includes(q)
        )
      : entries;
    return [...rows].sort((a, b) => {
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortAsc ? diff : -diff;
    });
  }, [entries, search, sortAsc]);

  const exportCsv = () => {
    const headers = ["name", "email", "phone", "source", "created_at"];
    const escape = (v: unknown) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = entries.map((e) => [e.name, e.email, e.phone, e.source, e.created_at].map(escape).join(","));
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stoketober-entries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const pickWinner = () => {
    if (!entries.length) return;
    setWinner(entries[Math.floor(Math.random() * entries.length)]);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--sky))] text-white">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Total entries</p>
            <p className="poster-heading text-7xl text-[hsl(var(--cream))]">{entries.length}</p>
          </div>
          <button onClick={() => supabase.auth.signOut()} className={btn}>
            Log out
          </button>
        </div>

        {sources.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {sources.map(([source, count]) => (
              <span key={source} className="rounded-full border-2 border-[hsl(var(--cream))]/40 px-3 py-1 text-sm font-bold">
                <span className="text-white/70">{source}</span> <span className="text-[hsl(var(--cream))]">{count}</span>
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or phone"
            className={`${field} min-w-[220px] flex-1 !py-2.5`}
          />
          <button onClick={exportCsv} className={btn} disabled={!entries.length}>
            Export CSV
          </button>
          <button onClick={pickWinner} className={btnPrimary} disabled={!entries.length}>
            Pick a winner
          </button>
        </div>

        {winner && (
          <div className="bubble mt-8 px-6 py-5">
            <p className="graffiti text-3xl leading-none">Winner</p>
            <p className="mt-2 text-2xl font-black text-[hsl(var(--ink))]">{winner.name}</p>
            <p className="font-bold text-[hsl(var(--ink))]/80">{winner.email}</p>
            <p className="font-bold text-[hsl(var(--ink))]/80">{winner.phone}</p>
          </div>
        )}

        <div className="mt-8 overflow-x-auto rounded-2xl border-4 border-[hsl(var(--orange))] bg-white text-[hsl(var(--ink))]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[hsl(var(--cream))] text-xs font-extrabold uppercase tracking-wide text-[hsl(var(--orange))]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Source</th>
                <th onClick={() => setSortAsc((v) => !v)} className="cursor-pointer select-none px-4 py-3">
                  Date {sortAsc ? "▲" : "▼"}
                </th>
              </tr>
            </thead>
            <tbody className="font-semibold">
              {loading && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[hsl(var(--ink))]/50">Loading entries...</td></tr>
              )}
              {!loading && loadError && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[hsl(var(--destructive))]">{loadError}</td></tr>
              )}
              {!loading && !loadError && visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[hsl(var(--ink))]/50">
                    {entries.length === 0 ? "No entries yet." : "No entries match your search."}
                  </td>
                </tr>
              )}
              {visible.map((e) => (
                <tr key={e.id} className="border-t-2 border-[hsl(var(--cream))]">
                  <td className="px-4 py-3">{e.name}</td>
                  <td className="px-4 py-3"><a className="underline decoration-[hsl(var(--orange))]" href={`mailto:${e.email}`}>{e.email}</a></td>
                  <td className="px-4 py-3">{e.phone}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-[hsl(var(--cream))] px-2 py-0.5 text-xs font-bold text-[hsl(var(--orange))]">{e.source || "direct"}</span>
                  </td>
                  <td className="px-4 py-3 text-[hsl(var(--ink))]/60">{formatDate(e.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const Admin = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    document.title = "Stoketoberfest Admin";
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--sky))] text-white/70">Loading...</div>;
  }
  return session ? <Dashboard /> : <Login />;
};

export default Admin;
