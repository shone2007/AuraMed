import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Edit2, Trash2, X, User } from 'lucide-react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    user: '',
    doctorId: '',
    name: '',
    specialization: '',
    qualification: '',
    experience: '',
    phone: '',
    email: '',
    consultationFee: ''
  });

  useEffect(() => {
    fetchDoctors();
    fetchUsers();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      // Filter only users with Doctor role if possible, or all for now
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      user: '', doctorId: '', name: '', specialization: '', 
      qualification: '', experience: '', phone: '', email: '', consultationFee: ''
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (doctor) => {
    setIsEditing(true);
    setCurrentId(doctor._id);
    setFormData({
      user: doctor.user?._id || '',
      doctorId: doctor.doctorId,
      name: doctor.name,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      phone: doctor.phone,
      email: doctor.email,
      consultationFee: doctor.consultationFee
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEditing) {
        await api.put(`/doctors/${currentId}`, formData);
      } else {
        await api.post('/doctors', formData);
      }
      setShowModal(false);
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.doctorId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctor Management</h1>
          <p className="text-sm text-slate-500">Manage hospital doctors and their details</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-800 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Doctor
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search doctors by name, ID or specialization..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="py-3 px-4 font-medium">Doctor Info</th>
                <th className="py-3 px-4 font-medium">Specialization</th>
                <th className="py-3 px-4 font-medium">Contact</th>
                <th className="py-3 px-4 font-medium">Fee</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">Loading doctors...</td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">No doctors found.</td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr key={doc._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold">
                          {doc.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{doc.name}</p>
                          <p className="text-xs text-slate-500">ID: {doc.doctorId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-slate-900">{doc.specialization}</p>
                      <p className="text-xs text-slate-500">{doc.experience}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-slate-900">{doc.phone}</p>
                      <p className="text-xs text-slate-500">{doc.email}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-900 font-medium">
                      ${doc.consultationFee}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(doc)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Link User Account</label>
                  <select 
                    name="user" 
                    value={formData.user} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  >
                    <option value="">Select a user...</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Doctor ID</label>
                  <input 
                    type="text" 
                    name="doctorId" 
                    value={formData.doctorId} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-200 rounded-md"
                    required 
                    disabled={isEditing}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Specialization</label>
                  <input type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Qualification</label>
                  <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Experience (e.g., "10 Years")</label>
                  <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Consultation Fee ($)</label>
                  <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800 font-medium transition-colors">
                  {isEditing ? 'Save Changes' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
