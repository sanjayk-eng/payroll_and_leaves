// Role-based access control utilities

export type Role = 'SUPERADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';

export const ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  HR: 'HR',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
} as const;

// Check if user has permission based on role
export const hasPermission = (userRole: string, allowedRoles: Role[]): boolean => {
  return allowedRoles.includes(userRole as Role);
};

// Check if user is admin or higher
export const isAdmin = (userRole: string): boolean => {
  return hasPermission(userRole, [ROLES.SUPERADMIN, ROLES.ADMIN]);
};

// Check if user is manager or higher
export const isManagerOrAbove = (userRole: string): boolean => {
  return hasPermission(userRole, [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]);
};

// Check if user can manage employees
export const canManageEmployees = (userRole: string): boolean => {
  return hasPermission(userRole, [ROLES.SUPERADMIN, ROLES.ADMIN]);
};

// Check if user can approve leaves
export const canApproveLeaves = (userRole: string): boolean => {
  return hasPermission(userRole, [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]);
};

// Check if user can manage payroll
export const canManagePayroll = (userRole: string): boolean => {
  return hasPermission(userRole, [ROLES.SUPERADMIN, ROLES.ADMIN]);
};

// Check if user can manage settings
export const canManageSettings = (userRole: string): boolean => {
  return hasPermission(userRole, [ROLES.SUPERADMIN, ROLES.ADMIN]);
};

// Check if user can manage holidays
export const canManageHolidays = (userRole: string): boolean => {
  return hasPermission(userRole, [ROLES.SUPERADMIN]);
};

// Check if user can adjust leave balances
export const canAdjustLeaveBalances = (userRole: string): boolean => {
  return hasPermission(userRole, [ROLES.SUPERADMIN, ROLES.ADMIN]);
};

// Check if user can add leave for others
export const canAddLeaveForOthers = (userRole: string, allowManagerAddLeave: boolean): boolean => {
  if (hasPermission(userRole, [ROLES.SUPERADMIN, ROLES.ADMIN])) {
    return true;
  }
  return userRole === ROLES.MANAGER && allowManagerAddLeave;
};
