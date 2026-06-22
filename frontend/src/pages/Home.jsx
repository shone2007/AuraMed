import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, Clock, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-secondary text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-primary opacity-20 rounded-full blur-3xl mix-blend-multiply"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 lg:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Advanced Healthcare <br className="hidden md:block" />
            <span className="text-primary">At Your Fingertips</span>
          </h1>
          <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            A comprehensive, secure, and modern hospital management portal designed for seamless interaction between patients, doctors, and administration.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition-colors text-lg">
              Access Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose AuraMed?</h2>
            <p className="mt-4 text-lg text-slate-600">Built for modern medical institutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto h-14 w-14 bg-blue-50 flex items-center justify-center rounded-full mb-6">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Role-Based Access</h3>
              <p className="text-slate-600">Secure and tailored portals for Administrators, Doctors, and Patients.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto h-14 w-14 bg-blue-50 flex items-center justify-center rounded-full mb-6">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Scheduling</h3>
              <p className="text-slate-600">Efficient appointment booking and queue management system.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto h-14 w-14 bg-blue-50 flex items-center justify-center rounded-full mb-6">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Records</h3>
              <p className="text-slate-600">Enterprise-grade security for medical records and billing information.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
