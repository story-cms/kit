import { test, expect } from '@playwright/test';

import { parseReference } from '../../src/frontend/shared/helpers';

test.describe('Parse exactly spelled and punctuated references', () => {
  test('Identify junk', () => {
    expect(parseReference('Dear Johnny 1')).toBe('');
    expect(parseReference('kjhagdkjh jhsfljjsf')).toBe('');
  });

  test('Exact references to John', () => {
    expect(parseReference('John 1')).toBe('JHN.1');
    expect(parseReference('John 1:1')).toBe('JHN.1.1');
    expect(parseReference('John 2:1-7')).toBe('JHN.2.1-JHN.2.7');
    expect(parseReference('john 1')).toBe('JHN.1');
    expect(parseReference(' john 1     ')).toBe('JHN.1');
  });

  test('Range spanning chapter', () => {
    expect(parseReference('John 2:1-7')).toBe('JHN.2.1-JHN.2.7');
    expect(parseReference('John 2:1-3:7')).toBe('JHN.2.1-JHN.3.7');
    expect(parseReference('John 2:7-3:1')).toBe('JHN.2.7-JHN.3.1');
  });

  test('Exact references to other books', () => {
    expect(parseReference('Matthew 2:3-7')).toBe('MAT.2.3-MAT.2.7');
    expect(parseReference('Psalm 1')).toBe('PSA.1');
    expect(parseReference('Proverbs 1:8')).toBe('PRO.1.8');
    expect(parseReference('Nahum 3:8')).toBe('NAM.3.8');
    expect(parseReference('   1 samuel 3:8')).toBe('1SA.3.8');
    expect(parseReference('1 Samuel 1:4-5')).toBe('1SA.1.4-1SA.1.5');
    expect(parseReference('1Samuel      1:4-5')).toBe('1SA.1.4-1SA.1.5');
    expect(parseReference('Nahum 3:8')).toBe('NAM.3.8');
  });

  test('Partial references to books', () => {
    expect(parseReference('   Mat 2:3-7  ')).toBe('MAT.2.3-MAT.2.7');
    expect(parseReference('Jo 1:1')).toBe('JHN.1.1');
    expect(parseReference('Jn 1:1')).toBe('JHN.1.1');
    expect(parseReference('Joh 1:1')).toBe('JHN.1.1');
    expect(parseReference('jn 1:1')).toBe('JHN.1.1');
    expect(parseReference('JOH 1:1')).toBe('JHN.1.1');
    expect(parseReference('Prov 1:8')).toBe('PRO.1.8');
    expect(parseReference('1 sam 3:8')).toBe('1SA.3.8');
    expect(parseReference('1sam 3:8')).toBe('1SA.3.8');
    expect(parseReference('1sam 3')).toBe('1SA.3');
    expect(parseReference('1sa 3:8')).toBe('1SA.3.8');
    expect(parseReference('1SA 3:8')).toBe('1SA.3.8');
    expect(parseReference('3 jn 1:5')).toBe('3JN.1.5');
    expect(parseReference('3 JOH 1:5')).toBe('3JN.1.5');
    expect(parseReference('Psalms 1')).toBe('PSA.1');
  });

  test('Non-standard punctuation', () => {
    expect(parseReference('   Mat 2.3-7  ')).toBe('MAT.2.3-MAT.2.7');
    expect(parseReference(' Mat 2.3 - 7 ')).toBe('MAT.2.3-MAT.2.7');
    expect(parseReference('jn 1.1')).toBe('JHN.1.1');
    expect(parseReference('jn 1. 1')).toBe('JHN.1.1');
    expect(parseReference('Jn 1:1')).toBe('JHN.1.1');
    expect(parseReference('Jn 1: 1')).toBe('JHN.1.1');
    expect(parseReference('1 Sam 1.4-5')).toBe('1SA.1.4-1SA.1.5');
    expect(parseReference('1 Sam 1:4-5')).toBe('1SA.1.4-1SA.1.5');
    expect(parseReference(' 1 Sam 1 . 4 - 5  ')).toBe('1SA.1.4-1SA.1.5');
    expect(parseReference(' 1SA 1 .  4   -    5  ')).toBe('1SA.1.4-1SA.1.5');
  });
});
