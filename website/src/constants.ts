import { SidebarMenu, SidebarUrls } from "react-browser-tests";

export const testUrls: SidebarUrls = {
  "/tests/test-component": "Test Component",
  "/tests/react-components": "React Components",
  "/tests/before-and-after": "Before and After Functions",
  "/tests/overview-components": "Overview Components",
  "/tests/async-tests": "Async Tests",
};


export const componentUrls: SidebarUrls = {
  "/components/test-container": "Test Container",
  "/components/test-group": "Test Group",
  "/components/test": "Test",
  "/components/single-test-container-overview": "Single Test Container Overview",
  "/components/multiple-test-container-overview": "Multiple Test Container Overview",
  "/components/multiple-page-overview": "Multiple Page Overview",
  "/components/test-stats-display": "Test Stats Display",
  "/components/test-group-stats": "Test Group Stats",
  "/components/sidebar-layout": "Sidebar Layout",
};

export const sidebarMenu: SidebarMenu = {
  "/": ["Home"],
  "/components": ["Components", componentUrls],
  "/tests": ["Tests", testUrls],
}

