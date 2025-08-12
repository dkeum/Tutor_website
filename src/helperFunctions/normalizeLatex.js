export default function normalizeLatex(str) {
  if (!str) return "";

  let normalized = str.trim();

  // Remove all regular spaces
  normalized = normalized.replace(/\s+/g, "");

  // Remove LaTeX spacing commands like \ , \quad, \! etc.
  normalized = normalized.replace(/\\(,|;|:|quad|qquad|!)/g, "");

  // Replace \mathrm{...} with just its contents
  normalized = normalized.replace(/\\mathrm\{([^}]+)\}/g, "$1");

  // Replace Unicode superscripts (², ³, etc.) with ^2, ^3
  const superscriptMap = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3',
    '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7',
    '⁸': '8', '⁹': '9'
  };
  normalized = normalized.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, m => "^" + superscriptMap[m]);

  // Lowercase for unit matching (e.g., CM → cm)
  normalized = normalized.toLowerCase();

  return normalized;
}

// // Example usage:
// const a = "75\\ cm^2";
// const b = "75cm^2";
// console.log(normalizeLatex(a) === normalizeLatex(b)); // true
