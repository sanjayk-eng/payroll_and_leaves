import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  DollarSign, 
  FileText, 
  Settings,
  LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'HR'] },
  { title: "Employees", url: "/employees", icon: Users, roles: ['SUPERADMIN', 'ADMIN'] },
  { title: "Apply Leave", url: "/apply-leave", icon: Calendar, roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'HR'] },
  { title: "Leave Approvals", url: "/approvals", icon: ClipboardList, roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'HR'] },
  { title: "Leave Calendar", url: "/calendar", icon: Calendar, roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'HR'] },
  { title: "Payroll", url: "/payroll", icon: DollarSign, roles: ['SUPERADMIN', 'ADMIN'] },
  { title: "Payslips", url: "/payslips", icon: FileText, roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'HR'] },
  { title: "Settings", url: "/settings", icon: Settings, roles: ['SUPERADMIN', 'ADMIN'] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  const filteredItems = menuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  const handleLogout = () => {
    logout();
  };

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">HR Portal</h2>
            <p className="text-xs text-sidebar-foreground/60">{currentUser?.email || 'User'}</p>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
