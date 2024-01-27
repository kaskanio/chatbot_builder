import React, { useState, useRef, useCallback } from 'react';
import {
  DiagramComponent,
  Inject,
  BpmnDiagrams,
  DiagramTools,
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
  const [updateNode] = useUpdateNodeMutation();
  const [deleteNode] = useDeleteNodeMutation();
  const diagramInstanceRef = useRef(null);
  const [drawMode, toggleDrawMode] = useState(false);

  const handlePositionChange = useCallback(
    (args) => {
      console.log('Position changed:', args);

      if (args.state === 'Completed') {
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

  const handleCollectionChange = useCallback(
    (args) => {
      if (args.type === 'Removal' && args.element.propName === 'nodes') {
        const deletedNodeId = args.element.properties.id;
        console.log(`Node with ID ${deletedNodeId} is deleted.`);
        deleteNode(args.element.properties.id);
      }
    },
    [deleteNode]
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

  let content;

  if (isLoading) {
    content = <Skeleton className="h-10 w-full" times={3} />;
  } else if (error) {
    content = <div>Error loading intents: {error.message}</div>;
  } else if (data) {
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

    content = (
      <div>
        <DiagramComponent
          id="container"
          width={'100%'}
          height={'600px'}
          nodes={returnNodes}
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
            }
          }}
        >
          <Inject services={[BpmnDiagrams]} />
        </DiagramComponent>
      </div>
    );
  }

  const handleButtonClick = () => {
    toggleDrawMode(!drawMode);
    const connectors = {
      id: 'connector1',
      type: 'Straight',
      segments: [
        {
          type: 'polyline',
        },
      ],
      sourceId: 'sourceNodeId',
      targetId: 'targetNodeId',
    };

    diagramInstanceRef.current.drawingObject = connectors;
    diagramInstanceRef.current.tool = DiagramTools.DrawOnce;
    diagramInstanceRef.current.dataBind();
    toggleDrawMode(!drawMode);
    console.log(connectors);
  };

  // const handleCollectionChange = (args) => {
  //   console.log(args.element.sourceID);
  //   console.log(args.element.targetID);
  // };

  return (
    <div className="flex flex-col">
      <div className="mb-9">{content}</div>
      <div className="flex items-center space-x-4">
        <Button onClick={handleButtonClick}>Draw Connector</Button>
        <DialoguesToolbar />
      </div>
    </div>
  );
}

export default Dialogues;
