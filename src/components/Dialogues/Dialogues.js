import { useRef, useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import {
  DiagramComponent,
  Inject,
  BpmnDiagrams,
  ConnectorEditing,
} from '@syncfusion/ej2-react-diagrams';
import { useFetchNodeQuery } from '../../store';
import { useFetchConnectorQuery } from '../../store';
import { useFetchIntentNodesQuery } from '../../store';
import Skeleton from '../modules/Skeleton';
import DialoguesToolbar from './DialoguesToolbar';
import DialogIntent from './DialogIntent';
import DialogSpeak from './DialogSpeak';
import DialogEvent from './DialogEvent';
import { FiRefreshCw } from 'react-icons/fi';
import DialogIntentRefresh from './DialogIntentRefresh';
import { mapNodes, mapIntentNodes, mapConnectors } from './utils';
import { handleSymbolDrag } from './handlers';

function saveDiagramData(diagramInstanceRef) {
  if (diagramInstanceRef.current) {
    const diagramData = diagramInstanceRef.current.saveDiagram();
    const formattedData = JSON.stringify(JSON.parse(diagramData), null, 2); // Pretty-print JSON with 2-space indentation
    const blob = new Blob([formattedData], { type: 'application/json' });
    saveAs(blob, 'diagramData.json');
  }
}

function loadDiagramData(event, diagramInstanceRef) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const diagramData = e.target.result;
      if (diagramInstanceRef.current) {
        diagramInstanceRef.current.loadDiagram(diagramData);
      }
    };
    reader.readAsText(file);
  }
}

function Dialogues() {
  const { data, error, isLoading } = useFetchNodeQuery();
  const {
    data: connectorData,
    error: connectorError,
    isLoading: connectorLoading,
  } = useFetchConnectorQuery();

  const {
    data: intentNodesData,
    error: intentNodesError,
    isLoading: intentNodesLoading,
  } = useFetchIntentNodesQuery();

  const [showDialogIntent, setShowDialogIntent] = useState(false);
  const [showDialogSpeak, setShowDialogSpeak] = useState(false);
  const [showDialogFireEvent, setShowDialogFireEvent] = useState(false);
  const [showDialogIntentRefresh, setShowDialogIntentRefresh] = useState(false);
  const [nodeToAdd, setNodeToAdd] = useState();

  const diagramInstanceRef = useRef(null);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      saveDiagramData(diagramInstanceRef);
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [diagramInstanceRef]);

  let content;

  if (isLoading || connectorLoading || intentNodesLoading) {
    content = <Skeleton className="h-10 w-full" times={3} />;
  } else if (error || connectorError || intentNodesError) {
    content = (
      <div>
        Error loading data: {error ? error.message : connectorError.message}
      </div>
    );
  } else if (data && connectorData && intentNodesData) {
    const returnNodes = mapNodes(data);
    const returnIntentNodes = mapIntentNodes(intentNodesData);
    const combinedNodes = [...returnNodes, ...returnIntentNodes];
    const returnConnectors = mapConnectors(connectorData);

    content = (
      <div>
        <DiagramComponent
          id="container"
          width={'100%'}
          height={'calc(100vh - 100px)'}
          nodes={combinedNodes}
          connectors={returnConnectors}
          drop={(args) =>
            handleSymbolDrag(
              args,
              setNodeToAdd,
              setShowDialogIntentRefresh,
              setShowDialogSpeak,
              setShowDialogFireEvent
            )
          }
          ref={(diagram) => {
            diagramInstanceRef.current = diagram;
          }}
        >
          <Inject services={[BpmnDiagrams, ConnectorEditing]} />
        </DiagramComponent>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center mb-4 relative">
        <h1 className="text-2xl font-bold">Dialogues</h1>
        <button
          onClick={() => window.location.reload()}
          className="absolute right-0 flex items-center justify-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FiRefreshCw className="mr-2" />
          Refresh Page
        </button>
      </div>
      <div className="flex items-center justify-center mb-4">
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={(event) => loadDiagramData(event, diagramInstanceRef)}
        />
        <button
          onClick={() => document.getElementById('fileInput').click()}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Load Diagram
        </button>
        <button
          onClick={() => saveDiagramData(diagramInstanceRef)}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
        >
          Save Diagram
        </button>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 mb-9">{content}</div>
        <div className="w-1/4 mb-9">
          <DialoguesToolbar diagramInstanceRef={diagramInstanceRef} />
        </div>
      </div>
      <div>
        <DialogIntentRefresh
          showDialogIntentRefresh={showDialogIntentRefresh}
          setShowDialogIntentRefresh={setShowDialogIntentRefresh}
          nodeToAdd={nodeToAdd}
        />
        <DialogIntent
          showDialogIntent={showDialogIntent}
          setShowDialogIntent={setShowDialogIntent}
          nodeToAdd={nodeToAdd}
        />
        <DialogSpeak
          showDialogSpeak={showDialogSpeak}
          setShowDialogSpeak={setShowDialogSpeak}
          nodeToAdd={nodeToAdd}
        />
        <DialogEvent
          showDialogFireEvent={showDialogFireEvent}
          setShowDialogFireEvent={setShowDialogFireEvent}
          nodeToAdd={nodeToAdd}
        />
      </div>
    </div>
  );
}

export default Dialogues;
