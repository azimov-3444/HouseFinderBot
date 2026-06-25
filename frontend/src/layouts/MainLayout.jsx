import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AiChatBot from '../components/AiChatBot';
import BotpressWebchat from '../components/BotpressWebchat';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative">
      <Navbar />
      
      {/* Main scrolling viewport */}
      <main className="flex-grow pt-24 pb-12">
        <Outlet />
      </main>

      <Footer />
      
      {/* AI Assistant Floating Widget */}
      <AiChatBot />
      <BotpressWebchat />
    </div>
  );
};

export default MainLayout;
