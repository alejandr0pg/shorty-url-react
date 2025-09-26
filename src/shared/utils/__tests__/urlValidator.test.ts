import { validateUrl, sanitizeUrl, normalizeUrl } from '../urlValidator';

describe('URL Validator', () => {
  describe('validateUrl', () => {
    test('should validate valid URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://example.com',
        'https://sub.example.com/path',
        'http://localhost:3000',
        'https://192.168.1.1'
      ];

      validUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    test('should reject invalid URLs', () => {
      const invalidUrls = [
        '',
        'not-a-url',
        'http://',
        'javascript:alert(1)'
      ];

      invalidUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    test('should validate URL length', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(2100);
      const result = validateUrl(longUrl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('URL is too long. Maximum length is 2048 characters');
    });

    test('should validate schemes', () => {
      const result1 = validateUrl('https://example.com');
      expect(result1.valid).toBe(true);

      const result2 = validateUrl('ftp://example.com');
      expect(result2.valid).toBe(true); // FTP is valid but marked as uncommon
      expect(result2.errors).toContain('Uncommon scheme: ftp. Common schemes are: http, https, ftp, ftps');
    });
  });

  describe('sanitizeUrl', () => {
    test('should add https to URLs without protocol', () => {
      expect(sanitizeUrl('example.com')).toBe('https://example.com');
      expect(sanitizeUrl('www.example.com')).toBe('https://www.example.com');
    });

    test('should preserve existing protocols', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
    });

    test('should handle empty input', () => {
      expect(sanitizeUrl('')).toBe('');
      expect(sanitizeUrl('   ')).toBe('https://');
    });

    test('should trim whitespace', () => {
      expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com');
    });
  });

  describe('normalizeUrl', () => {
    test('should convert to lowercase', () => {
      expect(normalizeUrl('HTTPS://EXAMPLE.COM')).toBe('https://example.com/');
    });

    test('should remove default ports', () => {
      expect(normalizeUrl('https://example.com:443')).toBe('https://example.com/');
      expect(normalizeUrl('http://example.com:80')).toBe('http://example.com/');
    });

    test('should preserve non-default ports', () => {
      expect(normalizeUrl('https://example.com:8080')).toBe('https://example.com:8080/');
    });

    test('should normalize paths', () => {
      expect(normalizeUrl('https://example.com/path/')).toBe('https://example.com/path/');
      expect(normalizeUrl('https://example.com//double//slashes')).toBe('https://example.com//double//slashes');
    });

    test('should preserve root path', () => {
      expect(normalizeUrl('https://example.com/')).toBe('https://example.com/');
    });
  });
});