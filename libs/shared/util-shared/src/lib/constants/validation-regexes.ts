export const ALBANIAN_NID_REGEXP = `^[A-Za-z][0-9]{8}[A-Za-z]$`;
export const STRONG_PASSWORD_REGEXP = `^(?!.* )(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$`;
export const BARCODE_REGEX = new RegExp(`^\\d{5}[dz][123z]$`, 'i');
