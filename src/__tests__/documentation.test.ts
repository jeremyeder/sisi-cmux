import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Documentation Tests', () => {
  it('README.md exists', () => {
    const readmePath = join(process.cwd(), 'README.md');
    expect(existsSync(readmePath)).toBe(true);
  });

  it('man page exists', () => {
    const manPath = join(process.cwd(), 'man', 'sisi.1');
    expect(existsSync(manPath)).toBe(true);
  });

  it('README contains basic sections', () => {
    const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf-8');
    expect(readme).toContain('# sisi-cmux');
    expect(readme).toContain('## Installation');
    expect(readme).toContain('## Quick Start');
    expect(readme).toContain('## Features');
  });

  it('man page contains command documentation', () => {
    const manPage = readFileSync(join(process.cwd(), 'man', 'sisi.1'), 'utf-8');
    expect(manPage).toContain('.TH SISI 1');
    expect(manPage).toContain('SYNOPSIS');
    expect(manPage).toContain('DESCRIPTION');
    expect(manPage).toContain('OPTIONS');
  });
});