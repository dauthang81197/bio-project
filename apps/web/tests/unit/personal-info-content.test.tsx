/** @jsxImportSource react */
// The pragma above pins this file's JSX to React's runtime instead of
// Playwright's default component-testing jsx-runtime (which the test
// loader would otherwise use for any .tsx file), so the elements built
// below are real React elements that `react-dom/server` can render.
import { test, expect } from '@playwright/test';
import { renderToStaticMarkup } from 'react-dom/server';
import { PersonalInfoContent } from '@/components/personal-info-content';
import { PLACEHOLDER_PERSONAL_INFO, type PersonalInfo } from '@/lib/personal-info';

/**
 * Covers every row of the "I/O & Edge-Case Matrix" in
 * spec-1-2-publish-the-personal-information-page.md via
 * `react-dom/server`'s `renderToStaticMarkup` -- no browser needed, unlike
 * the `tests/e2e` suite.
 */

test.describe('Matrix row 1 -- Published info supplied', () => {
  test('renders display name, introduction, biography, and social links', () => {
    const html = renderToStaticMarkup(
      <PersonalInfoContent info={PLACEHOLDER_PERSONAL_INFO} />,
    );

    expect(html).toContain(PLACEHOLDER_PERSONAL_INFO.displayName);
    expect(html).toContain(PLACEHOLDER_PERSONAL_INFO.introduction);
    expect(html).toContain(PLACEHOLDER_PERSONAL_INFO.biography);
    for (const link of PLACEHOLDER_PERSONAL_INFO.socialLinks) {
      expect(html).toContain(link.label);
      expect(html).toContain(`href="${link.href}"`);
    }
  });

  test('renders no admin-control or customer-data markup', () => {
    const html = renderToStaticMarkup(
      <PersonalInfoContent info={PLACEHOLDER_PERSONAL_INFO} />,
    );

    expect(html).not.toMatch(/data-testid="admin-/);
    expect(html).not.toMatch(/<(button|form|input)[ >]/);
  });
});

test.describe('Matrix row 2 -- Not yet published', () => {
  test('renders a content-unavailable message and no draft fields', () => {
    const html = renderToStaticMarkup(<PersonalInfoContent info={null} />);

    expect(html).toContain('has not been published yet');
    expect(html).not.toContain(PLACEHOLDER_PERSONAL_INFO.displayName);
    expect(html).not.toContain(PLACEHOLDER_PERSONAL_INFO.introduction);
    expect(html).not.toContain(PLACEHOLDER_PERSONAL_INFO.biography);
    expect(html).not.toMatch(/data-testid="info-social-link/);
  });
});

test.describe('Matrix row 3 -- Social link present', () => {
  test('renders as visibly external: target=_blank, rel=noopener noreferrer, external indicator', () => {
    const html = renderToStaticMarkup(
      <PersonalInfoContent info={PLACEHOLDER_PERSONAL_INFO} />,
    );

    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    // Visible external indicator, not conveyed by color/attribute alone.
    expect(html).toContain('opens in a new tab');
    // Keyboard-focus styling is present on the link itself.
    expect(html).toContain('focus-visible:outline');
  });
});

test.describe('Matrix row 4 -- No social links configured', () => {
  test('renders name/intro/bio without a broken or empty social-links section', () => {
    const info: PersonalInfo = { ...PLACEHOLDER_PERSONAL_INFO, socialLinks: [] };
    const html = renderToStaticMarkup(<PersonalInfoContent info={info} />);

    expect(html).toContain(info.displayName);
    expect(html).toContain(info.introduction);
    expect(html).toContain(info.biography);
    expect(html).not.toMatch(/data-testid="info-social-links"/);
    expect(html).not.toMatch(/<nav/);
  });
});

test.describe('Non-null but incomplete record', () => {
  test('falls back to the unavailable branch when a required field is blank', () => {
    const info: PersonalInfo = { ...PLACEHOLDER_PERSONAL_INFO, biography: '   ' };
    const html = renderToStaticMarkup(<PersonalInfoContent info={info} />);

    expect(html).toContain('has not been published yet');
    expect(html).not.toContain('data-testid="info-published"');
    expect(html).not.toContain(PLACEHOLDER_PERSONAL_INFO.displayName);
  });
});
