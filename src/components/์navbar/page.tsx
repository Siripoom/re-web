'use client';
import { useState } from 'react';

export default function Navbar() {
  const [language, setLanguage] = useState<'en' | 'th'>('en');

  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'th' : 'en';
    setLanguage(newLang);
    console.log('Selected language:', newLang);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md shadow-gray-300">
      <div className="text-xl font-bold text-gray-800">Ruby Real Estate</div>
      <div className="hidden md:flex items-center space-x-6">
        <a href="/home" className="text-gray-800 hover:text-red-700 font-medium">Home</a>
        <a href="/product" className="text-gray-800 hover:text-red-700 font-medium">Product</a>
        <a href="/aboutUs" className="text-gray-800 hover:text-red-700 font-medium">About Us</a>
        <a href="/contactUs" className="text-gray-800 hover:text-red-700 font-medium">Contact Us</a>
        <a href="#" className="text-gray-800 hover:text-red-700 font-medium">Login/Register</a>

        {/* Language Toggle */}
        <div className="switch">
          <label className="switch__wrapper">
            <input
              type="checkbox"
              checked={language === 'th'}
              onChange={handleLanguageToggle}
            />
            <span className="switch__slider"></span>
            <div></div>
          </label>
        </div>
      </div>
    </nav>
  );
}