/**
 * Default admin-editable message template.
 * {name} and {score} are substituted per student at send time.
 */
export const DEFAULT_TEMPLATE =
  'היי {name}, מה קורה? רציתי לעדכן אותך שהניקוד שלך בטבלה התעדכן! כרגע יש לך {score} נקודות. להמשך השקעה בנבחרת: [כאן תכניס קישור לאתר אם תרצה]'

/**
 * Build a whatsapp:// deep-link that opens the WhatsApp desktop/mobile app directly,
 * without triggering a browser tab or the wa.me confirmation page.
 *
 * Format: whatsapp://send?phone=972XXXXXXXXX&text=<encoded>
 *
 * @param {string} rawPhone  - phone as stored in sheet (e.g. "0521234567" or "521234567")
 * @param {string} name      - student real name  (replaces {name} in template)
 * @param {number} score     - student total score (replaces {score} in template)
 * @param {string} [template] - optional custom template; falls back to DEFAULT_TEMPLATE
 */
export function buildWAUrl(rawPhone, name, score, template) {
  // Strip spaces, dashes, parentheses, leading +
  const digits = rawPhone.replace(/[\s\-\(\)\+]/g, '')
  // Drop the leading 0 → international format without country code prefix
  const waNumber = digits.startsWith('0') ? digits.substring(1) : digits

  const msg = (template || DEFAULT_TEMPLATE)
    .replace(/\{name\}/g,  name ?? '')
    .replace(/\{score\}/g, (score ?? 0).toLocaleString())

  return `whatsapp://send?phone=972${waNumber}&text=${encodeURIComponent(msg)}`
}
