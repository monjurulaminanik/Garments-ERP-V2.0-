/**
 * Dawat RMG SOFT — shared TypeScript domain types.
 *
 * These interfaces model the full ERP dataset that is stored as a single
 * document in MongoDB (see `src/lib/models/ErpData.ts`) and hydrated on the
 * client via `useErpData`. Every module (buyers, orders, T&A, costing,
 * procurement, inventory, production, QC, shipment, accounts, settings,
 * roles) has a corresponding array/object below.
 */

/* ------------------------------------------------------------------ */
/* Shared / enum-like unions                                          */
/* ------------------------------------------------------------------ */

export type OrderStage =
  | "Merchandising"
  | "Cutting"
  | "Sewing"
  | "Finishing"
  | "Packing"
  | "Shipment"
  | "Completed";

export type TaAndPaymentStatus = "On Track" | "At Risk" | "Delayed";
export type PaymentStatus = "paid" | "partial" | "unpaid";

export type TaTaskStatus = "Pending" | "In Progress" | "Completed" | "Delayed" | "Critical";
export type TaRiskLevel = "On Time" | "Low Risk" | "Medium Risk" | "High Risk" | "Critical";
export type TaDepartment = "Merchandising" | "Procurement" | "Production" | "QC" | "Commercial";

export type SampleApprovalStatus = "Approved" | "Pending" | "Rejected";
export type ProductionApprovalStatus = "Approved" | "Pending" | "Rejected";

export type ProcurementType = "fabric" | "trims";
export type ProcurementStatus = "booked" | "ordered" | "partial received" | "in house" | "delayed";

export type InventoryCategory = "fabric" | "trims" | "finished" | "finished_fabric";

export type CuttingStatus = "Pending" | "In Progress" | "Completed";
export type SewingStatus = "Below Target" | "On Target" | "Above Target";

export type QcType = "inline" | "endline" | "final";
export type QcResult = "passed" | "rework" | "failed";

export type ShipmentMode = "SEA" | "AIR";
export type ShipmentStatus = "prepared" | "submitted" | "approved" | "shipped";
export type CustomsStatus = "Pending" | "Under Review" | "Cleared";

export type LedgerPaymentStatus = "paid" | "partial" | "unpaid";
export type PaymentMethod = "bank" | "cash" | "cheque" | "mobile banking" | "LC";
export type PaymentPartyType = "buyer" | "supplier" | "other";

export type ExpenseCategory =
  | "utility"
  | "salary"
  | "transport"
  | "rent"
  | "maintenance"
  | "office"
  | "other";

export type RoleId =
  | "super_admin"
  | "owner_director"
  | "merchandiser"
  | "production_manager"
  | "qc_manager"
  | "store_manager"
  | "accounts_manager";

/* ------------------------------------------------------------------ */
/* Core entities                                                      */
/* ------------------------------------------------------------------ */

export interface Buyer {
  id: string;
  name: string;
  contactPerson: string;
  company: string;
  country: string;
  phone: string;
  email: string;
  address: string;
  status: "Active" | "Inactive";
  totalOrders: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  createdAt: string;
}

export interface Order {
  id: string;
  poNumber: string;
  style: string;
  buyerId: string;
  buyerName: string;
  productName: string;
  colorway: string;
  quantity: number;
  unitPrice: number;
  orderValue: number;
  orderDate: string;
  shipDate: string;
  stage: OrderStage;
  progressPercent: number;
  taStatus: TaAndPaymentStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface TaTask {
  id: string;
  orderId: string;
  poNumber: string;
  buyerName: string;
  style: string;
  taskName: string;
  department: TaDepartment;
  owner: string;
  plannedDate: string;
  actualDate: string | null;
  status: TaTaskStatus;
  riskLevel: TaRiskLevel;
  delayDays?: number;
}

export interface Sample {
  id: string;
  orderId: string;
  poNumber: string;
  buyerName: string;
  style: string;
  fitSampleStatus: SampleApprovalStatus;
  ppSampleStatus: SampleApprovalStatus;
  productionApprovalStatus: ProductionApprovalStatus;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  notes: string;
}

export interface Costing {
  id: string;
  orderId: string;
  poNumber: string;
  buyerName: string;
  style: string;
  fabricType: string;
  fabricGsm: number;
  fabricConsumptionYdPc: number;
  trimsCost: number;
  cmCost: number;
  totalCost: number;
  pricePerPc: number;
  marginPercent: number;
}

export interface Procurement {
  id: string;
  type: ProcurementType;
  supplier: string;
  item: string;
  orderId: string;
  poNumber: string;
  buyerName: string;
  style: string;
  required: number;
  received: number;
  balance: number;
  expectedDate: string;
  receivedDate: string | null;
  status: ProcurementStatus;
}

export interface InventoryItem {
  id: string;
  category: InventoryCategory;
  itemName: string;
  colorSpec: string;
  unitType: string;
  unit: string;
  orderId: string;
  poNumber: string;
  buyerName: string;
  style: string;
  received: number;
  issued: number;
  balance: number;
  location: string;
  lastUpdated: string;
}

export interface StockLedgerEntry {
  id: string;
  itemName: string;
  date: string;
  ref: string;
  inQty: number;
  outQty: number;
  balance: number;
  remarks: string;
}

export interface CuttingJob {
  id: string;
  orderId: string;
  poNumber: string;
  buyerName: string;
  style: string;
  fabricIssued: number;
  cutQty: number;
  reject: number;
  balance: number;
  cuttingDate: string;
  status: CuttingStatus;
}

export interface SewingLine {
  id: string;
  lineName: string;
  orderId: string;
  poNumber: string;
  buyerName: string;
  style: string;
  target: number;
  output: number;
  defect: number;
  efficiencyPercent: number;
  operators: number;
  status: SewingStatus;
}

export interface FinishingJob {
  id: string;
  orderId: string;
  poNumber: string;
  buyerName: string;
  style: string;
  fromSewing: number;
  iron: number;
  finish: number;
  reject: number;
  readyForPacking: number;
  date: string;
}

export interface PackingJob {
  id: string;
  orderId: string;
  poNumber: string;
  buyerName: string;
  style: string;
  color: string;
  size: string;
  cartons: number;
  packed: number;
  ready: number;
  date: string;
}

export interface QcRecord {
  id: string;
  orderId: string;
  poNumber: string;
  buyerName: string;
  style: string;
  type: QcType;
  inspector: string;
  checked: number;
  passed: number;
  defectQty: number;
  rejected: number;
  defectType: string;
  result: QcResult;
}

export interface Defect {
  id: string;
  defectType: string;
  occurrences: number;
  totalDefectQty: number;
}

export interface ShipmentDocuments {
  invoice: boolean;
  packing: boolean;
  exp: boolean;
  coo: boolean;
  bl: boolean;
  gsp: boolean;
  buyer: boolean;
}

export interface Shipment {
  id: string;
  orderId: string;
  poNumber: string;
  buyerName: string;
  style: string;
  orderQty: number;
  packedQty: number;
  cartons: number;
  shipDate: string;
  forwarder: string;
  mode: ShipmentMode;
  status: ShipmentStatus;
  customsStatus: CustomsStatus;
  documents: ShipmentDocuments;
}

export interface BuyerLedgerEntry {
  id: string;
  buyerId: string;
  buyerName: string;
  orderValue: number;
  invoiceValue: number;
  receivedValue: number;
  dueValue: number;
  status: LedgerPaymentStatus;
}

export interface SupplierLedgerEntry {
  id: string;
  supplierName: string;
  purchaseValue: number;
  paidValue: number;
  dueValue: number;
  status: LedgerPaymentStatus;
}

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  date: string;
  amount: number;
  notes: string;
}

export interface Payment {
  id: string;
  party: string;
  partyType: PaymentPartyType;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
}

export interface Pnl {
  id: string;
  orderId: string;
  poNumber: string;
  buyerName: string;
  style: string;
  orderValue: number;
  fabricCost: number;
  cmCost: number;
  totalCost: number;
  profit: number;
  marginPercent: number;
}

export interface Settings {
  companyName: string;
  tagline: string;
  taglineBn: string;
  address: string;
  phone: string;
  email: string;
  units: string[];
  currentPanel: RoleId;
  website?: string;
}

export interface Role {
  id: RoleId;
  name: string;
  nameBn: string;
  description: string;
  focusModules: string[];
  defaultRoute: string;
}

/* ------------------------------------------------------------------ */
/* Aggregate ERP document                                             */
/* ------------------------------------------------------------------ */

export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  basicSalary: number;
  status: "Active" | "Inactive" | "On Leave";
  joiningDate: string;
  contactNumber: string;
}

export interface AttendanceLog {
  id: string;
  date: string;
  empId: string;
  name: string;
  inTime: string | null;
  outTime: string | null;
  status: "Present" | "Absent" | "Late" | "Half Day" | "On Leave";
  source: "ZKTeco" | "Manual";
}

export interface PayrollRecord {
  id: string;
  month: string; // e.g. "2026-09"
  empId: string;
  name: string;
  department: string;
  basicSalary: number;
  attendanceDays: number;
  lateDeduction: number;
  overtimeAmount: number;
  netPayable: number;
  status: "Draft" | "Approved" | "Paid";
}

export interface ErpData {
  buyers: Buyer[];
  orders: Order[];
  taTasks: TaTask[];
  samples: Sample[];
  costings: Costing[];
  procurements: Procurement[];
  inventory: InventoryItem[];
  stockLedger: StockLedgerEntry[];
  cuttingJobs: CuttingJob[];
  sewingLines: SewingLine[];
  finishingJobs: FinishingJob[];
  packingJobs: PackingJob[];
  qcRecords: QcRecord[];
  defects: Defect[];
  shipments: Shipment[];
  buyerLedger: BuyerLedgerEntry[];
  supplierLedger: SupplierLedgerEntry[];
  expenses: Expense[];
  payments: Payment[];
  pnl: Pnl[];
  settings: Settings;
  roles: Role[];
  employees: Employee[];
  attendance: AttendanceLog[];
  payroll: PayrollRecord[];
}

/** Key of every array-valued module in ErpData — used by generic CRUD helpers. */
export type ErpCollectionKey = {
  [K in keyof ErpData]: ErpData[K] extends unknown[] ? K : never;
}[keyof ErpData];
