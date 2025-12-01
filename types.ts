export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late'
}

export enum LeaveType {
  SICK = 'Sick Leave',
  CASUAL = 'Casual Leave',
  ANNUAL = 'Annual Leave'
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface Department {
  id: string;
  name: string;
  managerId: string; // ID of the employee who is the manager
  description: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  departmentId: string;
  salary: number;
  hireDate: string; // ISO date string
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  status: AttendanceStatus;
  checkInTime?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string; // YYYY-MM
  basicSalary: number;
  deductions: {
    tax: number;
    sss: number;
    philhealth: number;
    other: number;
  };
  netSalary: number;
  generatedDate: string;
}

export interface HRData {
  employees: Employee[];
  departments: Department[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payroll: PayrollRecord[];
}