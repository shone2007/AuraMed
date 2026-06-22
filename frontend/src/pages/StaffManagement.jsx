import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Trash2, X, UserCog, User, Mail, Shield } from 'lucide-react';

const StaffManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Doctor'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      // Filter out patients so we only see staff (Admins and Doctors)
      const staffUsers = res.data.filter(u => u.role === 'Admin' || u.role === 'Doctor');
      setUsers(staffUsers);
    } catch (err) {
      console.error('Failed to fetch staff', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setFormData({ name: '', email: '', password: '', role: 'Doctor' });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Use the public registration endpoint to create the user account
      // Note: In a production app, there might be a specific protected endpoint for admins to create users
      await api.post('/auth/register', formData);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this staff account?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user', err);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-sm text-slate-500">Securely create and manage Doctor and Admin accounts</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-800 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Staff
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search staff by name, email or role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="py-3 px-4 font-medium">User Info</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium">Created At</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-500">Loading staff data...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-500">No staff members found.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${u.role === 'Admin' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDelete(u._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 rounded-t-xl">
              <div className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-slate-900">Add New Staff</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">{error}</div>}
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <User className="h-4 w-4 text-slate-400" /> Full Name
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" required placeholder="Dr. Jane Smith" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <Mail className="h-4 w-4 text-slate-400" /> Email Address
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" required placeholder="jane@hospital.com" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <Shield className="h-4 w-4 text-slate-400" /> Password
                  </label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" required minLength="6" placeholder="Temporary password" />
                </div>
                
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-slate-700">Assign Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center gap-2 transition-all ${formData.role === 'Doctor' ? 'border-primary bg-blue-50 text-primary ring-1 ring-primary' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                      <input type="radio" name="role" value="Doctor" checked={formData.role === 'Doctor'} onChange={handleInputChange} className="sr-only" />
                      <span className="font-medium">Doctor</span>
                    </label>
                    <label className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center gap-2 transition-all ${formData.role === 'Admin' ? 'border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                      <input type="radio" name="role" value="Admin" checked={formData.role === 'Admin'} onChange={handleInputChange} className="sr-only" />
                      <span className="font-medium">Admin</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 flex gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-800 font-medium transition-colors disabled:opacity-70">
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
