import { DiagramComponent } from '@syncfusion/ej2-react-diagrams';

function Dialogues() {
  const diagram = {
    nodes: [
      {
        id: 'node1',
        offsetX: 100,
        offsetY: 100,
        width: 100,
        height: 50,
        shape: { type: 'Basic', shape: 'Rectangle' },
      },
      // Add more nodes as needed asdgfasdgasgas
    ],
    connectors: [
      {
        id: 'connector1',
        sourceID: 'node1',
        targetID: 'node2',
      },
      // Add more connectors as needed
    ],
  };

  return (
    <DiagramComponent
      id="diagram"
      width="100%"
      height={880}
      nodes={diagram.nodes}
      connectors={diagram.connectors}
    />
  );
}

export default Dialogues;
