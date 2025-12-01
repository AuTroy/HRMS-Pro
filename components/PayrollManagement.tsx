import React, { useState } from 'react';
import { Employee, PayrollRecord } from '../types';
import { CURRENCY } from '../constants';
import { Download } from 'lucide-react';

interface Props {
  employees: Employee[];
}

const PayrollManagement: React.FC<Props> = ({ employees }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const calculatePayroll = (emp: Employee): PayrollRecord => {
    // Simplified Philippine Payroll Logic
    const basic = emp.salary;
    const tax = basic * 0.10; // Flat 10% for demo
    const sss = basic * 0.045; // 4.5%
    const philhealth = basic * 0.04; // 4%
    const deductions = { tax, sss, philhealth, other: 0 };
    const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
    
    return {
      id: `pay_${emp.id}_${selectedMonth}`,
      employeeId: emp.id,
      month: selectedMonth,
      basicSalary: basic,
      deductions,
      netSalary: basic - totalDeductions,
      generatedDate: new Date().toISOString()
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: CURRENCY }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Payroll Management</h2>
        <input
          type="month"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Basic Salary</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Tax (10%)</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">SSS (4.5%)</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">PhilHealth (4%)</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right text-blue-600">Net Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map(emp => {
                const payroll = calculatePayroll(emp);
                return (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{emp.name}</div>
                      <div className="text-xs text-gray-500">{emp.position}</div>
                    </td>
                    <td className="p-4 text-right text-gray-600 font-mono">{formatCurrency(payroll.basicSalary)}</td>
                    <td className="p-4 text-right text-red-500 font-mono text-xs">-{formatCurrency(payroll.deductions.tax)}</td>
                    <td className="p-4 text-right text-red-500 font-mono text-xs">-{formatCurrency(payroll.deductions.sss)}</td>
                    <td className="p-4 text-right text-red-500 font-mono text-xs">-{formatCurrency(payroll.deductions.philhealth)}</td>
                    <td className="p-4 text-right font-bold text-green-700 font-mono">{formatCurrency(payroll.netSalary)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="text-sm font-semibold text-blue-800 mb-1">Total Payout</h4>
          <p className="text-2xl font-bold text-blue-900">
            {formatCurrency(employees.reduce((acc, emp) => acc + calculatePayroll(emp).netSalary, 0))}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h4 className="text-sm font-semibold text-red-800 mb-1">Total Deductions</h4>
          <p className="text-2xl font-bold text-red-900">
             {formatCurrency(employees.reduce((acc, emp) => {
               const p = calculatePayroll(emp);
               return acc + p.deductions.tax + p.deductions.sss + p.deductions.philhealth;
             }, 0))}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center justify-center">
           <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 shadow-sm transition-all">
             <Download size={18} />
             Export Payroll Report
           </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollManagement;