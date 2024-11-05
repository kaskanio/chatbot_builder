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
import DialogIntent from './DialogIntent';
import {
  handlePropertyChange,
  handleSymbolDrag,
  handleCollectionChange,
} from './handlers';
import { saveDiagramState, loadDiagramState } from '../../store/diagramSlice';
import {
  useFetchAllStringsQuery,
  useEditStringMutation,
  useAddStringMutation,
  useRemoveStringMutation,
} from '../../store'; // Import the hook

const Dialogues = forwardRef((props, ref) => {
  const [nodes, setNodes] = useState([]);
  const [showDialogSpeak, setShowDialogSpeak] = useState(false);
  const [showDialogFireEvent, setShowDialogFireEvent] = useState(false);
  const [showDialogIntentRefresh, setShowDialogIntentRefresh] = useState(false);

  const [selectedIntent, setSelectedIntent] = useState(null);
  const [newNode, setNewNode] = useState(null);

  const diagramInstanceRef = useRef(null);
  const dispatch = useDispatch();
  const diagramData = useSelector((state) => state.diagram.diagramData);

  const [previousStringsData, setPreviousStringsData] = useState(null);
  const { data: stringsData } = useFetchAllStringsQuery();
  const [editString] = useEditStringMutation();
  const [addString] = useAddStringMutation();
  const [removeString] = useRemoveStringMutation();

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
  }, []); // Add diagramData as a dependency

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
          setNodes(diagramData.nodes || []); // Update nodes state with loaded data
        }
      };
      reader.readAsText(file);
    }
  };

  // Function to add a new node to the nodes array
  const addNewNode = (node) => {
    diagramInstanceRef.current.addNode(node);
  };

  // Watch for changes to newNode and add it to nodes array
  useEffect(() => {
    if (newNode) {
      addNewNode(newNode);
    }
  }, [newNode]);

  // Function to fetch data from server and update nodes
  const handleFetchFromServer = (args) => {
    if (diagramInstanceRef.current && stringsData) {
      let currentNodes = args.diagram.nodes;
      console.log('Current nodes: ', currentNodes);
      console.log('Strings data:', stringsData);

      // Update the nodes with the latest strings data
      const updatedNodes = currentNodes.map((node) => {
        if (node.shape && node.shape.enumerationShape) {
          const updatedEnumerationShape =
            node.shape.enumerationShape.members.map((enumMember) => {
              const matchingString = stringsData.find(
                (string) => string.name === enumMember.name
              );
              if (matchingString && matchingString.value !== enumMember.value) {
                return { ...enumMember, value: matchingString.value };
              }
              return enumMember;
            });
          return {
            ...node,
            shape: {
              ...node.shape,
              enumerationShape: updatedEnumerationShape,
            },
          };
        }
        return node;
      });
      console.log('Updated nodes: ', updatedNodes);
      // setNodes(updatedNodes);
      // console.log('Nodes updated:', updatedNodes);
      // diagramInstanceRef.current.loadDiagram({ nodes: updatedNodes });
    }
  };

  let content;
  content = (
    <div>
      <DiagramComponent
        id="container"
        width={'100%'}
        height={'800px'} //'calc(100vh - 100px)'
        drop={(args) =>
          handleSymbolDrag(
            args,
            setShowDialogIntentRefresh,
            setShowDialogSpeak,
            setShowDialogFireEvent
          )
        }
        collectionChange={(args) => {
          handleCollectionChange(args, removeString, stringsData);
        }}
        propertyChange={(args) => {
          handlePropertyChange(
            args,
            editString,
            addString,
            stringsData,
            selectedIntent
          );
        }}
        loaded={(args) => {
          handleFetchFromServer(args);
        }}
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
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={handleFetchFromServer}
        >
          Fetch from Server
        </button>
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
        <DialogIntent
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
