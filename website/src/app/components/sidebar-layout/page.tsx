"use client"

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

const sidebarMenuExample = `const sidebarMenu: SidebarMenu = {
  "/": ["Home"],
  "/components": ["Components", {
    "/components/test-container": "Test Container",
    "/components/test": "Test",
    "/components/test-group": "Test Group",
    "/components/single-test-container-overview": "Single Test Container Overview",
    "/components/multiple-test-container-overview": "Multiple Test Container Overview",
    "/components/multiple-page-overview": "Multiple Page Overview",
    "/components/sidebar-layout": "Sidebar Layout",
  }]
}
`

export default function SidebarLayoutPage() {
  return (
    <>
      <h1>&lt;SidebarLayout&gt;</h1>

      <p>Simple sidebar layout UI component. Contains a sidebar with links, a header and a main content area. Useful when handling multiple test pages.</p>
      <p>The sidebar and header in this website were built using a &lt;SidebarLayout&gt; component.</p>

      <h3>Example:</h3>

      <p>The following example shows how to create a custom sidebar layout component, compatible with NextJS&apos;s app router:</p>

      <SyntaxHighlighter language="tsx" style={prism}>
        {`"use client"

import { sidebarMenu } from "@/constants"
import { usePathname } from "next/navigation"
import { FC } from "react"
import { SidebarLayout } from "react-browser-tests"

type CustomSidebarLayoutProps = {
  children: React.ReactNode
}

export const CustomSidebarLayout: FC<CustomSidebarLayoutProps> = ({ children }) => {
  const pathname = usePathname()

  return (<SidebarLayout
    sidebarMenu={sidebarMenu}
    activeUrl={pathname}
  >
    {children}
  </SidebarLayout>)
}
`}
      </SyntaxHighlighter>

      <p><code>sidebarMenu</code> is an object with the URLs and names of the pages.</p>
      <p>The result of the above code is this page&apos;s sidebar, header and main content area.</p>

      <h3>Props</h3>
      <div className="grid-container">
        <div>
          sidebarMenu?
        </div>
        <div>
          <p>Object where the keys are the urls, and the values are arrays. The first element of the array specifies the page name to display in the sidebar. The second element is an optional object for submenus - the keys are the urls, and the values are the page names.</p>
          <p style={{ margin: 0 }}>Example:</p>
          <pre>
            {sidebarMenuExample}
          </pre>
        </div>

        <div>
          activeUrl?
        </div>
        <div>
          <p>String - the active URL. The sidebar will highlight the active URL.</p>
        </div>

        <div>
          css?
        </div>
        <div>
          <p>CSS styles to apply to the sidebar layout elements. The default value is a CSS string constant called <code>layoutStyles</code>, exported from the <a href="https://github.com/jongomez/react-browser-tests/blob/main/package/src/styles.ts" target="_blank" rel="noreferrer">styles.ts</a> file.</p>
        </div>

        <div>
          HTMLDivElement props
        </div>
        <div>
          <p>Supports standard HTMLDivElement props. For example: <code>className</code>, <code>style</code>, etc.</p>
        </div>
      </div>
    </>
  );
}
