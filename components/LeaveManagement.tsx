import React, { useState } from 'react';
import { LeaveRequest, Employee, LeaveType, LeaveStatus } from '../types';
import { Calendar, Check, X, Clock, FileText } from 'lucide-react';

interface Props {
  requests: LeaveRequest[];
  employees: Employee[];
  onRequestLeave: (req: LeaveRequest) => void;
  onUpdateStatus: (id: string, status: LeaveStatus) => void;
}

const LeaveManagement: React.FC<Props> = ({ requests, employees, onRequestLeave, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'apply'>('requests');
  const [formData, setFormData] = useState<Partial<LeaveRequest>>({
    employeeId: '',
    type: LeaveType.SICK,
    startDate: '',
    endDate: '',
    reason: ''
  });

  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Unknown';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestLeave({
      id: Math.random().toString(36).substr(2, 9),
      status: LeaveStatus.PENDING,
      ...formData
    } as LeaveRequest);
    setActiveTab('requests');
    setFormData({ ...formData, reason: '', startDate: '', endDate: '' });
  };

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED: return 'bg-green-100 text-green-700';
      case LeaveStatus.REJECTED: return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Leave Management</h2>
        <div className="flex bg-white p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'requests' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'apply' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Apply for Leave
          </button>
        </div>
      </div>

      {activeTab === 'requests' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Dates</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map(req => (
                <tr key={req.id}>
                  <td className="p-4 font-medium text-gray-900">{getEmployeeName(req.employeeId)}</td>
                  <td className="p-4 text-gray-600">{req.type}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {req.startDate} <span className="text-gray-400">to</span> {req.endDate}
                  </td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{req.reason}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {req.status === LeaveStatus.PENDING && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onUpdateStatus(req.id, LeaveStatus.APPROVED)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => onUpdateStatus(req.id, LeaveStatus.REJECTED)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No leave requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Submit Leave Request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
              <select
                required
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.employeeId}
                onChange={e => setFormData({...formData, employeeId: e.target.value})}
              >
                <option value="">Select Employee</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  required
                  type="date"
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  required
                  type="date"
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select
                required
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as LeaveType})}
              >
                {Object.values(LeaveType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                required
                rows={3}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.reason}
                onChange={e => setFormData({...formData, reason: e.target.value})}
                placeholder="Brief description of the reason..."
              />
            </div>

            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md">
              Submit Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;