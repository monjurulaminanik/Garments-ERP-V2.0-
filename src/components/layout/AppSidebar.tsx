"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CalendarClock,
  Shirt,
  Calculator,
  PackageSearch,
  Layers,
  Ruler,
  Scissors,
  Boxes,
  Ship,
  FileBarChart,
  Settings as SettingsIcon,
  LogOut,
  Factory,
  PackageCheck,
  ScanSearch,
  ClipboardCheck,
  AlertTriangle,
  Map as MapIcon,
  FileStack,
  Container,
  FileCheck2,
  BookUser,
  Building2,
  Receipt,
  HandCoins,
  TrendingUp,
  Fingerprint,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useErpStore } from "@/lib/store";
import {
  getRoleById,
  roleCanAccessModule,
  type ModuleKey,
  type RoleId,
} from "@/lib/roles";

interface NavLeaf {
  label: string;
  href: string;
  icon: LucideIcon;
  module: ModuleKey;
}

interface NavSection {
  title: string;
  titleBn: string;
  items: NavLeaf[];
}

const topLevel: NavLeaf[] = [
  { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard, module: "dashboard" },
];

const navSections: NavSection[] = [
  {
    title: "Commercial",
    titleBn: "কমার্শিয়াল",
    items: [
      { label: "Buyers", href: "/app/buyers", icon: Users, module: "buyers" },
      { label: "Orders", href: "/app/orders", icon: ClipboardList, module: "orders" },
      { label: "T&A Calendar", href: "/app/ta-calendar", icon: CalendarClock, module: "ta-calendar" },
      { label: "Samples", href: "/app/merchandising?tab=samples", icon: Shirt, module: "merchandising" },
      { label: "Costing", href: "/app/costing", icon: Calculator, module: "costing" },
    ],
  },
  {
    title: "Procurement",
    titleBn: "ক্রয়",
    items: [
      { label: "Fabric Booking", href: "/app/procurement?tab=fabric", icon: Layers, module: "procurement" },
      { label: "Trims Booking", href: "/app/procurement?tab=trims", icon: Ruler, module: "procurement" },
      { label: "Supplier PO", href: "/app/procurement?tab=po", icon: FileStack, module: "procurement" },
      { label: "In-house Status", href: "/app/procurement?tab=inhouse", icon: PackageCheck, module: "procurement" },
      { label: "Comm. Import", href: "/app/procurement?tab=import", icon: Ship, module: "procurement" },
    ],
  },
  {
    title: "Inventory",
    titleBn: "ইনভেন্টরি",
    items: [
      { label: "Fabric Stock", href: "/app/inventory?tab=fabric", icon: Boxes, module: "inventory" },
      { label: "Fin. Fabric Stock", href: "/app/inventory?tab=finished_fabric", icon: Layers, module: "inventory" },
      { label: "Trims Stock", href: "/app/inventory?tab=trims", icon: PackageSearch, module: "inventory" },
      { label: "Cutting Issue", href: "/app/inventory?tab=cutting", icon: Scissors, module: "inventory" },
      { label: "Finished Goods", href: "/app/inventory?tab=finished", icon: PackageCheck, module: "inventory" },
      { label: "Stock Ledger", href: "/app/inventory?tab=ledger", icon: FileStack, module: "inventory" },
    ],
  },
  {
    title: "HR & Admin",
    titleBn: "এইচআর ও অ্যাডমিন",
    items: [
      { label: "Directory", href: "/app/hr?tab=directory", icon: Users, module: "hr" },
      { label: "Attendance", href: "/app/hr?tab=attendance", icon: Fingerprint, module: "hr" },
      { label: "Payroll", href: "/app/hr?tab=payroll", icon: Receipt, module: "hr" },
    ],
  },
  {
    title: "Composite Production",
    titleBn: "কম্পোজিট উৎপাদন",
    items: [
      { label: "Yarn Store", href: "/app/production/yarn", icon: Layers, module: "production" },
      { label: "Knitting", href: "/app/production/knitting", icon: Factory, module: "production" },
      { label: "Dyeing & Wash", href: "/app/production/dyeing", icon: FileStack, module: "production" },
    ],
  },
  {
    title: "Garments Production",
    titleBn: "গার্মেন্টস উৎপাদন",
    items: [
      { label: "Cutting", href: "/app/production/cutting", icon: Scissors, module: "production" },
      { label: "Sewing Lines", href: "/app/production/sewing", icon: Shirt, module: "production" },
      { label: "Finishing", href: "/app/production/finishing", icon: Factory, module: "production" },
      { label: "Packing", href: "/app/production/packing", icon: Container, module: "production" },
    ],
  },
  {
    title: "Quality",
    titleBn: "কোয়ালিটি",
    items: [
      { label: "Inline QC", href: "/app/quality-control?tab=inline", icon: ScanSearch, module: "quality-control" },
      { label: "Endline QC", href: "/app/quality-control?tab=endline", icon: ClipboardCheck, module: "quality-control" },
      { label: "Final Inspection", href: "/app/quality-control?tab=final", icon: FileCheck2, module: "quality-control" },
      { label: "Defects", href: "/app/quality-control?tab=defects", icon: AlertTriangle, module: "quality-control" },
    ],
  },
  {
    title: "Shipment",
    titleBn: "শিপমেন্ট",
    items: [
      { label: "Shipment Plan", href: "/app/shipment?tab=plan", icon: MapIcon, module: "shipment" },
      { label: "Packing List", href: "/app/shipment?tab=packing", icon: FileStack, module: "shipment" },
      { label: "Cartons", href: "/app/shipment?tab=carton", icon: Container, module: "shipment" },
      { label: "Export Docs", href: "/app/shipment?tab=export", icon: Ship, module: "shipment" },
    ],
  },
  {
    title: "Accounts",
    titleBn: "হিসাব",
    items: [
      { label: "Buyer Ledger", href: "/app/accounts?tab=buyer", icon: BookUser, module: "accounts" },
      { label: "Supplier Ledger", href: "/app/accounts?tab=supplier", icon: Building2, module: "accounts" },
      { label: "Expenses", href: "/app/accounts?tab=expense", icon: Receipt, module: "accounts" },
      { label: "Collections", href: "/app/accounts?tab=payment", icon: HandCoins, module: "accounts" },
      { label: "Profit / Loss", href: "/app/accounts?tab=pnl", icon: TrendingUp, module: "accounts" },
    ],
  },
  {
    title: "Reports",
    titleBn: "রিপোর্ট",
    items: [
      { label: "Order Reports", href: "/app/reports?tab=orders", icon: FileBarChart, module: "reports" },
      { label: "T&A Reports", href: "/app/reports?tab=ta_delay", icon: FileBarChart, module: "reports" },
      { label: "Production Reports", href: "/app/reports?tab=production", icon: FileBarChart, module: "reports" },
      { label: "QC Reports", href: "/app/reports?tab=qc", icon: FileBarChart, module: "reports" },
      { label: "Stock Reports", href: "/app/reports?tab=stock", icon: FileBarChart, module: "reports" },
      { label: "Shipment Reports", href: "/app/reports?tab=shipment", icon: FileBarChart, module: "reports" },
      { label: "Accounts Reports", href: "/app/reports?tab=accounts", icon: FileBarChart, module: "reports" },
    ],
  },
];

function isActive(pathname: string, search: string, href: string): boolean {
  const [hrefPath, hrefQuery] = href.split("?");
  if (pathname !== hrefPath && !pathname.startsWith(`${hrefPath}/`)) return false;
  if (!hrefQuery) {
    const siblingsHaveTabs = [...navSections.flatMap((s) => s.items), ...topLevel].some((i) =>
      i.href.startsWith(`${hrefPath}?`)
    );
    if (siblingsHaveTabs) return !search || search === "";
    return true;
  }
  const want = new URLSearchParams(hrefQuery);
  const have = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  for (const [k, v] of want.entries()) {
    if (have.get(k) !== v) return false;
  }
  return true;
}

function filterByRole(items: NavLeaf[], roleId: RoleId | null): NavLeaf[] {
  return items.filter((item) => roleCanAccessModule(roleId, item.module));
}

export interface AppSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const pathname = usePathname() ?? "/app/dashboard";
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ? `?${searchParams.toString()}` : "";
  const roleId = useErpStore((s) => s.role);
  const clearRole = useErpStore((s) => s.clearRole);
  const role = getRoleById(roleId);

  const visibleTop = filterByRole(topLevel, roleId);
  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: filterByRole(section.items, roleId),
    }))
    .filter((section) => section.items.length > 0);

  const showSettings = roleCanAccessModule(roleId, "settings");

  return (
    <div
      className={cn(
        "flex h-dvh w-full flex-col bg-[#08323C] text-white",
        "border-r border-white/[0.06]",
        className
      )}
    >
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-white/10 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#E36414] text-xs font-bold tracking-wide">
          DR
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[13px] font-semibold tracking-wide">Dawat</p>
          <p className="truncate text-[10px] text-white/45">
            {role ? `${role.titleBn}` : "RMG SOFT"}
          </p>
        </div>
      </div>

      {/* Role chip */}
      {role && (
        <div className="shrink-0 border-b border-white/10 px-3 py-2">
          <div className="rounded-md bg-white/[0.06] px-2.5 py-1.5">
            <p className="text-[9px] uppercase tracking-[0.14em] text-white/40">Active panel</p>
            <p className="truncate text-[12px] font-semibold text-[#F19F50]">{role.title}</p>
          </div>
        </div>
      )}

      <nav className="brand-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 py-3">
        <ul className="space-y-0.5">
          {visibleTop.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              active={isActive(pathname, search, item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </ul>

        {visibleSections.map((section) => (
          <div key={section.title} className="mt-3.5">
            <p className="mb-1 px-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
              {section.title}
              <span className="ml-1 normal-case tracking-normal text-white/25">· {section.titleBn}</span>
            </p>
            <ul className="space-y-px">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  active={isActive(pathname, search, item.href)}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </div>
        ))}

        {showSettings && (
          <div className="mt-3.5 pb-2">
            <ul>
              <NavItem
                item={{
                  label: "Settings",
                  href: "/app/settings",
                  icon: SettingsIcon,
                  module: "settings",
                }}
                active={isActive(pathname, search, "/app/settings")}
                onNavigate={onNavigate}
              />
            </ul>
          </div>
        )}
      </nav>

      <div className="shrink-0 border-t border-white/10 bg-[#06282F] px-2.5 py-2.5">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            clearRole();
            window.location.href = "/enter";
          }}
          className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12px] text-white/75 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" />
          Switch Panel / লগআউট
        </button>
        <p className="mt-1 px-2.5 pb-1 text-[9px] leading-snug text-white/30">Dawat RMG SOFT</p>
      </div>
    </div>
  );
}

function NavItem({
  item,
  active,
  onNavigate,
}: {
  item: NavLeaf;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-2 rounded-md px-2.5 py-[7px] text-[12.5px] font-medium transition-colors",
          active
            ? "bg-[#E36414] text-white shadow-sm"
            : "text-white/70 hover:bg-white/[0.08] hover:text-white"
        )}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" strokeWidth={2} />
        <span className="truncate">{item.label}</span>
      </Link>
    </li>
  );
}

export default AppSidebar;
