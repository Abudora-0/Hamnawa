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
- Check the sticky header's compact state after scrolling, including its
  bottom shadow and anchor spacing.
- At mobile widths, verify the menu button announces its state, closed links
  are not tabbable, Escape returns focus to the button, and route changes close
  the menu.
- Cycle the theme button through light, dark, and high contrast and verify its
  label and announcement describe the next theme.
- Check the footer landmarks, Explore and Support link groups, privacy card,
  Back to top button, and stacked mobile layout.

## P4 visual QA

- Check dynamic titles for Home, Upload, Reader, loading, paused, processing,
  errors, and the not found page.
- Check the boot splash, lazy route loader, top progress thread, Reader
  skeleton, upload processing panel, and toast timer.
- Check Reader, Speak Aloud, and document error empty states, including all
  actions and keyboard focus.
- Check expiry labels and reading progress after section changes.

## Controls

- Check text inputs, search fields, textareas, file inputs, selects, checkboxes,
  radios, details, tables, kbd, meter, and progress in light, dark, and high
  contrast themes.
- Confirm hover, active, focus-visible, disabled, invalid, and placeholder
  states are visible and use the correct theme colors.
- Confirm scrollbars on the page, reader tools, tables, and textareas match the
  active theme, including the wider high contrast scrollbar.
- Confirm details summaries are keyboard operable and their content remains
  visible with reduced motion enabled.
