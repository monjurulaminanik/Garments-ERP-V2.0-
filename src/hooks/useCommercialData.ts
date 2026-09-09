"use client";

/**
 * Dedicated client-side data hook for the Commercial module
 * (Buyers, Orders, T&A Calendar, Merchandising, Costing).
 *
 * Kept self-contained under its own name/store (instead of the shared
 * `@/hooks/useErpData`) so this module's CRUD data model never collides
 * with other in-flight ERP modules being built in parallel.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Buyer = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
};

export type OrderStage =
  | "Merchandising"
  | "Cutting"
  | "Sewing"
  | "Finishing"
  | "Packing"
  | "Shipped";

export type TaStatus = "On Track" | "At Risk" | "Delayed";
export type PaymentStatus = "paid" | "partial" | "due";

export type Order = {
  id: string;
  buyerId: string;
  buyer: string;
  po: string;
  style: string;
  product: string;
  color: string;
  qty: number;
  unitPrice: number;
  shipDate: string;
  stage: OrderStage;
  progress: number;
  taStatus: TaStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
};

export type TaskStatus = "Completed" | "In Progress" | "Pending" | "Delayed";
export type RiskLevel = "On Time" | "At Risk" | "Delayed";

export type TaTask = {
  id: string;
  orderId: string;
  buyer: string;
  po: string;
  style: string;
  taskName: string;
  department: string;
  owner: string;
  plannedDate: string;
  actualDate: string;
  status: TaskStatus;
  risk: RiskLevel;
};

export type SampleStatus = "Approved" | "Pending" | "Rejected";
export type ProductionApproval = "Approved" | "Pending";

export type MerchItem = {
  id: string;
  orderId: string;
  buyer: string;
  po: string;
  style: string;
  fitSample: SampleStatus;
  ppSample: SampleStatus;
  techPack: SampleStatus;
  productionApproval: ProductionApproval;
  riskLevel: TaStatus;
  notes: string;
};

export type QuotationStatus = "Pending" | "Confirmed" | "Rejected";

export type QuotationVersion = {
  version: number;
  date: string;
  offeredPrice: number;
  status: QuotationStatus;
  validUntil: string;
  buyerFeedback: string;
};

export type Costing = {
  id: string;
  buyer: string;
  style: string;
  fabricName: string;
  garmentWeight: number;
  consumption: number;
  fabricCost: number;
  trimsCost: number;
  cmCost: number;
  processingCost: number;
  commercialCost: number;
  unitPrice: number;
  isFobLocked: boolean;
  paymentTerms: string;
  shipmentTerms: string;
  quotations: QuotationVersion[];
  createdAt: string;
};


/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */

const seedBuyers: Buyer[] = [
  { id: "b1", name: "H&M", company: "H & M Hennes & Mauritz GBC AB", phone: "+46 8 796 5500", email: "sourcing@hm.com", address: "Mäster Samuelsgatan 46A, Stockholm, Sweden", createdAt: "2026-01-12" },
  { id: "b2", name: "Zara", company: "Industria de Diseño Textil S.A. (Inditex)", phone: "+34 981 185 400", email: "buying@zara.com", address: "Avenida de la Diputación, Arteixo, Spain", createdAt: "2026-01-18" },
  { id: "b3", name: "Primark", company: "Primark Stores Ltd.", phone: "+44 118 960 6300", email: "merchandising@primark.co.uk", address: "Mary Street, Dublin 1, Ireland", createdAt: "2026-01-22" },
  { id: "b4", name: "C&A", company: "C&A Buying GmbH & Co. KG", phone: "+49 211 9822 0", email: "sourcing@canda.com", address: "Ottoplatz 1, Düsseldorf, Germany", createdAt: "2026-02-02" },
  { id: "b5", name: "Tesco", company: "Tesco PLC", phone: "+44 1992 632 222", email: "sourcing@tesco.com", address: "Tesco House, Welwyn Garden City, United Kingdom", createdAt: "2026-02-10" },
  { id: "b6", name: "Next", company: "Next Sourcing Ltd.", phone: "+44 116 284 2000", email: "sourcing@next.co.uk", address: "Desford Road, Enderby, Leicester, United Kingdom", createdAt: "2026-02-20" },
  { id: "b7", name: "M&S", company: "Marks and Spencer PLC", phone: "+44 20 7935 4422", email: "sourcing@marksandspencer.com", address: "Paddington, London, United Kingdom", createdAt: "2026-03-01" },
  { id: "b8", name: "Decathlon", company: "Decathlon S.A.", phone: "+33 3 20 33 1212", email: "sourcing@decathlon.com", address: "Villeneuve-d'Ascq, France", createdAt: "2026-03-08" },
];

const seedOrders: Order[] = [
  { id: "o1", buyerId: "b1", buyer: "H&M", po: "HM-2026-0142", style: "STY-2026001", product: "Men's Basic T-Shirt", color: "Navy / White", qty: 48000, unitPrice: 3.85, shipDate: "2026-08-10", stage: "Sewing", progress: 62, taStatus: "At Risk", paymentStatus: "partial", createdAt: "2026-07-07" },
  { id: "o2", buyerId: "b2", buyer: "Zara", po: "ZARA-88421", style: "STY-2026002", product: "Ladies Leggings", color: "Black", qty: 32000, unitPrice: 4.2, shipDate: "2026-08-17", stage: "Cutting", progress: 28, taStatus: "On Track", paymentStatus: "paid", createdAt: "2026-07-10" },
  { id: "o3", buyerId: "b3", buyer: "Primark", po: "PRM-55201", style: "STY-2026003", product: "Kids Hoodie", color: "Heather Grey", qty: 24000, unitPrice: 5.1, shipDate: "2026-08-24", stage: "Finishing", progress: 78, taStatus: "On Track", paymentStatus: "paid", createdAt: "2026-07-01" },
  { id: "o4", buyerId: "b4", buyer: "C&A", po: "CA-77102", style: "STY-2026004", product: "Denim Jacket", color: "Indigo Wash", qty: 18000, unitPrice: 12.5, shipDate: "2026-08-31", stage: "Merchandising", progress: 12, taStatus: "Delayed", paymentStatus: "partial", createdAt: "2026-07-05" },
  { id: "o5", buyerId: "b5", buyer: "Tesco", po: "TSC-33018", style: "STY-2026005", product: "Polo Shirt", color: "Royal Blue", qty: 56000, unitPrice: 4.75, shipDate: "2026-09-07", stage: "Packing", progress: 91, taStatus: "On Track", paymentStatus: "paid", createdAt: "2026-06-20" },
  { id: "o6", buyerId: "b6", buyer: "Next", po: "NXT-11904", style: "STY-2026006", product: "Woven Shirt", color: "Stripe", qty: 22000, unitPrice: 6.0, shipDate: "2026-09-14", stage: "Cutting", progress: 20, taStatus: "On Track", paymentStatus: "partial", createdAt: "2026-07-12" },
  { id: "o7", buyerId: "b7", buyer: "M&S", po: "MS-44021", style: "STY-2026007", product: "Cargo Pant", color: "Khaki", qty: 20000, unitPrice: 7.25, shipDate: "2026-09-20", stage: "Merchandising", progress: 10, taStatus: "At Risk", paymentStatus: "due", createdAt: "2026-07-14" },
  { id: "o8", buyerId: "b8", buyer: "Decathlon", po: "DEC-22015", style: "STY-2026008", product: "Men's Basic T-Shirt", color: "Grey Melange", qty: 26000, unitPrice: 3.6, shipDate: "2026-09-25", stage: "Cutting", progress: 15, taStatus: "On Track", paymentStatus: "partial", createdAt: "2026-07-16" },
  { id: "o9", buyerId: "b1", buyer: "H&M", po: "HM-2026-0188", style: "STY-2026009", product: "Polo Shirt", color: "White", qty: 36000, unitPrice: 4.5, shipDate: "2026-10-05", stage: "Finishing", progress: 68, taStatus: "On Track", paymentStatus: "partial", createdAt: "2026-07-18" },
];

const seedTaTasks: TaTask[] = [
  { id: uid("ta"), orderId: "o1", buyer: "H&M", po: "HM-2026-0142", style: "STY-2026001", taskName: "Order Confirmation", department: "Merchandising", owner: "Rashida Begum", plannedDate: "2026-07-07", actualDate: "2026-07-09", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o1", buyer: "H&M", po: "HM-2026-0142", style: "STY-2026001", taskName: "Tech Pack Review", department: "Procurement", owner: "Karim Hossain", plannedDate: "2026-07-08", actualDate: "2026-07-10", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o1", buyer: "H&M", po: "HM-2026-0142", style: "STY-2026001", taskName: "Fabric Booking", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-09", actualDate: "2026-07-11", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o1", buyer: "H&M", po: "HM-2026-0142", style: "STY-2026001", taskName: "Trims Booking", department: "QC", owner: "Imran Ahmed", plannedDate: "2026-07-10", actualDate: "2026-07-12", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o1", buyer: "H&M", po: "HM-2026-0142", style: "STY-2026001", taskName: "Lab Dip Approval", department: "Commercial", owner: "Farhana Akter", plannedDate: "2026-07-11", actualDate: "2026-07-13", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o1", buyer: "H&M", po: "HM-2026-0142", style: "STY-2026001", taskName: "Fit Sample Approval", department: "Merchandising", owner: "Rashida Begum", plannedDate: "2026-07-15", actualDate: "2026-07-19", status: "Completed", risk: "At Risk" },
  { id: uid("ta"), orderId: "o1", buyer: "H&M", po: "HM-2026-0142", style: "STY-2026001", taskName: "Bulk Fabric In-house", department: "Store", owner: "Jashim Uddin", plannedDate: "2026-07-27", actualDate: "2026-07-27", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o1", buyer: "H&M", po: "HM-2026-0142", style: "STY-2026001", taskName: "Cutting Start", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-22", actualDate: "2026-07-22", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o1", buyer: "H&M", po: "HM-2026-0142", style: "STY-2026001", taskName: "Sewing Start", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-28", actualDate: "", status: "In Progress", risk: "At Risk" },
  { id: uid("ta"), orderId: "o1", buyer: "H&M", po: "HM-2026-0142", style: "STY-2026001", taskName: "Final Inspection", department: "QC", owner: "Priya Saha", plannedDate: "2026-08-05", actualDate: "", status: "Pending", risk: "On Time" },

  { id: uid("ta"), orderId: "o2", buyer: "Zara", po: "ZARA-88421", style: "STY-2026002", taskName: "Order Confirmation", department: "Merchandising", owner: "Rashida Begum", plannedDate: "2026-07-10", actualDate: "2026-07-10", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o2", buyer: "Zara", po: "ZARA-88421", style: "STY-2026002", taskName: "Tech Pack Review", department: "Procurement", owner: "Karim Hossain", plannedDate: "2026-07-11", actualDate: "2026-07-11", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o2", buyer: "Zara", po: "ZARA-88421", style: "STY-2026002", taskName: "Fabric Booking", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-14", actualDate: "2026-07-14", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o2", buyer: "Zara", po: "ZARA-88421", style: "STY-2026002", taskName: "Cutting Start", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-23", actualDate: "2026-07-23", status: "In Progress", risk: "On Time" },
  { id: uid("ta"), orderId: "o2", buyer: "Zara", po: "ZARA-88421", style: "STY-2026002", taskName: "Sewing Start", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-30", actualDate: "", status: "Pending", risk: "On Time" },

  { id: uid("ta"), orderId: "o3", buyer: "Primark", po: "PRM-55201", style: "STY-2026003", taskName: "Order Confirmation", department: "Merchandising", owner: "Farhana Akter", plannedDate: "2026-07-01", actualDate: "2026-07-01", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o3", buyer: "Primark", po: "PRM-55201", style: "STY-2026003", taskName: "Fabric Booking", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-05", actualDate: "2026-07-05", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o3", buyer: "Primark", po: "PRM-55201", style: "STY-2026003", taskName: "Cutting Start", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-24", actualDate: "2026-07-24", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o3", buyer: "Primark", po: "PRM-55201", style: "STY-2026003", taskName: "Sewing Complete", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-26", actualDate: "2026-07-26", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o3", buyer: "Primark", po: "PRM-55201", style: "STY-2026003", taskName: "Final Inspection", department: "QC", owner: "Priya Saha", plannedDate: "2026-07-29", actualDate: "", status: "In Progress", risk: "On Time" },

  { id: uid("ta"), orderId: "o4", buyer: "C&A", po: "CA-77102", style: "STY-2026004", taskName: "Order Confirmation", department: "Merchandising", owner: "Rashida Begum", plannedDate: "2026-07-05", actualDate: "2026-07-12", status: "Completed", risk: "Delayed" },
  { id: uid("ta"), orderId: "o4", buyer: "C&A", po: "CA-77102", style: "STY-2026004", taskName: "Tech Pack Review", department: "Procurement", owner: "Karim Hossain", plannedDate: "2026-07-12", actualDate: "", status: "Delayed", risk: "Delayed" },
  { id: uid("ta"), orderId: "o4", buyer: "C&A", po: "CA-77102", style: "STY-2026004", taskName: "Fabric Booking", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-20", actualDate: "", status: "Pending", risk: "Delayed" },

  { id: uid("ta"), orderId: "o5", buyer: "Tesco", po: "TSC-33018", style: "STY-2026005", taskName: "Order Confirmation", department: "Merchandising", owner: "Farhana Akter", plannedDate: "2026-06-20", actualDate: "2026-06-20", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o5", buyer: "Tesco", po: "TSC-33018", style: "STY-2026005", taskName: "Cutting Start", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-10", actualDate: "2026-07-10", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o5", buyer: "Tesco", po: "TSC-33018", style: "STY-2026005", taskName: "Sewing Complete", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-18", actualDate: "2026-07-18", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o5", buyer: "Tesco", po: "TSC-33018", style: "STY-2026005", taskName: "Finishing Complete", department: "Production", owner: "Nusrat Jahan", plannedDate: "2026-07-25", actualDate: "2026-07-25", status: "Completed", risk: "On Time" },
  { id: uid("ta"), orderId: "o5", buyer: "Tesco", po: "TSC-33018", style: "STY-2026005", taskName: "Packing Complete", department: "Production", owner: "Jashim Uddin", plannedDate: "2026-07-27", actualDate: "2026-07-27", status: "In Progress", risk: "On Time" },
];

const seedMerchItems: MerchItem[] = [
  { id: uid("mi"), orderId: "o1", buyer: "H&M", po: "HM-2026-0142", style: "STY-2026001", fitSample: "Approved", ppSample: "Approved", techPack: "Approved", productionApproval: "Approved", riskLevel: "At Risk", notes: "H&M — Men's Basic T-Shirt export order" },
  { id: uid("mi"), orderId: "o2", buyer: "Zara", po: "ZARA-88421", style: "STY-2026002", fitSample: "Approved", ppSample: "Approved", techPack: "Approved", productionApproval: "Approved", riskLevel: "On Track", notes: "Zara — Ladies Leggings export order" },
  { id: uid("mi"), orderId: "o3", buyer: "Primark", po: "PRM-55201", style: "STY-2026003", fitSample: "Approved", ppSample: "Approved", techPack: "Approved", productionApproval: "Approved", riskLevel: "On Track", notes: "Primark — Kids Hoodie export order" },
  { id: uid("mi"), orderId: "o4", buyer: "C&A", po: "CA-77102", style: "STY-2026004", fitSample: "Pending", ppSample: "Pending", techPack: "Pending", productionApproval: "Pending", riskLevel: "Delayed", notes: "C&A — Denim Jacket export order" },
  { id: uid("mi"), orderId: "o5", buyer: "Tesco", po: "TSC-33018", style: "STY-2026005", fitSample: "Approved", ppSample: "Pending", techPack: "Approved", productionApproval: "Pending", riskLevel: "On Track", notes: "Tesco — Polo Shirt export order" },
  { id: uid("mi"), orderId: "o6", buyer: "Next", po: "NXT-11904", style: "STY-2026006", fitSample: "Approved", ppSample: "Pending", techPack: "Approved", productionApproval: "Pending", riskLevel: "On Track", notes: "Next — Woven Shirt export order" },
  { id: uid("mi"), orderId: "o7", buyer: "M&S", po: "MS-44021", style: "STY-2026007", fitSample: "Pending", ppSample: "Pending", techPack: "Pending", productionApproval: "Pending", riskLevel: "At Risk", notes: "M&S — Cargo Pant export order" },
  { id: uid("mi"), orderId: "o8", buyer: "Decathlon", po: "DEC-22015", style: "STY-2026008", fitSample: "Pending", ppSample: "Pending", techPack: "Pending", productionApproval: "Pending", riskLevel: "On Track", notes: "Decathlon — Men's Basic T-Shirt export order" },
  { id: uid("mi"), orderId: "o9", buyer: "H&M", po: "HM-2026-0188", style: "STY-2026009", fitSample: "Pending", ppSample: "Pending", techPack: "Pending", productionApproval: "Pending", riskLevel: "On Track", notes: "H&M — Polo Shirt export order" },
];

const seedCostings: Costing[] = [
  { id: uid("cs"), buyer: "H&M", style: "STY-2026001", fabricName: "Single Jersey 160 GSM", garmentWeight: 120, consumption: 1.2, fabricCost: 94020, trimsCost: 16800, cmCost: 52800, processingCost: 0, commercialCost: 5000, unitPrice: 3.85, isFobLocked: false, paymentTerms: "LC", shipmentTerms: "FOB", quotations: [{ version: 1, date: "2026-07-14", offeredPrice: 4.00, status: "Pending", validUntil: "2026-07-30", buyerFeedback: "Awaiting review" }], createdAt: "2026-07-14" },
  { id: uid("cs"), buyer: "Zara", style: "STY-2026002", fabricName: "Fleece 280 GSM", garmentWeight: 160, consumption: 1.35, fabricCost: 46800, trimsCost: 11200, cmCost: 35200, processingCost: 2000, commercialCost: 3000, unitPrice: 4.2, isFobLocked: true, paymentTerms: "TT", shipmentTerms: "CIF", quotations: [{ version: 1, date: "2026-07-15", offeredPrice: 4.50, status: "Rejected", validUntil: "2026-07-20", buyerFeedback: "Too high" }, { version: 2, date: "2026-07-18", offeredPrice: 4.20, status: "Confirmed", validUntil: "2026-07-25", buyerFeedback: "Accepted" }], createdAt: "2026-07-15" },
  { id: uid("cs"), buyer: "Primark", style: "STY-2026003", fabricName: "Denim 12oz", garmentWeight: 200, consumption: 1.5, fabricCost: 42480, trimsCost: 8400, cmCost: 26400, processingCost: 3300, commercialCost: 2500, unitPrice: 5.1, isFobLocked: false, paymentTerms: "Advance", shipmentTerms: "FOB", quotations: [], createdAt: "2026-07-08" },
  { id: uid("cs"), buyer: "C&A", style: "STY-2026004", fabricName: "Poplin 120 GSM", garmentWeight: 240, consumption: 1.2, fabricCost: 38475, trimsCost: 6300, cmCost: 19800, processingCost: 1000, commercialCost: 1500, unitPrice: 12.57, isFobLocked: false, paymentTerms: "LC", shipmentTerms: "FOB", quotations: [], createdAt: "2026-07-11" },
  { id: uid("cs"), buyer: "Tesco", style: "STY-2026005", fabricName: "Pique 200 GSM", garmentWeight: 280, consumption: 1.35, fabricCost: 110530, trimsCost: 19600, cmCost: 61600, processingCost: 5000, commercialCost: 4500, unitPrice: 4.75, isFobLocked: false, paymentTerms: "LC", shipmentTerms: "FOB", quotations: [], createdAt: "2026-06-25" },
];

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

interface CommercialState {
  buyers: Buyer[];
  orders: Order[];
  taTasks: TaTask[];
  merchItems: MerchItem[];
  costings: Costing[];

  addBuyer: (buyer: Omit<Buyer, "id" | "createdAt">) => Buyer;
  updateBuyer: (id: string, patch: Partial<Buyer>) => void;
  deleteBuyer: (id: string) => void;

  addOrder: (order: Omit<Order, "id" | "createdAt">) => Order;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  deleteOrder: (id: string) => void;

  addTaTask: (task: Omit<TaTask, "id">) => TaTask;
  updateTaTask: (id: string, patch: Partial<TaTask>) => void;
  deleteTaTask: (id: string) => void;

  addMerchItem: (item: Omit<MerchItem, "id">) => MerchItem;
  updateMerchItem: (id: string, patch: Partial<MerchItem>) => void;

  addCosting: (costing: Omit<Costing, "id" | "createdAt">) => Costing;
  updateCosting: (id: string, patch: Partial<Costing>) => void;
  deleteCosting: (id: string) => void;

  refresh: () => Promise<void>;
}

function persistToServer(state: Omit<CommercialState, "addBuyer" | "updateBuyer" | "deleteBuyer" | "addOrder" | "updateOrder" | "deleteOrder" | "addTaTask" | "updateTaTask" | "deleteTaTask" | "addMerchItem" | "updateMerchItem" | "addCosting" | "updateCosting" | "deleteCosting" | "refresh">) {
  if (typeof window === "undefined") return;
  fetch("/api/data?store=commercial", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: state }),
  }).catch(() => {});
}

export const useCommercialData = create<CommercialState>()(
  persist(
    (set, get) => {
      const apply = (updater: (state: CommercialState) => Partial<CommercialState>) => {
        const next = updater(get());
        set(next);
        const { addBuyer, updateBuyer, deleteBuyer, addOrder, updateOrder, deleteOrder, addTaTask, updateTaTask, deleteTaTask, addMerchItem, updateMerchItem, addCosting, updateCosting, deleteCosting, refresh, ...dataToPersist } = { ...get(), ...next };
        persistToServer(dataToPersist);
      };

      return {
        buyers: seedBuyers,
        orders: seedOrders,
        taTasks: seedTaTasks,
        merchItems: seedMerchItems,
        costings: seedCostings,

        refresh: async () => {
          try {
            const res = await fetch("/api/data?store=commercial");
            const json = await res.json();
            if (json?.success && json.data) {
              set({ ...json.data });
            }
          } catch (e) {}
        },

        addBuyer: (buyer) => {
          const newBuyer: Buyer = { ...buyer, id: uid("buyer"), createdAt: new Date().toISOString().slice(0, 10) };
          apply((state) => ({ buyers: [newBuyer, ...state.buyers] }));
          return newBuyer;
        },
        updateBuyer: (id, patch) => {
          apply((state) => ({ buyers: state.buyers.map((b) => (b.id === id ? { ...b, ...patch } : b)) }));
        },
        deleteBuyer: (id) => {
          apply((state) => ({ buyers: state.buyers.filter((b) => b.id !== id) }));
        },

        addOrder: (order) => {
          const newOrder: Order = { ...order, id: uid("order"), createdAt: new Date().toISOString().slice(0, 10) };
          apply((state) => ({ orders: [newOrder, ...state.orders] }));
          return newOrder;
        },
        updateOrder: (id, patch) => {
          apply((state) => ({ orders: state.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) }));
        },
        deleteOrder: (id) => {
          apply((state) => ({ orders: state.orders.filter((o) => o.id !== id) }));
        },

        addTaTask: (task) => {
          const newTask: TaTask = { ...task, id: uid("ta") };
          apply((state) => ({ taTasks: [newTask, ...state.taTasks] }));
          return newTask;
        },
        updateTaTask: (id, patch) => {
          apply((state) => ({ taTasks: state.taTasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
        },
        deleteTaTask: (id) => {
          apply((state) => ({ taTasks: state.taTasks.filter((t) => t.id !== id) }));
        },

        addMerchItem: (item) => {
          const newItem: MerchItem = { ...item, id: uid("mi") };
          apply((state) => ({ merchItems: [newItem, ...state.merchItems] }));
          return newItem;
        },
        updateMerchItem: (id, patch) => {
          apply((state) => ({ merchItems: state.merchItems.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
        },

        addCosting: (costing) => {
          const newCosting: Costing = { ...costing, id: uid("cs"), createdAt: new Date().toISOString().slice(0, 10) };
          apply((state) => ({ costings: [newCosting, ...state.costings] }));
          return newCosting;
        },
        updateCosting: (id, patch) => {
          apply((state) => ({ costings: state.costings.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
        },
        deleteCosting: (id) => {
          apply((state) => ({ costings: state.costings.filter((c) => c.id !== id) }));
        },
      };
    },
    { name: "same-dawat-erp-commercial", version: 2 }
  )
);

/* ------------------------------------------------------------------ */
/*  Derived helpers                                                    */
/* ------------------------------------------------------------------ */

export function orderValue(order: Order): number {
  return order.qty * order.unitPrice;
}

export function buyerStats(buyer: Buyer, orders: Order[]) {
  const buyerOrders = orders.filter((o) => o.buyerId === buyer.id);
  const totalValue = buyerOrders.reduce((sum, o) => sum + orderValue(o), 0);
  const totalQty = buyerOrders.reduce((sum, o) => sum + o.qty, 0);
  const received = buyerOrders.reduce((sum, o) => {
    const value = orderValue(o);
    if (o.paymentStatus === "paid") return sum + value;
    if (o.paymentStatus === "partial") return sum + value * 0.6;
    return sum;
  }, 0);
  return {
    totalOrders: buyerOrders.length,
    totalQty,
    totalValue,
    totalReceived: received,
    totalDue: totalValue - received,
    orders: buyerOrders,
  };
}

export function costingTotal(c: Costing): number {
  return c.fabricCost + c.trimsCost + c.cmCost + c.processingCost + c.commercialCost;
}

export function costingMarginPct(c: Costing, qty: number): number {
  if (!qty || !c.unitPrice) return 0;
  const totalCost = costingTotal(c);
  const costPerPc = totalCost / qty;
  return ((c.unitPrice - costPerPc) / c.unitPrice) * 100;
}
