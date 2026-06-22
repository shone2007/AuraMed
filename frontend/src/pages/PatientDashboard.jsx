import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, FileText, HeartPulse } from 'lucide-react';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get('/appointments');
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><HeartPulse className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Patient Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="bg-blue-50 p-3 rounded-lg"><Calendar className="h-6 w-6 text-primary" /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Book Appointment</h3>
            <p className="text-sm text-slate-500">Schedule a new visit</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="bg-blue-50 p-3 rounded-lg"><FileText className="h-6 w-6 text-primary" /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">View Medical Records</h3>
            <p className="text-sm text-slate-500">Access your past prescriptions</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
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
                  <tr key={appt._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{appt.doctor?.name}</td>
                    <td className="px-6 py-4">{new Date(appt.date).toLocaleDateString()} at {appt.time}</td>
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
    </div>
  );
};

export default PatientDashboard;
