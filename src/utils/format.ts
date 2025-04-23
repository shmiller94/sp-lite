import { OperationOutcomeError, validationError } from '@/utils/errors';

/**
 * Formats a FHIR Observation resource value as a string.
 * @param obs A FHIR Observation resource.
 * @param includeUnit whether or no the unit soul dbe included defaults to true
 * @returns A human-readable string representation of the Observation.
 */
export function formatObservationValue(
  obs: any | undefined,
  includeUnit = true,
): string {
  if (!obs) {
    return '';
  }

  if (obs?.valueQuantity) {
    return formatQuantity(obs.valueQuantity, undefined, includeUnit);
  }

  // if (obs.valueCodeableConcept) {
  //   return formatCodeableConcept(obs.valueCodeableConcept);
  // }

  // if (obs.valueString) {
  //   return obs.valueString;
  // }

  return '';
}

/**
 * formats the value status ( High, Normal, Low ) based on the provided range
 * @param obs A FHIR observation resource
 * @param range A FHIR range resource
 * @returns A string High, Normal or Low
 */
export function formatObservationRangeStatus(
  obs: any | undefined,
  ranges: any[],
): string {
  if (!ranges || ranges.length === 0) return 'n/a';

  const optimalRange = ranges.find(
    (qualifiedInterval: any) => qualifiedInterval.status === 'Optimal',
  )?.range;
  const normalRange = ranges.find(
    (qualifiedInterval: any) => qualifiedInterval.status === 'Normal',
  )?.range;
  const criticalRange = ranges.find(
    (qualifiedInterval: any) => qualifiedInterval.category === 'CRITICAL',
  )?.range;

  const val = obs?.valueQuantity?.value;

  //TODO handle comparator on ranges to determine inclusive or excusive
  if (val !== 0 && !val) {
    return '';
  }

  const criticalLow = criticalRange?.low?.value;
  const criticalHigh = criticalRange?.high?.value;

  if (
    !(criticalLow && val < criticalLow) &&
    !(criticalHigh && val > criticalHigh) &&
    criticalHigh
  ) {
    return 'Critical';
  }

  // if (optimalRange) {
  const optimalLow = optimalRange?.low?.value;
  const optimalHigh = optimalRange?.high?.value;

  if (
    !(optimalLow && val < optimalLow) &&
    !(optimalHigh && val > optimalHigh) &&
    optimalHigh
  ) {
    return 'Optimal';
  }

  const normalLow = normalRange?.low?.value;
  const normalHigh = normalRange?.high?.value;

  if (
    !(normalLow && val < normalLow) &&
    !(normalHigh && val > normalHigh) &&
    normalLow
  ) {
    return 'Normal';
  }

  const absoluteLow =
    optimalLow || normalLow
      ? Math.min(optimalLow || Infinity, normalLow || Infinity)
      : -Infinity;
  const absoluteHigh =
    optimalHigh || normalHigh
      ? Math.max(optimalHigh || -Infinity, normalHigh || -Infinity)
      : Infinity;

  if (val < absoluteLow) {
    return 'Low';
  } else if (val > absoluteHigh) {
    return 'High';
  }

  return 'n/a';
}

/**
 * Formats a FHIR Observation resource value as a string.
 * @param obs A FHIR Observation resource.
 * @returns A human-readable string representation of the Observation.
 */
export function formatObservationUnit(obs: any | undefined): string {
  if (!obs) {
    return '';
  }

  if (obs?.valueQuantity) {
    return formatUnit(obs.valueQuantity);
  }

  return '';
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

/**
 * Formats a FHIR Address as a string.
 * @param address The address to format.
 * @param options Optional address format options.
 * @returns The formatted address string.
 */
export function formatAddress(address: any, options?: any): string {
  // TODO
  const builder = [];

  if (address?.line) {
    builder.push(...address.line);
  }

  if (address?.city || address?.state || address?.postalCode) {
    const cityStateZip = [];
    if (address?.city) {
      cityStateZip.push(address.city);
    }
    if (address?.state) {
      cityStateZip.push(address.state);
    }
    if (address?.postalCode) {
      cityStateZip.push(address.postalCode);
    }
    builder.push(cityStateZip.join(', '));
  }

  if (address?.use && (options?.all || options?.use)) {
    builder.push('[' + address.use + ']');
  }

  return builder.join(options?.lineSeparator || ', ').trim();
}

/**
 * Formats a dateTime string as a human readable string.
 * Handles missing values and invalid dates.
 * @param dateTime The dateTime to format.
 * @param locales Optional locales.
 * @param options Optional dateTime format options.
 * @returns The formatted dateTime string.
 */
export function formatDateTime(
  dateTime: string | undefined,
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions | undefined,
): string {
  if (!dateTime) {
    return '';
  }
  const d = new Date(dateTime);
  if (!isValidDate(d)) {
    return '';
  }
  return d.toLocaleString(locales, options);
}

/**
 * Returns true if the given date object is a valid date.
 * Dates can be invalid if created by parsing an invalid string.
 * @param date A date object.
 * @returns Returns true if the date is a valid date.
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Returns a human-readable string for a FHIR Range datatype, taking into account one-sided ranges
 * @param range A FHIR Range element
 * @param precision Number of decimal places to display in the rendered quantity values
 * @param exclusive If true, one-sided ranges will be rendered with the '>' or '<' bounds rather than '>=' or '<='
 * @returns A human-readable string representation of the Range
 */
export function formatRange(
  range: any | undefined,
  precision?: number,
  exclusive = false,
): string {
  if (exclusive && precision === undefined) {
    throw new Error('Precision must be specified for exclusive ranges');
  }

  // Extract high and low range endpoints, explicitly ignoring any comparator
  // since Range uses SimpleQuantity variants (see http://www.hl7.org/fhir/datatypes.html#Range)
  const low = range?.low && { ...range.low, comparator: undefined };
  const high = range?.high && { ...range.high, comparator: undefined };
  if (low?.value === undefined && high?.value === undefined) {
    return '';
  }

  if (low?.value !== undefined && high?.value === undefined) {
    // Lower bound only
    if (exclusive && precision !== undefined) {
      low.value = preciseDecrement(low.value, precision);
      return `> ${formatQuantity(low, precision)}`;
    }
    return `>= ${formatQuantity(low, precision)}`;
  } else if (low?.value === undefined && high?.value !== undefined) {
    // Upper bound only
    if (exclusive && precision !== undefined) {
      high.value = preciseIncrement(high.value, precision);
      return `< ${formatQuantity(high, precision)}`;
    }
    return `<= ${formatQuantity(high, precision)}`;
  } else {
    // Double-sided range
    if (low?.unit === high?.unit) {
      delete low?.unit; // Format like "X - Y units" instead of "X units - Y units"
    }
    return `${formatQuantity(low, precision)} - ${formatQuantity(high, precision)}`;
  }
}

function formatComparator(comparator: string): string {
  if (comparator === 'EQUALS') {
    return '';
  } else if (comparator === 'LESS_THAN') {
    return '<';
  } else if (comparator === 'LESS_THAN_EQUALS') {
    return '<=';
  } else if (comparator === 'GREATER_THAN') {
    return '>';
  } else if (comparator === 'GREATER_THAN_EQUALS') {
    return '>=';
  }

  return comparator;
}

/**
 * Returns a human-readable string for a FHIR Quantity datatype, taking into account units and comparators
 * @param quantity
 * @param precision Number of decimal places to display in the rendered quantity values
 * @param unit included if the unit should be included or not
 * @returns A human-readable string representation of the Quantity
 */
export function formatQuantity(
  quantity: any | undefined,
  precision?: number,
  includeUnit = true,
): string {
  // TODO
  if (!quantity) {
    return '';
  }

  const result = [];

  if (quantity.comparator) {
    result.push(formatComparator(quantity.comparator));
    result.push(' ');
  }

  if (quantity.value !== undefined) {
    if (precision !== undefined) {
      result.push(quantity.value.toFixed(precision));
    } else {
      result.push(quantity.value);
    }
  }

  if (quantity.unit && includeUnit) {
    if (quantity.unit !== '%' && result[result.length - 1] !== ' ') {
      result.push(' ');
    }
    result.push(quantity.unit);
  }

  return result.join('').trim();
}

/**
 * Formats a CodeableConcept element as a string.
 * @param codeableConcept A FHIR CodeableConcept element
 * @returns The codeable concept as a string.
 */
export function formatCodeableConcept(
  codeableConcept: any | undefined,
): string {
  // TODO
  if (!codeableConcept) {
    return '';
  }

  if (codeableConcept.text) {
    return codeableConcept.text;
  }

  if (codeableConcept.coding) {
    return codeableConcept.coding.map((c: any) => formatCoding(c)).join(', '); // TODO
  }
  return '';
}

/**
 * Formats the unit of a Quantity or ObservationDefintion element as a string.
 * @param quantity A FHIR Quantity element
 * @returns The unit as a string.
 */
export function formatUnit(quantity: any): string {
  return quantity.unit || '';
}

/**
 * Formats a Coding element as a string.
 * @param coding A FHIR Coding element
 * @returns The coding as a string.
 */
export function formatCoding(coding: any | undefined): string {
  // TODO
  return coding?.display || coding?.code || '';
}

/**
 * Returns the input number increased by the `n` units of the specified precision
 * @param a The input number
 * @param precision The precision in number of digits.
 * @param n (default 1) The number of units to add
 */
function preciseIncrement(a: number, precision: number, n = 1): number {
  return (toPreciseInteger(a, precision) + n) * Math.pow(10, -precision);
}

/**
 * Returns the input number decreased by the `n` units of the specified precision
 * @param a The input number
 * @param precision The precision in number of digits.
 * @param n (default 1) The number of units to subtract
 */
function preciseDecrement(a: number, precision: number, n = 1): number {
  return (toPreciseInteger(a, precision) - n) * Math.pow(10, -precision);
}

/**
 * Returns an integer representation of the number with the given precision.
 * For example, if precision is 2, then 1.2345 will be returned as 123.
 * @param a The number.
 * @param precision Optional precision in number of digits.
 * @returns The integer with the given precision.
 */
function toPreciseInteger(a: number, precision?: number): number {
  if (precision === undefined) {
    return a;
  }
  return Math.round(a * Math.pow(10, precision));
}

/**
 * Enum representing the format to use for a phone number.
 * For the examples outlined the 10 digit phone number is 1234567890
 */
export enum PhoneFormat {
  /**
   * Phone number as 10 digit string
   *
   * Example:
   * '1234567890'
   */
  TEN_DIGIT,
  /**
   * Phone number as 10 digit string with leading + code
   *
   * Example:
   * '+11234567890'
   */
  COUNTRTY_PLUS,
  /**
   * Phone number in pretty format with leading +1 code
   *
   * Example:
   * '+1 (123) 456-7890'
   */
  PRETTY_PLUS,
  /**
   * Phone number in pretty format
   *
   * Example:
   * '(123) 456-7890'
   */
  PRETTY,
}

function prettyAreaCode(code: string): string {
  return code.length > 0 ? `(${code}` : code;
}

function prettyPrefix(prefix: string): string {
  return prefix.length > 0 ? `) ${prefix}` : prefix;
}

function prettyLine(line: string): string {
  return line.length > 0 ? `-${line}` : line;
}

/**
 * Formats a phone number to the specified format if no format is specified uses +11234567890.
 * @param {string} phoneNumber - The phone number to format.
 * @param {PhoneFormat} format (optional) - The format to use for the phone number. default is COUNTRTY_PLUS
 * @param {boolean} validate (optional) - whether to check if the input is a 10 or 11 digit number defaults to true should only be false when formating incomplete input (ex. as user types number)
 * @returns {string} The formatted phone number.
 */
export function formatPhoneNumber(
  phoneNumber: string | undefined,
  format: PhoneFormat = PhoneFormat.COUNTRTY_PLUS,
  validate = true,
): string {
  if (!phoneNumber) {
    return '';
  }

  // get in the format with optionsal + and digits only
  const countryPlusDigits = phoneNumber.replace(/[^+\d]/g, '');

  // get Country Code if it exists
  const countryCodeMatch = countryPlusDigits.match(/^\+(.*)\d{10}$/);

  // country code
  let countryCode = '';

  if (countryCodeMatch) {
    //get captruning group for country code
    countryCode = countryCodeMatch[1];
  }

  // Remove any non-digit characters from the input string
  let digitsOnly = phoneNumber.replace(/\D/g, '');

  // trim anything beyond 11 charagters
  if (digitsOnly.length > 10 + countryCode.length) {
    digitsOnly = digitsOnly.slice(countryCode.length, 10 + countryCode.length);
  }

  // Validate the phone number
  if (validate && !isValidPhoneNumberDigits(digitsOnly)) {
    throw new OperationOutcomeError(
      validationError('Could not format phone number'),
    );
  }

  const adjustment = countryCode.length;

  // Split the digits into their respective groups
  const areaCode = digitsOnly.slice(adjustment, 3 + adjustment);
  const prefix = digitsOnly.slice(3 + adjustment, 6 + adjustment);
  const lineNumber = digitsOnly.slice(6 + adjustment, 10 + adjustment);

  const DEFAULT_COUNTRY_CODE = 1;

  // Combine the groups into the desired format
  switch (format) {
    case PhoneFormat.TEN_DIGIT:
      return `${areaCode}${prefix}${lineNumber}`;
    case PhoneFormat.COUNTRTY_PLUS:
      return `+${countryCodeMatch ? countryCode : DEFAULT_COUNTRY_CODE}${areaCode}${prefix}${lineNumber}`;
    case PhoneFormat.PRETTY_PLUS:
      return `+${countryCodeMatch ? countryCode : DEFAULT_COUNTRY_CODE} ${prettyAreaCode(areaCode)}${prettyPrefix(
        prefix,
      )}${prettyLine(lineNumber)}`;
    case PhoneFormat.PRETTY:
      return `${prettyAreaCode(areaCode)}${prettyPrefix(prefix)}${prettyLine(lineNumber)}`;
    default:
      throw Error(
        `PhoneFormat ${format} is either not implemented or not valid.`,
      );
  }
}

// Helper function to validate the phone number
export function isValidPhoneNumberDigits(phoneNumber: string): boolean {
  //accepts any 10 or 11 for international -digit phone number
  const phoneNumberRegex = /^\d{10,11}$/;
  return phoneNumberRegex.test(phoneNumber);
}

/**
 * Normalizes a string input by converting it to PascalCase, changing special characters to spaces, and removing excess whitespace.
 * @param str The string to normalize.
 * @returns The normalized version of the input string.
 */
export function normalizeStringInput(str: string): string {
  // Convert string to all lowercase
  let normalizedStr = str.toLowerCase();

  // Replace special characters with spaces
  normalizedStr = normalizedStr.replace(/[^a-zA-Z0-9 ]/g, ' ');

  // Make the first letter of each word Uppercase
  normalizedStr = normalizedStr.replace(/\b[a-z]/g, (match) =>
    match.toUpperCase(),
  );

  // Remove excess whitespace and leading whitespace
  normalizedStr = normalizedStr.replace(/\s+/g, ' ').replace(/\s+/g, '');

  // Return the normalized string
  return normalizedStr;
}

/**
 * Validates whether a string is not all digits, special characters, whitespace, or a combination thereof.
 * @param str The string to validate.
 * @returns A boolean indicating whether the string is valid or not.
 */
export function isValidStringEntry(str: string): boolean {
  // Regular expression pattern to match all digits, special characters, whitespace or a combination thereof.
  const regex = /^[0-9\W_\s]+$/;

  // Check if the input string matches the regex pattern.
  const matchesRegex = regex.test(str);

  // If the string does not match the regex pattern and is not empty, it is a valid string entry.
  return !matchesRegex && str !== '';
}

/**
 * Returns a number representing years since a date
 * @param date the date to calculate time from
 * @returns a number of years since the input date
 */
export function yearsSinceDate(date: string): number {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
  return diff / millisecondsPerYear;
}
