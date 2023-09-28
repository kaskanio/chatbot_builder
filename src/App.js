import Sidebar from './components/Sidebar';
import IntentsList from './components/IntentsList';
import Route from './components/Route';
import Dialogues from './components/Dialogues';

function App() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="flex-0 overflow-y-auto">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="bg-white h-16 sticky top-0 shadow flex flex-col justify-center px-4 sm:px-8">
          <h1 className="text-lg font-semibold text-indigo-800 text-center">
            Main Content
          </h1>
        </div>
        <div className="flex-1 p-4 sm:p-8">
          <Route path="/intents">
            <IntentsList />
          </Route>
          <Route path="/dialogues">
            <Dialogues />
          </Route>
        </div>
      </div>
    </div>
  );
}

export default App;
