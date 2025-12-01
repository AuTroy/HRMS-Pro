import React from 'react';
import { HRData, AttendanceStatus } from '../types';
import { Users, Building2, Calendar, DollarSign, Activity } from 'lucide-react';
import { CURRENCY } from '../constants';

interface Props {
  data: HRData;
}

const Dashboard: React.FC<Props> = ({ data }) => {
  const totalEmployees = data.employees.length;
  const totalDepartments = data.departments.length;
  const presentToday = data.attendance.filter(a => 
    a.date === new Date().toISOString().split('T')[0] && 
    a.status === AttendanceStatus.PRESENT
  ).length;
  const pendingLeaves = data.leaveRequests.filter(l => l.status === 'Pending').length;
  
  // Quick Salary Estimate
  const totalPayroll = data.employees.reduce((acc, curr) => acc + curr.salary, 0);

  const stats = [
    { label: 'Total Employees', value: totalEmployees, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Departments', value: totalDepartments, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Present Today', value: presentToday, icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending Leaves', value: pendingLeaves, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to HRMS Pro. Here is your daily overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className={`p-4 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity / Simplified List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Hires</h3>
          <div className="space-y-4">
            {data.employees.slice(0, 3).map(emp => (
              <div key={emp.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {emp.name.charAt(0)}
                  </div>
                <div>
                  <p className="font-medium text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.position}</p>
                </div>
                <div className="ml-auto text-xs text-gray-400">
                  {emp.hireDate}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-xl font-bold mb-2">Estimated Monthly Payroll</h3>
          <div className="flex items-baseline gap-2 mt-4">
             <span className="text-4xl font-bold">
               {new Intl.NumberFormat('en-PH', { style: 'currency', currency: CURRENCY }).format(totalPayroll)}
             </span>
          </div>
          <p className="text-blue-100 text-sm mt-2 opacity-80">
            Base salary total before deductions.
          </p>
          <div className="mt-8 pt-6 border-t border-white/20">
             <div className="flex items-center gap-2 text-sm text-blue-100">
               <DollarSign size={16} />
               <span>Next payout scheduled for month end</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;