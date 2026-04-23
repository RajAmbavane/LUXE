import { Brain, Eye, Gavel, Inbox, LayoutDashboard, Shield, Home } from "lucide-react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
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
import { useFirstCaseId } from "@/hooks/useFirstCaseId";

const mainNav = [
  { title: "Home", url: "/", icon: Home },
  { title: "Case Queue", url: "/cases", icon: Inbox },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";
  const firstCaseId = useFirstCaseId();
  const location = useLocation();
  const caseMatch = matchPath("/cases/:caseId/*", location.pathname) ?? matchPath("/cases/:caseId", location.pathname);
  const activeCaseId = caseMatch?.params.caseId ?? firstCaseId;
  const caseNav = [
    { title: "Visual Analysis", url: `/cases/${activeCaseId}/visual`, icon: Eye },
    { title: "Risk & Reasoning", url: `/cases/${activeCaseId}/risk`, icon: Brain },
    { title: "Actions", url: `/cases/${activeCaseId}/actions`, icon: Gavel },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-card/50 backdrop-blur-xl">
      <SidebarContent className="pt-4">
        <div className={`mb-6 px-4 ${collapsed ? "px-2" : ""}`}>
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="LuxeResolve" className="h-8 w-8 rounded-lg shadow-lg object-cover" />
            {!collapsed ? (
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold text-gradient-primary">LuxeResolve</span>
                <span className="text-xs text-muted-foreground">Verified</span>
              </div>
            ) : null}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="transition-all duration-200 hover:bg-primary/10 hover:text-primary rounded-lg"
                      activeClassName="bg-primary/15 font-semibold text-primary shadow-sm"
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
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
            Case Analysis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeCaseId ? caseNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="transition-all duration-200 hover:bg-primary/10 hover:text-primary rounded-lg"
                      activeClassName="bg-primary/15 font-semibold text-primary shadow-sm"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed ? <span>{item.title}</span> : null}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )) : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          {!collapsed && (
            <div className="text-xs text-muted-foreground text-center">
              <div className="mb-1 font-medium">AI Detection Active</div>
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>94.2% Accuracy</span>
              </div>
            </div>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
