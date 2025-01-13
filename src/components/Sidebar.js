import { useState } from 'react';
import Link from './Link';

function Sidebar() {
  const [activeLink, setActiveLink] = useState('/dialogues'); // Default active link

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const isActive = (link) => link === activeLink;

  return (
    <div className="sidebar bg-gray-900 text-white w-50 p-4 h-screen top-0 transform shadow-lg">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">Chat Builder</h2>
            <p className="mt-1 text-sm text-gray-400">Welcome!</p>
          </div>
          <ul className="space-y-0">
            <li className="mb-0">
              <Link
                to="/dialogues"
                isActive={isActive('/dialogues')}
                onClick={() => handleLinkClick('/dialogues')}
              >
                <i className="fas fa-cog mr-3"></i>
                Dialogues
              </Link>
            </li>
            <li className="mb-0">
              <Link
                to="/entities"
                isActive={isActive('/entities')}
                onClick={() => handleLinkClick('/entities')}
              >
                <i className="fas fa-home mr-3"></i>
                Entities
              </Link>
            </li>
            <li className="mb-0">
              <Link
                to="/synonyms"
                isActive={isActive('/synonyms')}
                onClick={() => handleLinkClick('/synonyms')}
              >
                <i className="fas fa-home mr-3"></i>
                Synonyms
              </Link>
            </li>
            <li className="mb-0">
              <Link
                to="/globalSlots"
                isActive={isActive('/globalSlots')}
                onClick={() => handleLinkClick('/globalSlots')}
              >
                <i className="fas fa-home mr-3"></i>
                Global Slots
              </Link>
            </li>
            <li className="mb-0">
              <Link
                to="/formSlots"
                isActive={isActive('/formSlots')}
                onClick={() => handleLinkClick('/formSlots')}
              >
                <i className="fas fa-home mr-3"></i>
                Form Slots
              </Link>
            </li>

            <li className="mb-0">
              <Link
                to="/services"
                isActive={isActive('/services')}
                onClick={() => handleLinkClick('/services')}
              >
                <i className="fas fa-home mr-3"></i>
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                isActive={isActive('/events')}
                onClick={() => handleLinkClick('/events')}
              >
                <i className="fas fa-circle mr-3 text-xs"></i>
                Events
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-center">
          <p className="mt-8 text-xs text-gray-500">
            &copy; 2023 Thesis. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
