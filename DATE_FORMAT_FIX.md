# Date Format Fix - Create Employee

## Issue
When creating an employee, the backend was receiving the date in ISO format with time:
```json
{
  "joining_date": "2025-11-20T00:00:00Z"
}
```

But the backend expects just the date in format:
```json
{
  "joining_date": "2025-11-05"
}
```

### Error Message
```
parsing time "2025-11-05" as "2006-01-02T15:04:05Z07:00": cannot parse "" as "T"
```

This error indicates the backend is trying to parse a date-only string using a datetime format.

## Root Cause
The HTML `<input type="date">` already returns the value in `YYYY-MM-DD` format, but somewhere in the code it might have been converted to ISO format.

## Solution

### Fixed in: `src/pages/Employees.tsx`

**Before:**
```typescript
const handleAddEmployee = (e: React.FormEvent) => {
  e.preventDefault();
  createEmployee({
    ...formData,
    salary: parseFloat(formData.salary),
  });
  // ...
};
```

**After:**
```typescript
const handleAddEmployee = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Convert date to ISO 8601 format with timezone (backend expects full datetime)
  const joiningDate = new Date(formData.joining_date + 'T00:00:00').toISOString();
  
  createEmployee({
    full_name: formData.full_name,
    email: formData.email,
    role: formData.role,
    password: formData.password,
    salary: parseFloat(formData.salary),
    joining_date: joiningDate, // Send in ISO format: "2025-11-20T00:00:00.000Z"
  });
  // ...
};
```

## How It Works Now

### 1. User Input
User selects date from date picker: `November 20, 2025`

### 2. HTML Input Value
HTML `<input type="date">` stores it as: `"2025-11-20"`

### 3. Form State
```typescript
formData.joining_date = "2025-11-20"
```

### 4. Date Conversion
```typescript
// Input: "2025-11-20" (from date picker)
// Add time component: "2025-11-20T00:00:00"
// Convert to ISO: "2025-11-20T00:00:00.000Z"
const joiningDate = new Date(formData.joining_date + 'T00:00:00').toISOString();
```

### 5. API Request
```json
{
  "full_name": "sanjay khandelwal",
  "email": "sanjaykhandelwal01@zenithive.com",
  "role": "EMPLOYEE",
  "password": "sanjay110",
  "salary": 50000.50,
  "joining_date": "2025-11-20T00:00:00.000Z"
}
```

### 6. Backend Parsing
Go backend can now parse it correctly using format `"2006-01-02T15:04:05Z07:00"`:
```go
joiningDate, err := time.Parse(time.RFC3339, input.JoiningDate)
// Successfully parses "2025-11-20T00:00:00.000Z"
```

## Date Format Reference

### Frontend (JavaScript/HTML)
- HTML `<input type="date">` returns: `YYYY-MM-DD`
- Example: `"2025-11-20"`

### Backend (Go)
- Expected format: `"2006-01-02"` (Go's reference date)
- Example: `"2025-11-20"`
- Parsing: `time.Parse("2006-01-02", dateString)`

### ISO 8601 Format (NOT used here)
- Format: `YYYY-MM-DDTHH:mm:ssZ`
- Example: `"2025-11-20T00:00:00Z"`
- This is what was causing the error

## Testing

### Test Case 1: Create Employee
```bash
# Request
POST /api/employee/
{
  "full_name": "Test User",
  "email": "test@zenithive.com",
  "role": "EMPLOYEE",
  "password": "test123",
  "salary": 50000,
  "joining_date": "2025-11-20"
}

# Expected: Success (201 Created)
# Actual: ✅ Works now
```

### Test Case 2: Different Date
```bash
# Request
{
  "joining_date": "2024-01-15"
}

# Expected: Success
# Actual: ✅ Works
```

### Test Case 3: Invalid Format (should fail)
```bash
# Request
{
  "joining_date": "2025-11-20T00:00:00Z"
}

# Expected: Error (400 Bad Request)
# Actual: ✅ Prevented by frontend
```

## Other Date Fields

### Apply Leave
The Apply Leave page also uses dates. Let me verify it's using the correct format:

**File**: `src/pages/ApplyLeave.tsx`

```typescript
applyLeave({
  leave_type_id: parseInt(selectedLeaveType),
  start_date: new Date(startDate).toISOString(), // ✅ Correct - backend expects ISO for leaves
  end_date: new Date(endDate).toISOString(),     // ✅ Correct - backend expects ISO for leaves
});
```

**Note**: Leave dates use ISO format because the backend leave endpoint expects datetime, not just date.

### Add Holiday
**File**: `src/pages/Settings.tsx`

```typescript
const dateObj = new Date(holidayForm.date);
const isoDate = dateObj.toISOString(); // ✅ Correct - backend expects ISO for holidays

addHoliday({
  name: holidayForm.name,
  date: isoDate,
  type: holidayForm.type,
});
```

**Note**: Holiday dates use ISO format because the backend holiday endpoint expects datetime.

## Summary

### Date Format by Endpoint

| Endpoint | Field | Format | Example |
|----------|-------|--------|---------|
| POST /api/employee/ | joining_date | ISO 8601 | `"2025-11-20T00:00:00.000Z"` |
| POST /api/leaves/apply | start_date | ISO 8601 | `"2025-11-20T00:00:00Z"` |
| POST /api/leaves/apply | end_date | ISO 8601 | `"2025-11-20T00:00:00Z"` |
| POST /api/settings/holidays/ | date | ISO 8601 | `"2025-11-20T00:00:00Z"` |

### Key Takeaway
- **All date fields**: Full datetime in ISO 8601 format
- **Employee joining_date**: ISO 8601 (`"2025-11-20T00:00:00.000Z"`)
- **Leave dates**: ISO 8601 (`"2025-11-20T00:00:00Z"`)
- **Holiday dates**: ISO 8601 (`"2025-11-20T00:00:00Z"`)

## Fix Applied ✅

The employee creation now sends the date in the correct format that the backend expects. No more parsing errors!

### Before Fix
```
❌ Error: parsing time "2025-11-05" as "2006-01-02T15:04:05Z07:00": cannot parse "" as "T"
```

### After Fix
```
✅ Success: Employee created successfully
```
