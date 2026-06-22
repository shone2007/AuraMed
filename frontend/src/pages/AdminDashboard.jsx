import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Stethoscope, CalendarDays, Receipt, HeartPulse } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      {trend && (
        <p className={`text-xs mt-2 font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}% from last month
        </p>
      )}
    </div>
    <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
      <Icon className="h-6 w-6 text-primary" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock chart data for presentation
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [docsRes, patsRes, apptsRes, billsRes] = await Promise.all([
          api.get('/doctors'),
          api.get('/patients'),
          api.get('/appointments'),
          api.get('/bills')
        ]);
        
        const totalRevenue = billsRes.data.reduce((acc, bill) => acc + (bill.totalAmount || 0), 0);

        setStats({
          doctors: docsRes.data.length,
          patients: patsRes.data.length,
          appointments: apptsRes.data.length,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const generateReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Doctors,${stats.doctors}\n`
      + `Total Patients,${stats.patients}\n`
      + `Total Appointments,${stats.appointments}\n`
      + `Total Revenue,$${stats.revenue}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hospital_Summary_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><HeartPulse className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Hospital performance and metrics</p>
        </div>
        <button 
          onClick={generateReport}
          className="bg-primary text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-800 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Receipt className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Doctors" value={stats.doctors} icon={Stethoscope} trend={5} />
        <StatCard title="Total Patients" value={stats.patients} icon={Users} trend={12} />
        <StatCard title="Appointments" value={stats.appointments} icon={CalendarDays} trend={-2} />
        <StatCard title="Total Revenue" value={`$${stats.revenue}`} icon={Receipt} trend={8} />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Analytics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{fill: '#F1F5F9'}} 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="revenue" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <HeartPulse className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-800 font-medium">New appointment scheduled</p>
                  <p className="text-xs text-slate-500 mt-1">Patient Jane Doe with Dr. Smith</p>
                  <p className="text-xs text-slate-400 mt-1">{i * 15} mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
