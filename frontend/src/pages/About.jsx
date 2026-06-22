import React from 'react';

const About = () => {
  return (
    <div className="py-20 bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">About AuraMed</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            AuraMed is a state-of-the-art Hospital Management System designed to streamline healthcare operations.
          </p>
        </div>
        <div className="prose prose-lg mx-auto text-slate-600">
          <p>
            Our mission is to empower healthcare professionals with cutting-edge tools to manage patients, 
            doctors, appointments, and billing seamlessly. By digitizing hospital workflows, we reduce administrative 
            burdens and allow medical staff to focus on what matters most: patient care.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
              <h3 className="font-bold text-xl text-slate-900 mb-2">Modern</h3>
              <p>Built with the latest technologies for speed and reliability.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
              <h3 className="font-bold text-xl text-slate-900 mb-2">Secure</h3>
              <p>Enterprise-grade security to protect sensitive medical data.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
              <h3 className="font-bold text-xl text-slate-900 mb-2">Efficient</h3>
              <p>Streamlined workflows that save hours of administrative work.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
