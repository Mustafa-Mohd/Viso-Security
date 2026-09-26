import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import {
  Building2, Droplets, Zap, Shield, Briefcase, Anchor, Map, Pickaxe,
  Flame, Activity, CheckCircle2, Search, X, UserCheck, Layers,
  ChevronRight, Sparkles, Filter, Factory, Compass
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
  status: "Active" | "Completed" | "Ongoing";
  highlight?: string;
  scope: string;
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

// ─── Master Project List (77 Items) ──────────────────────────────────────────
const PROJECTS: ProjectItem[] = [
  // ── Oil & Gas / Petrochemical (19 projects) ──
  { sNo: 14, client: "LINDE", name: "Jubail 3_NH3", endUser: "SIPCHEM", sector: "PETROCHEMICAL", category: "oil-gas", status: "Active", location: "Jubail Industrial City", scope: "Integrated security engineering design, HCIS Stage-1 & Stage-2 compliance, CCTV surveillance and access control for ammonia chemical complex." },
  { sNo: 17, client: "SAMSUNG", name: "SASREF ETHANE CRACKER", endUser: "SAUDI ARAMCO", sector: "PETROCHEMICAL", category: "oil-gas", status: "Active", highlight: "Aramco Project", location: "Jubail Industrial City", scope: "Industrial physical security system, perimeter intrusion detection (PIDS), and HCIS directives compliance review." },
  { sNo: 19, client: "Siemens", name: "Khurais CPF", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", highlight: "Flagship", location: "Khurais Field", scope: "Central Processing Facility security control systems, perimeter fence sensors, and emergency response integration." },
  { sNo: 20, client: "Siemens", name: "Khurais CPF-Variation Order", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Khurais Field", scope: "Variation order scope expansion for security coverage, extended CCTV surveillance, and gate control integration." },
  { sNo: 26, client: "KBR", name: "Bio-Reactor-STAGE-01 & STAGE-02 / SAUDI ARAMCO", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Active", location: "Eastern Province", scope: "Stage-01 & Stage-02 HCIS security design engineering approval, risk assessment, and technical security validation." },
  { sNo: 27, client: "WORLEY", name: "ZULUF STAGE-02", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Active", highlight: "Major Mega Program", location: "Zuluf Offshore / Onshore", scope: "Zuluf Field Stage-02 comprehensive security infrastructure engineering, perimeter defense, and central command design." },
  { sNo: 28, client: "L&T", name: "UPGRADE FILTRATION SYSTEM - AINDAR STAGE-02 REDEVELOPMENT PROGRAM STAGE-01 & MARJAN STAGE-01,02,03 & 04", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Active", location: "Ain Dar & Marjan Fields", scope: "Multi-stage filtration system upgrade physical security design, access control, and HCIS SEC compliance." },
  { sNo: 29, client: "NMDC", name: "CRPOS 79,80,81,82 & 83 STAGE-03", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Active", location: "Offshore Fields", scope: "Offshore platform security systems design review, stage-03 compliance certification, and marine vessel monitoring." },
  { sNo: 31, client: "KBR", name: "SAFANIYAH AH RESIDUAL OFFSHORE WATER INJECTION STAGE-01 & STAGE-02", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Active", location: "Safaniyah Offshore Field", scope: "Water injection facility security engineering, access restriction, explosion-proof CCTV camera deployment." },
  { sNo: 34, client: "IDOM", name: "BAO STEEL", endUser: "NEOM / BAO STEEL", sector: "PETROCHEMICAL", category: "oil-gas", status: "Ongoing", location: "NEOM Industrial City", scope: "Green steel complex security master plan, industrial access management, and perimeter fence intrusion detection." },
  { sNo: 38, client: "KBR", name: "Zuluf Redevelopment Program - Safaniyah Plant", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Active", location: "Safaniyah Onshore Plant", scope: "Redevelopment program physical security engineering, HCIS security directives compliance & site verification." },
  { sNo: 39, client: "S-Chem", name: "S-CHEM PLANT STAGE-03", endUser: "S-CHEM", sector: "PETROCHEMICAL", category: "oil-gas", status: "Completed", location: "Jubail Industrial City", scope: "Stage-03 petrochem plant security upgrade, blast-resistant CCTV camera enclosures, and central monitoring station." },
  { sNo: 40, client: "KBR", name: "ABO GOSP2-WATER WELL", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Completed", location: "Abqaiq / GOSP-2", scope: "Water well perimeter physical security, automated gate barriers, and remote telemetry security monitoring." },
  { sNo: 48, client: "S-CHEM", name: "UPGRADE GATES-GAP ANALYSIS & STAGE-01", endUser: "S-CHEM", sector: "PETROCHEMICAL", category: "oil-gas", status: "Completed", location: "Jubail Industrial City", scope: "Security gate upgrade gap analysis, HCIS compliance assessment, and Stage-01 preliminary engineering." },
  { sNo: 68, client: "IDOM", name: "JOTUN FACTORY", endUser: "JOTUN", sector: "PETROCHEMICAL", category: "oil-gas", status: "Completed", location: "Jeddah Industrial City", scope: "Chemical factory security design, automated vehicle access barriers, hazard zone CCTV coverage, and alarm response." },
  { sNo: 71, client: "KBR", name: "INCREASE SHAYBAH GAS HANDLING-11 STAGE-1", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Active", location: "Shaybah, Rub' al Khali", scope: "Shaybah gas handling expansion physical security system design, HCIS Stage-1 review, and remote facility surveillance." },
  { sNo: 72, client: "KBR", name: "INCREASE SHAYBAH GAS HANDLING-11 STAGE-1 VARIATION ORDER", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Active", location: "Shaybah, Rub' al Khali", scope: "Variation order scope extension for perimeter security sensors and remote telecommunication integration." },
  { sNo: 74, client: "KBR", name: "UPGRADE NORTHERN AREA UPSTREAM TRUNKLINES & FLOWLINES-STAGE-1", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Active", location: "Northern Area Fields", scope: "Pipeline trunkline security design, block valve station protection, and Stage-1 HCIS compliance documentation." },
  { sNo: 75, client: "KBR", name: "UPGRADE NORTHERN AREA UPSTREAM TRUNKLINES & FLOWLINES-STAGE-2", endUser: "SAUDI ARAMCO", sector: "OIL & GAS", category: "oil-gas", status: "Active", location: "Northern Area Fields", scope: "Stage-2 detailed design engineering approval, fiber optic perimeter detection, and central control room integration." },

  // ── Water (21 projects) ──
  { sNo: 1, client: "NWC", name: "217 Sites", endUser: "NWC", sector: "WATER", category: "water", status: "Active", highlight: "Kingdom-Wide", location: "Across Saudi Arabia", scope: "Kingdom-wide physical security master assessment and CCTV surveillance deployment across 217 water facility sites." },
  { sNo: 2, client: "NWC", name: "Madina", endUser: "NWC", sector: "WATER", category: "water", status: "Active", location: "Madina Region", scope: "Regional water distribution network physical security design, control center integration, and access authorization systems." },
  { sNo: 3, client: "NWC", name: "Tabuk", endUser: "NWC", sector: "WATER", category: "water", status: "Active", location: "Tabuk Region", scope: "Tabuk sector water reservoirs and pumping station security engineering and perimeter defense." },
  { sNo: 4, client: "NWC", name: "Hail (5 Locations)", endUser: "NWC", sector: "WATER", category: "water", status: "Active", location: "Hail Region (5 Locations)", scope: "Physical security upgrade and access control integration across 5 strategic water facility sites in Hail." },
  { sNo: 5, client: "NWC", name: "Jouf (13 locations)", endUser: "NWC", sector: "WATER", category: "water", status: "Active", location: "Al Jouf Region (13 Locations)", scope: "Integrated security system implementation, intrusion alarms, and surveillance monitoring for 13 Jouf locations." },
  { sNo: 6, client: "NWC", name: "Eastern Region (28 locations)", endUser: "NWC", sector: "WATER", category: "water", status: "Active", location: "Eastern Region (28 Locations)", scope: "Comprehensive physical security master plan & CCTV infrastructure deployment across 28 Eastern Region water sites." },
  { sNo: 7, client: "NWC", name: "Southern Region (80 Locations)", endUser: "NWC", sector: "WATER", category: "water", status: "Active", highlight: "Massive Scope", location: "Southern Region (80 Locations)", scope: "Large-scale security engineering covering 80 key water assets, dams, and purification stations in the Southern Region." },
  { sNo: 8, client: "NWC", name: "Qassim (31 Locations)", endUser: "NWC", sector: "WATER", category: "water", status: "Active", location: "Al Qassim (31 Locations)", scope: "Security architecture, perimeter fencing review, and automated gate control for 31 water distribution centers." },
  { sNo: 9, client: "NWC", name: "Northern Borders (15 locations)", endUser: "NWC", sector: "WATER", category: "water", status: "Active", location: "Northern Borders (15 Locations)", scope: "Physical security assessment, central command integration, and video surveillance across 15 border region sites." },
  { sNo: 21, client: "NWC", name: "Madina Region - Stage-1 & Stage-2", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Madina Region", scope: "Stage-1 preliminary design & Stage-2 final engineering approval for Madina main water treatment plant." },
  { sNo: 22, client: "NWC", name: "Jeddah Region - Stage-1 & Stage-2", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Jeddah Metro", scope: "Metropolitan water security master design, automated access gates, and central monitoring station approval." },
  { sNo: 23, client: "Siemens", name: "Rabigh Power Plant - Stage-3", endUser: "RABIGH ELECTRICITY COMPANY", sector: "WATER", category: "water", status: "Completed", location: "Rabigh", scope: "Desalination and power water plant security infrastructure design and HCIS Class-1 security compliance." },
  { sNo: 41, client: "TAAQAT", name: "ECZA-Desalination Plant - STAGE-03", endUser: "ACWA POWER", sector: "WATER", category: "water", status: "Active", location: "Rabigh / ECZA", scope: "Economic City Desalination Plant Stage-03 security detailed design, perimeter fiber optics, and control room setup." },
  { sNo: 44, client: "TAAQAT", name: "ECZA-Desalination Plant -STAGE-04", endUser: "ACWA POWER", sector: "WATER", category: "water", status: "Active", location: "Rabigh / ECZA", scope: "Stage-04 validation and security installation supervision, final authority audit, and commissioning." },
  { sNo: 47, client: "METITO", name: "ROSHN SEDRA-STP STAGE-01", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Riyadh, Sedra", scope: "ROSHN Sedra Sewage Treatment Plant (STP) Stage-01 security design approval and surveillance integration." },
  { sNo: 55, client: "TAAQAT", name: "ECZA-Desalination Plant-STAGE-03-MOI SCOPE", endUser: "ACWA POWER", sector: "WATER", category: "water", status: "Active", location: "Rabigh / ECZA", scope: "Ministry of Interior (MOI) security directives alignment, Stage-03 compliance certification, and threat analysis." },
  { sNo: 63, client: "Al Agadir Hail", name: "SECURITY CONTROL CENTER", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Hail", scope: "Dedicated regional water Security Control Center (SCC) architectural & technology system engineering." },
  { sNo: 65, client: "NWC", name: "JOUF (3 locations)", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Al Jouf", scope: "Physical security enhancement and access verification for 3 primary water supply nodes in Jouf." },
  { sNo: 66, client: "NWC", name: "QASSSIM (3 locations)", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Al Qassim", scope: "Security upgrade and central camera telemetry integration across 3 key water storage tanks." },
  { sNo: 67, client: "NWC", name: "Northern Borders (3 locations)", endUser: "NWC", sector: "WATER", category: "water", status: "Completed", location: "Northern Borders", scope: "Border region water station security perimeter review, intrusion detection, and central control tie-in." },
  { sNo: 70, client: "CWC", name: "ARAR SEWAGE TREATMENT PLANT - Stage-1,2,3 & 4", endUser: "NWC", sector: "WATER", category: "water", status: "Active", highlight: "Full Lifecycle", location: "Arar", scope: "Comprehensive Stage 1-4 full lifecycle security engineering for Arar STP, including testing and final authority handover." },

  // ── Energy (8 projects) ──
  { sNo: 11, client: "AL GIHAZ", name: "NEOM-380kv Substation", endUser: "SAUDI ENERGY", sector: "ENERGY", category: "energy", status: "Active", highlight: "High Voltage", location: "NEOM Region", scope: "380kV extra high voltage substation physical security engineering, HCIS compliance, thermal perimeter imaging." },
  { sNo: 12, client: "AL GIHAZ", name: "Um Aljoud-380kv Substation", endUser: "SAUDI ENERGY", sector: "ENERGY", category: "energy", status: "Active", location: "Makkah Al Mukarramah", scope: "380kV major electrical substation security master design, anti-ram vehicle barriers, and biometric control." },
  { sNo: 13, client: "AL GIHAZ", name: "Arafat 5-110kv Substation", endUser: "SAUDI ENERGY", sector: "ENERGY", category: "energy", status: "Completed", location: "Arafat / Makkah", scope: "110kV substation physical security design, automated intrusion detection, and security authority certification." },
  { sNo: 24, client: "Doosan", name: "Rabigh Power Plant", endUser: "RABIGH ELECTRICITY COMPANY", sector: "ENERGY", category: "energy", status: "Completed", location: "Rabigh", scope: "Thermal power plant security infrastructure, coastal perimeter surveillance, and emergency response integration." },
  { sNo: 46, client: "TAAQAT", name: "HENAKIYAH SUB STATION - STAGE-03", endUser: "SAUDI ENERGY", sector: "ENERGY", category: "energy", status: "Active", location: "Henakiyah, Madina", scope: "Solar power interconnection substation Stage-03 detailed security engineering and testing." },
  { sNo: 69, client: "AL SHARIF GROUP", name: "REVIEW AND CERTIFY SECURITY CONTROL CENTER", endUser: "SAUDI ENERGY", sector: "ENERGY", category: "energy", status: "Completed", location: "Riyadh", scope: "Third-party audit, review, and authority certification of national electricity Security Control Center." },
  { sNo: 76, client: "MARAFIQ", name: "YANBU", endUser: "MARAFIQ", sector: "ENERGY", category: "energy", status: "Active", location: "Yanbu Industrial City", scope: "Industrial utility complex perimeter physical security, asset protection, and access management." },
  { sNo: 77, client: "MARAFIQ", name: "JUBAIL", endUser: "MARAFIQ", sector: "ENERGY", category: "energy", status: "Active", location: "Jubail Industrial City", scope: "Multi-facility utility security upgrade, central monitoring station design, and security directive compliance." },

  // ── Infra (5 projects) ──
  { sNo: 16, client: "RITZ CARLTON", name: "Upgradation of CCTV system", endUser: "RITZ CARLTON", sector: "HOSPITALITY", category: "infra", status: "Completed", highlight: "VIP Hospitality", location: "Riyadh", scope: "Full upgrade of high-definition CCTV camera system, AI facial recognition, and executive surveillance integration." },
  { sNo: 49, client: "RCRC", name: "UPGRADE SURVEILLANCE CAMERA", endUser: "ROYAL COMMISSION FOR RIYADH CITY", sector: "SMART CITY", category: "infra", status: "Active", highlight: "Royal Commission", location: "Riyadh Metro", scope: "Capital city smart surveillance upgrade, high-definition camera network expansion, and municipal control center link." },
  { sNo: 56, client: "IDOM", name: "DATA CENTER-RIYADH-CONCEPTUAL DESIGN", endUser: "Riyadh City / Telecommunications", sector: "SMART CITY", category: "infra", status: "Completed", location: "Riyadh", scope: "Tier-IV Data Center conceptual physical security design, threat risk assessment, and setback zone engineering." },
  { sNo: 57, client: "IDOM", name: "DATA CENTER - RIYADH - PRELIMINARY DESIGN", endUser: "Riyadh City / Telecommunications", sector: "SMART CITY", category: "infra", status: "Completed", location: "Riyadh", scope: "Preliminary security architecture design, biometric mantrap access control, and blast mitigation review." },
  { sNo: 58, client: "IDOM", name: "DATA CENTER-RIYADH-DETAIL DESIGN", endUser: "Riyadh City / Telecommunications", sector: "SMART CITY", category: "infra", status: "Active", highlight: "Tier-4 Security", location: "Riyadh", scope: "Final detailed engineering design, regulatory authority submission package, and command center specification." },

  // ── Finance (1 project) ──
  { sNo: 10, client: "SAMA", name: "CCTV coverage", endUser: "SAMA", sector: "FINANCE", category: "finance", status: "Active", highlight: "Central Bank", location: "Riyadh HQ", scope: "Saudi Central Bank (SAMA) high-security ultra-HD CCTV coverage engineering, cash vault monitoring, and access logging." },

  // ── Ports (4 projects) ──
  { sNo: 32, client: "CAPITAL ENGINEERING", name: "AMAZON JED4 STAGE-01 & 04", endUser: "MAWANI", sector: "PORTS", category: "ports", status: "Active", highlight: "Logistics Hub", location: "Jeddah Port Zone", scope: "Major logistics center Stage-01 concept & Stage-04 validation security engineering under MAWANI directives." },
  { sNo: 60, client: "Al Ibtekar", name: "AL IBTEKAR MARINE COMPANY-STAGE-01", endUser: "MAWANI", sector: "PORTS", category: "ports", status: "Completed", location: "Jeddah Commercial Port", scope: "Marine facility Stage-01 security risk assessment, perimeter fence design, and harbor access control." },
  { sNo: 61, client: "Western Coast", name: "SERVICE HARBOR & SLIPWAY JEDDAH AND JAZAN-STAGE-01", endUser: "MAWANI", sector: "PORTS", category: "ports", status: "Completed", location: "Jeddah & Jazan Ports", scope: "Dual port marine service harbor and slipway physical security master design for Stage-01 approval." },
  { sNo: 62, client: "Western Coast", name: "SERVICE HARBOR & SLIPWAY JEDDAH AND JAZAN-SITE VISIT", endUser: "MAWANI", sector: "PORTS", category: "ports", status: "Completed", location: "Jeddah & Jazan Ports", scope: "Comprehensive site audit, physical vulnerability assessment, and existing security system gap analysis." },

  // ── Defence (3 projects) ──
  { sNo: 18, client: "HLP", name: "Ammunition Factory", endUser: "GAMI", sector: "DEFENCE", category: "defence", status: "Active", highlight: "Classified Military", location: "KSA Defense Zone", scope: "High-security ammunition manufacturing plant physical security design, blast perimeter protection, and GAMI compliance." },
  { sNo: 36, client: "MKKN", name: "MKKN FOR STEEL FACTORY STAGE-01 & 02", endUser: "MKKN / Military Authority", sector: "DEFENCE", category: "defence", status: "Active", location: "Industrial Military Zone", scope: "Defense-grade industrial facility physical security design Stage-01 & Stage-02, perimeter defense, and visitor vetting." },
  { sNo: 73, client: "SAUDI CHEMICAL", name: "EXPLOSIVE MAGAZINE-STAGE-04", endUser: "SAUDI CHEMICAL", sector: "DEFENCE", category: "defence", status: "Active", highlight: "High Hazard", location: "Central Province", scope: "Explosive magazine storage facility Stage-04 final security validation, seismic barrier sensors, and MOI compliance." },

  // ── Giga Projects (11 projects) ──
  { sNo: 15, client: "Red Sea Alluminium", name: "The Aluminium Super Cluster", endUser: "RED SEA ALLUMINIUM (RSA)", sector: "PETROCHEMICAL / GIGA PROJECTS", category: "giga-projects", status: "Active", highlight: "Super Cluster", location: "Red Sea Economic Zone", scope: "Super cluster industrial physical security master plan, perimeter surveillance, and heavy vehicle screening gates." },
  { sNo: 25, client: "GEO", name: "Bio-Reactor-STAGE-01 & STAGE-02", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Active", highlight: "NEOM Mega", location: "NEOM, Tabuk", scope: "NEOM bio-reactor facility security engineering Stage-01 & Stage-02, environmental sensor link, and perimeter defense." },
  { sNo: 30, client: "NEOM", name: "TELCO PARK-STAGE-01,02.03 & 04", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Active", highlight: "Full Stage 1-4", location: "NEOM Telco Park", scope: "Complete Stage 1 through 4 security master planning, data privacy physical protection, and AI surveillance." },
  { sNo: 33, client: "IDOM", name: "CORAL NURSERY-STAGE-03", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Completed", location: "NEOM Coast", scope: "Marine coral nursery environmental security system, waterborne perimeter intrusion detection, and station security." },
  { sNo: 35, client: "WORLEY", name: "HIDC STAGE-01", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Completed", location: "NEOM Region", scope: "Hydrogen Innovation & Development Center Stage-01 security concept engineering and hazard zone mapping." },
  { sNo: 42, client: "BARQ", name: "OXAGON-COMMUNITY", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Active", highlight: "Oxagon City", location: "Oxagon, KSA", scope: "Oxagon floating city residential community physical security design, smart access gates, and video analytics." },
  { sNo: 43, client: "BARQ", name: "MAGNA EXPLOSIVES", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Active", location: "NEOM Magna", scope: "Magna development site explosives store physical security compliance, armed perimeter barriers, and access control." },
  { sNo: 45, client: "RED SEA INTERNATIONAL", name: "RESIDENTIAL CAMP-WEBUILD-STRA", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Active", location: "NEOM Trojena / Line", scope: "WeBuild workforce mega camp security system, automated turnstiles, CCTV coverage, and site perimeter fencing." },
  { sNo: 50, client: "HASSAN ALLAM", name: "CORAL NURSERY-STAGE-03 & STAGE-04", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Active", location: "NEOM Coast", scope: "Stage-03 & Stage-04 construction oversight, final system validation, and security authority signoff." },
  { sNo: 54, client: "ADVANCED ENERGY", name: "ADVANCED ENERGY - CONSTRUCTION FENCE", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Completed", location: "NEOM Energy Hub", scope: "High-security temporary and permanent construction perimeter fencing, automated access check points, and CCTV telemetry." },
  { sNo: 64, client: "IDOM", name: "FERRF AND SANITARY LANDFILL AT NEOM-Stage-01", endUser: "NEOM", sector: "GIGA PROJECTS", category: "giga-projects", status: "Completed", location: "NEOM Sector", scope: "Sanitary landfill and facility environmental physical security design Stage-01 risk assessment." },

  // ── Mining (5 projects) ──
  { sNo: 37, client: "WORLEY", name: "MAADEN PHOSPHATE STAGE-03 & 04", endUser: "MAADEN", sector: "MINING", category: "mining", status: "Active", highlight: "Ma'aden Mega", location: "Wa'ad Al Shamal", scope: "Stage-03 & Stage-04 detailed security design, heavy transport gate access control, and perimeter radar." },
  { sNo: 51, client: "WORLEY", name: "MAADEN PHOSPHATE STAGE-03 & 04", endUser: "MAADEN", sector: "MINING", category: "mining", status: "Active", location: "Ras Al Khair", scope: "Phosphate processing plant Stage 3/4 security compliance certification and central command deployment." },
  { sNo: 52, client: "WORLEY", name: "MAADEN PHOSPHATE STAGE-03 & 04", endUser: "MAADEN", sector: "MINING", category: "mining", status: "Active", location: "Wa'ad Al Shamal", scope: "Mining complex extension physical security validation, automated weighbridge integration, and surveillance." },
  { sNo: 53, client: "WORLEY", name: "MAADEN PHOSPHATE STAGE-03 & 04", endUser: "MAADEN", sector: "MINING", category: "mining", status: "Active", location: "Al Jalamid", scope: "Phosphate mine security directives implementation, remote perimeter monitoring, and crisis control center design." },
  { sNo: 59, client: "WORLEY", name: "MAADEN PHOSPHATE 3 PHASE 2 STAGE-01 & 02", endUser: "MAADEN", sector: "MINING", category: "mining", status: "Active", highlight: "Phase 2 Expansion", location: "Wa'ad Al Shamal / Ras Al Khair", scope: "Phosphate 3 Phase 2 expansion Stage-01 conceptual and Stage-02 preliminary security engineering." }
];

// ─── Status Badge Component ───────────────────────────────────────────────────
function StatusBadge({ status }: { status: ProjectItem["status"] }) {
  const config = {
    Active: { color: "#22C55E", bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.3)" },
    Completed: { color: "#38BDF8", bg: "rgba(56,189,248,0.15)", border: "rgba(56,189,248,0.3)" },
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

// ─── HD Project Card ──────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onSelect
}: {
  project: ProjectItem;
  index: number;
  onSelect: (p: ProjectItem) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3), ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect(project)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Outer Card Glass Container - Default Crisp White Theme */}
      <div
        className="relative rounded-2xl h-full flex flex-col justify-between border backdrop-blur-xl transition-all duration-500 overflow-hidden"
        style={{
          background: hovered
            ? "rgba(24, 28, 42, 0.9)"
            : "rgba(15, 18, 28, 0.8)",
          borderColor: hovered ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.12)",
          boxShadow: hovered
            ? "0 20px 40px -15px rgba(212, 175, 55, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)"
            : "0 10px 30px rgba(0, 0, 0, 0.4)",
          transform: hovered ? "translateY(-6px)" : "translateY(0px)",
        }}
      >
        {/* Top Accent Strip */}
        <div
          className="h-1 w-full transition-all duration-500"
          style={{
            background: hovered
              ? "linear-gradient(90deg, #D4AF37, #FFFFFF, #D4AF37)"
              : "linear-gradient(90deg, rgba(212, 175, 55, 0.5), rgba(255, 255, 255, 0.2))",
          }}
        />

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              {/* S.No Badge - Crisp White & Gold */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider uppercase border border-primary/40 bg-primary/10 text-primary shadow-inner">
                <Sparkles className="w-3 h-3" />
                S.No {project.sNo.toString().padStart(2, '0')}
              </div>

              <div className="flex items-center gap-2">
                {project.highlight && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                    {project.highlight}
                  </span>
                )}
                <StatusBadge status={project.status} />
              </div>
            </div>

            {/* Project Title - White Colour Normally */}
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-wide uppercase leading-snug mb-3 text-white">
              {project.name}
            </h3>

            {/* Client & End User Badges - Crisp White Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                <Building2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase text-white/50 font-semibold tracking-wider">Client</div>
                  <div className="text-xs font-bold text-white truncate">{project.client}</div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                <UserCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase text-white/50 font-semibold tracking-wider">End User</div>
                  <div className="text-xs font-bold text-white truncate">{project.endUser}</div>
                </div>
              </div>
            </div>

            {/* Scope Snippet - Crisp White */}
            <p className="text-xs text-white/80 line-clamp-2 leading-relaxed mb-4">
              {project.scope}
            </p>
          </div>

          {/* Footer Card Row */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-[11px] px-2.5 py-1 rounded-md bg-white/10 text-white border border-white/15">
              <Factory className="w-3 h-3 text-primary" />
              {project.sector}
            </span>

            <span className="inline-flex items-center gap-1 text-white font-sans font-bold group-hover:text-primary group-hover:translate-x-1 transition-all">
              Details <ChevronRight className="w-4 h-4 text-primary" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Modal Detail View ────────────────────────────────────────────────────────
function ProjectDetailModal({ project, onClose }: { project: ProjectItem | null; onClose: () => void }) {
  if (!project) return null;

  const currentSector = SECTORS.find((s) => s.id === project.category) || SECTORS[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
          className="relative w-full max-w-2xl bg-zinc-950/90 border border-white/15 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Banner Image */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img
              src={currentSector.bgImage}
              alt={currentSector.label}
              className="w-full h-full object-cover filter brightness-75 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Content on Image */}
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-primary/40 bg-primary/20 text-primary">
                  S.No {project.sNo.toString().padStart(2, '0')}
                </span>
                <StatusBadge status={project.status} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-wide">
                {project.name}
              </h2>
            </div>
          </div>

          {/* Body Info */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-mono uppercase text-white/50 font-bold mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" /> Client Contracting Party
                </div>
                <div className="text-lg font-bold text-white">{project.client}</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-mono uppercase text-white/50 font-bold mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Beneficiary / End User
                </div>
                <div className="text-lg font-bold text-white">{project.endUser}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/50 uppercase block mb-1">Sector</span>
                <span className="font-bold text-white tracking-wide">{project.sector}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/50 uppercase block mb-1">Category</span>
                <span className="font-bold text-white tracking-wide">{currentSector.label}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-white/50 uppercase block mb-1">Location</span>
                <span className="font-bold text-white tracking-wide">{project.location || "Saudi Arabia"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase font-bold text-primary tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Scope of Work & Security Engineering
              </h4>
              <p className="text-sm text-white/90 leading-relaxed bg-white/[0.03] p-4 rounded-2xl border border-white/10">
                {project.scope}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Projects Page Component ─────────────────────────────────────────────
function ProjectsPage() {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const activeSector = useMemo(
    () => SECTORS.find((s) => s.id === selectedSector) || SECTORS[0],
    [selectedSector]
  );

  // Extract unique clients for filter dropdown
  const uniqueClients = useMemo(() => {
    const clients = new Set<string>();
    PROJECTS.forEach((p) => clients.add(p.client));
    return ["all", ...Array.from(clients).sort()];
  }, []);

  // Filter projects dynamically
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      const matchesSector = selectedSector === "all" || project.category === selectedSector;
      const matchesClient = selectedClient === "all" || project.client === selectedClient;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.name.toLowerCase().includes(q) ||
        project.client.toLowerCase().includes(q) ||
        project.endUser.toLowerCase().includes(q) ||
        project.sector.toLowerCase().includes(q) ||
        project.sNo.toString().includes(q);

      return matchesSector && matchesClient && matchesSearch;
    });
  }, [selectedSector, selectedClient, searchQuery]);

  // Sector Counts Map
  const sectorCounts = useMemo(() => {
    const map: Record<string, number> = { all: PROJECTS.length };
    SECTORS.forEach((s) => {
      if (s.id !== "all") {
        map[s.id] = PROJECTS.filter((p) => p.category === s.id).length;
      }
    });
    return map;
  }, []);

  return (
    <>
      <SmoothScroll />
      <TopNav />

      <main className="min-h-screen text-foreground relative overflow-hidden bg-zinc-950">
        {/* Dynamic Sector Background Image with Smooth Fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSector.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <img
              src={activeSector.bgImage}
              alt={activeSector.label}
              className="w-full h-full object-cover filter brightness-[0.22] contrast-125 saturate-125"
            />
            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-950" />
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.12) 0%, transparent 70%)"
              }}
            />
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
              Master Project Portfolio — {PROJECTS.length} Key Delivered Projects
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.15]"
            >
              Security Engineering &{" "}
              <span
                className="italic text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #D4AF37 0%, #FFFFFF 100%)",
                  filter: "drop-shadow(0 4px 20px rgba(212,175,55,0.35))"
                }}
              >
                Project Execution
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed"
            >
              Explore our proven track record with clients such as <strong className="text-white">Saudi Aramco, NEOM, NWC, Siemens, KBR, MAWANI, SAMA, and Ma'aden</strong> across critical industrial sectors.
            </motion.p>
          </div>

          {/* ── Key Metrics Header Bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 p-4 rounded-3xl bg-zinc-900/70 border border-white/10 backdrop-blur-xl"
          >
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">{PROJECTS.length}</div>
              <div className="text-xs font-mono uppercase text-white/50 tracking-wider font-semibold">Total Delivered Projects</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-primary mb-1">9</div>
              <div className="text-xs font-mono uppercase text-white/50 tracking-wider font-semibold">Industrial Sectors</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-sky-400 mb-1">20+</div>
              <div className="text-xs font-mono uppercase text-white/50 tracking-wider font-semibold">Global Tier-1 Clients</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-emerald-400 mb-1">100%</div>
              <div className="text-xs font-mono uppercase text-white/50 tracking-wider font-semibold">HCIS & Security Approval</div>
            </div>
          </motion.div>

          {/* ── Sector Tabs Navigation ── */}
          <div className="mb-10">
            <div className="text-xs font-mono uppercase font-bold text-white/50 mb-4 tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Filter by Industry Sector
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none scroll-smooth">
              {SECTORS.map((sector) => {
                const isActive = selectedSector === sector.id;
                const count = sectorCounts[sector.id] || 0;

                return (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector.id)}
                    className="relative flex items-center gap-2.5 px-4 py-3 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 border whitespace-nowrap flex-shrink-0"
                    style={{
                      background: isActive ? "rgba(212, 175, 55, 0.2)" : "rgba(255, 255, 255, 0.04)",
                      borderColor: isActive ? "#D4AF37" : "rgba(255, 255, 255, 0.1)",
                      color: "#FFFFFF",
                      boxShadow: isActive ? "0 10px 25px -5px rgba(212, 175, 55, 0.3)" : "none"
                    }}
                  >
                    <span className={isActive ? "text-primary" : "text-white/70"}>
                      {sector.icon}
                    </span>
                    <span>{sector.label}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        background: isActive ? "#D4AF37" : "rgba(255,255,255,0.15)",
                        color: isActive ? "#000000" : "#FFFFFF"
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Search & Filter Controls Bar ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 p-4 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl">
            {/* Text Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search by S.No, project name, client (Linde, KBR, NWC...), or end user (Saudi Aramco, NEOM...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs font-mono focus:outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Client Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full pl-11 pr-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono uppercase focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="all" className="bg-zinc-900 text-white">All Contracting Clients ({uniqueClients.length - 1})</option>
                {uniqueClients.filter(c => c !== "all").map((client) => (
                  <option key={client} value={client} className="bg-zinc-900 text-white">
                    Client: {client}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Results Info Bar ── */}
          <div className="flex items-center justify-between mb-8 text-xs font-mono text-white/60">
            <div>
              Showing <span className="font-bold text-white">{filteredProjects.length}</span> of{" "}
              <span className="font-bold text-white">{PROJECTS.length}</span> projects
              {selectedSector !== "all" && (
                <span> in <span className="text-primary font-bold">{activeSector.label}</span></span>
              )}
            </div>

            {(searchQuery || selectedClient !== "all" || selectedSector !== "all") && (
              <button
                onClick={() => {
                  setSelectedSector("all");
                  setSelectedClient("all");
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
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredProjects.map((project, idx) => (
                  <ProjectCard
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
            <div className="text-center py-24 p-8 rounded-3xl bg-white/[0.02] border border-white/10 max-w-lg mx-auto">
              <Search className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Projects Match Your Search</h3>
              <p className="text-xs text-white/60 mb-6">
                Try searching with different terms or reset your sector and client filters.
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
      <ProjectDetailModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </>
  );
}
