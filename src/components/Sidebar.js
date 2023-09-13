import Link from './Link';

function Sidebar() {
  return (
    <div className="sidebar bg-gray-900 text-white w-72 p-4 h-screen top-0 transform">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Chat Builder</h2>
            <p className="mt-2 text-sm">Welcome!</p>
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                to="/intents"
                className="flex items-center py-2 px-4 rounded hover:bg-gray-800"
              >
                <i className="fas fa-home mr-3"></i>
                Intents
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center py-2 px-4 rounded hover:bg-gray-800"
              >
                <i className="fas fa-cog mr-3"></i>
                Settings
              </Link>
            </li>
            <li>
              <Link
                to="/users"
                className="flex items-center py-2 px-4 rounded hover:bg-gray-800"
              >
                <i className="fas fa-user mr-3"></i>
                Users
              </Link>
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
