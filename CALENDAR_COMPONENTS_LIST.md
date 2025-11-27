# Leave Calendar - Component List

## 📦 Component Inventory

### Page Components

#### 1. LeaveCalendar (Main Page)
**File**: `src/pages/LeaveCalendar.tsx`

**Purpose**: Main container page for the leave calendar system

**Features**:
- Header with title and apply leave button
- Calendar navigation controls
- View mode switching (Monthly/Weekly)
- Conditional rendering of calendar views
- Manager timeline (role-based)
- Legend display
- Apply leave dialog management

**Props**: None (page component)

**State**:
- `currentDate: Date` - Currently displayed date
- `view: "monthly" | "weekly"` - Active view mode
- `showApplyDialog: boolean` - Dialog visibility

**Hooks Used**:
- `useAuth()` - User authentication and role
- `useLeaves()` - Leave data fetching
- `useHolidays()` - Holiday data fetching

---

### Calendar View Components

#### 2. MonthlyCalendar
**File**: `src/components/calendar/MonthlyCalendar.tsx`

**Purpose**: Display month-view calendar with leave visualization

**Props**:
```typescript
interface MonthlyCalendarProps {
  currentDate: Date;      // Month to display
  leaves: Leave[];        // All leave records
  holidays: Holiday[];    // Public holidays
}
```

**Features**:
- 7-column grid (Sun-Sat)
- Day numbers and weekday headers
- Weekend highlighting (gray background)
- Holiday markers (rose background)
- Today indicator (primary ring)
- Multiple leave indicators per day
- Hover tooltips with leave details
- Overflow indicator (+X more)

**Key Functions**:
- `getLeavesForDate(date)` - Filter leaves for specific date
- `getHolidayForDate(date)` - Check if date is holiday
- `getLeaveColor(type, status)` - Determine leave color

**Styling**:
- Grid: `grid-cols-7 gap-2`
- Cell: `min-h-24 border rounded-lg p-2`
- Weekend: `bg-gray-100 dark:bg-gray-900`
- Holiday: `bg-rose-50 dark:bg-rose-950/20 border-rose-300`
- Today: `ring-2 ring-primary`

---

#### 3. WeeklyCalendar
**File**: `src/components/calendar/WeeklyCalendar.tsx`

**Purpose**: Display week-view calendar with detailed leave information

**Props**:
```typescript
interface WeeklyCalendarProps {
  currentDate: Date;      // Week to display
  leaves: Leave[];        // All leave records
  holidays: Holiday[];    // Public holidays
}
```

**Features**:
- 7-day horizontal layout
- Large day numbers for readability
- Full employee names visible
- Leave type labels shown
- Holiday banners
- Hover tooltips with full details
- Weekend and today highlighting

**Key Functions**:
- `getLeavesForDate(date)` - Filter leaves for specific date
- `getHolidayForDate(date)` - Check if date is holiday
- `getLeaveColor(type, status)` - Determine leave color

**Styling**:
- Grid: `grid-cols-7 gap-3`
- Cell: `min-h-64 border rounded-lg p-3`
- Day header: `text-2xl font-bold`
- Leave card: `p-2 rounded text-white`

---

#### 4. ManagerTimeline
**File**: `src/components/calendar/ManagerTimeline.tsx`

**Purpose**: Horizontal timeline showing team member leaves across the month

**Props**:
```typescript
interface ManagerTimelineProps {
  currentDate: Date;      // Month to display
  leaves: Leave[];        // All leave records
  holidays: Holiday[];    // Public holidays
}
```

**Features**:
- Employee list on left side
- Horizontal timeline with day numbers
- Color-coded leave bars
- Leave duration visualization
- Weekend highlighting in timeline
- Holiday indicators
- Leave type abbreviations (CL, SL, WFH)
- Hover tooltips on leave bars

**Key Functions**:
- `getLeavePosition(leave)` - Calculate bar position and width
- `isHoliday(date)` - Check if date is holiday
- `isWeekend(date)` - Check if date is weekend

**Data Processing**:
- Groups leaves by employee using `useMemo`
- Sorts leaves by start date
- Calculates percentage-based positioning

**Styling**:
- Employee name: `w-40 flex-shrink-0`
- Timeline: `flex-1 relative h-10`
- Day cell: `min-width: 30px`
- Leave bar: `h-8 rounded border-2`

---

### Dialog Components

#### 5. ApplyLeaveDialog
**File**: `src/components/calendar/ApplyLeaveDialog.tsx`

**Purpose**: Modal dialog for submitting leave requests

**Props**:
```typescript
interface ApplyLeaveDialogProps {
  open: boolean;                    // Dialog visibility
  onOpenChange: (open: boolean) => void;  // Close handler
}
```

**Features**:
- Leave type selection dropdown
- Start date picker with calendar
- End date picker with calendar
- Optional reason textarea
- Auto-calculated duration display
- Form validation
- Loading states
- Success/error handling

**Form Fields**:
1. **Leave Type** - Select component
   - Fetches from `useLeavePolicies()`
   - Shows paid/unpaid status
   
2. **Start Date** - Calendar popover
   - Disables past dates
   - Uses `date-fns` for formatting
   
3. **End Date** - Calendar popover
   - Disables dates before start date
   - Validates date range
   
4. **Reason** - Textarea (optional)
   - 3 rows
   - Character limit (optional)
   
5. **Duration** - Read-only display
   - Auto-calculated from dates
   - Shows in days

**Validation**:
- Leave type required
- Start and end dates required
- End date must be after start date
- Toast notifications for errors

**Actions**:
- Cancel button (outline variant)
- Submit button (primary variant with loading)

**Hooks Used**:
- `useLeavePolicies()` - Fetch leave types
- `useLeaves()` - Submit leave request
- `useState` - Form state management

**Styling**:
- Max width: `sm:max-w-[500px]`
- Spacing: `space-y-4`
- Duration display: `p-3 bg-muted rounded-lg`

---

## 🎨 Shared UI Components Used

### From shadcn/ui

#### Card Components
- `Card` - Container wrapper
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Subtitle text
- `CardContent` - Main content area

#### Form Components
- `Button` - Action buttons
- `Select` - Dropdown selection
- `Label` - Form labels
- `Textarea` - Multi-line input
- `Calendar` - Date picker

#### Overlay Components
- `Dialog` - Modal dialogs
- `Popover` - Floating popovers
- `HoverCard` - Hover tooltips
- `Tooltip` - Simple tooltips

#### Navigation Components
- `Tabs` - View mode switching
- `TabsList` - Tab container
- `TabsTrigger` - Individual tab
- `TabsContent` - Tab panel

#### Feedback Components
- `Badge` - Status indicators
- `Loader2` - Loading spinner (from lucide-react)
- Toast notifications (via sonner)

---

## 🔧 Utility Functions

### Color Utilities

#### getLeaveColor
```typescript
const getLeaveColor = (leaveType: string, status: string) => {
  if (status === 'PENDING') return 'bg-yellow-500';
  if (status === 'APPROVED') {
    if (leaveType.toLowerCase().includes('casual')) return 'bg-blue-500';
    if (leaveType.toLowerCase().includes('sick')) return 'bg-red-500';
    if (leaveType.toLowerCase().includes('wfh')) return 'bg-purple-500';
    return 'bg-green-500';
  }
  return 'bg-gray-400';
};
```

**Used in**: MonthlyCalendar, WeeklyCalendar, ManagerTimeline

**Purpose**: Determine background color based on leave type and status

---

### Date Utilities

#### getLeavesForDate
```typescript
const getLeavesForDate = (date: Date) => {
  const dateStr = date.toISOString().split('T')[0];
  return leaves.filter(leave => {
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);
    return date >= start && date <= end;
  });
};
```

**Used in**: MonthlyCalendar, WeeklyCalendar

**Purpose**: Filter leaves that fall on a specific date

---

#### getHolidayForDate
```typescript
const getHolidayForDate = (date: Date) => {
  const dateStr = date.toISOString().split('T')[0];
  return holidays.find(h => h.date === dateStr);
};
```

**Used in**: MonthlyCalendar, WeeklyCalendar, ManagerTimeline

**Purpose**: Check if a date is a public holiday

---

#### isWeekend
```typescript
const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
```

**Used in**: MonthlyCalendar, WeeklyCalendar, ManagerTimeline

**Purpose**: Check if a date falls on weekend

---

## 📊 Data Flow

### Component Data Flow
```
LeaveCalendar (Page)
    │
    ├─→ useAuth() ────────────→ currentUser, role
    ├─→ useLeaves() ──────────→ leaves[], isLoading
    ├─→ useHolidays() ────────→ holidays[], isLoading
    │
    ├─→ MonthlyCalendar
    │   └─→ Props: currentDate, leaves, holidays
    │
    ├─→ WeeklyCalendar
    │   └─→ Props: currentDate, leaves, holidays
    │
    ├─→ ManagerTimeline (if manager)
    │   └─→ Props: currentDate, leaves, holidays
    │
    └─→ ApplyLeaveDialog
        ├─→ useLeavePolicies() → policies[]
        └─→ useLeaves() ───────→ applyLeave()
```

---

## 🎯 Component Responsibilities

### LeaveCalendar (Page)
- ✅ State management (date, view mode)
- ✅ Navigation controls
- ✅ View switching
- ✅ Role-based rendering
- ✅ Dialog management
- ❌ Leave rendering (delegated to child components)
- ❌ Date calculations (delegated to child components)

### MonthlyCalendar
- ✅ Month grid generation
- ✅ Day cell rendering
- ✅ Leave visualization
- ✅ Tooltip content
- ❌ Navigation (handled by parent)
- ❌ Data fetching (receives via props)

### WeeklyCalendar
- ✅ Week grid generation
- ✅ Day column rendering
- ✅ Detailed leave cards
- ✅ Tooltip content
- ❌ Navigation (handled by parent)
- ❌ Data fetching (receives via props)

### ManagerTimeline
- ✅ Employee grouping
- ✅ Timeline rendering
- ✅ Leave bar positioning
- ✅ Duration calculation
- ❌ Navigation (handled by parent)
- ❌ Data fetching (receives via props)

### ApplyLeaveDialog
- ✅ Form state management
- ✅ Form validation
- ✅ Date selection
- ✅ Leave submission
- ✅ Error handling
- ❌ Dialog visibility (controlled by parent)

---

## 🎨 Styling Patterns

### Consistent Patterns Used

#### Card Structure
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### Loading State
```tsx
{isLoading ? (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
) : (
  {/* Content */}
)}
```

#### Hover Tooltip
```tsx
<HoverCard>
  <HoverCardTrigger asChild>
    <div className="cursor-pointer">
      {/* Trigger element */}
    </div>
  </HoverCardTrigger>
  <HoverCardContent className="w-80">
    {/* Tooltip content */}
  </HoverCardContent>
</HoverCard>
```

#### Conditional Styling
```tsx
className={cn(
  "base-classes",
  condition && "conditional-classes",
  anotherCondition && "more-classes"
)}
```

---

## 📱 Responsive Behavior

### MonthlyCalendar
- Mobile: Smaller cells, reduced padding
- Tablet: Standard grid
- Desktop: Full grid with hover effects

### WeeklyCalendar
- Mobile: Horizontal scroll
- Tablet: Smaller day cells
- Desktop: Full 7-column layout

### ManagerTimeline
- Mobile: Horizontal scroll, stacked layout
- Tablet: Reduced employee name width
- Desktop: Full timeline with all features

### ApplyLeaveDialog
- Mobile: Full screen
- Tablet: 90% width
- Desktop: 500px max width

---

## 🔄 Component Lifecycle

### Mount
1. Page loads → Fetch leaves and holidays
2. Render loading state
3. Data arrives → Render calendar
4. User interactions → Update state

### Update
1. Date navigation → Re-render with new date
2. View switch → Render different component
3. New leave applied → Refetch data
4. Real-time updates → Query invalidation

### Unmount
1. Cleanup subscriptions
2. Cancel pending requests
3. Clear local state

---

## 🧪 Testing Considerations

### Unit Tests
- Date utility functions
- Color determination logic
- Leave filtering
- Position calculations

### Component Tests
- Render with mock data
- User interactions
- Form validation
- Error states

### Integration Tests
- Full calendar flow
- Apply leave process
- Navigation between views
- Role-based rendering

---

## 📦 Export Structure

### Index File
**File**: `src/components/calendar/index.ts`

```typescript
export { MonthlyCalendar } from './MonthlyCalendar';
export { WeeklyCalendar } from './WeeklyCalendar';
export { ManagerTimeline } from './ManagerTimeline';
export { ApplyLeaveDialog } from './ApplyLeaveDialog';
```

**Purpose**: Barrel export for clean imports

**Usage**:
```typescript
import { 
  MonthlyCalendar, 
  WeeklyCalendar, 
  ManagerTimeline, 
  ApplyLeaveDialog 
} from '@/components/calendar';
```

---

## 🎓 Component Best Practices Applied

1. **Single Responsibility**: Each component has one clear purpose
2. **Props Interface**: Explicit TypeScript interfaces
3. **Composition**: Small, reusable components
4. **Controlled Components**: Parent controls state
5. **Error Boundaries**: Graceful error handling
6. **Loading States**: Clear feedback during async operations
7. **Accessibility**: Semantic HTML and ARIA labels
8. **Performance**: Memoization where needed
9. **Maintainability**: Clear naming and structure
10. **Documentation**: Inline comments for complex logic

---

This component list provides a complete reference for all calendar-related components, their responsibilities, and how they work together to create the leave calendar system.
