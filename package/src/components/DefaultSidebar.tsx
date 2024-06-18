import { ChevronDown, ChevronRight } from "lucide-react";
import { FC, useState } from "react";
import { SidebarMenu, SidebarUrls, useCustomRouter } from "..";

type DefaultSidebarLiItemProps = React.HTMLAttributes<HTMLLIElement> & {
  activeUrl: string;
  url: string;
  anchorText: string;
  children?: React.ReactNode;
}

const DefaultSidebarLiItem: FC<DefaultSidebarLiItemProps> = ({
  activeUrl,
  url,
  anchorText,
  children,
  ...props }) => {
  const router = useCustomRouter();

  const handleNavigation = (
    urlParam: string,
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.push(urlParam);
  };

  return (
    <li
      className={`rbt-sidebar-li ${activeUrl === url ? "rbt-sidebar-li-active" : ""}`}
      {...props}>
      <a href={url} className="rbt-sidebar-a" onClick={(e) => handleNavigation(url, e)}>
        {anchorText}
      </a>
      {children}
    </li >
  );
}

type DefaultSidebarSubmenuProps = {
  subMenuUrls: SidebarUrls;
  activeUrl: string;
  isOpen: boolean;
}

const DefaultSidebarSubmenu: FC<DefaultSidebarSubmenuProps> = ({
  subMenuUrls,
  activeUrl,
  isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ul className="rbt-submenu-ul">
      {Object.entries(subMenuUrls).map(([url, title], index) => (
        <DefaultSidebarLiItem
          key={index}
          activeUrl={activeUrl}
          url={url}
          anchorText={title}
        />
      ))}
    </ul>
  );
}

// The initial open state of a submenu is open === true if:
// 1. The activeUrl is the same as the url of the submenu.
// 2. The activeUrl is belongs to the submenu.
const initialIsSubmenuOpen = (
  activeUrl: string,
  url: string,
  currentSubmenu: SidebarUrls | undefined): boolean => {
  if (activeUrl === url) {
    return true;
  }

  if (currentSubmenu && Object.keys(currentSubmenu).includes(activeUrl)) {
    return true;
  }

  return false;
}

type TitleAndSubmenuProps = {
  titleAndSubmenu: [string, SidebarUrls?];
  url: string;
  activeUrl: string;
  menuEntries: [string, [string, SidebarUrls?]][];
}

const TitleAndSubmenu: FC<TitleAndSubmenuProps> = ({
  titleAndSubmenu,
  url,
  menuEntries,
  activeUrl }) => {
  const title = titleAndSubmenu[0];
  const submenu = titleAndSubmenu[1];
  const [submenuOpen, setSubmenuOpen] = useState(initialIsSubmenuOpen(activeUrl, url, submenu));

  if (submenu) {
    const onChevronClick = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.stopPropagation();
      setSubmenuOpen(!submenuOpen);
    }

    return (
      <>
        <DefaultSidebarLiItem
          activeUrl={activeUrl}
          anchorText={title}
          url={url}>
          {submenuOpen ? (
            <ChevronDown
              size={20}
              onClick={onChevronClick}
              className="rbt-chevron"
            />)
            : (<ChevronRight
              size={20}
              className="rbt-chevron"
              onClick={onChevronClick} />)}
        </DefaultSidebarLiItem>
        <li>
          <DefaultSidebarSubmenu
            isOpen={submenuOpen}
            subMenuUrls={submenu}
            activeUrl={activeUrl} />
        </li>
      </>
    );
  }

  return (
    <DefaultSidebarLiItem activeUrl={activeUrl} url={url} anchorText={title} />
  );
}

export type DefaultSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  sidebarMenu: SidebarMenu;
  activeUrl: string;
  isOpen?: boolean;
}


export const DefaultSidebar: FC<DefaultSidebarProps> = ({
  sidebarMenu,
  activeUrl,
  isOpen = true,
  ...props }) => {
  const menuEntries = Object.entries(sidebarMenu || {});
  const classNames = "rbt-sidebar " + (isOpen ? "rbt-force-display" : "");

  if (menuEntries.length === 0) {
    return <p>sidebarMenu has no entries :(</p>;
  }

  return (
    <div className={classNames} {...props}>
      <ul className="rbt-sidebar-ul">
        {menuEntries.map(([url, titleAndSubmenu], index) => (
          <TitleAndSubmenu
            key={index}
            menuEntries={menuEntries}
            titleAndSubmenu={titleAndSubmenu}
            url={url}
            activeUrl={activeUrl} />
        ))}
      </ul>
    </div>
  );
};
