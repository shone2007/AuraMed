import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Edit2, Trash2, X, User } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
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
    patientId: '',
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: '',
    phone: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  });

  useEffect(() => {
    fetchPatients();
    fetchUsers();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
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
      user: '', patientId: '', name: '', age: '', gender: 'Male', 
      bloodGroup: '', phone: '', address: '', 
      emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: ''
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (patient) => {
    setIsEditing(true);
    setCurrentId(patient._id);
    setFormData({
      user: patient.user?._id || '',
      patientId: patient.patientId,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      phone: patient.phone,
      address: patient.address,
      emergencyContactName: patient.emergencyContact?.name || '',
      emergencyContactPhone: patient.emergencyContact?.phone || '',
      emergencyContactRelation: patient.emergencyContact?.relation || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Construct payload
    const payload = {
      user: formData.user,
      patientId: formData.patientId,
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      address: formData.address,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relation: formData.emergencyContactRelation
      }
    };

    try {
      if (isEditing) {
        await api.put(`/patients/${currentId}`, payload);
      } else {
        await api.post('/patients', payload);
      }
      setShowModal(false);
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.delete(`/patients/${id}`);
        fetchPatients();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const filteredPatients = patients.filter(pat => 
    pat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pat.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pat.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Management</h1>
          <p className="text-sm text-slate-500">Manage hospital patients and their details</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-800 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search patients by name, ID or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="py-3 px-4 font-medium">Patient Info</th>
                <th className="py-3 px-4 font-medium">Details</th>
                <th className="py-3 px-4 font-medium">Contact</th>
                <th className="py-3 px-4 font-medium">Emergency</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">Loading patients...</td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">No patients found.</td>
                </tr>
              ) : (
                filteredPatients.map((pat) => (
                  <tr key={pat._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                          {pat.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{pat.name}</p>
                          <p className="text-xs text-slate-500">ID: {pat.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-slate-900">{pat.age} yrs, {pat.gender}</p>
                      <p className="text-xs font-semibold text-red-500">Blood: {pat.bloodGroup}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-slate-900">{pat.phone}</p>
                      <p className="text-xs text-slate-500 max-w-[150px] truncate">{pat.address}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-slate-900">{pat.emergencyContact?.name || 'N/A'}</p>
                      <p className="text-xs text-slate-500">{pat.emergencyContact?.phone || 'N/A'} ({pat.emergencyContact?.relation || '-'})</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(pat)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(pat._id)}
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
                {isEditing ? 'Edit Patient' : 'Add New Patient'}
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
                  <label className="text-sm font-medium text-slate-700">Patient ID</label>
                  <input type="text" name="patientId" value={formData.patientId} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required disabled={isEditing} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Blood Group</label>
                  <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required placeholder="e.g. O+, A-" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" rows="2" required></textarea>
                </div>
                
                <div className="md:col-span-2 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">Name</label>
                      <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">Phone</label>
                      <input type="text" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">Relation</label>
                      <input type="text" name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800 font-medium transition-colors">
                  {isEditing ? 'Save Changes' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
