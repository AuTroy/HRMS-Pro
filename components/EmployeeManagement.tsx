import React, { useState } from 'react';
import { Employee, Department } from '../types';
import { Plus, Search, Edit2, Trash2, User, Mail, Briefcase, Calendar, DollarSign, X } from 'lucide-react';

interface Props {
  employees: Employee[];
  departments: Department[];
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

const EmployeeManagement: React.FC<Props> = ({ employees, departments, onAddEmployee, onUpdateEmployee, onDeleteEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    email: '',
    position: '',
    departmentId: '',
    salary: 0,
    hireDate: ''
  });

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (emp?: Employee) => {
    if (emp) {
      setEditingEmployee(emp);
      setFormData(emp);
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        email: '',
        position: '',
        departmentId: departments[0]?.id || '',
        salary: 0,
        hireDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      onUpdateEmployee({ ...editingEmployee, ...formData } as Employee);
    } else {
      onAddEmployee({
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      } as Employee);
    }
    setIsModalOpen(false);
  };

  const getDepartmentName = (id: string) => departments.find(d => d.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Employee Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search employees by name, email, or position..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Position</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Joined</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {emp.name.charAt(0)}
                      </div>
                      <div className="font-medium text-gray-900">{emp.name}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{emp.position}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                      {getDepartmentName(emp.departmentId)}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{emp.email}</td>
                  <td className="p-4 text-gray-600 text-sm">{emp.hireDate}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(emp)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDeleteEmployee(emp.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No employees found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User size={16} /> Full Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail size={16} /> Email Address
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Briefcase size={16} /> Position
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={formData.position}
                    onChange={e => setFormData({...formData, position: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Briefcase size={16} /> Department
                  </label>
                  <select
                    required
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={formData.departmentId}
                    onChange={e => setFormData({...formData, departmentId: e.target.value})}
                  >
                    <option value="" disabled>Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign size={16} /> Monthly Salary (PHP)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={formData.salary}
                    onChange={e => setFormData({...formData, salary: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar size={16} /> Hire Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={formData.hireDate}
                    onChange={e => setFormData({...formData, hireDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors"
                >
                  {editingEmployee ? 'Update Employee' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;