import React, { useState, useEffect } from 'react';
import { HRData, Employee, Department, AttendanceRecord, LeaveRequest, LeaveStatus } from './types';
import { loadData, saveData } from './services/storage';
import { Users, Building2, Calendar, DollarSign, LayoutDashboard, FileText, Menu, X, LogOut } from 'lucide-react';

import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import DepartmentManagement from './components/DepartmentManagement';
import AttendanceTracking from './components/AttendanceTracking';
import LeaveManagement from './components/LeaveManagement';
import PayrollManagement from './components/PayrollManagement';

type View = 'dashboard' | 'employees' | 'departments' | 'attendance' | 'leaves' | 'payroll';

const App: React.FC = () => {
  const [data, setData] = useState<HRData>(loadData());
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar

  // Persist data on change
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Handlers
  const handleAddEmployee = (emp: Employee) => setData(prev => ({ ...prev, employees: [...prev.employees, emp] }));
  const handleUpdateEmployee = (emp: Employee) => setData(prev => ({ ...prev, employees: prev.employees.map(e => e.id === emp.id ? emp : e) }));
  const handleDeleteEmployee = (id: string) => setData(prev => ({ ...prev, employees: prev.employees.filter(e => e.id !== id) }));
  
  const handleAddDepartment = (dept: Department) => setData(prev => ({ ...prev, departments: [...prev.departments, dept] }));
  
  const handleMarkAttendance = (record: AttendanceRecord) => {
    setData(prev => {
      // Remove existing for same day/emp if any
      const filtered = prev.attendance.filter(a => !(a.employeeId === record.employeeId && a.date === record.date));
      return { ...prev, attendance: [...filtered, record] };
    });
  };

  const handleRequestLeave = (req: LeaveRequest) => setData(prev => ({ ...prev, leaveRequests: [...prev.leaveRequests, req] }));
  const handleUpdateLeaveStatus = (id: string, status: LeaveStatus) => {
    setData(prev => ({
      ...prev,
      leaveRequests: prev.leaveRequests.map(r => r.id === id ? { ...r, status } : r)
    }));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'leaves', label: 'Leaves', icon: FileText },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">HR</div>
             <h1 className="text-xl font-bold tracking-wide">HRMS Pro</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id as View); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
           <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
             <LogOut size={20} />
             <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header (Mobile Only mostly) */}
        <header className="bg-white border-b border-gray-200 p-4 flex md:hidden items-center justify-between shadow-sm z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-800">{navItems.find(n => n.id === currentView)?.label}</span>
          <div className="w-8" /> {/* Spacer */}
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && <Dashboard data={data} />}
            {currentView === 'employees' && (
              <EmployeeManagement 
                employees={data.employees} 
                departments={data.departments}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                onDeleteEmployee={handleDeleteEmployee}
              />
            )}
            {currentView === 'departments' && (
              <DepartmentManagement 
                departments={data.departments}
                employees={data.employees}
                onAddDepartment={handleAddDepartment}
              />
            )}
            {currentView === 'attendance' && (
              <AttendanceTracking 
                employees={data.employees}
                attendance={data.attendance}
                onMarkAttendance={handleMarkAttendance}
              />
            )}
            {currentView === 'leaves' && (
              <LeaveManagement 
                requests={data.leaveRequests}
                employees={data.employees}
                onRequestLeave={handleRequestLeave}
                onUpdateStatus={handleUpdateLeaveStatus}
              />
            )}
            {currentView === 'payroll' && (
              <PayrollManagement employees={data.employees} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;