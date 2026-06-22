import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Edit2, Trash2, X, Receipt, Download } from 'lucide-react';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    billId: '',
    patient: '',
    doctor: '',
    appointment: '',
    consultationFee: 0,
    medicineFee: 0,
    laboratoryFee: 0,
    paymentStatus: 'Unpaid'
  });

  useEffect(() => {
    fetchBills();
    fetchDropdownData();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bills');
      setBills(res.data);
    } catch (err) {
      console.error('Failed to fetch bills', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [patRes, docRes, apptRes] = await Promise.all([
        api.get('/patients'),
        api.get('/doctors'),
        api.get('/appointments')
      ]);
      setPatients(patRes.data);
      setDoctors(docRes.data);
      setAppointments(apptRes.data);
    } catch (err) {
      console.error('Failed to fetch patients/doctors/appointments', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      billId: '', patient: '', doctor: '', appointment: '',
      consultationFee: 0, medicineFee: 0, laboratoryFee: 0, paymentStatus: 'Unpaid'
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (bill) => {
    setIsEditing(true);
    setCurrentId(bill._id);
    
    setFormData({
      billId: bill.billId,
      patient: bill.patient?._id || '',
      doctor: bill.doctor?._id || '',
      appointment: bill.appointment?._id || '',
      consultationFee: bill.consultationFee,
      medicineFee: bill.medicineFee,
      laboratoryFee: bill.laboratoryFee,
      paymentStatus: bill.paymentStatus
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isEditing) {
        await api.put(`/bills/${currentId}`, formData);
      } else {
        await api.post('/bills', formData);
      }
      setShowModal(false);
      fetchBills();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(`/bills/${id}`);
        fetchBills();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const downloadInvoice = (bill) => {
    // Simple CSV download logic
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Invoice ID,Patient,Doctor,Consultation Fee,Medicine Fee,Lab Fee,Total,Status\n"
      + `${bill.billId},${bill.patient?.name},${bill.doctor?.name},${bill.consultationFee},${bill.medicineFee},${bill.laboratoryFee},${bill.totalAmount},${bill.paymentStatus}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Invoice_${bill.billId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBills = bills.filter(bill => 
    bill.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.billId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing & Invoices</h1>
          <p className="text-sm text-slate-500">Manage hospital billing and payments</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-800 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Generate Bill
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by patient or Invoice ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="py-3 px-4 font-medium">Invoice Info</th>
                <th className="py-3 px-4 font-medium">Patient</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">Loading bills...</td>
                </tr>
              ) : filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">No bills found.</td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                          <Receipt className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">INV-{bill.billId}</p>
                          <p className="text-xs text-slate-500">{new Date(bill.generatedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-slate-900">{bill.patient?.name || 'Unknown Patient'}</p>
                      <p className="text-xs text-slate-500">Dr. {bill.doctor?.name || 'Unknown'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-lg font-bold text-slate-900">${bill.totalAmount}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bill.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {bill.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => downloadInvoice(bill)}
                          className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          title="Download Invoice"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(bill)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(bill._id)}
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
                {isEditing ? 'Edit Bill' : 'Generate New Bill'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Invoice ID</label>
                  <input type="text" name="billId" value={formData.billId} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required disabled={isEditing} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Patient</label>
                  <select name="patient" value={formData.patient} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required disabled={isEditing}>
                    <option value="">Select patient...</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Doctor</label>
                  <select name="doctor" value={formData.doctor} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required disabled={isEditing}>
                    <option value="">Select doctor...</option>
                    {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Related Appointment (Optional)</label>
                  <select name="appointment" value={formData.appointment} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" disabled={isEditing}>
                    <option value="">No specific appointment</option>
                    {appointments.filter(a => a.patient?._id === formData.patient).map(a => (
                      <option key={a._id} value={a._id}>{new Date(a.date).toLocaleDateString()} - {a.time}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Consultation Fee ($)</label>
                  <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required min="0" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Medicine Fee ($)</label>
                  <input type="number" name="medicineFee" value={formData.medicineFee} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required min="0" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Laboratory Fee ($)</label>
                  <input type="number" name="laboratoryFee" value={formData.laboratoryFee} onChange={handleInputChange} className="w-full p-2 border border-slate-200 rounded-md" required min="0" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Total ($)</label>
                  <div className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-900">
                    {Number(formData.consultationFee) + Number(formData.medicineFee) + Number(formData.laboratoryFee)}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800 font-medium transition-colors">
                  {isEditing ? 'Save Changes' : 'Generate Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
