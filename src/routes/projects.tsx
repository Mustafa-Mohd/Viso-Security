import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import {
  Building2, Droplets, Zap, Shield, Briefcase, Anchor, Map, Pickaxe,
  Flame, Activity, CheckCircle2, Search, X, UserCheck, Layers,
  ChevronRight, Sparkles, Filter, Factory, Compass, Calendar, ArrowUpDown
} from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "VISO | Projects Portfolio" },
      { name: "description", content: "Explore VISO's comprehensive project portfolio spanning Oil & Gas, Water, Energy, Giga Projects, Defence, Ports, Finance, Infra & Mining." },
    ],
  }),
  component: ProjectsPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ProjectItem {
  sNo: number;
  name: string;
  client: string;
  endUser: string;
  sector: string;
  category: string;
  location?: string;
  status: "Ongoing" | "Completed";
  highlight?: string;
  scope: string;
  month?: string; // e.g., "October 2024" or "2024-10"
}

/** Helper function to parse month/year string for sorting */
export function parseMonthYear(mStr?: string): number {
  if (!mStr) return 0;
  const isoMatch = mStr.match(/(\d{4})[-/](\d{1,2})/);
  if (isoMatch) {
    return parseInt(isoMatch[1], 10) * 100 + parseInt(isoMatch[2], 10);
  }
  const yearMatch = mStr.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : 2000;
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const lower = mStr.toLowerCase();
  let mIdx = 1;
  monthNames.forEach((name, idx) => {
    if (lower.includes(name)) mIdx = idx + 1;
  });
  return year * 100 + mIdx;
}

export interface SectorCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  bgImage: string;
  description: string;
}

// ─── Sector Categories & Backgrounds ──────────────────────────────────────────
const SECTORS: SectorCategory[] = [
  {
    id: "all",
    label: "All Projects",
    icon: <Compass className="w-4 h-4" />,
    bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
    description: "Complete master portfolio of security engineering and consulting projects across the Kingdom."
  },
  {
    id: "oil-gas",
    label: "Oil & Gas",
    icon: <Flame className="w-4 h-4" />,
    bgImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop",
    description: "Petrochemical refineries, upstream trunklines, CPF facilities & offshore platforms."
  },
  {
    id: "water",
    label: "Water",
    icon: <Droplets className="w-4 h-4" />,
    bgImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2000&auto=format&fit=crop",
    description: "Desalination plants, sewage treatment, regional distribution networks & control centers."
  },
  {
    id: "energy",
    label: "Energy",
    icon: <Zap className="w-4 h-4" />,
    bgImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2000&auto=format&fit=crop",
    description: "380kV & 110kV transmission substations, power plants & utility grid infrastructure."
  },
  {
    id: "giga-projects",
    label: "Giga Projects",
    icon: <Map className="w-4 h-4" />,
    bgImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop",
    description: "NEOM, Red Sea developments, Oxagon, Coral Nursery & futuristic mega-hubs."
  },
  {
    id: "infra",
    label: "Infra",
    icon: <Building2 className="w-4 h-4" />,
    bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop",
    description: "Data centers, smart city surveillance, luxury hospitality & command centers."
  },
  {
    id: "defence",
    label: "Defence",
    icon: <Shield className="w-4 h-4" />,
    bgImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2000&auto=format&fit=crop",
    description: "Ammunition factories, explosives magazines & military authority security systems."
  },
  {
    id: "ports",
    label: "Ports",
    icon: <Anchor className="w-4 h-4" />,
    bgImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2000&auto=format&fit=crop",
    description: "Maritime harbors, slipways, container terminals & MAWANI port infrastructure."
  },
  {
    id: "mining",
    label: "Mining",
    icon: <Pickaxe className="w-4 h-4" />,
    bgImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2000&auto=format&fit=crop",
    description: "Maaden phosphate complexes, mineral processing plants & remote mining operations."
  },
  {
    id: "finance",
    label: "Finance",
    icon: <Briefcase className="w-4 h-4" />,
    bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
    description: "Saudi Central Bank (SAMA) financial security & high-security CCTV coverage."
  }
];

// ─── Master Project List (80 Items) ──────────────────────────────────────────
export const PROJECTS: ProjectItem[] = [
  { sNo: 1, name: "HYDROGEN INNOVATION & DEVELOPMENT CENTER", client: "WORLEY", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Completed", location: "NEOM", scope: "STAGE-01", month: "Jul 2021" },
  { sNo: 2, name: "RELOCATE GROUNDWATER WELLS - NORTH GHAWAR", client: "SLFE", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "North Ghawar", scope: "STAGE-01", month: "Apr 2022" },
  { sNo: 3, name: "INSTALL INTEGRATED SECURITY SYSTEM IN OFFSHORE FACILITIES", client: "WORLEY", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Offshore Facilities", scope: "STAGE-01 & STAGE-02", month: "May 2022" },
  { sNo: 4, name: "TAIBA FUEL PIPELINE", client: "SLFE", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Taiba", scope: "STAGE-01", month: "May 2022" },
  { sNo: 5, name: "QASSIM FUEL PIPELINE", client: "SLFE", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Qassim", scope: "STAGE-01", month: "May 2022" },
  { sNo: 6, name: "DEVELOP SECURITY OPERATION PROCEDURES", client: "DAHLAN", endUser: "SAUDI ENERGY", sector: "ENERGY", category: "energy", status: "Completed", location: "Riyadh", scope: "POLICY & PROCEDURES", month: "Jun 2022" },
  { sNo: 7, name: "ACCELERATED CARBON CAPTURE AND SEQUESTRATION", client: "WOOD", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Eastern Province", scope: "STAGE-01", month: "Aug 2022" },
  { sNo: 8, name: "JAZAN - ROSTP", client: "KAES", endUser: "SAUDI ARAMCO/JV", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Jazan", scope: "STAGE-04", month: "Nov 2022" },
  { sNo: 9, name: "INSTALL INTEGRATED SECURITY SYSTEM IN PLANT FACILITIES, PHASE III", client: "SLFE", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Plant Facilities", scope: "STAGE-01", month: "Nov 2022" },
  { sNo: 10, name: "NEOM - 380kv Substation", client: "AL GIHAZ", endUser: "SAUDI ENERGY", sector: "ENERGY", category: "energy", status: "Completed", location: "NEOM", scope: "STAGE-03", month: "Jan 2023" },
  { sNo: 11, name: "SATORP", client: "WORLEY", endUser: "SATORP", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Jubail", scope: "STAGE-01", month: "Jan 2023" },
  { sNo: 12, name: "217 Sites", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Across Saudi Arabia", scope: "STAGE-01", month: "Feb 2023" },
  { sNo: 13, name: "H2 POWER VAULT", client: "WORLEY", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Jubail", scope: "STAGE-01", month: "Feb 2023" },
  { sNo: 14, name: "Tabuk", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Tabuk", scope: "STAGE-01 & 02", month: "May 2023" },
  { sNo: 15, name: "CCTV coverage", client: "SAMA", endUser: "SAMA", sector: "FINANCE", category: "finance", status: "Completed", location: "Riyadh", scope: "DESIGN", month: "May 2023" },
  { sNo: 16, name: "Um Aljoud - 380kv Substation", client: "AL GIHAZ", endUser: "SAUDI ENERGY", sector: "ENERGY", category: "energy", status: "Completed", location: "Makkah", scope: "STAGE-03", month: "May 2023" },
  { sNo: 17, name: "CRPOs 79,80,81,82 & 83", client: "NMDC", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Ongoing", location: "Offshore", scope: "STAGE-03", month: "May 2023" },
  { sNo: 18, name: "Madina", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Madina", scope: "STAGE-01", month: "Jun 2023" },
  { sNo: 19, name: "AMAZON JED4", client: "CAPITAL ENGINEERING", endUser: "MAWANI", sector: "PORTS", category: "ports", status: "Completed", location: "Jeddah", scope: "STAGE-01", month: "Jun 2023" },
  { sNo: 20, name: "BAO STEEL", client: "IDOM", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Completed", location: "NEOM", scope: "STAGE-01", month: "Jul 2023" },
  { sNo: 21, name: "NEOM - FIRST DESALINATION PLANT", client: "WORLEY", endUser: "SAUDI ARAMCO", sector: "WATER", category: "water", status: "Completed", location: "NEOM", scope: "STAGE-1 & STAGE-02 (REVIEW ONLY)", month: "Aug 2023" },
  { sNo: 22, name: "Jouf (13 locations)", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Al Jouf", scope: "STAGE-01", month: "Oct 2023" },
  { sNo: 23, name: "ZULUF REDEVELOPMENT PROGRAM", client: "WORLEY", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Zuluf Field", scope: "STAGE-01 & STAGE-02", month: "Oct 2023" },
  { sNo: 24, name: "SAFANIYAH AH DEVELOPMENT - OFFSHORE OIL AND WATER INJECTION FAC", client: "WORLEY", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Safaniyah Field", scope: "STAGE-02", month: "Oct 2023" },
  { sNo: 25, name: "Eastern Region (28 locations)", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Ongoing", location: "Eastern Region", scope: "STAGE-01 & STAGE-02", month: "Nov 2023" },
  { sNo: 26, name: "Qassim (31 Locations)", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Qassim", scope: "STAGE-01 & STAGE-02", month: "Dec 2023" },
  { sNo: 27, name: "Northern Borders (15 locations)", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Northern Borders", scope: "STAGE-01 & STAGE-02", month: "Dec 2023" },
  { sNo: 28, name: "Hail (5 Locations)", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Hail", scope: "STAGE-01 & STAGE-02", month: "Jan 2024" },
  { sNo: 29, name: "Southern Region (80 Locations)", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Ongoing", location: "Southern Region", scope: "STAGE-01 & STAGE-02", month: "Jan 2024" },
  { sNo: 30, name: "MARJAN", client: "L&T", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Ongoing", location: "Marjan Field", scope: "STAGE-01,02,03 & 04", month: "Jan 2024" },
  { sNo: 31, name: "The Aluminium Super Cluster", client: "RED SEA ALUMINIUM", endUser: "RED SEA ALUMINIUM", sector: "INFRA", category: "infra", status: "Completed", location: "Red Sea Zone", scope: "STAGE-01", month: "Mar 2024" },
  { sNo: 32, name: "MKKN FOR STEEL FACTORY", client: "MKKN", endUser: "MKKN", sector: "INFRA", category: "infra", status: "Completed", location: "Riyadh", scope: "STAGE-01", month: "Mar 2024" },
  { sNo: 33, name: "Arafat 5 - 110kv Substation", client: "AL GIHAZ", endUser: "SAUDI ENERGY", sector: "ENERGY", category: "energy", status: "Completed", location: "Arafat", scope: "STAGE-01 & STAGE-02", month: "Apr 2024" },
  { sNo: 34, name: "Bio-Reactor", client: "GEO", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Completed", location: "NEOM", scope: "STAGE-01 & STAGE-02", month: "Jun 2024" },
  { sNo: 35, name: "UPGRADE FILTRATION SYSTEM - AINDAR", client: "KBR", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Ain Dar", scope: "STAGE-02", month: "Jun 2024" },
  { sNo: 36, name: "Jubail_3_NH3", client: "LINDE", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Jubail", scope: "STAGE-01", month: "Jul 2024" },
  { sNo: 37, name: "SAFANIYAH AH RESIDUAL OFFSHORE WATER INJECTION STAGE-01 & STAGE-02", client: "KBR", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Safaniyah", scope: "STAGE-01 & STAGE-02", month: "Aug 2024" },
  { sNo: 38, name: "MAADEN PHOSPHATE - PHASE 1", client: "WORLEY", endUser: "SAUDI ARAMCO", sector: "MINING", category: "mining", status: "Ongoing", location: "Wa'ad Al Shamal", scope: "STAGE-03 & 04", month: "Aug 2024" },
  { sNo: 39, name: "AL IBTEKAR MARINE COMPANY -", client: "AL IBTEKAR", endUser: "MAWANI", sector: "PORTS", category: "ports", status: "Completed", location: "Jeddah Port", scope: "STAGE-01", month: "Aug 2024" },
  { sNo: 40, name: "SERVICE HARBOR & SLIPWAY JEDDAH", client: "WESTERN COAST", endUser: "MAWANI", sector: "PORTS", category: "ports", status: "Completed", location: "Jeddah Port", scope: "STAGE-01", month: "Aug 2024" },
  { sNo: 41, name: "TELCO PARK -", client: "NEOM", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Ongoing", location: "NEOM", scope: "STAGE-01,02,03 & 04", month: "Sep 2024" },
  { sNo: 42, name: "HIDC STAGE-01", client: "WORLEY", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Completed", location: "NEOM", scope: "STAGE-01", month: "Sep 2024" },
  { sNo: 43, name: "SECURITY CONTROL CENTER", client: "AL AGADIR HAIL", endUser: "NWC", sector: "WATER", category: "water", status: "Ongoing", location: "Hail", scope: "STAGE-04", month: "Sep 2024" },
  { sNo: 44, name: "SERVICE HARBOR & SLIPWAY JAZAN", client: "WESTERN COAST", endUser: "MAWANI", sector: "PORTS", category: "ports", status: "Completed", location: "Jazan Port", scope: "STAGE-01", month: "Sep 2024" },
  { sNo: 45, name: "CORAL NURSERY -", client: "IDOM", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Completed", location: "NEOM Coast", scope: "STAGE-03", month: "Oct 2024" },
  { sNo: 46, name: "Zuluf Redevelopment Program - Safaniyah Plant", client: "KBR", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Safaniyah", scope: "STAGE-01", month: "Oct 2024" },
  { sNo: 47, name: "S-CHEM PLANT", client: "S-CHEM", endUser: "S-CHEM", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Jubail", scope: "STAGE-03", month: "Oct 2024" },
  { sNo: 48, name: "FERRF AND SANITARY LANDFILL AT NEOM-", client: "IDOM", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Completed", location: "NEOM", scope: "STAGE-01", month: "Nov 2024" },
  { sNo: 49, name: "ABQ GOSP2- WATER WELL", client: "KBR", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Abqaiq", scope: "STAGE-01", month: "Dec 2024" },
  { sNo: 50, name: "ECZA - Desalination Plant", client: "TAAQAT", endUser: "AQUA POWER", sector: "WATER", category: "water", status: "Completed", location: "ECZA Zone", scope: "STAGE-03", month: "Dec 2024" },
  { sNo: 51, name: "Upgradation of CCTV system", client: "RITZ CARLTON", endUser: "RITZ CARLTON", sector: "INFRA", category: "infra", status: "Completed", location: "Riyadh", scope: "DESIGN & SUPERVISION", month: "Feb 2025" },
  { sNo: 52, name: "OXAGON - COMMUNITY", client: "BARQ", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Completed", location: "Oxagon", scope: "STAGE-01", month: "Feb 2025" },
  { sNo: 53, name: "SASREF ETHANE CRACKER", client: "SAMSUNG", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Jubail", scope: "STAGE-01", month: "Mar 2025" },
  { sNo: 54, name: "MAGNA - EXPLOSIVES", client: "BARQ", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Completed", location: "NEOM Magna", scope: "STAGE-01", month: "Mar 2025" },
  { sNo: 55, name: "ROSHN SEDRA - STP STAGE-01", client: "METITO", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Riyadh", scope: "STAGE-01", month: "Apr 2025" },
  { sNo: 56, name: "JOUF ( 3 locations)", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Ongoing", location: "Al Jouf", scope: "STAGE-01 & STAGE-02", month: "Apr 2025" },
  { sNo: 57, name: "QASSIM (3 locations)", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Ongoing", location: "Qassim", scope: "STAGE-01 & STAGE-02", month: "Apr 2025" },
  { sNo: 58, name: "Khurais CPF", client: "SIEMENS", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Khurais Field", scope: "STAGE-03", month: "May 2025" },
  { sNo: 59, name: "Northern Borders (3 locations)", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Ongoing", location: "Northern Borders", scope: "STAGE-01 & STAGE-02", month: "May 2025" },
  { sNo: 60, name: "Ammunition Factory", client: "HLP", endUser: "GAMI", sector: "DEFENCE", category: "defence", status: "Completed", location: "Al Kharj", scope: "STAGE-01 & STAGE-02", month: "Jul 2025" },
  { sNo: 61, name: "ARAR SEWAGE TREATMENT PLANT", client: "CWC", endUser: "NWC", sector: "WATER", category: "water", status: "Ongoing", location: "Arar", scope: "STAGE-1,2,3 & 4", month: "Jul 2025" },
  { sNo: 62, name: "UPGRADE NORTHERN AREA UPSTREAM TRUNKLINES & FLOWLINES", client: "KBR", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Ongoing", location: "Northern Area", scope: "STAGE-01 & STAGE-02", month: "Aug 2025" },
  { sNo: 63, name: "ECZA - Desalination Plant", client: "TAAQAT", endUser: "AQUA POWER", sector: "WATER", category: "water", status: "Completed", location: "ECZA Zone", scope: "STAGE-04", month: "Sep 2025" },
  { sNo: 64, name: "EXPLOSIVE MAGAZINE", client: "SAUDI CHEMICAL", endUser: "SAUDI CHEMICAL", sector: "DEFENCE", category: "defence", status: "Ongoing", location: "Riyadh", scope: "STAGE-04", month: "Sep 2025" },
  { sNo: 65, name: "CORAL NURSERY", client: "HASSAN ALLAM", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Ongoing", location: "NEOM Coast", scope: "STAGE-03 & STAGE-04", month: "Oct 2025" },
  { sNo: 66, name: "INCREASE SHAYBAH GAS HANDLING - 11", client: "KBR", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Ongoing", location: "Shaybah", scope: "STAGE-1", month: "Oct 2025" },
  { sNo: 67, name: "Madina Region", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Ongoing", location: "Madina Region", scope: "STAGE-01 & STAGE-02", month: "Nov 2025" },
  { sNo: 68, name: "RESIDENTIAL CAMP - WEBUILD", client: "RED SEA INTERNATIONAL", endUser: "RED SEA INTERNATIONAL", sector: "INFRA", category: "infra", status: "Completed", location: "Red Sea Zone", scope: "STAGE-1", month: "Nov 2025" },
  { sNo: 69, name: "UPGRADE GATES -", client: "S-CHEM", endUser: "S-CHEM", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Jubail", scope: "GAP ANALYSIS & STAGE-01", month: "Nov 2025" },
  { sNo: 70, name: "ADVANCED ENERGY - CONSTRUCTION FENCE", client: "ADVANCED ENERGY", endUser: "MAADEN", sector: "MINING", category: "mining", status: "Completed", location: "Ras Al Khair", scope: "STAGE-03", month: "Nov 2025" },
  { sNo: 71, name: "UPGRADE SURVEILLANCE CAMERA", client: "RCRC", endUser: "RCRC", sector: "INFRA", category: "infra", status: "Ongoing", location: "Riyadh", scope: "DESIGN", month: "Dec 2025" },
  { sNo: 72, name: "JEDDAH REGION", client: "NWC", endUser: "NWC", sector: "WATER", category: "water", status: "Ongoing", location: "Jeddah Region", scope: "STAGE-01 & STAGE-02", month: "Dec 2025" },
  { sNo: 73, name: "DATA CENTER - RIYADH", client: "IDOM", endUser: "CONFIDENTIAL", sector: "INFRA", category: "infra", status: "Ongoing", location: "Riyadh", scope: "SECURITY CONSULTANCY", month: "Jan 2026" },
  { sNo: 74, name: "YANBU & JUBAIL", client: "MARAFIQ", endUser: "MARAFIQ", sector: "ENERGY", category: "energy", status: "Ongoing", location: "Yanbu & Jubail", scope: "SECURITY CONSULTANCY", month: "Jan 2026" },
  { sNo: 75, name: "RIYADH EXPO - 2030", client: "BURO HAPPOLD", endUser: "EXPO RIYADH COMPANY", sector: "GIGA PROJECTS", category: "giga-projects", status: "Ongoing", location: "Riyadh", scope: "SECURITY CONSULTANCY", month: "Feb 2026" },
  { sNo: 76, name: "JOTUN FACTORY", client: "IDOM", endUser: "JOTUN", sector: "INFRA", category: "infra", status: "Ongoing", location: "Yanbu", scope: "STAGE-01", month: "Feb 2026" },
  { sNo: 77, name: "Rabigh Power Plant", client: "SIEMENS", endUser: "SAUDI ENERGY", sector: "ENERGY", category: "energy", status: "Ongoing", location: "Rabigh", scope: "STAGE-03", month: "May 2026" },
  { sNo: 78, name: "Rabigh Power Plant", client: "DOOSAN", endUser: "SAUDI ENERGY", sector: "ENERGY", category: "energy", status: "Ongoing", location: "Rabigh", scope: "GAP ANALYSIS", month: "May 2026" },
  { sNo: 79, name: "MAADEN PHOSPHATE 3 PHASE 2", client: "WORLEY", endUser: "SAUDI ARAMCO", sector: "MINING", category: "mining", status: "Ongoing", location: "Wa'ad Al Shamal", scope: "STAGE-01 & STAGE-02", month: "Jun 2026" },
  { sNo: 80, name: "NORTHERN AREA GAS INCREMENT UPSTREAM GAS PRODUCTION FACILITIES", client: "KBR", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Ongoing", location: "Northern Area", scope: "STAGE-02", month: "Aug 2026" }
];

// ─── Client Logo Helper & Badge ───────────────────────────────────────────────
const LOGO_MAP: { keywords: string[]; logo: string }[] = [
  { keywords: ["aramco"], logo: "/clients/aramco.png" },
  { keywords: ["satorp"], logo: "/clients/satorp.png" },
  { keywords: ["s-chem", "schem"], logo: "https://schem.com/assets/img/logo-schem.png" },
  { keywords: ["nmdc"], logo: "https://www.nmdc-energy.com/assets/images/logo/NMDC%20Energy%20white.svg" },
  { keywords: ["advanced"], logo: "https://advancedpetrochem.com/wp-content/uploads/2022/09/advanced-logos-111-4.gif" },
  { keywords: ["neom"], logo: "/clients/neom.png" },
  { keywords: ["ma'aden", "maaden"], logo: "/clients/maaden.png" },
  { keywords: ["red sea aluminium"], logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJnSK4CumDRELOlBQJg_dU7W7aO2YNryTbrBxqbTnsYw&s=10" },
  { keywords: ["oxagon"], logo: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790588462/download.jpg" },
  { keywords: ["mkkn"], logo: "https://mkkn.com.sa/wp-content/uploads/2022/02/logo-copy-2.png" },
  { keywords: ["nwc", "national water company"], logo: "/clients/nwc.png" },
  { keywords: ["saudi water authority", "swa"], logo: "https://www.swa.gov.sa/assets/images/logos/swa-logo-dark.svg" },
  { keywords: ["water transmission", "wtc", "wtco"], logo: "https://res.cloudinary.com/dppwnds6z/image/upload/v1791403689/halrzfairpmo4hwt6irw.png" },
  { keywords: ["taaqat", "taqqat"], logo: "https://www.taqqat.com/images/taqat-name-logo.png" },
  { keywords: ["acwa", "aqua power"], logo: "/clients/acwa.png" },
  { keywords: ["saudi energy", "sec", "saudi electricity"], logo: "/clients/sec.png" },
  { keywords: ["marafiq"], logo: "/clients/marafiq.png" },
  { keywords: ["sama", "saudi central bank"], logo: "/clients/sama.png" },
  { keywords: ["mawani", "saudi ports"], logo: "/clients/mawani.png" },
  { keywords: ["rcrc", "royal commission for riyadh"], logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2czWYhQ99YmeQijpZnDefTU-5wRxuzVxg2KnXQOrYQg&s=10" },
  { keywords: ["gami"], logo: "https://www.gami.gov.sa/sites/default/files/160x22px_logo_GAMI.svg" },
  { keywords: ["worley"], logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFyOpJdepx0wZ8yYEX3LmMBYPV4pMRvm3HHxiFlgdfdg&s=10" },
  { keywords: ["wood"], logo: "https://www.woodgroup.com/__data/assets/file/0024/368601/Logo-Wood-Sidara.svg" },
  { keywords: ["slfe", "snc-lavalin", "snc lavalin"], logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjYzRdA_sKcoN2QDryI05gyDlRxnX86WHzz_vMOLDE2A&s=10" },
  { keywords: ["kbr"], logo: "https://www.kbr.com/modules/custom/kbr_language/images/kbr-logo-color.svg" },
  { keywords: ["idom"], logo: "https://www.idom.com/wp-content/themes/idom/images/IDOM.svg" },
  { keywords: ["siemens"], logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsrBNa5TuhWdFYRFwUaCOn-KAnm1gVrAmL_LFjTstyiQ&s=10" },
  { keywords: ["l&t", "larsen"], logo: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790588341/download.png" },
  { keywords: ["samsung"], logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfOebKDRgPNQCWw-4f8EFl--l8sqWuk1FWJ8pYjod6Zg&s=10" },
  { keywords: ["doosan"], logo: "https://www.doosan.com/images/common/CI_new.png" },
  { keywords: ["ritz", "ritz carlton", "ritz-carlton"], logo: "/clients/ritz.png" },
  { keywords: ["red sea international", "red sea intl"], logo: "/clients/red-sea-intl.png" },
  { keywords: ["red sea global"], logo: "/clients/red-sea-global.png" },
  { keywords: ["amazon"], logo: "/clients/amazon.svg" },
  { keywords: ["jotun"], logo: "/clients/jotun.png" },
  { keywords: ["roshn"], logo: "/clients/roshn.png" },
  { keywords: ["saudi chemical"], logo: "/clients/saudi-chemical.png" },
];

export function getClientLogo(name?: string): string | null {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  for (const item of LOGO_MAP) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.logo;
    }
  }
  return null;
}

function ClientLogoBadge({
  src,
  alt,
  fallbackIcon,
  className = "w-4 h-4 object-contain"
}: {
  src: string | null;
  alt: string;
  fallbackIcon: React.ReactNode;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <>{fallbackIcon}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

// ─── Status Badge Component ───────────────────────────────────────────────────
function StatusBadge({ status }: { status: ProjectItem["status"] }) {
  const config = {
    Active: { color: "#38BDF8", bg: "rgba(56,189,248,0.15)", border: "rgba(56,189,248,0.3)" },
    Completed: { color: "#22C55E", bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.3)" },
    Ongoing: { color: "#F59E0B", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)" },
  }[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md border shadow-sm"
      style={{ color: config.color, background: config.bg, borderColor: config.border }}
    >
      <span className="w-2 h-2 rounded-full animate-ping" style={{ background: config.color }} />
      {status}
    </span>
  );
}

// ─── Simple Card ──────────────────────────────────────────────────────────────
function ProjectSimpleCard({
  project,
  index,
  onSelect
}: {
  project: ProjectItem;
  index: number;
  onSelect: (p: ProjectItem) => void;
}) {
  const clientLogo = getClientLogo(project.client);
  const endUserLogo = getClientLogo(project.endUser);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.15) }}
      onClick={() => onSelect(project)}
      className={`group flex flex-col rounded-3xl p-6 cursor-pointer transition-all duration-300 relative overflow-hidden ${
        project.highlight 
          ? "bg-gradient-to-br from-primary/5 to-white border-2 border-primary shadow-md hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.4)]" 
          : "bg-white border border-black shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.2)]"
      }`}
    >
      <div className="flex justify-between items-center mb-5 gap-2">
        {project.month ? (
          <span className="text-[11px] font-mono font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full flex items-center gap-1 border border-primary/20 shrink-0">
            <Calendar className="w-3 h-3 text-primary" /> {project.month}
          </span>
        ) : (
          <span className="text-[11px] font-mono text-black/40">#{project.sNo}</span>
        )}
        <StatusBadge status={project.status} />
      </div>
      
      <h3 className="font-sans font-bold text-[15px] text-black leading-snug mb-1.5 group-hover:text-primary transition-colors">
        {project.name}
      </h3>
      <span className="text-sm font-medium text-primary mb-6 block">
        {project.sector}
      </span>

      <div className="mt-auto space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-black/5 border border-black/10 flex items-center justify-center shrink-0 overflow-hidden p-1.5">
            <ClientLogoBadge
              src={clientLogo}
              alt={project.client}
              fallbackIcon={<Building2 className="w-4 h-4 text-black/60" />}
              className="max-h-5 max-w-5 object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-black/50 font-medium">Client</span>
            <span className="text-sm font-semibold text-black truncate flex items-center gap-1.5">
              {project.client}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-black/5 border border-black/10 flex items-center justify-center shrink-0 overflow-hidden p-1.5">
            <ClientLogoBadge
              src={endUserLogo}
              alt={project.endUser}
              fallbackIcon={<UserCheck className="w-4 h-4 text-black/60" />}
              className="max-h-5 max-w-5 object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-black/50 font-medium">End User</span>
            <span className="text-sm font-semibold text-black truncate flex items-center gap-1.5">
              {project.endUser}
            </span>
          </div>
        </div>
      </div>

    </motion.div>
  );
}

// ─── Modal Detail View ────────────────────────────────────────────────────────
function ProjectDetailModal({ project, onClose }: { project: ProjectItem; onClose: () => void }) {
  const currentSector = SECTORS.find((s) => s.id === project.category) || SECTORS[0];
  const clientLogo = getClientLogo(project.client);
  const endUserLogo = getClientLogo(project.endUser);

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 sm:p-6 pt-28 pb-8 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
          className="relative w-full max-w-2xl bg-white border border-black/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl flex flex-col max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Banner Image */}
          <div className="relative h-28 sm:h-36 overflow-hidden rounded-t-3xl shrink-0">
            <img
              src={currentSector.bgImage}
              alt={currentSector.label}
              className="w-full h-full object-cover filter brightness-[0.7]"
            />
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors border border-white/20 z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Info */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
            {/* Header Content moved to white body */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={project.status} />
                {project.month && (
                  <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                    <Calendar className="w-3.5 h-3.5" /> {project.month}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-sans font-bold text-black leading-tight">
                {project.name}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase text-foreground/50 font-bold mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary" /> Client Contracting Party
                  </div>
                  <div className="text-base font-bold text-black">{project.client}</div>
                </div>
                {clientLogo && (
                  <div className="w-10 h-10 rounded-xl bg-white border border-black/10 p-1.5 flex items-center justify-center shrink-0 shadow-sm ml-2">
                    <ClientLogoBadge
                      src={clientLogo}
                      alt={project.client}
                      fallbackIcon={null}
                      className="max-h-7 max-w-7 object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase text-foreground/50 font-bold mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Beneficiary / End User
                  </div>
                  <div className="text-base font-bold text-black">{project.endUser}</div>
                </div>
                {endUserLogo && (
                  <div className="w-10 h-10 rounded-xl bg-white border border-black/10 p-1.5 flex items-center justify-center shrink-0 shadow-sm ml-2">
                    <ClientLogoBadge
                      src={endUserLogo}
                      alt={project.endUser}
                      fallbackIcon={null}
                      className="max-h-7 max-w-7 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/5 border border-black/10">
                <span className="text-foreground/50 uppercase block mb-0.5 text-[10px]">Sector</span>
                <span className="font-bold text-black tracking-wide">{project.sector}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/5 border border-black/10">
                <span className="text-foreground/50 uppercase block mb-0.5 text-[10px]">Category</span>
                <span className="font-bold text-black tracking-wide">{currentSector.label}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/5 border border-black/10 col-span-2 sm:col-span-1">
                <span className="text-foreground/50 uppercase block mb-0.5 text-[10px]">Location</span>
                <span className="font-bold text-black tracking-wide">{project.location || "Saudi Arabia"}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-[10px] font-mono uppercase font-bold text-primary tracking-widest flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Scope of Work & Security Engineering
              </h4>
              <p className="text-[13px] text-foreground/80 leading-relaxed bg-black/[0.03] p-3 rounded-2xl border border-black/10">
                {project.scope}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
}

// ─── Main Projects Page Component ─────────────────────────────────────────────
function ProjectsPage() {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(PROJECTS);

  useEffect(() => {
    async function loadProjects() {
      const { data } = await supabase.from('cms_content').select('content').eq('section_key', 'projects').maybeSingle();
      if (data && data.content && Array.isArray(data.content)) {
        setProjectsList(data.content);
      }
    }
    loadProjects();

    const handleCmsUpdated = () => {
      loadProjects();
    };
    window.addEventListener("viso_cms_updated", handleCmsUpdated);
    return () => window.removeEventListener("viso_cms_updated", handleCmsUpdated);
  }, []);

  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const activeSector = useMemo(
    () => SECTORS.find((s) => s.id === selectedSector) || SECTORS[0],
    [selectedSector]
  );

  // Extract unique clients for filter dropdown
  const uniqueClients = useMemo(() => {
    const clients = new Set<string>();
    projectsList.forEach((p) => clients.add(p.client));
    return ["all", ...Array.from(clients).sort()];
  }, [projectsList]);

  // Filter & sort projects dynamically
  const filteredProjects = useMemo(() => {
    let result = projectsList.filter((project) => {
      const matchesSector = selectedSector === "all" || project.category === selectedSector;
      const matchesClient = selectedClient === "all" || project.client === selectedClient;
      const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.name.toLowerCase().includes(q) ||
        project.client.toLowerCase().includes(q) ||
        project.endUser.toLowerCase().includes(q) ||
        project.sector.toLowerCase().includes(q) ||
        (project.month && project.month.toLowerCase().includes(q)) ||
        project.sNo.toString().includes(q);

      return matchesSector && matchesClient && matchesStatus && matchesSearch;
    });

    return [...result].sort((a, b) => parseMonthYear(b.month) - parseMonthYear(a.month));
  }, [selectedSector, selectedClient, selectedStatus, searchQuery, projectsList]);

  // Sector Counts Map
  const sectorCounts = useMemo(() => {
    const map: Record<string, number> = { all: projectsList.length };
    SECTORS.forEach((s) => {
      if (s.id !== "all") {
        map[s.id] = projectsList.filter((p) => p.category === s.id).length;
      }
    });
    return map;
  }, [projectsList]);

  return (
    <>
      <SmoothScroll />
      <TopNav />

      <main className="min-h-screen text-foreground relative overflow-hidden bg-background">
        {/* Dynamic Sector Background Image with Smooth Fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSector.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-[65vh] z-0 pointer-events-none"
          >
            <img
              src={activeSector.bgImage}
              alt={activeSector.label}
              className="w-full h-full object-cover filter brightness-[0.6] saturate-125"
            />
            {/* Simple dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Foreground Content Container */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 md:px-16 pt-36 pb-32">

          {/* ── Page Hero Header ── */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.3em] uppercase px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-6 shadow-lg backdrop-blur-md"
            >
              <Activity className="w-3.5 h-3.5" />
              Master Project Portfolio
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.15] drop-shadow-lg"
            >
              Security Engineering &{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #FFD700 0%, #FDB931 100%)",
                  filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))"
                }}
              >
                Project Execution
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
            >
              Explore our proven track record with clients such as <strong className="text-white">Saudi Aramco, NEOM, NWC, Siemens, KBR, MAWANI, SAMA, and Ma'aden</strong> across critical industrial sectors.
            </motion.p>
          </div>

          {/* ── Key Metrics Header Bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 p-4 rounded-3xl bg-white/80 border border-black/10 backdrop-blur-xl shadow-sm"
          >
            <div className="p-4 rounded-2xl bg-black/[0.03] border border-black/[0.06] text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-1">300+</div>
              <div className="text-xs font-mono uppercase text-foreground/60 tracking-wider font-semibold">Total Projects</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/[0.03] border border-black/[0.06] text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-primary mb-1">9</div>
              <div className="text-xs font-mono uppercase text-foreground/60 tracking-wider font-semibold">Industrial Sectors</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/[0.03] border border-black/[0.06] text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-sky-600 mb-1">500+</div>
              <div className="text-xs font-mono uppercase text-foreground/60 tracking-wider font-semibold">Technical Assessments</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/[0.03] border border-black/[0.06] text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-emerald-600 mb-1">99%</div>
              <div className="text-xs font-mono uppercase text-foreground/60 tracking-wider font-semibold">On-Time Deliverables</div>
            </div>
          </motion.div>

          {/* ── Sector Tabs Navigation ── */}
          <div className="mb-12 w-full">
            <div className="text-xs font-mono uppercase font-bold text-foreground/50 mb-6 tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Filter by Industry Sector
            </div>

            <div className="flex items-start justify-between gap-4 overflow-x-auto pb-6 pt-2 scrollbar-none scroll-smooth w-full px-1">
              {SECTORS.map((sector) => {
                const isActive = selectedSector === sector.id;
                const count = sectorCounts[sector.id] || 0;

                return (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector.id)}
                    className="relative flex flex-col items-center gap-2.5 flex-shrink-0 group outline-none"
                  >
                    <div 
                      className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
                        isActive 
                          ? 'border-primary shadow-[0_10px_20px_-5px_rgba(212,175,55,0.4)] scale-105' 
                          : 'border-black/5 shadow-sm group-hover:border-black/20'
                      }`}
                    >
                      <img 
                        src={sector.bgImage} 
                        alt={sector.label} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    </div>
                    <span className={`text-center font-sans text-xs sm:text-sm font-bold transition-colors duration-300 ${
                      isActive ? 'text-primary' : 'text-black/70 group-hover:text-black'
                    }`}>
                      {sector.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Search & Filter Controls Bar ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 p-4 rounded-3xl bg-white/80 border border-black/10 backdrop-blur-xl shadow-sm">
            {/* Text Search Input */}
            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input
                type="text"
                placeholder="Search by S.No, project name, client, month..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-black/[0.03] border border-black/10 text-black placeholder-black/40 text-xs font-mono focus:outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Client Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full pl-11 pr-8 py-3 rounded-xl bg-black/[0.03] border border-black/10 text-black text-xs font-mono uppercase focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Clients ({uniqueClients.length - 1})</option>
                {uniqueClients.filter(c => c !== "all").map((client) => (
                  <option key={client} value={client}>
                    Client: {client}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-11 pr-8 py-3 rounded-xl bg-black/[0.03] border border-black/10 text-black text-xs font-mono uppercase focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* ── Results Info Bar ── */}
          <div className="flex items-center justify-between mb-8 text-xs font-mono text-foreground/60">
            <div>
              Showing <span className="font-bold text-foreground">{filteredProjects.length}</span> of{" "}
              <span className="font-bold text-foreground">{projectsList.length}</span> projects
              {selectedSector !== "all" && (
                <span> in <span className="text-primary font-bold">{activeSector.label}</span></span>
              )}
            </div>

            {(searchQuery || selectedClient !== "all" || selectedSector !== "all" || selectedStatus !== "all") && (
              <button
                onClick={() => {
                  setSelectedSector("all");
                  setSelectedClient("all");
                  setSelectedStatus("all");
                  setSearchQuery("");
                }}
                className="text-primary hover:underline font-semibold flex items-center gap-1"
              >
                Reset Filters <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* ── Projects Grid ── */}
          {filteredProjects.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, idx) => (
                  <ProjectSimpleCard
                    key={`${project.sNo}-${project.name}`}
                    project={project}
                    index={idx}
                    onSelect={(p) => setActiveModalProject(p)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Empty State */
            <div className="text-center py-24 p-8 rounded-3xl bg-black/[0.02] border border-black/10 max-w-lg mx-auto">
              <Search className="w-12 h-12 text-black/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-2">No Projects Match Your Search</h3>
              <p className="text-xs text-foreground/60 mb-6">
                Try searching with different terms or reset your sector, client, and status filters.
              </p>
              <button
                onClick={() => {
                  setSelectedSector("all");
                  setSelectedClient("all");
                  setSearchQuery("");
                }}
                className="px-5 py-2.5 rounded-xl bg-primary text-black font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <ProjectDetailModal
            project={activeModalProject}
            onClose={() => setActiveModalProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
