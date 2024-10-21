import { useRef, useState, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DiagramComponent,
  Inject,
  BpmnDiagrams,
  ConnectorEditing,
} from '@syncfusion/ej2-react-diagrams';

import DialoguesToolbar from './DialoguesToolbar';
import DialogSpeak from './DialogSpeak';
import DialogEvent from './DialogEvent';
import DialogIntentRefresh from './DialogIntentRefresh';
import { handlePropertyChange, handleSymbolDrag } from './handlers';
import { saveDiagramState, loadDiagramState } from '../../store/diagramSlice';
import { useEditStringMutation } from '../../store'; // Import the hook

// handlers.js

// Dialogues.js

const Dialogues = forwardRef((props, ref) => {
  const [showDialogSpeak, setShowDialogSpeak] = useState(false);
  const [showDialogFireEvent, setShowDialogFireEvent] = useState(false);
  const [showDialogIntentRefresh, setShowDialogIntentRefresh] = useState(false);

  const [selectedIntent, setSelectedIntent] = useState(null);
  const [newNode, setNewNode] = useState(null);
  const [nodes, setNodes] = useState([]); // Initialize nodes state

  const [editString, resultsEdit] = useEditStringMutation();

  const diagramInstanceRef = useRef(null);
  const dispatch = useDispatch();
  const diagramData = useSelector((state) => state.diagram.diagramData);

  // Dispatch the action to load the diagram state from Redux when the component mounts
  useEffect(() => {
    dispatch(loadDiagramState());
  }, [dispatch]);

  // Load the diagram state into the diagram instance after the component mounts and diagramData is available
  useEffect(() => {
    if (diagramInstanceRef.current && diagramData) {
      diagramInstanceRef.current.loadDiagram(diagramData);
      // Manually set the diagram's size and viewport
      diagramInstanceRef.current.fitToPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once

  // Save the diagram state to Redux
  const handleSaveDiagram = () => {
    if (diagramInstanceRef.current) {
      const serializedData = diagramInstanceRef.current.saveDiagram({
        exclude: ['width', 'height', 'viewport'],
      });
      dispatch(saveDiagramState(serializedData));
      localStorage.setItem('diagramData', JSON.stringify(serializedData)); // Save to local storage
    }
  };

  // Save the diagram to a JSON file
  const handleSaveToFile = (args) => {
    if (diagramInstanceRef.current) {
      const serializedData = diagramInstanceRef.current.saveDiagram({
        exclude: ['width', 'height', 'viewport'],
      });
      const blob = new Blob([JSON.stringify(serializedData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.json';
      a.click();
      URL.revokeObjectURL(url);
      console.log('Ayto?', args);
    }
  };

  // Load the diagram from a JSON file
  const handleLoadFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const diagramData = JSON.parse(e.target.result);
        if (diagramInstanceRef.current) {
          diagramInstanceRef.current.loadDiagram(diagramData);
        }
      };
      reader.readAsText(file);
    }
  };

  // Function to add a new node to the nodes array
  const addNewNode = (node) => {
    setNodes((prevNodes) => [...prevNodes, node]);
  };

  // Watch for changes to newNode and add it to nodes array
  useEffect(() => {
    if (newNode) {
      addNewNode(newNode);
    }
  }, [newNode]);

  let content;
  content = (
    <div>
      <DiagramComponent
        id="container"
        width={'100%'}
        height={'800px'} //'calc(100vh - 100px)'
        nodes={nodes} // Pass nodes to DiagramComponent
        drop={(args) =>
          handleSymbolDrag(
            args,
            setShowDialogIntentRefresh,
            setShowDialogSpeak,
            setShowDialogFireEvent
          )
        }
        propertyChange={(args) => handlePropertyChange(args, editString)} // Update the node properties
        ref={(diagram) => {
          diagramInstanceRef.current = diagram;
        }}
        click={handleSaveDiagram} // Save state on collection change
        keyUp={(args = 'Delete' || 'Enter') => {
          handleSaveDiagram();
        }}
      >
        <Inject services={[BpmnDiagrams, ConnectorEditing]} />
      </DiagramComponent>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSaveToFile}
        >
          Save Diagram
        </button>
        <input
          type="file"
          accept=".json"
          className="hidden"
          id="loadDiagramInput"
          onChange={handleLoadFromFile}
        />
        <label
          htmlFor="loadDiagramInput"
          className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Load Diagram
        </label>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 mb-9">{content}</div>
        <div className="w-1/4 mb-9">
          <DialoguesToolbar
            diagramInstanceRef={diagramInstanceRef}
            selectedIntent={selectedIntent}
          />
        </div>
      </div>

      <div>
        <DialogIntentRefresh
          showDialogIntentRefresh={showDialogIntentRefresh}
          setShowDialogIntentRefresh={setShowDialogIntentRefresh}
          selectedIntent={selectedIntent}
          setSelectedIntent={setSelectedIntent}
          diagramInstanceRef={diagramInstanceRef}
          setNewNode={setNewNode}
        />
        <DialogSpeak
          showDialogSpeak={showDialogSpeak}
          setShowDialogSpeak={setShowDialogSpeak}
        />
        <DialogEvent
          showDialogFireEvent={showDialogFireEvent}
          setShowDialogFireEvent={setShowDialogFireEvent}
        />
      </div>
    </div>
  );
});

export default Dialogues;
