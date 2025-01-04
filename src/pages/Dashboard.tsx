import React from 'react';
import Navbar from '../components/Navbar';
import DashboardHero from '../components/DashboardHero';

const Dashboard: React.FC = () => {

  return (

    <div className="min-h-screen">
      <header className=" shadow">
        <Navbar />
      </header>


      <main className="max-w-7xl mx-auto p-4">

        <DashboardHero />

      </main>


    </div>
  );
};

export default Dashboard;