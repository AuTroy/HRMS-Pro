import { HRData, AttendanceStatus, LeaveStatus, LeaveType } from './types';

export const INITIAL_DATA: HRData = {
  departments: [
    { id: 'd1', name: 'IT Department', managerId: 'e1', description: 'Technology and Development' },
    { id: 'd2', name: 'Human Resources', managerId: 'e2', description: 'Employee Relations and Recruiting' },
    { id: 'd3', name: 'Sales', managerId: 'e3', description: 'Revenue and Customer Acquisition' },
    { id: 'd4', name: 'Marketing', managerId: 'e4', description: 'Brand and Outreach' },
  ],
  employees: [
    { 
      id: 'e1', 
      name: 'Troy Au', 
      email: 'troy.au@hrms.com', 
      position: 'Senior Developer', 
      departmentId: 'd1', 
      salary: 85000, 
      hireDate: '2022-01-15' 
    },
    { 
      id: 'e2', 
      name: 'Julius Simon', 
      email: 'julius.simon@hrms.com', 
      position: 'HR Manager', 
      departmentId: 'd2', 
      salary: 75000, 
      hireDate: '2021-03-10' 
    },
    { 
      id: 'e3', 
      name: 'Charles Sinacay', 
      email: 'charles.sinacay@hrms.com', 
      position: 'Sales Representative', 
      departmentId: 'd3', 
      salary: 45000, 
      hireDate: '2023-06-01' 
    },
    { 
      id: 'e4', 
      name: 'Jake Valdez', 
      email: 'jake.valdez@hrms.com', 
      position: 'Marketing Lead', 
      departmentId: 'd4', 
      salary: 65000, 
      hireDate: '2022-08-20' 
    },
  ],
  attendance: [
    { id: 'a1', employeeId: 'e1', date: new Date().toISOString().split('T')[0], status: AttendanceStatus.PRESENT, checkInTime: '08:55' },
    { id: 'a2', employeeId: 'e2', date: new Date().toISOString().split('T')[0], status: AttendanceStatus.PRESENT, checkInTime: '09:00' },
  ],
  leaveRequests: [
    { 
      id: 'l1', 
      employeeId: 'e3', 
      type: LeaveType.SICK, 
      startDate: '2023-10-01', 
      endDate: '2023-10-03', 
      reason: 'Flu and fever', 
      status: LeaveStatus.APPROVED 
    }
  ],
  payroll: []
};

export const APP_NAME = "HRMS Pro";
export const CURRENCY = "PHP";