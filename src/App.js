import Sidebar from './components/Sidebar';
import Route from './components/Route';
import Dialogues from './components/Dialogues/Dialogues';
import './App.css';
import ServicesList from './components/Pages/ServicesList';
import EventsList from './components/Pages/EventsList';
import EntitiesList from './components/Pages/EntitiesList';
import SynonymsList from './components/Pages/SynonymsList';
import GlobalSlotsList from './components/Pages/GlobalSlotsList';
import FormSlotsList from './components/Pages/FormSlotsList';
import Button from './components/modules/Button';
import getStartedImage from './get_started.png';
import Link from './components/Link'; // Import Link component

function App() {
  return (
    <div className="flex bg-gray-100 max-h-screen">
      {/* Sidebar */}
      <div className="flex-0 overflow-y-auto">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Route path="/dialogues">
            <Dialogues />
          </Route>
          <Route path="/events">
            <EventsList />
          </Route>
          <Route path="/services">
            <ServicesList />
          </Route>
          <Route path="/entities">
            <EntitiesList />
          </Route>
          <Route path="/synonyms">
            <SynonymsList />
          </Route>
          <Route path="/globalSlots">
            <GlobalSlotsList />
          </Route>
          <Route path="/formSlots">
            <FormSlotsList />
          </Route>
          <Route path="/">
            <div className="relative h-full w-full flex items-center justify-center">
              <img
                src={getStartedImage}
                alt="Get Started"
                className="absolute inset-0 w-full h-full object-cover blur-lg brightness-75"
              />
              <div className="absolute flex flex-col items-center justify-center p-8 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30">
                <h1 className="text-3xl font-semibold text-white mb-4">
                  Welcome to Chat Builder
                </h1>
                <Link to="/dialogues">
                  <Button
                    primary
                    rounded
                    className="px-6 py-3 text-lg font-bold transition-transform transform hover:scale-105 hover:bg-blue-600 hover:text-white shadow-lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </Route>
        </div>
      </div>
    </div>
  );
}

export default App;
