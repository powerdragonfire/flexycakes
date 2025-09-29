# Change Log

## 1.3.0

- **New Feature:** Floating Popout, by @emiljas-hexagon
    - **Added:** Introduced `IJsonPopup` interface to define the structure of popup windows
    - **Added:** Created `LayoutPopup` class to manage popup window behavior and state
    - **Enhanced:** Updated `Model` class to handle popup windows alongside regular windows
    - **Enhanced:** Enhanced `RowNode` and `TabSetNode` to support popup-specific logic
    - **Added:** Implemented resizing and moving functionality for popups in `LayoutInternal`
    - **Added:** Added new icons for floating and dockable states in `Icons` component
    - **Added:** Developed `Popup` component to render popups using React portals
    - **Enhanced:** Modified `Row` and `TabButton` components to accommodate popup interactions
    - **Enhanced:** Updated styles for popup tab bars in various CSS files

## 1.2.1

- **Fixed:** v0.9 Hidden Tabset Fix, courtesy of @Lukas Götz. See PR Conversation [here](https://github.com/caplin/FlexLayout/pull/485).

## 1.2.0

- **Enhanced:** README enhancements - new Kibana, Discord, LOGO!
- **Enhanced:** Watch script to support Symbolic Linking with HRM for local development
- **Fixed:** BorderTabSet 'not all code path returns something' fix.

## 1.1.0 - NPM Publish Error

## 1.0.0

- **Added:** New global boolean variable `tabSetEnableHideWhenEmpty` to control hiding of empty tabsets.
- **Added:** New optional boolean attribute `enableHideWhenEmpty` on `ITabSetAttribute` that inherits from the global `tabSetEnableHideWhenEmpty` setting.
- **Added:** New "ecmind" layout demonstrating row node with three tabsets (left and right empty, middle filled) with `tabSetEnableHideWhenEmpty` enabled.
- **Enhanced:** Row.tsx component now supports hiding empty tabsets when they have no children and `enableHideWhenEmpty` is set to true.
- **Added:** Demo functionality with "Add to left empty Tabset" and "Add to right empty Tabset" buttons to demonstrate dynamic tabset visibility.
- **Feature:** Empty tabsets can now serve as placeholders for future tab insertion, appearing only when populated with content.
- **Use Case:** Enables programmatic opening of tabs in placeholder tabsets for complex layouts like PDF editors with side panels.

## 0.9.0

- **Added:** Pin/unpin feature for side (left/right) and bottom panels. Users can now keep panels permanently visible ("pinned") or allow them to collapse automatically ("unpinned"), similar to behavior in modern IDEs and dashboard layouts.
- **Enhanced:** Improved layout flexibility by allowing users to control panel visibility behavior, helping to streamline workflows and reduce visual clutter in complex layouts.

### For older changes please see [Flexlayout ChangeLog](https://github.com/caplin/FlexLayout/blob/master/CHANGELOG.md)
