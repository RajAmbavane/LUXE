import { Brain, Eye, Gavel, Inbox, LayoutDashboard, LogOut, Settings, Shield } from "lucide-react";
import { matchPath, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { heroCaseId } from "@/lib/cases";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Case Queue", url: "/cases", icon: Inbox },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const location = useLocation();
  const caseMatch = matchPath("/cases/:caseId/*", location.pathname) ?? matchPath("/cases/:caseId", location.pathname);
  const activeCaseId = caseMatch?.params.caseId ?? heroCaseId;
  const caseNav = [
    { title: "Visual Analysis", url: `/cases/${activeCaseId}/visual`, icon: Eye },
    { title: "Risk & Reasoning", url: `/cases/${activeCaseId}/risk`, icon: Brain },
    { title: "Actions", url: `/cases/${activeCaseId}/actions`, icon: Gavel },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-4">
        <div className={`mb-6 px-4 ${collapsed ? "px-2" : ""}`}>
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 shrink-0 text-primary" />
            {!collapsed ? <span className="font-display text-lg font-bold text-gradient-gold">LuxeResolve</span> : null}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="transition-colors hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent font-medium text-primary"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed ? <span>{item.title}</span> : null}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Case Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {caseNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="transition-colors hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent font-medium text-primary"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed ? <span>{item.title}</span> : null}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/settings" className="transition-colors hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-primary">
                <Settings className="mr-2 h-4 w-4" />
                {!collapsed ? <span>Settings</span> : null}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-2 border-t border-border/40 pt-2">
          {!collapsed && user ? <p className="px-2 pb-2 text-xs text-muted-foreground">{user.email}</p> : null}
          <button
            onClick={signOut}
            className="flex items-center gap-2 p-2 text-sm text-gray-500 transition-colors hover:text-gray-800"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed ? <span>Sign Out</span> : null}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
