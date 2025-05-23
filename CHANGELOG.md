# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- **Refactored LumiferaController**: Split large controller component into smaller, reusable components
  - Created `SliderControl` component for BPM and Brightness controls with reusable slider functionality
  - Created `DirectionControl` component for left/right directional controls
  - Created `FixModeControl` component for fix mode selection with icon buttons
  - Created `CrossfadeTimeControl` component for crossfade time selection
  - Eliminated code duplication across slider patterns, button groups, and event handling
  - Reduced LumiferaController from 194 lines to ~110 lines
  - Improved maintainability and reusability of control components
  - Maintained all original functionality while improving code organization