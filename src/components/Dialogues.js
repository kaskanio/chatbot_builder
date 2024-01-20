import {
  DiagramComponent,
  Inject,
  BpmnDiagrams,
} from '@syncfusion/ej2-react-diagrams';
import { useRef, useCallback } from 'react';
import { useFetchNodeQuery, useUpdateNodeMutation } from '../store';
import Skeleton from './modules/Skeleton';
import DialoguesToolbar from './DialoguesToolbar';

function Dialogues() {
  const { data, error, isLoading } = useFetchNodeQuery();
  const [updateNode] = useUpdateNodeMutation();
  const diagramInstanceRef = useRef(null);

  const handlePositionChange = useCallback((args) => {
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
  }, []);

  const handleSizeChange = (args) => {
    console.log(args);

    if (args.state === 'asda') {
      updateNode({
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
  };

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
          content: node.id.toString(), // Use node.id as the annotation content
        },
      ],
      shape: {
        type: 'Bpmn',
        shape: node.shape,
        //Sets type of the gateway as None
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
          ref={(diagram) => {
            diagramInstanceRef.current = diagram;
            if (diagram) {
              diagram.addEventListener('positionChange', handlePositionChange);
            }
          }}
        >
          <Inject services={[BpmnDiagrams]} />
        </DiagramComponent>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-9">{content}</div>
      <div className="flex items-center space-x-4">
        <DialoguesToolbar />
      </div>
    </div>
  );
}

export default Dialogues;
