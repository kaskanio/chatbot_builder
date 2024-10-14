import { useRef, useState } from 'react';
import {
  DiagramComponent,
  Inject,
  BpmnDiagrams,
  ConnectorEditing,
} from '@syncfusion/ej2-react-diagrams';
import {
  useFetchNodeQuery,
  useUpdateNodeMutation,
  useDeleteNodeMutation,
} from '../../store';
import {
  useFetchConnectorQuery,
  useAddConnectorMutation,
  useUpdateConnectorMutation,
  useDeleteConnectorMutation,
} from '../../store';
import {
  useFetchIntentNodesQuery,
  useUpdateIntentNodeMutation,
  useDeleteIntentNodeMutation,
} from '../../store';
import Skeleton from '../modules/Skeleton';
import DialoguesToolbar from './DialoguesToolbar';
import DialogIntent from './DialogIntent';
import DialogSpeak from './DialogSpeak';
import DialogEvent from './DialogEvent';
import { FiRefreshCw } from 'react-icons/fi'; // Import the refresh icon from react-icons
import DialogIntentRefresh from './DialogIntentRefresh';
import { mapNodes, mapIntentNodes, mapConnectors } from './utils';
import {
  handleSymbolDrag,
  handleCollectionChange,
  handlePositionChange,
  handleSizeChange,
  handleConnectionChange,
} from './handlers';

function Dialogues() {
  const { data, error, isLoading } = useFetchNodeQuery();
  const {
    data: connectorData,
    error: connectorError,
    isLoading: connectorLoading,
  } = useFetchConnectorQuery();
  const [updateNode] = useUpdateNodeMutation();
  const [deleteNode] = useDeleteNodeMutation();
  const [updateConnector] = useUpdateConnectorMutation();
  const [addConnector] = useAddConnectorMutation();
  const [deleteConnector] = useDeleteConnectorMutation();
  const {
    data: intentNodesData,
    error: intentNodesError,
    isLoading: intentNodesLoading,
  } = useFetchIntentNodesQuery();
  const [updateIntentNode] = useUpdateIntentNodeMutation();
  const [deleteIntentNode] = useDeleteIntentNodeMutation();

  const [showDialogIntent, setShowDialogIntent] = useState(false);
  const [showDialogSpeak, setShowDialogSpeak] = useState(false);
  const [showDialogFireEvent, setShowDialogFireEvent] = useState(false);
  const [showDialogIntentRefresh, setShowDialogIntentRefresh] = useState(false);
  const [nodeToAdd, setNodeToAdd] = useState();

  const diagramInstanceRef = useRef(null);

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
            if (diagram) {
              diagram.addEventListener('positionChange', (args) =>
                handlePositionChange(
                  args,
                  updateNode,
                  updateIntentNode,
                  updateConnector,
                  diagramInstanceRef
                )
              );
              diagram.addEventListener('collectionChange', (args) =>
                handleCollectionChange(
                  args,
                  deleteNode,
                  addConnector,
                  deleteConnector,
                  diagramInstanceRef
                )
              );
              diagram.addEventListener('sizeChange', (args) =>
                handleSizeChange(
                  args,
                  updateNode,
                  updateConnector,
                  diagramInstanceRef
                )
              );
              diagram.addEventListener('connectionChange', (args) =>
                handleConnectionChange(
                  args,
                  updateConnector,
                  diagramInstanceRef
                )
              );
            }
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
