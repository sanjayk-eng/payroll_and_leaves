import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { User, Calendar, TrendingUp } from "lucide-react";

interface Leave {
  id: string;
  employee: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  status: string;
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  day: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface ManagerTimelineProps {
  currentDate: Date;
  leaves: Leave[];
  holidays: Holiday[];
}

// Dynamic leave type color mapping
const LEAVE_TYPE_MAP = [
  { keywords: ['casual', 'cl'], color: 'bg-blue-500', border: 'border-blue-600', shadow: 'shadow-blue-500/50' },
  { keywords: ['sick', 'sl'], color: 'bg-red-500', border: 'border-red-600', shadow: 'shadow-red-500/50' },
  { keywords: ['wfh', 'work from home', 'remote'], color: 'bg-purple-500', border: 'border-purple-600', shadow: 'shadow-purple-500/50' },
  { keywords: ['annual', 'vacation'], color: 'bg-indigo-500', border: 'border-indigo-600', shadow: 'shadow-indigo-500/50' },
  { keywords: ['maternity', 'paternity'], color: 'bg-pink-500', border: 'border-pink-600', shadow: 'shadow-pink-500/50' },
];

const getLeaveColor = (leaveType: string, status: string) => {
  if (status === 'PENDING') return {
    color: 'bg-yellow-500',
    border: 'border-yellow-600',
    shadow: 'shadow-yellow-500/50'
  };
  
  if (status === 'APPROVED') {
    const lowerType = leaveType.toLowerCase();
    const matchedType = LEAVE_TYPE_MAP.find(type => 
      type.keywords.some(keyword => lowerType.includes(keyword))
    );
    
    return matchedType || {
      color: 'bg-green-500',
      border: 'border-green-600',
      shadow: 'shadow-green-500/50'
    };
  }
  
  return {
    color: 'bg-gray-400',
    border: 'border-gray-500',
    shadow: 'shadow-gray-500/50'
  };
};

export const ManagerTimeline = ({ currentDate, leaves, holidays }: ManagerTimelineProps) => {
  // Get current month range
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Group leaves by employee
  const employeeLeaves = useMemo(() => {
    const grouped = new Map<string, Leave[]>();
    
    leaves.forEach(leave => {
      const existing = grouped.get(leave.employee) || [];
      grouped.set(leave.employee, [...existing, leave]);
    });
    
    return Array.from(grouped.entries()).map(([employee, leaves]) => ({
      employee,
      leaves: leaves.sort((a, b) => 
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      )
    }));
  }, [leaves]);
  
  // Helper to check if date is holiday
  const isHoliday = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.some(h => h.date === dateStr);
  };
  
  // Helper to check if date is weekend
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };
  
  // Calculate leave position and width
  const getLeavePosition = (leave: Leave) => {
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);
    
    // Clamp to current month
    const monthStart = Math.max(start.getDate(), 1);
    const monthEnd = Math.min(end.getDate(), daysInMonth);
    
    // Only show if leave overlaps with current month
    if (start.getMonth() === month && start.getFullYear() === year ||
        end.getMonth() === month && end.getFullYear() === year ||
        (start < firstDay && end > lastDay)) {
      
      const startPos = ((monthStart - 1) / daysInMonth) * 100;
      const width = ((monthEnd - monthStart + 1) / daysInMonth) * 100;
      
      return { startPos, width, visible: true };
    }
    
    return { startPos: 0, width: 0, visible: false };
  };

  if (employeeLeaves.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground font-medium">No team leaves for this period</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Team members haven't requested any leaves this month</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline header - Days of month */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-48 flex-shrink-0 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Team Member
        </div>
        <div className="flex-1 relative">
          <div className="flex rounded-lg overflow-hidden border-2 shadow-sm">
            {Array.from({ length: daysInMonth }, (_, i) => {
              const date = new Date(year, month, i + 1);
              const isHol = isHoliday(date);
              const isWknd = isWeekend(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={i}
                  className={cn(
                    "flex-1 text-center text-xs py-2 font-semibold border-r transition-colors",
                    isWknd && "bg-gray-100 dark:bg-gray-900 text-muted-foreground",
                    isHol && "bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
                    isToday && "bg-primary text-primary-foreground ring-2 ring-primary ring-inset",
                    !isWknd && !isHol && !isToday && "hover:bg-muted/50"
                  )}
                  style={{ minWidth: '32px' }}
                  title={isHol ? 'Holiday' : isWknd ? 'Weekend' : ''}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Employee rows */}
      <div className="space-y-4">
        {employeeLeaves.map(({ employee, leaves: empLeaves }, empIdx) => (
          <div 
            key={employee} 
            className="flex items-center gap-3 group"
            style={{
              animationDelay: `${empIdx * 100}ms`,
              animation: 'slideInLeft 0.5s ease-out forwards'
            }}
          >
            {/* Employee name */}
            <div className="w-48 flex-shrink-0 p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border-2 group-hover:border-primary/50 transition-all duration-300">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm font-bold truncate">{employee}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {empLeaves.length} leave{empLeaves.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {/* Timeline */}
            <div className="flex-1 relative h-12 border-2 rounded-lg bg-gradient-to-r from-muted/20 to-muted/10 shadow-inner group-hover:shadow-md transition-all duration-300">
              {/* Day dividers */}
              <div className="absolute inset-0 flex rounded-lg overflow-hidden">
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const date = new Date(year, month, i + 1);
                  const isWknd = isWeekend(date);
                  const isHol = isHoliday(date);
                  
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex-1 border-r",
                        isWknd && "bg-gray-200/50 dark:bg-gray-800/50",
                        isHol && "bg-rose-100/50 dark:bg-rose-950/20"
                      )}
                      style={{ minWidth: '32px' }}
                    />
                  );
                })}
              </div>
              
              {/* Leave bars */}
              {empLeaves.map((leave, leaveIdx) => {
                const { startPos, width, visible } = getLeavePosition(leave);
                
                if (!visible) return null;
                
                const colors = getLeaveColor(leave.leave_type, leave.status);
                
                return (
                  <div
                    key={leave.id}
                    className={cn(
                      "absolute top-1.5 h-9 rounded-lg border-2 text-white flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 shadow-lg",
                      colors.color,
                      colors.border,
                      colors.shadow
                    )}
                    style={{
                      left: `${startPos}%`,
                      width: `${width}%`,
                      animationDelay: `${(empIdx * 100) + (leaveIdx * 50)}ms`,
                      animation: 'expandWidth 0.5s ease-out forwards'
                    }}
                    title={`${leave.leave_type} - ${leave.status} (${leave.days} days)`}
                  >
                    <span className="truncate px-2 drop-shadow-sm">
                      {leave.leave_type.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="pt-6 border-t-2 flex items-center justify-between bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-bold">
              {employeeLeaves.length} Team Member{employeeLeaves.length !== 1 ? 's' : ''}
            </div>
            <div className="text-xs text-muted-foreground">
              with leaves this month
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-2">
          {employeeLeaves.reduce((sum, emp) => sum + emp.leaves.length, 0)} Total Leaves
        </Badge>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes expandWidth {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
