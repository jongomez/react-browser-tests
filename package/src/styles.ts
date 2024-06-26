
const pending = 'rgb(0, 0, 0)';
const running = 'rgb(0, 0, 255)';
const success = 'rgb(0, 160, 0)';
const fail = 'rgb(255, 40, 40)';
const skipped = 'rgb(255, 165, 0)';
const headerHeightPx = '60px';
const sidebarWidthPx = '256px';

export const testContainerStyles: string = `
/* Test Results Styles */
.rbt-test-result {
  padding-left: 16px;
}

.rbt-test-title {
  font-weight: 600;
  margin: 2px;
}

.rbt-test-title-and-result,
.rbt-overview-title-and-stats {
  display: flex;
  align-items: center;
}

.rbt-icon-and-count {
  display: flex;
  align-items: center;
  margin-left: -2px;
}

.rbt-container-state-stats {
  margin-left: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.rbt-test,
.rbt-overview {
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  padding: 8px;
  border-radius: 4px;
  margin: 4px;
  min-height: 24px;
}

.rbt-test-array-stats {
  padding: 8px;
  border-radius: 4px;
  margin: 4px;
  display: flex;
  gap: 10px;
}

/* Border Styles for Test Results */
.rbt-border-pending {
  border-left: 4px solid ${pending};
}

.rbt-border-running {
  border-left: 4px solid ${running};
}

.rbt-border-success {
  border-left: 4px solid ${success};
}

.rbt-border-fail {
  border-left: 4px solid ${fail};
}

.rbt-border-skipped {
  border-left: 4px solid ${skipped};
}

/* Icon Styles */
.rbt-icon {
  flex-shrink: 0;
  margin-right: 6px;
}

.rbt-icon-success {
  color: ${success};
}

.rbt-icon-fail {
  color: ${fail};
}

.rbt-icon-running {
  color: ${running};
}

.rbt-icon-skipped {
  color: ${skipped};
}

.rbt-icon-pending {
  color: ${pending};
}

/* Animation */
.rbt-spin-animation {
  animation: spin 1.4s linear infinite;
}

/* Specific Icons */
.rbt-hourglass,
.rbt-skipped {
  height: 22px;
  width: 22px;
  padding: 1px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
`

export const layoutStyles: string = `
.rbt-sidebar-ul {
  list-style: none;
  margin-top: 0;
  padding: 0;
}

.rbt-sidebar-li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  user-select: none;
  color: rgb(100, 100, 100);
}

.rbt-sidebar-li-active {
  font-weight: 600;
  background-color: rgba(0,0,0,0.06) !important;
  color: black;
}

.rbt-sidebar-li:hover {
  background-color: rgba(0,0,0,0.04);
  color: black !important;
}

.rbt-submenu-ul {
  margin-left: 24px;
  padding: 0 0 0 4px;
  border-left: 1px solid #ccc;
}

.rbt-header {
  grid-area: header;

  /* When the overlay is active, the header should be on top and with a white background. */
  background-color: white;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 15px;
  box-sizing: border-box;

  width: 100%;
  height: ${headerHeightPx};

  z-index: 1000;

  border-bottom: 1px solid rgb(230, 230, 230);
}

.rbt-header-title-anchor {
  font-weight: 600;
  color: black;
  text-decoration: none;
}

.rbt-header-title-and-burger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 16px;
  user-select: none;
}

.rbt-github-link {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rbt-chevron {
  padding: 8px;
}

.rbt-sidebar-a {
  flex-grow: 1;
  padding: 8px;
  color: inherit;
  text-decoration: none;
}

.rbt-sidebar-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: ${sidebarWidthPx} 1fr;
  grid-template-areas:
      "header header"
      "sidebar main-content";
  height: 100vh;
}

.rbt-sidebar-layout-content {
  grid-area: main-content;

  padding: 20px;
  overflow-y: auto;

  height: calc(100vh - ${headerHeightPx});

  box-sizing: border-box;
}

.rbt-sidebar {
  grid-area: sidebar;
  background-color: white;
  padding: 10px;

  box-sizing: border-box;

  width: ${sidebarWidthPx};
  overflow-y: auto;
  z-index: 1000;

  height: calc(100vh - ${headerHeightPx});
}
 
.rbt-mobile-menu-overlay-active {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
}

@media (max-width: 768px) {
  .rbt-sidebar-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
        "header"
        "main-content";
  }

  .rbt-sidebar {
    display: none;
    position: fixed;
    top: ${headerHeightPx};
  }

  .rbt-burger-menu {
    display: block;
  }

  .rbt-sidebar-layout-content {
    margin-left: 0;
    max-width: 100%;
  }

  .rbt-mobile-menu-overlay-active {
    display: block;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 98;
  }
}

@media (min-width: 769px) {
  .rbt-burger-menu {
    display: none;
  }
}

.rbt-burger-menu {
  cursor: pointer;
}

.rbt-force-display {
  display: block;
}
`;
