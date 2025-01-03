import React from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Paneli</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
          >
            Çıkış Yap
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Hoş Geldiniz, {user?.username}!</h2>
        {/* Buraya admin panelinizin içeriğini ekleyebilirsiniz */}
        <div className="bg-white p-6 rounded shadow">
          <p>Admin panelinin içerikleri burada yer alacak.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;