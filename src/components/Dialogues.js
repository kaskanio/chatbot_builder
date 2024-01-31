import React, { useRef, useCallback } from 'react';
import {
  DiagramComponent,
  Inject,
  BpmnDiagrams,
  DiagramTools,
  SymbolPaletteComponent,
  ConnectorEditing,
} from '@syncfusion/ej2-react-diagrams';
import {
  useFetchNodeQuery,
  useUpdateNodeMutation,
  useDeleteNodeMutation,
} from '../store';
import {
  useFetchConnectorQuery,
  useAddConnectorMutation,
  useUpdateConnectorMutation,
  useDeleteConnectorMutation,
} from '../store';
import Skeleton from './modules/Skeleton';
import DialoguesToolbar from './DialoguesToolbar';
import Button from './modules/Button';

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

  const diagramInstanceRef = useRef(null);

  let connectorSymbols = [
    {
      id: 'Link1',
      type: 'Orthogonal',
      sourcePoint: {
        x: 0,
        y: 0,
      },
      targetPoint: {
        x: 40,
        y: 40,
      },
      targetDecorator: {
        shape: 'Arrow',
      },
    },
    {
      id: 'Link21',
      type: 'Straight',
      sourcePoint: {
        x: 0,
        y: 0,
      },
      targetPoint: {
        x: 40,
        y: 40,
      },
      targetDecorator: {
        shape: 'Arrow',
      },
    },
    {
      id: 'link33',
      type: 'Bezier',
      sourcePoint: {
        x: 0,
        y: 0,
      },
      targetPoint: {
        x: 40,
        y: 40,
      },
      style: {
        strokeWidth: 2,
      },
      targetDecorator: {
        shape: 'None',
      },
    },
  ];

  const handleCollectionChange = useCallback(
    (args) => {
      if (
        args.type === 'Removal' &&
        args.element.propName === 'nodes' &&
        args.state === 'Changed'
      ) {
        const deletedNodeId = args.element.properties.id;
        console.log(`Node with ID ${deletedNodeId} is deleted.`, args);
        deleteNode(args.element.properties.id);
      } else if (
        args.type === 'Addition' &&
        args.element.propName === 'connectors'
      ) {
        console.log(`Connector with ID ${args.element.id} is added.`, args);
        addConnector({
          connectorId: args.element.id,
          sourceId: args.element.sourceID,
          targetId: args.element.targetID,
          type: args.element.type,
          sourceOffsetX: args.element.properties.sourcePoint.x,
          sourceOffsetY: args.element.properties.sourcePoint.y,
          targetOffsetX: args.element.properties.targetPoint.x,
          targetOffsetY: args.element.properties.targetPoint.y,
        });
      } else if (
        args.type === 'Removal' &&
        args.element.propName === 'connectors' &&
        args.state === 'Changed'
      ) {
        const deletedConnectorId = args.element.properties.id;
        console.log(`Connector with ID ${deletedConnectorId} is deleted.`);
        deleteConnector(args.element.properties.id);
      }
    },
    [deleteNode, addConnector, deleteConnector]
  );

  const handlePositionChange = useCallback(
    (args) => {
      console.log('Position changed:', args);

      if (args.state === 'Completed' && args.source.propName === 'nodes') {
        updateNode({
          nodeId: args.source.properties.id,
          updatedOffsetX: args.newValue.offsetX,
          updatedOffsetY: args.newValue.offsetY,
        })
          .unwrap()
          .then((result) => {
            console.log('Update successful:', result);
          })
          .catch((error) => {
            console.error('Update failed:', error);
          });
      }
    },
    [updateNode]
  );

  const handleSizeChange = useCallback(
    (args) => {
      if (args.state === 'Completed') {
        updateNode({
          nodeId: args.source.nodes[0].properties.id,
          updatedOffsetX: args.newValue.offsetX,
          updatedOffsetY: args.newValue.offsetY,
          updatedWidth: args.newValue.width,
          updatedHeight: args.newValue.height,
        })
          .unwrap()
          .then((result) => {
            console.log('Update successful:', result);
          })
          .catch((error) => {
            console.error('Update failed:', error);
          });
      }
    },
    [updateNode]
  );

  const handleConnectionChange = useCallback(
    (args) => {
      console.log('allazo 8esi connector', args);

      if (args.state === 'Changed') {
        console.log(args);
        updateConnector({
          connectorId: args.connector.id,
          updatedSourceId: args.connector.sourceID,
          updatedTargetId: args.connector.targetID,
          updatedSourceOffsetX: args.connector.properties.sourcePoint.x,
          updatedSourceOffsetY: args.connector.properties.sourcePoint.y,
          updatedTargetOffsetX: args.connector.properties.targetPoint.x,
          updatedTargetOffsetY: args.connector.properties.targetPoint.y,
        });
      }
    },
    [updateConnector]
  );

  let content;

  if (isLoading || connectorLoading) {
    content = <Skeleton className="h-10 w-full" times={3} />;
  } else if (error || connectorError) {
    content = (
      <div>
        Error loading data: {error ? error.message : connectorError.message}
      </div>
    );
  } else if (data && connectorData) {
    const returnNodes = data.map((node) => ({
      id: node.id,
      offsetX: node.offsetX || 100,
      offsetY: node.offsetY || 100,
      width: node.width || 130,
      height: node.height || 130,
      annotations: [
        {
          content: node.id.toString(),
        },
      ],
      shape: {
        type: 'Bpmn',
        shape: node.shape,
        gateway: {
          type: 'None',
        },
      },
    }));

    const returnConnectors = connectorData.map((connector) => ({
      id: connector.id,
      sourceID: connector.sourceId,
      targetID: connector.targetId,
      type: connector.type,
      sourcePoint: {
        x: connector.sourceOffsetX,
        y: connector.sourceOffsetY,
      },
      targetPoint: {
        x: connector.targetOffsetX,
        y: connector.targetOffsetY,
      },
    }));

    console.log(returnConnectors);

    content = (
      <div>
        <DiagramComponent
          id="container"
          width={'100%'}
          height={'600px'}
          connectors={returnConnectors}
          nodes={returnNodes}
          getConnectorDefaults={(obj, diagramInstance) => {
            return obj;
          }}
          getNodeDefaults={(obj, diagramInstance) => {
            obj.borderWidth = 1;
            obj.style = {
              fill: '#6BA5D7',
              strokeWidth: 2,
              strokeColor: '#6BA5D7',
            };
            return obj;
          }}
          ref={(diagram) => {
            diagramInstanceRef.current = diagram;
            if (diagram) {
              diagram.addEventListener('positionChange', handlePositionChange);
              diagram.addEventListener(
                'collectionChange',
                handleCollectionChange
              );
              diagram.addEventListener('sizeChange', handleSizeChange);
              diagram.addEventListener(
                'connectionChange',
                handleConnectionChange
              );
            }
          }}
        >
          <Inject services={[BpmnDiagrams, ConnectorEditing]} />
        </DiagramComponent>
      </div>
    );
  }

  const handleButtonClick = () => {
    const connectors = {
      id: 'connector1',
      type: 'Straight',
      segments: [
        {
          type: 'polyline',
        },
      ],
    };
    diagramInstanceRef.current.drawingObject = connectors;
    diagramInstanceRef.current.tool = DiagramTools.DrawOnce;
    diagramInstanceRef.current.dataBind();
  };

  const handleSymbolDrag = (args) => {
    const diagram = diagramInstanceRef.current;

    // Check if the dragged item is a connector (you may adjust this check based on your symbol type)
    if (args.element.isConnector) {
      // Select the dragged connector in the diagram
      diagram.select([args.element]);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-9">{content}</div>
      <div className="flex items-center space-x-4">
        <Button onClick={handleButtonClick}>Draw Connector</Button>
        <DialoguesToolbar />
        <SymbolPaletteComponent
          id="palette1"
          //Defines how many palettes can be at expanded mode at a time
          expandMode={'Multiple'}
          symbolDrag={handleSymbolDrag}
          //Defines the palette collection
          palettes={[
            {
              id: 'connectors',
              expanded: true,
              symbols: connectorSymbols,
              title: 'Connectors',
              iconCss: 'e-ddb-icons e-connector',
            },
          ]}
        />
      </div>
    </div>
  );
}

export default Dialogues;
