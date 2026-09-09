"use client";

/**
 * Dedicated client-side data hook for the Procurement module
 * (Fabric Booking, Trims Booking, Supplier PO, In-house Status).
 *
 * Kept self-contained (like `useCommercialData`) so this module's CRUD data
 * model never collides with other in-flight ERP modules, but the record
 * shape is the canonical `Procurement` type from `@/lib/types` and is seeded
 * from `@/lib/seed-data` so figures stay consistent with the rest of the app.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Procurement, ProcurementStatus, ProcurementType } from "@/lib/types";
import { procurements as seedProcurements } from "@/lib/seed-data";

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function computeBalance(required: number, received: number): number {
  return Math.max(required - received, 0);
}

interface ProcurementState {
  procurements: Procurement[];

  addProcurement: (input: Omit<Procurement, "id" | "balance">) => Procurement;
  updateProcurement: (id: string, patch: Partial<Omit<Procurement, "id">>) => void;
  deleteProcurement: (id: string) => void;
}

export const useProcurementData = create<ProcurementState>()(
  persist(
    (set) => ({
      procurements: seedProcurements,

      addProcurement: (input) => {
        const record: Procurement = {
          ...input,
          id: uid("proc"),
          balance: computeBalance(input.required, input.received),
        };
        set((state) => ({ procurements: [record, ...state.procurements] }));
        return record;
      },

      updateProcurement: (id, patch) => {
        set((state) => ({
          procurements: state.procurements.map((p) => {
            if (p.id !== id) return p;
            const merged: Procurement = { ...p, ...patch };
            merged.balance = computeBalance(merged.required, merged.received);
            return merged;
          }),
        }));
      },

      deleteProcurement: (id) => {
        set((state) => ({ procurements: state.procurements.filter((p) => p.id !== id) }));
      },
    }),
    { name: "same-dawat-erp-procurement", version: 1 }
  )
);

/* ------------------------------------------------------------------ */
/*  Derived helpers                                                    */
/* ------------------------------------------------------------------ */

export function procurementProgressPct(p: Procurement): number {
  if (!p.required) return 0;
  return Math.min(100, Math.round((p.received / p.required) * 100));
}

export function isProcurementInHouse(p: Procurement): boolean {
  return p.status === "in house" || p.received >= p.required;
}

export type { Procurement, ProcurementStatus, ProcurementType };
