/**
 * Sanitization types
 */
export enum SanitizeTypes {
  BLACKLIST = 'blacklist',
  ESCAPE = 'escape',
  LTRIM = 'ltrim',
  NORMALIZE_EMAIL = 'normalizeEmail',
  RTRIM = 'rtrim',
  STRIP_LOW = 'stripLow',
  TO_BOOLEAN = 'toBoolean',
  TO_DATE = 'toDate',
  TO_FLOAT = 'toFloat',
  TO_INT = 'toInt',
  TO_STRING = 'toString',
  TRIM = 'trim',
  WHITELIST = 'whitelist',
  TO_LOWER_CASE = 'toLowerCase',
  TO_UPPER_CASE = 'toUpperCase',
  CUSTOM_SANITIZATION = 'customSanitization',
  NESTED = 'nestedSanitization',
}

// tslint:disable-next-line:no-namespace
export namespace SanitizeTypes {
  export function isValid(type: SanitizeTypes | string) {
    return Object.values(SanitizeTypes).some((value) => value === type);
  }
}
