import { useRef, useCallback } from 'react';
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
} from '../store';
import {
  useFetchConnectorQuery,
  useAddConnectorMutation,
  useUpdateConnectorMutation,
  useDeleteConnectorMutation,
} from '../store';
import Skeleton from './modules/Skeleton';
import DialoguesToolbar from './DialoguesToolbar';

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

  const handleCollectionChange = useCallback(
    (args) => {
      console.log('Geia');

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
          sourcePointX: args.element.sourcePoint.x,
          sourcePointY: args.element.sourcePoint.y,
          targetPointX: args.element.targetPoint.x,
          targetPointY: args.element.targetPoint.y,
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
      const nodeId = args.source.properties.id;
      if (args.state === 'Completed') {
        if (args.source.propName === 'nodes') {
          updateNode({
            nodeId: nodeId,
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
          const connectedConnectors =
            diagramInstanceRef.current.connectors.filter(
              (connector) =>
                connector.sourceID === nodeId || connector.targetID === nodeId
            );

          // Update the connectors
          connectedConnectors.forEach((connector) => {
            updateConnector({
              connectorId: connector.id,
              updatedSourcePointX: connector.sourcePoint.x,
              updatedSourcePointY: connector.sourcePoint.y,
              updatedTargetPointX: connector.targetPoint.x,
              updatedTargetPointY: connector.targetPoint.y,
            })
              .unwrap()
              .then((result) => {
                console.log('Update successful:', result);
              })
              .catch((error) => {
                console.error('Update failed:', error);
              });
          });
        } else if (args.source.propName === 'connectors') {
          updateConnector({
            connectorId: nodeId,
            updatedSourcePointX: args.newValue.sourcePoint.x,
            updatedSourcePointY: args.newValue.sourcePoint.y,
            updatedTargetPointX: args.newValue.targetPoint.x,
            updatedTargetPointY: args.newValue.targetPoint.y,
          })
            .unwrap()
            .then((result) => {
              console.log('Update successful:', result);
            })
            .catch((error) => {
              console.error('Update failed:', error);
            });
        } else if (args.source.propName === 'selectedItems') {
          const selectedItems = args.source.nodes || args.source.connectors;
          if (selectedItems) {
            selectedItems.forEach((item) => {
              console.log('Selected item:', item);
              if (item.propName === 'nodes') {
                updateNode({
                  nodeId: item.id,
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
                const connectedConnectors =
                  diagramInstanceRef.current.connectors.filter(
                    (connector) =>
                      connector.sourceID === item.id ||
                      connector.targetID === item.id
                  );

                // Update the connectors
                connectedConnectors.forEach((connector) => {
                  updateConnector({
                    connectorId: connector.id,
                    updatedSourcePointX: connector.sourcePoint.x,
                    updatedSourcePointY: connector.sourcePoint.y,
                    updatedTargetPointX: connector.targetPoint.x,
                    updatedTargetPointY: connector.targetPoint.y,
                  })
                    .unwrap()
                    .then((result) => {
                      console.log('Update successful:', result);
                    })
                    .catch((error) => {
                      console.error('Update failed:', error);
                    });
                });
              }
            });
          }
        }
      }
    },
    [updateNode, updateConnector]
  );

  const handleSizeChange = useCallback(
    (args) => {
      if (args.state === 'Completed') {
        const nodeId = args.source.nodes[0].properties.id;

        // Update the node in the Redux store
        updateNode({
          nodeId: nodeId,
          updatedOffsetX: args.newValue.offsetX,
          offsetY: args.newValue.offsetY,
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
      if (args.state === 'Changed') {
        console.log(args);
        updateConnector({
          connectorId: args.connector.id,
          updatedSourceId: args.connector.sourceID,
          updatedTargetId: args.connector.targetID,
          updatedSourcePointX: args.connector.sourcePoint.x,
          updatedSourcePointY: args.connector.sourcePoint.y,
          updatedTargetPointX: args.connector.targetPoint.x,
          updatedTargetPointY: args.connector.targetPoint.y,
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
      type: connector.type || 'Orthogonal',
      targetDecorator: connector.targetDecorator,
      sourcePoint: {
        x: connector.sourcePointX,
        y: connector.sourcePointY,
      },
      targetPoint: {
        x: connector.targetPointX,
        y: connector.targetPointY,
      },
    }));

    const handleSymbolDrag = (args) => {
      console.log('To stoixeio pou petaksa einai to: ', args.element.propName);
      if (args.element.propName === 'nodes') {
        console.log('Connector EINAI REEEE');
      }
    };

    content = (
      <div>
        <DiagramComponent
          id="container"
          width={'100%'}
          height={'600px'}
          nodes={returnNodes}
          connectors={returnConnectors}
          drop={handleSymbolDrag}
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

  return (
    <div className="flex flex-col">
      <div className="mb-9">{content}</div>
      <div className="flex items-center space-x-4">
        <DialoguesToolbar diagramInstanceRef={diagramInstanceRef} />
      </div>
    </div>
  );
}

export default Dialogues;
