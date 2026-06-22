import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { Calendar, FileText, HeartPulse, X, Plus, Clock, FileWarning } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const { user } = useContext(AuthContext);

  // Modals state
  const [showBookModal, setShowBookModal] = useState(false);
  const [showRecordsModal, setShowRecordsModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    symptoms: ''
  });

  // Mock Medical Records Data
  const mockMedicalRecords = [
    { id: 1, date: '15/5/2026', doctor: 'Dr. Sarah Jenkins', diagnosis: 'Viral Fever', prescription: 'Paracetamol 500mg, Rest for 3 days' },
    { id: 2, date: '10/4/2026', doctor: 'Dr. Marcus Chen', diagnosis: 'Routine Checkup', prescription: 'Multivitamins' },
    { id: 3, date: '22/1/2026', doctor: 'Dr. Elena Rodriguez', diagnosis: 'Mild Asthma', prescription: 'Inhaler as needed' }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [apptRes, docRes] = await Promise.all([
          api.get('/appointments'),
          api.get('/doctors')
        ]);
        setAppointments(apptRes.data);
        setDoctors(docRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    
    // Find the selected doctor's name
    const selectedDoc = doctors.find(d => d._id === formData.doctor);
    
    // Create a mock new appointment for the UI
    const newAppointment = {
      _id: Math.random().toString(36).substr(2, 9),
      doctor: { name: selectedDoc ? `Dr. ${selectedDoc.name}` : 'Selected Doctor' },
      date: formData.date,
      time: formData.time,
      status: 'Scheduled'
    };

    // Update local state to immediately show it
    setAppointments([...appointments, newAppointment]);
    
    // Close modal and reset form
    setShowBookModal(false);
    setFormData({ doctor: '', date: '', time: '', symptoms: '' });
    
    // Show a success alert
    alert('Appointment booked successfully!');
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><HeartPulse className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Patient Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => setShowBookModal(true)}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
        >
          <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors"><Calendar className="h-6 w-6 text-primary" /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">Book Appointment</h3>
            <p className="text-sm text-slate-500">Schedule a new visit</p>
          </div>
        </div>
        
        <div 
          onClick={() => setShowRecordsModal(true)}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
        >
          <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors"><FileText className="h-6 w-6 text-primary" /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">View Medical Records</h3>
            <p className="text-sm text-slate-500">Access your past prescriptions</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">My Appointments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-medium">Doctor</th>
                <th className="px-6 py-3 font-medium">Date & Time</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No upcoming appointments</td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{appt.doctor?.name}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {new Date(appt.date).toLocaleDateString()} at {appt.time}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${appt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Book Appointment</h2>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleBookAppointment} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Select Doctor</label>
                <select 
                  name="doctor" 
                  value={formData.doctor} 
                  onChange={handleInputChange} 
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  required
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map(d => (
                    <option key={d._id} value={d._id}>Dr. {d.name} ({d.specialization})</option>
                  ))}
                  {doctors.length === 0 && (
                    <option value="mock-doc-1">Dr. Sarah Jenkins (General)</option>
                  )}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Time</label>
                  <input 
                    type="time" 
                    name="time" 
                    value={formData.time} 
                    onChange={handleInputChange} 
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Symptoms / Reason for Visit</label>
                <textarea 
                  name="symptoms" 
                  value={formData.symptoms} 
                  onChange={handleInputChange} 
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" 
                  rows="3" 
                  placeholder="Briefly describe your symptoms..."
                  required
                ></textarea>
              </div>

              <div className="mt-6 pt-4 flex gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowBookModal(false)} 
                  className="flex-1 px-4 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-800 font-medium transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Medical Records Modal */}
      {showRecordsModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileWarning className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-slate-900">My Medical Records</h2>
              </div>
              <button onClick={() => setShowRecordsModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-50/50 flex-1">
              <div className="space-y-4">
                {mockMedicalRecords.map((record) => (
                  <div key={record.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:border-blue-100 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 border-b border-slate-50 pb-3">
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <Clock className="h-4 w-4" />
                        {record.date}
                      </div>
                      <div className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                        {record.doctor}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Diagnosis</span>
                        <p className="text-slate-900 font-medium mt-1">{record.diagnosis}</p>
                      </div>
                      
                      <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                          <Plus className="h-3 w-3" /> Prescription
                        </span>
                        <p className="text-slate-800 mt-1 text-sm">{record.prescription}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-white">
              <button 
                onClick={() => setShowRecordsModal(false)} 
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Close Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
