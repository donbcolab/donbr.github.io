import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p>&copy; {currentYear} Don Branson. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
