import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Edit2, Trash2, X, Calendar as CalendarIcon, Clock } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    appointmentId: '',
    patient: '',
    doctor: '',
    date: '',
    time: '',
    status: 'Scheduled',
    symptoms: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchDropdownData();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [patRes, docRes] = await Promise.all([
        api.get('/patients'),
        api.get('/doctors')
      ]);
      setPatients(patRes.data);
      setDoctors(docRes.data);
    } catch (err) {
      console.error('Failed to fetch patients/doctors', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      appointmentId: '', patient: '', doctor: '', date: '', time: '', 
      status: 'Scheduled', symptoms: '', notes: ''
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (appt) => {
    setIsEditing(true);
    setCurrentId(appt._id);
    
    // Format date for input type="date"
    const dateObj = new Date(appt.date);
    const formattedDate = dateObj.toISOString().split('T')[0];

    setFormData({
      appointmentId: appt.appointmentId,
      patient: appt.patient?._id || '',
      doctor: appt.doctor?._id || '',
      date: formattedDate,
      time: appt.time,
      status: appt.status,
      symptoms: appt.symptoms,
      notes: appt.notes || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isEditing) {
        await api.put(`/appointments/${currentId}`, formData);
      } else {
        await api.post('/appointments', formData);
      }
      setShowModal(false);
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel and delete this appointment?')) {
      try {
        await api.delete(`/appointments/${id}`);
        fetchAppointments();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const filteredAppointments = appointments.filter(appt => 
    appt.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.appointmentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Completed</span>;
      case 'Cancelled': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Cancelled</span>;
      default: return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Scheduled</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500">Manage hospital appointments and schedules</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-800 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Schedule Appointment
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by patient, doctor, or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="py-3 px-4 font-medium">Patient Info</th>
                <th className="py-3 px-4 font-medium">Doctor Info</th>
                <th className="py-3 px-4 font-medium">Schedule</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">Loading appointments...</td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">No appointments found.</td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
                  <tr key={appt._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900">{appt.patient?.name || 'Unknown Patient'}</p>
                      <p className="text-xs text-slate-500">ID: {appt.appointmentId}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900">{appt.doctor?.name || 'Unknown Doctor'}</p>
                      <p className="text-xs text-slate-500">{appt.doctor?.specialization}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-slate-900 mb-1">
                        <CalendarIcon className="h-4 w-4 text-slate-400" />
                        {new Date(appt.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-900">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {appt.time}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(appt.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(appt)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(appt._id)}
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
                {isEditing ? 'Edit Appointment' : 'Schedule New Appointment'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Appointment ID</label>
                  <input type="text" name="appointmentId" value={formData.appointmentId} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required disabled={isEditing} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Select Patient</label>
                  <select name="patient" value={formData.patient} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required>
                    <option value="">Choose a patient...</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.name} (ID: {p.patientId})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Select Doctor</label>
                  <select name="doctor" value={formData.doctor} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required>
                    <option value="">Choose a doctor...</option>
                    {doctors.map(d => (
                      <option key={d._id} value={d._id}>Dr. {d.name} ({d.specialization})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Symptoms / Reason</label>
                  <textarea name="symptoms" value={formData.symptoms} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" rows="2" required></textarea>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" rows="2"></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800 font-medium transition-colors">
                  {isEditing ? 'Save Changes' : 'Schedule Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
