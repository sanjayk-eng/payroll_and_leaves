import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, User, Clock } from "lucide-react";

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

interface MonthlyCalendarProps {
  currentDate: Date;
  leaves: Leave[];
  holidays: Holiday[];
}

// Dynamic leave type color mapping
const LEAVE_TYPE_MAP = [
  { keywords: ['casual', 'cl'], color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', textColor: 'text-blue-500', borderColor: 'border-blue-500' },
  { keywords: ['sick', 'sl'], color: 'bg-red-500', hoverColor: 'hover:bg-red-600', textColor: 'text-red-500', borderColor: 'border-red-500' },
  { keywords: ['wfh', 'work from home', 'remote'], color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600', textColor: 'text-purple-500', borderColor: 'border-purple-500' },
  { keywords: ['annual', 'vacation'], color: 'bg-indigo-500', hoverColor: 'hover:bg-indigo-600', textColor: 'text-indigo-500', borderColor: 'border-indigo-500' },
  { keywords: ['maternity', 'paternity'], color: 'bg-pink-500', hoverColor: 'hover:bg-pink-600', textColor: 'text-pink-500', borderColor: 'border-pink-500' },
];

const getLeaveColor = (leaveType: string, status: string) => {
  if (status === 'PENDING') return {
    color: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600',
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
      hoverColor: 'hover:bg-green-600',
      textColor: 'text-green-600',
      borderColor: 'border-green-500'
    };
  }
  
  return {
    color: 'bg-gray-400',
    hoverColor: 'hover:bg-gray-500',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-400'
  };
};

export const MonthlyCalendar = ({ currentDate, leaves, holidays }: MonthlyCalendarProps) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and total days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Create calendar grid
  const days = [];
  const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;
  
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - startingDayOfWeek + 1;
    const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
    const date = isValidDay ? new Date(year, month, dayNumber) : null;
    
    days.push({
      dayNumber: isValidDay ? dayNumber : null,
      date,
      isWeekend: date ? (date.getDay() === 0 || date.getDay() === 6) : false,
    });
  }
  
  // Helper to check if date has leave
  const getLeavesForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return leaves.filter(leave => {
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      return date >= start && date <= end;
    });
  };
  
  // Helper to check if date is holiday
  const getHolidayForDate = (date: Date | null) => {
    if (!date) return null;
    const dateStr = date.toISOString().split('T')[0];
    console.log('🔍 Checking holiday for date:', dateStr);
    const holiday = holidays.find(h => {
      const holidayDateStr = h.date.split('T')[0];
      console.log('  Comparing with holiday:', h.name, holidayDateStr, 'Match:', holidayDateStr === dateStr);
      return holidayDateStr === dateStr;
    });
    if (holiday) console.log('✅ Found holiday:', holiday.name);
    return holiday;
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-4">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
          <div 
            key={day} 
            className={cn(
              "text-center text-sm font-semibold py-3 rounded-t-lg",
              (idx === 0 || idx === 6) ? "text-muted-foreground bg-muted/30" : "text-foreground bg-muted/10"
            )}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 3)}</span>
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayLeaves = getLeavesForDate(day.date);
          const holiday = getHolidayForDate(day.date);
          const isToday = day.date?.toDateString() === today.toDateString();
          
          // Debug log for first few days
          if (index < 7 && day.date) {
            console.log(`Day ${day.dayNumber}:`, {
              date: day.date.toISOString().split('T')[0],
              hasHoliday: !!holiday,
              holidayName: holiday?.name,
              totalHolidays: holidays.length
            });
          }
          
          return (
            <div
              key={index}
              className={cn(
                "min-h-32 border-2 rounded-xl p-3 transition-all duration-300 hover:shadow-lg",
                !day.dayNumber && "bg-muted/20 border-muted",
                day.isWeekend && day.dayNumber && "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700",
                holiday && "bg-gradient-to-br from-rose-50 via-rose-100 to-rose-50 dark:from-rose-950/40 dark:via-rose-900/30 dark:to-rose-950/40 border-rose-400 dark:border-rose-600 shadow-rose-200/50 dark:shadow-rose-900/50 shadow-lg",
                isToday && "ring-4 ring-primary ring-offset-2 shadow-xl scale-105",
                day.dayNumber && !day.isWeekend && !holiday && "bg-gradient-to-br from-background to-muted/20 hover:border-primary/50"
              )}
              style={{
                animationDelay: `${index * 20}ms`,
                animation: 'fadeIn 0.5s ease-out forwards'
              }}
            >
              {day.dayNumber && (
                <>
                  <div className={cn(
                    "text-sm font-bold mb-2 flex items-center justify-between",
                    day.isWeekend && "text-muted-foreground",
                    holiday && "text-rose-600 dark:text-rose-400",
                    isToday && "text-primary"
                  )}>
                    <span className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-full transition-all",
                      isToday && "bg-primary text-primary-foreground shadow-lg"
                    )}>
                      {day.dayNumber}
                    </span>
                    {dayLeaves.length > 0 && (
                      <Badge variant="secondary" className="text-xs h-5 px-1.5">
                        {dayLeaves.length}
                      </Badge>
                    )}
                  </div>
                  
                  {holiday && (
                    <HoverCard openDelay={100}>
                      <HoverCardTrigger asChild>
                        <div className="text-xs text-white font-bold mb-2 p-2 bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg shadow-md truncate flex items-center gap-1.5 cursor-pointer hover:from-rose-600 hover:to-rose-700 hover:shadow-lg transition-all duration-200 hover:scale-105">
                          <Calendar className="h-3.5 w-3.5 flex-shrink-0 animate-pulse" />
                          <span className="truncate">{holiday.name}</span>
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
                  
                  <div className="space-y-1.5">
                    {dayLeaves.slice(0, 3).map((leave, leaveIdx) => {
                      const colors = getLeaveColor(leave.leave_type, leave.status);
                      return (
                        <HoverCard key={leave.id} openDelay={200}>
                          <HoverCardTrigger asChild>
                            <div
                              className={cn(
                                "text-xs px-2 py-1.5 rounded-lg text-white cursor-pointer truncate transition-all duration-200 shadow-sm",
                                colors.color,
                                colors.hoverColor,
                                "hover:scale-105 hover:shadow-md"
                              )}
                              style={{
                                animationDelay: `${(index * 20) + (leaveIdx * 50)}ms`,
                                animation: 'slideIn 0.3s ease-out forwards'
                              }}
                            >
                              <div className="flex items-center gap-1.5">
                                <User className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate font-medium">{leave.employee.split(' ')[0]}</span>
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
                            <div className={cn("p-3 text-white", colors.color)}>
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  {leave.employee}
                                </h4>
                                <Badge 
                                  variant={leave.status === 'APPROVED' ? 'default' : 'secondary'}
                                  className="shadow-sm"
                                >
                                  {leave.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4 space-y-3 bg-background">
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                                <span className="text-xs text-muted-foreground font-medium">Type:</span>
                                <span className={cn("text-sm font-semibold", colors.textColor)}>{leave.leave_type}</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Duration:
                                </span>
                                <span className="text-sm font-semibold">{leave.days} day{leave.days > 1 ? 's' : ''}</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                                <span className="text-xs text-muted-foreground font-medium">From:</span>
                                <span className="text-sm font-semibold">
                                  {new Date(leave.start_date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                                <span className="text-xs text-muted-foreground font-medium">To:</span>
                                <span className="text-sm font-semibold">
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
                    {dayLeaves.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center py-1 bg-muted/30 rounded-md font-medium hover:bg-muted/50 transition-colors cursor-pointer">
                        +{dayLeaves.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
