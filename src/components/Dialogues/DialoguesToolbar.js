import {
  SymbolPaletteComponent,
  Inject,
  BpmnDiagrams,
} from '@syncfusion/ej2-react-diagrams';

function DialoguesToolbar({
  diagramInstanceRef,
  selectedIntent,
  relatedStrings,
}) {
  // You can now use selectedIntent and relatedStrings here
  const intentName = selectedIntent?.name;
  const strings = relatedStrings.map((string) => string.name);

  // // Log the variables to verify
  // console.log(intentName, strings);

  function createProperty(name, type) {
    return { name: name, type: type };
  }

  // Define the connector symbols
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

  let umlShapes = [
    {
      id: 'Intent',
      shape: {
        type: 'UmlClassifier',
        classShape: {
          name: 'Hi',
          attributes: [
            createProperty('name', 'Name'),
            createProperty('title', 'String[*]'),
            createProperty('gender', 'Gender'),
          ],
        },
        classifier: 'Class',
      },
      offsetX: 405,
      offsetY: 105,
    },
  ];

  let actionShape = [
    {
      id: 'SpeakAction',
      text: 'Speak',
      width: 170,
      height: 100,
      shape: {
        type: 'Bpmn',
        shape: 'Activity',
        activity: {
          activity: 'Task',
          task: {
            type: 'User',
          },
        },
      },
      style: {
        fill: '#FFD700',
        strokeWidth: 2,
        strokeColor: '#FFD700',
      },
      borderWidth: 1,
    },
    {
      id: 'FireEventAction',
      text: 'Fire Event',
      width: 170,
      height: 100,
      shape: {
        type: 'Bpmn',
        shape: 'Activity',
        activity: {
          activity: 'Task',
          task: {
            type: 'InstantiatingReceive',
          },
        },
      },
      style: {
        fill: '#FFD700',
        strokeWidth: 2,
        strokeColor: '#FFD700',
      },
      borderWidth: 1,
    },
    {
      id: 'RESTCallAction',
      text: 'REST Call',
      width: 170,
      height: 100,
      shape: {
        type: 'Bpmn',
        shape: 'Activity',
        activity: {
          activity: 'Task',
          task: {
            type: 'Service',
          },
        },
      },
      style: {
        fill: '#FFD700',
        strokeWidth: 2,
        strokeColor: '#FFD700',
      },
      borderWidth: 1,
    },
    {
      id: 'SetFormSlot',
      text: 'Form Slot',
      width: 170,
      height: 100,
      shape: {
        type: 'Bpmn',
        shape: 'Activity',
        activity: {
          activity: 'Task',
          task: {
            type: 'BusinessRule',
          },
        },
      },
      style: {
        fill: '#FFD700',
        strokeWidth: 2,
        strokeColor: '#FFD700',
      },
      borderWidth: 1,
    },
    {
      id: 'SetGlobalSlot',
      text: 'Global Slot',
      width: 170,
      height: 100,
      shape: {
        type: 'Bpmn',
        shape: 'Activity',
        activity: {
          activity: 'Task',
          task: {
            type: 'Manual',
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
                id: 'intents',
                expanded: true,
                symbols: umlShapes,
                title: 'Intents',
              },
              {
                id: 'connectors',
                expanded: true,
                symbols: connectorSymbols,
                title: 'Connectors',
                iconCss: 'e-ddb-icons e-connector',
              },

              {
                id: 'actionsForms',
                expanded: true,
                symbols: actionShape,
                title: 'Actions & Forms',
              },
            ]}
            symbolHeight={100}
            symbolWidth={100}
            getSymbolInfo={(symbol) => {
              if (symbol['text'] !== undefined) {
                return {
                  width: 75,
                  height: 60,
                  //Add or Remove the Text for Symbol palette item.
                  description: {
                    //Defines the symbol description
                    text: symbol['text'],
                    //Defines how to handle the text when its size exceeds the given symbol size
                    overflow: 'Wrap',
                    orientation: 'Bottom', // Position the text below the symbol
                  },
                };
              }
              return {
                width: 75,
                height: 60,
                description: {
                  text: symbol.shape['shape'],
                  overflow: 'Wrap',
                  orientation: 'Bottom', // Position the text below the symbol
                },
              };
            }}
          >
            <Inject services={[BpmnDiagrams]} />
          </SymbolPaletteComponent>
        </div>
      </div>
    </div>
  );
}

export default DialoguesToolbar;
