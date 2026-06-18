"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Field = { name: string; label: string; type?: "text" | "number" | "boolean" | "textarea" };

export function CrudManager({ table, fields }: { table: string; fields: Field[] }) {
  const supabase = createClient();
  const [rows, setRows] = useState<Record<string, string | number | boolean | null>[]>([]);
  const [draft, setDraft] = useState<Record<string, string | number | boolean>>({});
  const [status, setStatus] = useState("Ready");

  async function loadRows() {
    try {
      const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
      setStatus(error ? error.message : "Loaded");
      setRows(data ?? []);
    } catch (err: any) {
      setStatus(err.message || "Failed to load rows");
    }
  }

  async function createRow() {
    try {
      const { error } = await supabase.from(table).insert(draft);
      setStatus(error ? error.message : "Created");
      if (!error) {
        setDraft({});
        await loadRows();
      }
    } catch (err: any) {
      setStatus(err.message || "Failed to create row");
    }
  }

  async function deleteRow(id: string | number) {
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      setStatus(error ? error.message : "Deleted");
      if (!error) await loadRows();
    } catch (err: any) {
      setStatus(err.message || "Failed to delete row");
    }
  }

  async function updateRow(row: Record<string, string | number | boolean | null>) {
    try {
      const { id, created_at, ...payload } = row;
      const { error } = await supabase.from(table).update(payload).eq("id", id);
      setStatus(error ? error.message : "Saved");
      if (!error) await loadRows();
    } catch (err: any) {
      setStatus(err.message || "Failed to update row");
    }
  }

  useEffect(() => {
    loadRows();
  }, []);

  return (
    <div>
      <div className="glass rounded-[8px] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl text-[#21183d]">Create {table.replace("_", " ")}</h2>
            <p className="mt-1 text-sm text-[#6b6680]">{status}</p>
          </div>
          <Button variant="secondary" onClick={loadRows} type="button"><RefreshCw size={17} />Refresh</Button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {fields.map((field) => (
            <label key={field.name} className="grid gap-2 text-sm font-semibold text-[#4b328b]">
              {field.label}
              {field.type === "textarea" ? (
                <textarea className="focus-ring rounded-[8px] border border-[#4b328b]/10 p-3" value={String(draft[field.name] ?? "")} onChange={(event) => setDraft({ ...draft, [field.name]: event.target.value })} />
              ) : field.type === "boolean" ? (
                <input type="checkbox" checked={Boolean(draft[field.name])} onChange={(event) => setDraft({ ...draft, [field.name]: event.target.checked })} className="h-5 w-5 accent-[#6e63b8]" />
              ) : (
                <input type={field.type ?? "text"} className="focus-ring min-h-11 rounded-[8px] border border-[#4b328b]/10 px-3" value={String(draft[field.name] ?? "")} onChange={(event) => setDraft({ ...draft, [field.name]: field.type === "number" ? Number(event.target.value) : event.target.value })} />
              )}
            </label>
          ))}
        </div>
        <Button className="mt-5" onClick={createRow} type="button"><Plus size={17} />Create</Button>
      </div>
      <div className="mt-6 grid gap-4">
        {rows.map((row) => (
          <article key={String(row.id)} className="rounded-[8px] border border-[#4b328b]/10 bg-white p-5">
            <div className="grid gap-3 md:grid-cols-3">
              {fields.map((field) => (
                <label key={field.name} className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b6680]">
                  {field.label}
                  <input
                    className="focus-ring min-h-11 rounded-[8px] border border-[#4b328b]/10 px-3 text-sm normal-case tracking-normal text-[#21183d]"
                    value={String(row[field.name] ?? "")}
                    onChange={(event) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, [field.name]: field.type === "number" ? Number(event.target.value) : event.target.value } : item))}
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <Button type="button" onClick={() => updateRow(row)}><Save size={17} />Save</Button>
              <Button type="button" variant="secondary" onClick={() => deleteRow(row.id as string | number)}><Trash2 size={17} />Delete</Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
