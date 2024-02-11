import {
  SymbolPaletteComponent,
  Inject,
  BpmnDiagrams,
} from '@syncfusion/ej2-react-diagrams';

function DialoguesToolbar(diagramInstanceRef) {
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

  let nodeShape = [
    {
      id: 'Intent',
      width: 35,
      height: 35,
      shape: {
        type: 'Bpmn',
        shape: 'Gateway',
      },
      style: {
        fill: '#6BA5D7',
        strokeWidth: 2,
        strokeColor: '#6BA5D7',
      },
      borderWidth: 1, // Set the border width
    },
    {
      id: 'ActionGroup',
      width: 35,
      height: 35,
      shape: {
        type: 'Bpmn',
        shape: 'Activity',
        //Sets activity as Task
        activity: {
          activity: 'Task',
          //Sets the type of the task as Send
          task: {
            type: 'Send',
          },
        },
      },
      style: {
        fill: '#FFD700',
        strokeWidth: 2,
        strokeColor: '#FFD700',
      },
      borderWidth: 1, // Set the border width
    },
    {
      id: 'Form',
      width: 35,
      height: 35,
      shape: {
        type: 'Flow',
        shape: 'Document',
      },
      style: {
        fill: '#6BA5D7',
        strokeColor: 'white',
      },
      borderWidth: 1, // Set the border width
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div className="flex">
          <SymbolPaletteComponent
            id="palette1"
            expandMode="Multiple"
            palettes={[
              {
                id: 'connectors',
                expanded: false,
                symbols: connectorSymbols,
                title: 'Connectors',
                iconCss: 'e-ddb-icons e-connector',
              },
              {
                id: 'Intent',
                expanded: true,
                symbols: nodeShape,
                title: 'Nodes',
              },
            ]}
            symbolHeight={100}
            symbolWidth={100}
          >
            <Inject services={[BpmnDiagrams]} />
          </SymbolPaletteComponent>
        </div>
      </div>
    </div>
  );
}

export default DialoguesToolbar;
