/**
 * FINAL PRODUCTION PARSER (READY)
 */

// ─── Helpers ─────────────────────────────────────────

function parseIndianNumber(raw: string): number | null {
  if (!raw) return null;

  const s = raw.trim();
  const inParens = /^\([\d,. ]+\)$/.test(s);

  const cleaned = s
    .replace(/[₹$€£]/g, "")
    .replace(/\bRs\.?\b/gi, "")
    .replace(/\bINR\b/gi, "")
    .replace(/\s/g, "")
    .replace(/[()]/g, "")
    .replace(/,/g, "");

  const val = parseFloat(cleaned);
  if (isNaN(val)) return null;

  return inParens ? -Math.abs(val) : val;
}

function extractNumbers(text: string): number[] {
  const pattern = /\([\d,]+(?:\.\d+)?\)|[\d,]+(?:\.\d+)?/g;
  const results: number[] = [];

  let m: RegExpExecArray | null;

  while ((m = pattern.exec(text)) !== null) {
    const v = parseIndianNumber(m[0]);
    if (v !== null) results.push(v);
  }

  return results;
}

function makeLineFinder(lines: string[]) {
  return function findValue(
    keywords: string[],
    preferLast = false
  ): number | undefined {
    const values: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      if (!keywords.some(k => line.includes(k))) continue;

      const nums = extractNumbers(lines[i]);

      if (nums.length > 0) values.push(nums[0]);
    }

    if (values.length === 0) return undefined;
    return preferLast ? values.at(-1) : values[0];
  };
}

// ─── Balance Sheet ───────────────────────────────────

export function extractBalanceSheet(text: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const fv = makeLineFinder(lines);

  return {
    currentAssets: fv(["current assets"], true),
    currentLiabilities: fv(["current liabilities"], true),
    inventory: fv(["inventory", "stock"]),
    debtors: fv(["debtors", "receivables"]),
    creditors: fv(["creditors", "payables"]),
    cash: fv(["cash", "bank"]),
  };
}

// ─── Profit & Loss ───────────────────────────────────

export function extractProfitLoss(text: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const fv = makeLineFinder(lines);

  return {
    sales: fv(["sales", "revenue"], true),
    cogs: fv(["cogs", "cost of goods"], true),
    purchases: fv(["purchases"]),
    expenses: fv(["expenses"], true),
    netProfit: fv(["net profit", "profit after tax"], true),
  };
}

// ─── Banking ─────────────────────────────────────────

export function extractBanking(text: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const fv = makeLineFinder(lines);

  return {
    totalCredits: fv(["total credit"]),
    totalDebits: fv(["total debit"]),
    averageBalance: fv(["average balance"]),
    minimumBalance: fv(["minimum balance"]),
    openingBalance: fv(["opening balance"]),
    closingBalance: fv(["closing balance"]),
  };
}

// ─── GSTR ────────────────────────────────────────────

export function extractGstr(text: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const fv = makeLineFinder(lines);

  const gstinMatch = text.match(/\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]\b/);

  return {
    gstin: gstinMatch?.[0], // ✅ fixed
    totalTaxableTurnover: fv(["taxable turnover"], true),
    totalOutputTax: fv(["output tax"], true),
  };
}

// ─── ITR ─────────────────────────────────────────────

export function extractItr(text: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const fv = makeLineFinder(lines);

  const panMatch = text.match(/[A-Z]{5}[0-9]{4}[A-Z]/);

  return {
    panNumber: panMatch?.[0],
    grossTotalIncome: fv(["gross total income"], true),
    taxableIncome: fv(["taxable income"], true),
    taxPayable: fv(["tax payable"], true),
  };
}

// ─── MAIN ────────────────────────────────────────────

export function parseFinancialDocument(
  text: string,
  docType: "balance_sheet" | "profit_loss" | "banking" | "gstr" | "itr"
) {
  switch (docType) {
    case "balance_sheet":
      return extractBalanceSheet(text);

    case "profit_loss":
      return extractProfitLoss(text);

    case "banking":
      return extractBanking(text);

    case "gstr":
      return extractGstr(text);

    case "itr":
      return extractItr(text);
  }
}
