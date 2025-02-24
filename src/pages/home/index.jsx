import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Don Branson</h1>
            <p className="text-xl text-gray-600 mb-8">AI Engineer & Solutions Architect</p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Versatile professional with over two decades of expertise in AI engineering, solutions architecture, and business solution implementation.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="https://github.com/donbr" className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700">GitHub</a>
              <a href="https://www.linkedin.com/in/donbranson/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">About Me</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 leading-relaxed mb-4">
              Based in Southern California, I'm a solutions architect and AI engineer with comprehensive expertise spanning program management, 
              architecture, development, and business solution implementation. I specialize in delivering outcomes across diverse industries 
              including travel and transportation, public sector, life sciences, telecommunications, and insurance.
            </p>
            <p className="text-gray-600 leading-relaxed">
              I'm particularly focused on cutting-edge AI technologies including generative AI, large language models, and computer vision, 
              with a strong emphasis on responsible AI development and deployment.
            </p>
          </div>
        </div>
      </section>

      {/* Additional sections would be added here */}
    </div>
  );
}

export default HomePage;
