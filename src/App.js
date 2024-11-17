import Sidebar from './components/Sidebar';
import IntentsList from './components/Pages/IntentsList';
import Route from './components/Route';
import Dialogues from './components/Dialogues/Dialogues';
import './App.css';
import ServicesList from './components/Pages/ServicesList';
import EventsList from './components/Pages/EventsList';
import EntitiesList from './components/Pages/EntitiesList';
import SynonymsList from './components/Pages/SynonymsList';
import GlobalSlotsList from './components/Pages/GlobalSlotsList';
import FormSlotsList from './components/Pages/FormSlotsList';

function App() {
  return (
    <div className="flex bg-gray-100 max-h-screen">
      {/* Sidebar */}
      <div className="flex-0 overflow-y-auto">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* <div className="bg-white h-16 sticky top-0 shadow flex items-center justify-center px-4 sm:px-8">
          <h1 className="text-lg font-semibold text-indigo-800 text-center">
            Main Content
          </h1>
        </div> */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Route path="/intents">
            <IntentsList />
          </Route>
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
        </div>
      </div>
    </div>
  );
}

export default App;
