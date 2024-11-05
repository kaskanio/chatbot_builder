import { useState } from 'react';
import Link from './Link';

function Sidebar() {
  const [isTriggersOpen, setIsTriggersOpen] = useState(true); // Start open

  const toggleTriggers = () => {
    setIsTriggersOpen(!isTriggersOpen);
  };

  return (
    <div className="sidebar bg-gray-900 text-white w-64 p-4 h-screen top-0 transform shadow-lg">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Chat Builder</h2>
            <p className="mt-2 text-sm text-gray-400">Welcome!</p>
          </div>
          <ul className="space-y-0">
            {' '}
            <li className="mb-0">
              {' '}
              <Link to="/dialogues" className="flex-grow">
                <div className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                  <i className="fas fa-cog mr-3"></i>
                  Dialogues
                </div>
              </Link>
            </li>
            <li className="mb-0">
              {' '}
              <Link to="/entities" className="flex-grow">
                <div className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                  <i className="fas fa-home mr-3"></i>
                  Entities
                </div>
              </Link>
            </li>
            <li className="mb-0">
              {' '}
              <Link to="/synonyms" className="flex-grow">
                <div className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                  <i className="fas fa-home mr-3"></i>
                  Synonyms
                </div>
              </Link>
            </li>
            <li className="mb-0">
              {' '}
              <Link to="/globalSlots" className="flex-grow">
                <div className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                  <i className="fas fa-home mr-3"></i>
                  Global Slots
                </div>
              </Link>
            </li>
            <li className="mb-0">
              {' '}
              <Link to="/services" className="flex-grow">
                <div className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                  <i className="fas fa-home mr-3"></i>
                  Services
                </div>
              </Link>
            </li>
            <li className="mb-0">
              {' '}
              <div
                className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                onClick={toggleTriggers}
              >
                <i className="fas fa-bell mr-3"></i>
                Triggers
                <i
                  className={`fas ml-auto ${
                    isTriggersOpen ? 'fa-chevron-up' : 'fa-chevron-down'
                  }`}
                ></i>
              </div>
              {isTriggersOpen && (
                <ul className="pl-8 space-y-1 border-l border-gray-700 mt-1">
                  {' '}
                  {/* Further reduced space between submenu items */}
                  <li>
                    <Link to="/intents">
                      <div className="flex items-center py-1.5 rounded hover:bg-gray-800 transition-colors duration-200">
                        <i className="fas fa-circle mr-3 text-xs"></i>
                        Intents
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/events">
                      <div className="flex items-center py-1.5 rounded hover:bg-gray-800 transition-colors duration-200">
                        <i className="fas fa-circle mr-3 text-xs"></i>
                        Events
                      </div>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
        <div className="text-center">
          <p className="mt-8 text-xs text-gray-500">
            &copy; 2023 Your Thesis. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
