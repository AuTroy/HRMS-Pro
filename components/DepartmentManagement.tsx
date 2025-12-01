import React, { useState } from 'react';
import { Department, Employee } from '../types';
import { Plus, Users, Layout, ChevronRight, Briefcase } from 'lucide-react';

interface Props {
  departments: Department[];
  employees: Employee[];
  onAddDepartment: (dept: Department) => void;
}

const DepartmentManagement: React.FC<Props> = ({ departments, employees, onAddDepartment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDept, setNewDept] = useState<Partial<Department>>({
    name: '',
    managerId: '',
    description: ''
  });

  const getManagerName = (id: string) => employees.find(e => e.id === id)?.name || 'Unassigned';
  const getEmployeeCount = (deptId: string) => employees.filter(e => e.departmentId === deptId).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDepartment({
      id: Math.random().toString(36).substr(2, 9),
      ...newDept
    } as Department);
    setIsModalOpen(false);
    setNewDept({ name: '', managerId: '', description: '' });
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Create Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <div key={dept.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <Briefcase size={24} />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {getEmployeeCount(dept.id)} Employees
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">{dept.name}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{dept.description}</p>
            
            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                {getManagerName(dept.managerId).charAt(0)}
              </div>
              <div>
                <p className="text-xs text-gray-500">Manager</p>
                <p className="text-sm font-medium text-gray-800">{getManagerName(dept.managerId)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Dept Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
             <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Create New Department</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input
                  required
                  type="text"
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newDept.name}
                  onChange={e => setNewDept({...newDept, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newDept.description}
                  onChange={e => setNewDept({...newDept, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Manager</label>
                <select
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newDept.managerId}
                  onChange={e => setNewDept({...newDept, managerId: e.target.value})}
                >
                  <option value="">Select an Employee</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Create Department
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;