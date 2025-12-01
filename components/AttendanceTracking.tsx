import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus, Employee } from '../types';
import { Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  employees: Employee[];
  attendance: AttendanceRecord[];
  onMarkAttendance: (record: AttendanceRecord) => void;
}

const AttendanceTracking: React.FC<Props> = ({ employees, attendance, onMarkAttendance }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getRecord = (empId: string) => attendance.find(a => a.employeeId === empId && a.date === selectedDate);

  const handleMark = (empId: string, status: AttendanceStatus) => {
    const existing = getRecord(empId);
    const newRecord: AttendanceRecord = {
      id: existing ? existing.id : Math.random().toString(36).substr(2, 9),
      employeeId: empId,
      date: selectedDate,
      status,
      checkInTime: status === AttendanceStatus.PRESENT ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : undefined
    };
    onMarkAttendance(newRecord);
  };

  const getStatusColor = (status?: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT: return 'bg-green-100 text-green-700 border-green-200';
      case AttendanceStatus.ABSENT: return 'bg-red-100 text-red-700 border-red-200';
      case AttendanceStatus.LATE: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Daily Attendance</h2>
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <input
            type="date"
            className="bg-transparent outline-none text-gray-700 font-medium"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-4">Employee</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-2">Check In</div>
          <div className="col-span-3 text-right">Action</div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {employees.map(emp => {
            const record = getRecord(emp.id);
            return (
              <div key={emp.id} className="grid grid-cols-12 p-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-4 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{emp.name}</p>
                    <p className="text-xs text-gray-500">{emp.position}</p>
                  </div>
                </div>
                
                <div className="col-span-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record?.status)}`}>
                    {record?.status || 'Not Marked'}
                  </span>
                </div>
                
                <div className="col-span-2 text-sm text-gray-600 font-mono">
                  {record?.checkInTime || '--:--'}
                </div>
                
                <div className="col-span-3 flex justify-end gap-2">
                  <button
                    onClick={() => handleMark(emp.id, AttendanceStatus.PRESENT)}
                    className={`p-2 rounded-lg transition-all ${record?.status === AttendanceStatus.PRESENT ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'}`}
                    title="Mark Present"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleMark(emp.id, AttendanceStatus.LATE)}
                    className={`p-2 rounded-lg transition-all ${record?.status === AttendanceStatus.LATE ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600'}`}
                    title="Mark Late"
                  >
                    <Clock size={18} />
                  </button>
                  <button
                    onClick={() => handleMark(emp.id, AttendanceStatus.ABSENT)}
                    className={`p-2 rounded-lg transition-all ${record?.status === AttendanceStatus.ABSENT ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600'}`}
                    title="Mark Absent"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracking;