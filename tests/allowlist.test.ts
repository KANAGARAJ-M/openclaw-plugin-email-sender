import { SecurityManager } from '../src/security/allowlist';

describe('SecurityManager', () => {
  it('should allow valid recipient when no restriction rules set', () => {
    const manager = new SecurityManager({});
    const res = manager.validateSendRequest({
      to: 'john@example.com',
      subject: 'Test',
      text: 'Hello',
    });

    expect(res.valid).toBe(true);
  });

  it('should block recipient if in blockedRecipients list', () => {
    const manager = new SecurityManager({
      blockedRecipients: ['spam@malicious.com'],
    });

    const res = manager.validateSendRequest({
      to: 'spam@malicious.com',
      subject: 'Test',
      text: 'Hello',
    });

    expect(res.valid).toBe(false);
    expect(res.reason).toContain('blocked by security policy');
  });

  it('should enforce allowedRecipientDomains', () => {
    const manager = new SecurityManager({
      allowedRecipientDomains: ['company.com'],
    });

    const validRes = manager.validateSendRequest({
      to: 'alice@company.com',
      subject: 'Work',
      text: 'Hi Alice',
    });
    expect(validRes.valid).toBe(true);

    const invalidRes = manager.validateSendRequest({
      to: 'hacker@external.org',
      subject: 'Work',
      text: 'Hi',
    });
    expect(invalidRes.valid).toBe(false);
    expect(invalidRes.reason).toContain('is not in the allowed domains list');
  });

  it('should enforce rate limits per hour', () => {
    const manager = new SecurityManager({
      maxEmailsPerHour: 2,
    });

    manager.recordSend();
    manager.recordSend();

    const res = manager.validateSendRequest({
      to: 'alice@company.com',
      subject: 'Third Email',
      text: 'Exceeding limit',
    });

    expect(res.valid).toBe(false);
    expect(res.reason).toContain('Rate limit exceeded');
  });
});
