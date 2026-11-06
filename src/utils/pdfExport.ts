import { jsPDF } from 'jspdf';
import { FundingRound, RoundSimulationResult } from '../types/capTable';

export interface TermSheetAuditItem {
  clause: string;
  category: 'Economics' | 'Control' | 'Process' | string;
  severity: 'danger' | 'warning' | 'clean' | string;
  issue: string;
  remedy: string;
  marketStandard: string;
}

export interface TermSheetExportOptions {
  presetName: string;
  findings: TermSheetAuditItem[];
  companyName?: string;
  analystName?: string;
  language?: string;
}

export interface CapTableExportOptions {
  rounds: FundingRound[];
  currentResult: RoundSimulationResult;
  simulationResults: RoundSimulationResult[];
  companyName?: string;
  scenarioNotes?: string;
  language?: string;
}

// Color palette definitions (RGB tuples for jsPDF)
const COLORS = {
  navyDark: [15, 23, 42] as [number, number, number], // #0F172A
  navySlate: [30, 41, 59] as [number, number, number], // #1E293B
  goldAccent: [217, 119, 6] as [number, number, number], // #D97706
  goldLight: [245, 158, 11] as [number, number, number], // #F59E0B
  roseRed: [225, 29, 72] as [number, number, number], // #E11D48
  roseLight: [255, 241, 242] as [number, number, number], // #FFF1F2
  amberOrange: [217, 119, 6] as [number, number, number], // #D97706
  amberLight: [254, 243, 199] as [number, number, number], // #FEF3C7
  emeraldGreen: [16, 185, 129] as [number, number, number], // #10B981
  emeraldLight: [236, 253, 245] as [number, number, number], // #ECFDF5
  slateGray: [100, 116, 139] as [number, number, number], // #64748B
  lightBg: [248, 250, 252] as [number, number, number], // #F8FAFC
  borderGray: [226, 232, 240] as [number, number, number], // #E2E8F0
  textPrimary: [15, 23, 42] as [number, number, number],
  textMuted: [100, 116, 139] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_X = 14;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2; // 182mm
const MAX_Y = 272;

/**
 * Helper to ensure string is safely printable in standard Latin-1 jsPDF Helvetica font
 */
function sanitizeText(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2026]/g, '...')
    .replace(/[^\x00-\xFF]/g, ''); // strip unsupported multi-byte glyphs for clean ASCII output
}

/**
 * Format currency with compact M / K suffix
 */
function formatCurrency(val: number): string {
  if (val >= 1000000) {
    return `$${(val / 1000000).toFixed(2)}M`;
  }
  if (val >= 1000) {
    return `$${(val / 1000).toFixed(0)}K`;
  }
  return `$${val.toLocaleString()}`;
}

/**
 * Format number with commas
 */
function formatNumber(val: number): string {
  return Math.round(val).toLocaleString();
}

/**
 * Draws executive header banner
 */
function drawDocumentHeader(
  doc: jsPDF,
  title: string,
  subtitle: string,
  categoryBadge: string,
  dateStr: string
): number {
  // Top deep navy bar
  doc.setFillColor(...COLORS.navyDark);
  doc.rect(0, 0, PAGE_WIDTH, 26, 'F');

  // Gold accent rule
  doc.setFillColor(...COLORS.goldAccent);
  doc.rect(0, 26, PAGE_WIDTH, 1.8, 'F');

  // Top tracker brand
  doc.setTextColor(...COLORS.goldLight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('VENTURE MIND ACADEMY | EXECUTIVE DUE DILIGENCE & GOVERNANCE INTELLIGENCE', MARGIN_X, 8);

  // Main title
  doc.setTextColor(...COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(title.toUpperCase(), MARGIN_X, 16);

  // Subtitle
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(subtitle, MARGIN_X, 22);

  // Right-side badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.goldAccent);
  doc.text(categoryBadge.toUpperCase(), PAGE_WIDTH - MARGIN_X, 11, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(`AUDIT DATE: ${dateStr}`, PAGE_WIDTH - MARGIN_X, 17, { align: 'right' });
  doc.text('CLASSIFICATION: HIGH PRIVILEGE / IC READY', PAGE_WIDTH - MARGIN_X, 22, { align: 'right' });

  return 34; // Next currentY
}

/**
 * Stamp running footers on all pages
 */
function applyFooters(doc: jsPDF) {
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Subtle divider
    doc.setDrawColor(...COLORS.borderGray);
    doc.setLineWidth(0.3);
    doc.line(MARGIN_X, PAGE_HEIGHT - 12, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 12);

    // Left info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(
      'Venture Mind Executive Suite | Strictly Confidential | Educational Valuation & Legal Research',
      MARGIN_X,
      PAGE_HEIGHT - 7.5
    );

    // Right page number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.navyDark);
    doc.text(`PAGE ${i} OF ${totalPages}`, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 7.5, { align: 'right' });
  }
}

/**
 * Handle page overflow check with mini running header on new page
 */
function checkPageBreak(doc: jsPDF, currentY: number, neededHeight: number, reportTitle: string): number {
  if (currentY + neededHeight > MAX_Y) {
    doc.addPage();

    // Mini running header on subsequent pages
    doc.setFillColor(...COLORS.navyDark);
    doc.rect(0, 0, PAGE_WIDTH, 12, 'F');
    doc.setFillColor(...COLORS.goldAccent);
    doc.rect(0, 12, PAGE_WIDTH, 1, 'F');

    doc.setTextColor(...COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`VENTURE MIND ACADEMY - ${reportTitle.toUpperCase()} (CONT.)`, MARGIN_X, 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(203, 213, 225);
    doc.text('CONFIDENTIAL EXECUTIVE BRIEFING', PAGE_WIDTH - MARGIN_X, 8, { align: 'right' });

    return 20;
  }
  return currentY;
}

// ============================================================================
// 1. TERM SHEET AUDIT PDF EXPORT
// ============================================================================

export function exportTermSheetAuditPDF(options: TermSheetExportOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isAggressive =
    options.presetName.toLowerCase().includes('predator') ||
    options.presetName.toLowerCase().includes('aggressive') ||
    options.findings.some((f) => f.severity === 'danger');

  let currentY = drawDocumentHeader(
    doc,
    'Term Sheet Legal & Governance Audit',
    'NVCA Model Standards Benchmark & Toxic Clause Detection Report',
    isAggressive ? 'HIGH RISK EXPOSURE' : 'NVCA STANDARD',
    dateFormatted
  );

  // Executive Metadata Summary Card
  const dangerCount = options.findings.filter((f) => f.severity === 'danger').length;
  const warningCount = options.findings.filter((f) => f.severity === 'warning').length;
  const cleanCount = options.findings.filter((f) => f.severity === 'clean').length;

  doc.setFillColor(...COLORS.lightBg);
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN_X, currentY, CONTENT_WIDTH, 22, 2.5, 2.5, 'FD');

  // Left column summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.navyDark);
  doc.text('EXECUTIVE RISK PROFILE:', MARGIN_X + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textMuted);
  const targetLabel = isAggressive
    ? 'Aggressive Down-Market / Shark Investor Terms'
    : 'NVCA Gold Standard Clean Series A';
  doc.text(`Profile: ${targetLabel}`, MARGIN_X + 4, currentY + 11);
  doc.text(`Scope: ${options.findings.length} key economic, control, and process clauses audited`, MARGIN_X + 4, currentY + 16);

  // Right badges
  const badgeX = PAGE_WIDTH - MARGIN_X - 70;
  
  // Danger badge
  doc.setFillColor(254, 226, 226); // red-100
  doc.setDrawColor(...COLORS.roseRed);
  doc.roundedRect(badgeX, currentY + 4, 20, 14, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.roseRed);
  doc.text(`${dangerCount}`, badgeX + 10, currentY + 11, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text('CRITICAL', badgeX + 10, currentY + 15, { align: 'center' });

  // Warning badge
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(...COLORS.amberOrange);
  doc.roundedRect(badgeX + 24, currentY + 4, 20, 14, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.amberOrange);
  doc.text(`${warningCount}`, badgeX + 34, currentY + 11, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text('CAUTION', badgeX + 34, currentY + 15, { align: 'center' });

  // Clean badge
  doc.setFillColor(209, 250, 229); // emerald-100
  doc.setDrawColor(...COLORS.emeraldGreen);
  doc.roundedRect(badgeX + 48, currentY + 4, 20, 14, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.emeraldGreen);
  doc.text(`${cleanCount}`, badgeX + 58, currentY + 11, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text('STANDARD', badgeX + 58, currentY + 15, { align: 'center' });

  currentY += 28;

  // Section Header: Detailed Audit Findings
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.navyDark);
  doc.text('1. ITEMIZED CLAUSE AUDIT & REDLINE STRATEGY', MARGIN_X, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Ranked by governance impact and equity waterfall priority', MARGIN_X + 85, currentY);

  doc.setDrawColor(...COLORS.goldAccent);
  doc.setLineWidth(0.8);
  doc.line(MARGIN_X, currentY + 2, MARGIN_X + 22, currentY + 2);

  currentY += 6;

  // Iterate findings
  options.findings.forEach((item, index) => {
    // Determine badge colors
    let sevColor = COLORS.emeraldGreen;
    let sevBg = COLORS.emeraldLight;
    let sevLabel = 'MARKET STANDARD';
    if (item.severity === 'danger') {
      sevColor = COLORS.roseRed;
      sevBg = COLORS.roseLight;
      sevLabel = 'CRITICAL RISK';
    } else if (item.severity === 'warning') {
      sevColor = COLORS.amberOrange;
      sevBg = COLORS.amberLight;
      sevLabel = 'CAUTION REQUIRED';
    }

    // Measure text heights
    const clauseLines = doc.splitTextToSize(`"${sanitizeText(item.clause)}"`, CONTENT_WIDTH - 8);
    const issueLines = doc.splitTextToSize(sanitizeText(item.issue), (CONTENT_WIDTH - 12) / 2);
    const remedyLines = doc.splitTextToSize(sanitizeText(item.remedy), (CONTENT_WIDTH - 12) / 2);

    const maxSubHeight = Math.max(issueLines.length * 3.4, remedyLines.length * 3.4) + 12;
    const clauseBoxHeight = clauseLines.length * 3.6 + 6;
    const cardHeight = 12 + clauseBoxHeight + maxSubHeight + 10;

    // Check page break
    currentY = checkPageBreak(doc, currentY, cardHeight, 'Term Sheet Legal Audit');

    // Card background
    doc.setFillColor(...COLORS.white);
    doc.setDrawColor(...COLORS.borderGray);
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGIN_X, currentY, CONTENT_WIDTH, cardHeight, 2, 2, 'FD');

    // Severity indicator strip on left
    doc.setFillColor(...sevColor);
    doc.roundedRect(MARGIN_X, currentY, 2.5, cardHeight, 1, 1, 'F');

    // Top Header line of card
    const headerY = currentY + 6;

    // Severity pill
    doc.setFillColor(...sevBg);
    doc.setDrawColor(...sevColor);
    doc.setLineWidth(0.2);
    doc.roundedRect(MARGIN_X + 6, headerY - 3.5, 26, 5, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...sevColor);
    doc.text(sevLabel, MARGIN_X + 19, headerY, { align: 'center' });

    // Category
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.navySlate);
    doc.text(`[${item.category.toUpperCase()}] CLAUSE #${index + 1}`, MARGIN_X + 35, headerY);

    // NVCA Standard reference on right
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.textMuted);
    const mktStd = sanitizeText(item.marketStandard);
    doc.text(mktStd, PAGE_WIDTH - MARGIN_X - 4, headerY, { align: 'right' });

    // Clause Quote Box
    const clauseBoxY = currentY + 10;
    doc.setFillColor(...COLORS.lightBg);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(MARGIN_X + 6, clauseBoxY, CONTENT_WIDTH - 10, clauseBoxHeight, 1.5, 1.5, 'FD');

    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.navyDark);
    doc.text(clauseLines, MARGIN_X + 9, clauseBoxY + 4.5);

    // Two Column Breakdown: Risk to Founders vs Recommended Counter Remedy
    const subColY = clauseBoxY + clauseBoxHeight + 5;
    const colWidth = (CONTENT_WIDTH - 16) / 2;
    const col2X = MARGIN_X + 8 + colWidth + 4;

    // Col 1: Vulnerability / Issue
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.roseRed);
    doc.text('FOUNDER & COMMON RISK:', MARGIN_X + 8, subColY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.textPrimary);
    doc.text(issueLines, MARGIN_X + 8, subColY + 4.5);

    // Col 2: Recommended Remedy & Redline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.emeraldGreen);
    doc.text('TACTICAL COUNTER & REDLINE:', col2X, subColY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.textPrimary);
    doc.text(remedyLines, col2X, subColY + 4.5);

    currentY += cardHeight + 4;
  });

  // Section 2: Founder Negotiation Protocol & Sign-off Box
  currentY = checkPageBreak(doc, currentY, 48, 'Term Sheet Legal Audit');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.navyDark);
  doc.text('2. STRATEGIC NEGOTIATION PLAYBOOK & LEGAL SAFEGUARDS', MARGIN_X, currentY);

  doc.setDrawColor(...COLORS.goldAccent);
  doc.setLineWidth(0.8);
  doc.line(MARGIN_X, currentY + 2, MARGIN_X + 22, currentY + 2);

  currentY += 7;

  // Box for recommendations
  doc.setFillColor(...COLORS.lightBg);
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN_X, currentY, CONTENT_WIDTH, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.navyDark);
  doc.text('CORE NON-NEGOTIABLE PRINCIPLES:', MARGIN_X + 4, currentY + 6);

  const tips = [
    '• Liquidation Preference: Always insist on 1.0x Non-Participating Preferred. Decline double-dip participation.',
    '• Anti-Dilution: Accept only Broad-Based Weighted Average. Full Ratchet is catastrophic in macroeconomic downturns.',
    '• Board Balance: Avoid investor voting majorities at Series A; establish an independent tie-breaker (2-2-1 model).',
    '• Exclusivity Windows: Cap no-shop clauses at 30-45 calendar days with mandatory weekly written diligence progress.',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.textPrimary);
  tips.forEach((tip, idx) => {
    doc.text(tip, MARGIN_X + 6, currentY + 11 + idx * 4.2);
  });

  // Disclaimer line
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(
    'Notice: This automated report is generated for strategic simulation and educational review. Retain accredited startup legal counsel before signing binding definitive agreements.',
    MARGIN_X + 4,
    currentY + 32
  );

  applyFooters(doc);

  // Trigger download
  const cleanPresetName = options.presetName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Term_Sheet_Audit_${cleanPresetName}_${Date.now()}.pdf`);
}

// ============================================================================
// 2. CAP TABLE DILUTION REPORT PDF EXPORT
// ============================================================================

export function exportCapTableReportPDF(options: CapTableExportOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const { currentResult, rounds, simulationResults } = options;

  let currentY = drawDocumentHeader(
    doc,
    'Executive Cap Table & Dilution Report',
    'Multi-Stage Equity Waterfall, Option Pool Shuffle & Ownership Trajectory',
    `ACTIVE: ${sanitizeText(currentResult.roundName).slice(0, 24)}`,
    dateFormatted
  );

  // Top Metric Cards (4 Columns)
  const cardW = (CONTENT_WIDTH - 9) / 4;
  const cardH = 17;

  const kpis = [
    { label: 'PRE-MONEY VAL', val: formatCurrency(currentResult.effectivePreMoney) },
    { label: 'ROUND CAPITAL', val: formatCurrency(currentResult.newCapital) },
    { label: 'POST-MONEY VAL', val: formatCurrency(currentResult.postMoneyValuation) },
    {
      label: 'SHARE PRICE / POOL',
      val: `$${currentResult.effectiveSharePrice.toFixed(3)} (${currentResult.optionPoolPercent || 0}%)`,
    },
  ];

  kpis.forEach((kpi, idx) => {
    const cardX = MARGIN_X + idx * (cardW + 3);
    doc.setFillColor(...COLORS.lightBg);
    doc.setDrawColor(...COLORS.borderGray);
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, currentY, cardW, cardH, 2, 2, 'FD');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(kpi.label, cardX + 3, currentY + 5);

    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.navyDark);
    doc.text(kpi.val, cardX + 3, currentY + 12);
  });

  currentY += cardH + 7;

  // Section 1: Detailed Stakeholder Ownership Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.navyDark);
  doc.text(`1. OWNERSHIP BREAKDOWN: ${sanitizeText(currentResult.roundName).toUpperCase()}`, MARGIN_X, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(
    `Total Fully Diluted Shares: ${formatNumber(currentResult.totalShares)}`,
    PAGE_WIDTH - MARGIN_X,
    currentY,
    { align: 'right' }
  );

  doc.setDrawColor(...COLORS.goldAccent);
  doc.setLineWidth(0.8);
  doc.line(MARGIN_X, currentY + 2, MARGIN_X + 22, currentY + 2);

  currentY += 6;

  // Table Header
  const colX = {
    stakeholder: MARGIN_X + 4,
    category: MARGIN_X + 54,
    shares: MARGIN_X + 90,
    equity: MARGIN_X + 118,
    value: MARGIN_X + 144,
    dilution: MARGIN_X + 172,
  };

  doc.setFillColor(...COLORS.navyDark);
  doc.roundedRect(MARGIN_X, currentY, CONTENT_WIDTH, 7, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.white);
  doc.text('STAKEHOLDER / ENTITY', colX.stakeholder, currentY + 4.8);
  doc.text('CLASS / GROUP', colX.category, currentY + 4.8);
  doc.text('SHARES OWNED', colX.shares, currentY + 4.8, { align: 'right' });
  doc.text('EQUITY %', colX.equity, currentY + 4.8, { align: 'right' });
  doc.text('VALUE ($)', colX.value, currentY + 4.8, { align: 'right' });
  doc.text('ROUND DILUTION', colX.dilution, currentY + 4.8, { align: 'right' });

  currentY += 8;

  // Render Table Rows
  currentResult.stakeholders.forEach((s, idx) => {
    currentY = checkPageBreak(doc, currentY, 8, 'Cap Table Report');

    const isZebra = idx % 2 === 1;
    if (isZebra) {
      doc.setFillColor(248, 250, 252);
      doc.rect(MARGIN_X, currentY - 1, CONTENT_WIDTH, 6.8, 'F');
    }

    // Border line bottom
    doc.setDrawColor(...COLORS.borderGray);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_X, currentY + 5.8, PAGE_WIDTH - MARGIN_X, currentY + 5.8);

    // Stakeholder color dot
    doc.setFillColor(...COLORS.goldAccent);
    doc.circle(MARGIN_X + 2, currentY + 2.5, 0.8, 'F');

    // Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.navyDark);
    const cleanName = sanitizeText(s.name).slice(0, 28);
    doc.text(cleanName, colX.stakeholder, currentY + 3.2);

    // Category
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(s.category.toUpperCase().replace('_', ' '), colX.category, currentY + 3.2);

    // Shares
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.textPrimary);
    doc.text(formatNumber(s.shares), colX.shares, currentY + 3.2, { align: 'right' });

    // Equity %
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.navyDark);
    doc.text(`${s.ownershipPercent.toFixed(2)}%`, colX.equity, currentY + 3.2, { align: 'right' });

    // Value ($)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.textPrimary);
    doc.text(formatCurrency(s.currentValue), colX.value, currentY + 3.2, { align: 'right' });

    // Dilution
    const dilution = s.dilutionFromLastRound;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    if (dilution < 0) {
      doc.setTextColor(...COLORS.roseRed);
      doc.text(`${dilution.toFixed(2)}%`, colX.dilution, currentY + 3.2, { align: 'right' });
    } else if (dilution > 0) {
      doc.setTextColor(...COLORS.emeraldGreen);
      doc.text(`+${dilution.toFixed(2)}%`, colX.dilution, currentY + 3.2, { align: 'right' });
    } else {
      doc.setTextColor(...COLORS.textMuted);
      doc.text('-', colX.dilution, currentY + 3.2, { align: 'right' });
    }

    currentY += 6.8;
  });

  // Totals Row
  doc.setFillColor(241, 245, 249);
  doc.rect(MARGIN_X, currentY - 1, CONTENT_WIDTH, 7, 'F');
  doc.setDrawColor(...COLORS.navyDark);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_X, currentY + 6, PAGE_WIDTH - MARGIN_X, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.navyDark);
  doc.text('TOTAL FULLY DILUTED CAPITALIZATION', colX.stakeholder, currentY + 3.5);
  doc.text(formatNumber(currentResult.totalShares), colX.shares, currentY + 3.5, { align: 'right' });
  doc.text('100.00%', colX.equity, currentY + 3.5, { align: 'right' });
  doc.text(formatCurrency(currentResult.postMoneyValuation), colX.value, currentY + 3.5, { align: 'right' });
  doc.text('PRO-RATA', colX.dilution, currentY + 3.5, { align: 'right' });

  currentY += 12;

  // Section 2: Multi-Round Evolution Timeline Table
  currentY = checkPageBreak(doc, currentY, 45, 'Cap Table Report');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.navyDark);
  doc.text('2. MULTI-ROUND CAPITALIZATION TRAJECTORY', MARGIN_X, currentY);

  doc.setDrawColor(...COLORS.goldAccent);
  doc.setLineWidth(0.8);
  doc.line(MARGIN_X, currentY + 2, MARGIN_X + 22, currentY + 2);

  currentY += 6;

  // Round summary timeline table
  doc.setFillColor(...COLORS.navyDark);
  doc.roundedRect(MARGIN_X, currentY, CONTENT_WIDTH, 6.5, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.white);
  doc.text('ROUND NAME & DATE', MARGIN_X + 4, currentY + 4.5);
  doc.text('TYPE', MARGIN_X + 65, currentY + 4.5);
  doc.text('RAISED', MARGIN_X + 96, currentY + 4.5, { align: 'right' });
  doc.text('POST-VAL', MARGIN_X + 124, currentY + 4.5, { align: 'right' });
  doc.text('TOTAL SHARES', MARGIN_X + 154, currentY + 4.5, { align: 'right' });
  doc.text('FOUNDER %', MARGIN_X + 178, currentY + 4.5, { align: 'right' });

  currentY += 7.5;

  simulationResults.forEach((roundRes, rIdx) => {
    currentY = checkPageBreak(doc, currentY, 7, 'Cap Table Report');

    const isCurrent = roundRes.roundId === currentResult.roundId;
    if (isCurrent) {
      doc.setFillColor(254, 243, 199); // amber highlight
      doc.rect(MARGIN_X, currentY - 1, CONTENT_WIDTH, 6.5, 'F');
    } else if (rIdx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(MARGIN_X, currentY - 1, CONTENT_WIDTH, 6.5, 'F');
    }

    doc.setDrawColor(...COLORS.borderGray);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_X, currentY + 5.5, PAGE_WIDTH - MARGIN_X, currentY + 5.5);

    // Round title
    doc.setFont('helvetica', isCurrent ? 'bold' : 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.navyDark);
    const roundTitle = sanitizeText(roundRes.roundName).slice(0, 36);
    doc.text(roundTitle, MARGIN_X + 4, currentY + 3.2);

    // Round Type
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(roundRes.roundType.toUpperCase().replace('_', ' '), MARGIN_X + 65, currentY + 3.2);

    // Raised
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.textPrimary);
    doc.text(formatCurrency(roundRes.newCapital), MARGIN_X + 96, currentY + 3.2, { align: 'right' });

    // Post-val
    doc.text(formatCurrency(roundRes.postMoneyValuation), MARGIN_X + 124, currentY + 3.2, { align: 'right' });

    // Shares
    doc.text(formatNumber(roundRes.totalShares), MARGIN_X + 154, currentY + 3.2, { align: 'right' });

    // Founder %
    const founder = roundRes.stakeholders.find((s) => s.category === 'founders');
    const founderPct = founder ? `${founder.ownershipPercent.toFixed(1)}%` : '0%';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(isCurrent ? COLORS.amberOrange[0] : COLORS.navyDark[0], isCurrent ? COLORS.amberOrange[1] : COLORS.navyDark[1], isCurrent ? COLORS.amberOrange[2] : COLORS.navyDark[2]);
    doc.text(founderPct, MARGIN_X + 178, currentY + 3.2, { align: 'right' });

    currentY += 6.5;
  });

  currentY += 6;

  // Section 3: Strategic Executive Dilution Commentary Box
  currentY = checkPageBreak(doc, currentY, 36, 'Cap Table Report');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.navyDark);
  doc.text('3. STRATEGIC DILUTION & GOVERNANCE OBSERVATIONS', MARGIN_X, currentY);

  doc.setDrawColor(...COLORS.goldAccent);
  doc.setLineWidth(0.8);
  doc.line(MARGIN_X, currentY + 2, MARGIN_X + 22, currentY + 2);

  currentY += 6;

  doc.setFillColor(...COLORS.lightBg);
  doc.setDrawColor(...COLORS.borderGray);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN_X, currentY, CONTENT_WIDTH, 30, 2, 2, 'FD');

  const founderStakeholder = currentResult.stakeholders.find((s) => s.category === 'founders');
  const founderEquity = founderStakeholder ? founderStakeholder.ownershipPercent : 0;

  const notes = [
    `• Founder Control Status: Founders retain ${founderEquity.toFixed(1)}% fully diluted equity post-${sanitizeText(currentResult.roundName).slice(0, 20)}.`,
    '• Option Pool Shuffle: Pre-money ESOP expansions place 100% of the dilution burden exclusively on prior common shareholders.',
    '• SAFE Conversion Overhang: Monitor cumulative post-money SAFE caps to prevent massive sudden dilution upon priced Series A conversion.',
    '• Pro-Rata Rights: Future non-dilutive maintenance requires capital reserves or super-pro-rata allocation agreements.',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.textPrimary);
  notes.forEach((note, idx) => {
    doc.text(note, MARGIN_X + 4, currentY + 5.5 + idx * 5.2);
  });

  // Footer stamp
  applyFooters(doc);

  // Trigger download
  const cleanRoundName = currentResult.roundName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 24);
  doc.save(`Cap_Table_Report_${cleanRoundName}_${Date.now()}.pdf`);
}
