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
            {/* Removed space between items */}
            <li className="mb-0">
              {' '}
              {/* Further reduced margin between items */}
              <div className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                <i className="fas fa-cog mr-3"></i>
                <Link to="/dialogues" className="flex-grow">
                  Dialogues
                </Link>
              </div>
            </li>
            <li className="mb-0">
              {' '}
              {/* Further reduced margin between items */}
              <div className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                <i className="fas fa-home mr-3"></i>
                <Link to="/entities" className="flex-grow">
                  Entities
                </Link>
              </div>
            </li>
            <li className="mb-0">
              {' '}
              {/* Further reduced margin between items */}
              <div className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                <i className="fas fa-home mr-3"></i>
                <Link to="/synonyms" className="flex-grow">
                  Synonym
                </Link>
              </div>
            </li>
            <li className="mb-0">
              {' '}
              {/* Further reduced margin between items */}
              <div className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                <i className="fas fa-home mr-3"></i>
                <Link to="/globalSlots" className="flex-grow">
                  Global Slots
                </Link>
              </div>
            </li>
            <li className="mb-0">
              {' '}
              {/* Further reduced margin between items */}
              <div className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                <i className="fas fa-home mr-3"></i>
                <Link to="/services" className="flex-grow">
                  Services
                </Link>
              </div>
            </li>
            <li className="mb-0">
              {' '}
              {/* Further reduced margin between items */}
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
                    <Link
                      to="/intents"
                      className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 transition-colors duration-200"
                    >
                      <i className="fas fa-circle mr-3 text-xs"></i>
                      Intents
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/events"
                      className="flex items-center py-1.5 px-4 rounded hover:bg-gray-800 transition-colors duration-200"
                    >
                      <i className="fas fa-circle mr-3 text-xs"></i>
                      Events
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
