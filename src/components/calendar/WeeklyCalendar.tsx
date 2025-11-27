import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, User, Clock, Briefcase } from "lucide-react";

interface Leave {
  id: string;
  employee: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  status: string;
  reason?: string;
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

interface WeeklyCalendarProps {
  currentDate: Date;
  leaves: Leave[];
  holidays: Holiday[];
}

// Dynamic leave type color mapping
const LEAVE_TYPE_MAP = [
  { keywords: ['casual', 'cl'], color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600', textColor: 'text-blue-600', borderColor: 'border-blue-500' },
  { keywords: ['sick', 'sl'], color: 'bg-red-500', gradient: 'from-red-500 to-red-600', textColor: 'text-red-600', borderColor: 'border-red-500' },
  { keywords: ['wfh', 'work from home', 'remote'], color: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600', textColor: 'text-purple-600', borderColor: 'border-purple-500' },
  { keywords: ['annual', 'vacation'], color: 'bg-indigo-500', gradient: 'from-indigo-500 to-indigo-600', textColor: 'text-indigo-600', borderColor: 'border-indigo-500' },
  { keywords: ['maternity', 'paternity'], color: 'bg-pink-500', gradient: 'from-pink-500 to-pink-600', textColor: 'text-pink-600', borderColor: 'border-pink-500' },
];

const getLeaveColor = (leaveType: string, status: string) => {
  if (status === 'PENDING') return {
    color: 'bg-yellow-500',
    gradient: 'from-yellow-500 to-yellow-600',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-500'
  };
  
  if (status === 'APPROVED') {
    const lowerType = leaveType.toLowerCase();
    const matchedType = LEAVE_TYPE_MAP.find(type => 
      type.keywords.some(keyword => lowerType.includes(keyword))
    );
    
    return matchedType || {
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      borderColor: 'border-green-500'
    };
  }
  
  return {
    color: 'bg-gray-400',
    gradient: 'from-gray-400 to-gray-500',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-400'
  };
};

export const WeeklyCalendar = ({ currentDate, leaves, holidays }: WeeklyCalendarProps) => {
  // Get start of week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Generate 7 days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
  
  // Helper to check if date has leave
  const getLeavesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return leaves.filter(leave => {
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      return date >= start && date <= end;
    });
  };
  
  // Helper to check if date is holiday
  const getHolidayForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    console.log('🔍 Weekly - Checking holiday for date:', dateStr);
    const holiday = holidays.find(h => {
      const holidayDateStr = h.date.split('T')[0];
      return holidayDateStr === dateStr;
    });
    if (holiday) console.log('✅ Weekly - Found holiday:', holiday.name);
    return holiday;
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((date, index) => {
          const dayLeaves = getLeavesForDate(date);
          const holiday = getHolidayForDate(date);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <div
              key={index}
              className={cn(
                "border-2 rounded-2xl p-4 min-h-80 transition-all duration-300 hover:shadow-2xl",
                isWeekend && "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200",
                holiday && "bg-gradient-to-br from-rose-50 via-rose-100 to-rose-50 dark:from-rose-950/40 dark:via-rose-900/30 dark:to-rose-950/40 border-rose-400 dark:border-rose-600 shadow-rose-200/50 dark:shadow-rose-900/50 shadow-xl",
                isToday && "ring-4 ring-primary ring-offset-2 shadow-2xl scale-105",
                !isWeekend && !holiday && "bg-gradient-to-br from-background to-muted/10 hover:border-primary/50"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'slideInUp 0.5s ease-out forwards'
              }}
            >
              {/* Day header */}
              <div className="text-center mb-4 pb-3 border-b-2">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  {date.toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div className={cn(
                  "text-4xl font-bold mb-1 transition-colors",
                  isWeekend && "text-muted-foreground",
                  holiday && "text-rose-600 dark:text-rose-400",
                  isToday && "text-primary"
                )}>
                  {date.getDate()}
                </div>
                <div className="text-xs font-semibold text-muted-foreground uppercase">
                  {date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                {dayLeaves.length > 0 && (
                  <Badge variant="secondary" className="mt-2">
                    {dayLeaves.length} {dayLeaves.length === 1 ? 'Leave' : 'Leaves'}
                  </Badge>
                )}
              </div>
              
              {/* Holiday indicator */}
              {holiday && (
                <HoverCard openDelay={100}>
                  <HoverCardTrigger asChild>
                    <div className="mb-4 p-4 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 rounded-2xl text-sm text-white font-bold text-center shadow-xl flex items-center justify-center gap-2.5 animate-pulse cursor-pointer hover:from-rose-600 hover:via-rose-700 hover:to-rose-800 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-rose-400">
                      <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <span className="tracking-wide">{holiday.name}</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent 
                    className="w-80 p-0 overflow-hidden shadow-2xl border-2 border-rose-200 dark:border-rose-800 z-[9999]"
                    side="top"
                    align="center"
                    sideOffset={8}
                    collisionPadding={20}
                    avoidCollisions={true}
                  >
                    <div className="p-4 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold">Public Holiday</h4>
                          <p className="text-xs text-rose-100">Company-wide observance</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-3 bg-gradient-to-b from-background to-muted/20">
                      <div className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 hover:shadow-md transition-shadow">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Holiday Name</span>
                        <span className="text-base font-bold text-rose-600 dark:text-rose-400">{holiday.name}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Date</span>
                        <span className="text-sm font-bold">
                          {new Date(holiday.date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Day of Week</span>
                        <span className="text-sm font-bold">{holiday.day}</span>
                      </div>
                      {holiday.type === 'OPTIONAL' && (
                        <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
                              Optional Holiday
                            </Badge>
                            <span className="text-xs text-orange-700 dark:text-orange-300">Employee choice</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
              
              {/* Leaves */}
              <div className="space-y-2.5">
                {dayLeaves.map((leave, leaveIdx) => {
                  const colors = getLeaveColor(leave.leave_type, leave.status);
                  return (
                    <HoverCard key={leave.id} openDelay={200}>
                      <HoverCardTrigger asChild>
                        <div
                          className={cn(
                            "p-3 rounded-xl text-white cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 bg-gradient-to-br",
                            colors.gradient
                          )}
                          style={{
                            animationDelay: `${(index * 50) + (leaveIdx * 100)}ms`,
                            animation: 'fadeInScale 0.4s ease-out forwards'
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <div className="text-sm font-bold truncate">
                              {leave.employee}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs opacity-95">
                            <Briefcase className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{leave.leave_type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs opacity-90 mt-1">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span>{leave.days} day{leave.days > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent 
                        className="w-80 p-0 overflow-hidden z-[9999]"
                        side="top"
                        align="center"
                        sideOffset={8}
                        collisionPadding={20}
                        avoidCollisions={true}
                      >
                        <div className={cn("p-4 text-white bg-gradient-to-br", colors.gradient)}>
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-bold flex items-center gap-2">
                              <User className="h-5 w-5" />
                              {leave.employee}
                            </h4>
                            <Badge 
                              variant={leave.status === 'APPROVED' ? 'default' : 'secondary'}
                              className="shadow-md"
                            >
                              {leave.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 space-y-3 bg-background">
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                              <Briefcase className="h-3.5 w-3.5" />
                              Type:
                            </span>
                            <span className={cn("text-sm font-bold", colors.textColor)}>{leave.leave_type}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5" />
                              Duration:
                            </span>
                            <span className="text-sm font-bold">{leave.days} day{leave.days > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <span className="text-xs text-muted-foreground font-semibold">From:</span>
                            <span className="text-sm font-bold">
                              {new Date(leave.start_date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <span className="text-xs text-muted-foreground font-semibold">To:</span>
                            <span className="text-sm font-bold">
                              {new Date(leave.end_date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          {leave.reason && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-start gap-2">
                                <div className="p-1 bg-blue-500 rounded-full mt-0.5">
                                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Reason</p>
                                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{leave.reason}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
                {dayLeaves.length === 0 && !holiday && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No leaves
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};
