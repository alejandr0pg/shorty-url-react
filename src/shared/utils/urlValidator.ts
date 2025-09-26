import { UrlValidationResult } from '../types';

/**
 * URL Validator according to RFC 1738
 * https://www.rfc-editor.org/rfc/rfc1738.txt
 */

// RFC 1738 compliant patterns
const SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z0-9+.-]*$/;

/**
 * Validates if a character needs encoding according to RFC 1738
 */
const needsEncoding = (char: string): boolean => {
  // Safe characters don't need encoding
  if (/[a-zA-Z0-9]/.test(char)) return false;

  // Special safe characters
  if ('$-_.+!*\'(),'.includes(char)) return false;

  // Reserved characters that have special meaning
  if (';/?:@&='.includes(char)) return false;

  // Everything else needs encoding
  return true;
};

/**
 * Validates URL scheme according to RFC 1738
 */
const validateScheme = (scheme: string): boolean => {
  if (!scheme) return false;

  // Scheme must start with letter and contain only letters, digits, +, -, or .
  return SCHEME_PATTERN.test(scheme);
};

/**
 * Validates host according to RFC 1738
 */
const validateHost = (host: string): boolean => {
  if (!host) return false;

  // IPv4 address pattern
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Pattern.test(host)) {
    const parts = host.split('.');
    return parts.every((part: string) => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }

  // Domain name validation
  const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z]{2,}$/;
  return domainPattern.test(host);
};

/**
 * Validates port according to RFC 1738
 */
const validatePort = (port: string): boolean => {
  if (!port) return true; // Port is optional

  const portNum = parseInt(port, 10);
  return !isNaN(portNum) && portNum > 0 && portNum <= 65535;
};

/**
 * Validates path according to RFC 1738
 */
const validatePath = (path: string): boolean => {
  if (!path) return true; // Path is optional

  // Check for invalid characters in path
  // Path can contain unreserved characters and some reserved characters
  const invalidChars = ['<', '>', '"', ' ', '{', '}', '|', '\\', '^', '`'];

  return !invalidChars.some(char => path.includes(char));
};

/**
 * Main URL validation function according to RFC 1738
 */
export const validateUrl = (url: string): UrlValidationResult => {
  const errors = [];

  if (!url) {
    errors.push('URL is required');
    return { valid: false, errors };
  }

  // Basic URL structure
  const urlPattern = /^([a-zA-Z][a-zA-Z0-9+.-]*):\/\/([^:/\s]+)(:\d+)?(\/[^#\s]*)?$/;
  const match = url.match(urlPattern);

  if (!match) {
    errors.push('Invalid URL format. URL must follow the pattern: scheme://host[:port][/path]');
    return { valid: false, errors };
  }

  const [, scheme, host, port, path] = match;

  // Validate scheme
  if (!validateScheme(scheme)) {
    errors.push(`Invalid scheme: ${scheme}. Scheme must start with a letter and contain only letters, digits, +, -, or .`);
  }

  // Common schemes check
  const commonSchemes = ['http', 'https', 'ftp', 'ftps'];
  if (!commonSchemes.includes(scheme.toLowerCase())) {
    errors.push(`Uncommon scheme: ${scheme}. Common schemes are: ${commonSchemes.join(', ')}`);
  }

  // Validate host
  if (!validateHost(host)) {
    errors.push(`Invalid host: ${host}. Host must be a valid domain name or IP address`);
  }

  // Validate port if present
  if (port && !validatePort(port.substring(1))) {
    errors.push(`Invalid port: ${port.substring(1)}. Port must be a number between 1 and 65535`);
  }

  // Validate path if present
  if (path && !validatePath(path)) {
    errors.push(`Invalid path: ${path}. Path contains invalid characters`);
  }

  // Check URL length (RFC doesn't specify, but practical limit)
  if (url.length > 2048) {
    errors.push('URL is too long. Maximum length is 2048 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
    parts: errors.length === 0 ? {
      scheme,
      host,
      port: port?.substring(1),
      path
    } : undefined
  };
};

/**
 * Encodes a character according to RFC 1738 percent-encoding
 */
const encodeChar = (char: string): string => {
  return '%' + char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
};

/**
 * Sanitizes URL to be RFC 1738 compliant with proper percent-encoding
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';

  // Remove leading/trailing whitespace
  url = url.trim();

  // Ensure scheme is present
  if (!url.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//)) {
    url = 'https://' + url;
  }

  // Parse URL components
  const urlPattern = /^([a-zA-Z][a-zA-Z0-9+.-]*):\/\/([^:/\s]+)(:\d+)?(\/.*)?$/;
  const match = url.match(urlPattern);

  if (!match) {
    // If URL doesn't match pattern, do basic sanitization
    return url.split('').map(char => needsEncoding(char) ? encodeChar(char) : char).join('');
  }

  const [, scheme, host, port, path] = match;

  // Sanitize each component according to RFC 1738
  const sanitizedScheme = scheme.toLowerCase(); // Schemes are case-insensitive
  const sanitizedHost = host.toLowerCase(); // Domain names are case-insensitive
  const sanitizedPort = port || '';

  // Sanitize path with proper encoding
  let sanitizedPath = '';
  if (path) {
    // Split path into segments to preserve '/' characters
    const segments = path.split('/');
    sanitizedPath = segments.map(segment => {
      return segment.split('').map(char => {
        // Don't encode forward slashes in path
        if (char === '/') return char;
        // Don't encode reserved characters that are valid in paths
        if ('!*\'();:@&=+$,/?#[]'.includes(char)) return char;
        // Encode characters that need encoding
        return needsEncoding(char) ? encodeChar(char) : char;
      }).join('');
    }).join('/');
  }

  return `${sanitizedScheme}://${sanitizedHost}${sanitizedPort}${sanitizedPath}`;
};

/**
 * Checks if URL needs sanitization
 */
export const needsSanitization = (url: string): boolean => {
  return url !== sanitizeUrl(url);
};

/**
 * Decodes percent-encoded characters in a URL
 */
export const decodeUrl = (url: string): string => {
  try {
    return decodeURIComponent(url);
  } catch (error) {
    // If decoding fails, return original URL
    console.warn('Failed to decode URL:', error);
    return url;
  }
};

/**
 * Normalizes URL according to RFC 1738 standards
 */
export const normalizeUrl = (url: string): string => {
  if (!url) return '';

  // First sanitize
  let normalized = sanitizeUrl(url);

  // Parse normalized URL
  const urlObj = new URL(normalized);

  // Normalize scheme and host to lowercase
  urlObj.protocol = urlObj.protocol.toLowerCase();
  urlObj.hostname = urlObj.hostname.toLowerCase();

  // Remove default ports
  if ((urlObj.protocol === 'http:' && urlObj.port === '80') ||
      (urlObj.protocol === 'https:' && urlObj.port === '443') ||
      (urlObj.protocol === 'ftp:' && urlObj.port === '21')) {
    urlObj.port = '';
  }

  // Remove empty query string
  if (urlObj.search === '?') {
    urlObj.search = '';
  }

  // Remove empty fragment
  if (urlObj.hash === '#') {
    urlObj.hash = '';
  }

  // Normalize path - remove consecutive slashes
  if (urlObj.pathname) {
    urlObj.pathname = urlObj.pathname.replace(/\/+/g, '/');

    // Remove trailing slash for non-root paths
    if (urlObj.pathname.length > 1 && urlObj.pathname.endsWith('/')) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
  }

  return urlObj.toString();
};

/**
 * Validates and sanitizes URL with detailed feedback
 */
export const processUrl = (url: string): {
  original: string;
  sanitized: string;
  normalized: string;
  validation: UrlValidationResult;
  needsSanitization: boolean;
} => {
  const original = url;
  const sanitized = sanitizeUrl(url);
  const normalized = normalizeUrl(sanitized);
  const validation = validateUrl(normalized);
  const needsSanitizationFlag = needsSanitization(original);

  return {
    original,
    sanitized,
    normalized,
    validation,
    needsSanitization: needsSanitizationFlag
  };
};

/**
 * Extracts and validates URL components
 */
export const parseUrl = (url: string): {
  scheme: string;
  host: string;
  port?: string;
  path?: string;
  query?: string;
  fragment?: string;
  isValid: boolean;
} | null => {
  try {
    const urlObj = new URL(url);
    return {
      scheme: urlObj.protocol.slice(0, -1), // Remove trailing ':'
      host: urlObj.hostname,
      port: urlObj.port || undefined,
      path: urlObj.pathname || undefined,
      query: urlObj.search.slice(1) || undefined, // Remove leading '?'
      fragment: urlObj.hash.slice(1) || undefined, // Remove leading '#'
      isValid: true
    };
  } catch (error) {
    return null;
  }
};

export default {
  validateUrl,
  sanitizeUrl,
  normalizeUrl,
  decodeUrl,
  processUrl,
  parseUrl,
  needsSanitization,
  validateScheme,
  validateHost,
  validatePort,
  validatePath,
  needsEncoding
};