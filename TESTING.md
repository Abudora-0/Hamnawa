# Manual testing checklist

- Use the app with keyboard only.
- Test at 200 percent zoom.
- Check contrast in light, dark, and high contrast themes.
- Complete an NVDA smoke test.
- Test at 1366x768.
- Test at 320 pixels wide.
- Test in Chrome and Edge.
- Automated coverage targets the utils and services. The hooks and pages are covered by this manual checklist.
- Try the bad file test set: empty file, wrong extension, oversized file,
  unreadable file, password-protected PDF, and a document over 200 pages or
  slides.

## Visual checks

- Check light, dark, and high contrast themes at 320 pixels and 1366x768.
- Check the extra large font setting and 200 percent browser zoom for
  horizontal scroll, overlap, clipping, and sticky content coverage.
- Tab through every control and confirm the focus ring is visible.
- Enable prefers-reduced-motion and the Reduce animations setting. Confirm no
  animation runs and no content is hidden.
- Check the Urdu reader sample and Urdu wordmark for Nastaliq font, right to
  left alignment, and line height.
