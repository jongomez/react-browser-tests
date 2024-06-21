"use client"

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
