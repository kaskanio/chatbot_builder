import React from 'react';
import {
  SymbolPaletteComponent,
  Inject,
  BpmnDiagrams,
  AnnotationConstraints,
} from '@syncfusion/ej2-react-diagrams';

function DialoguesToolbar({
  diagramInstanceRef,
  selectedIntent,
  relatedStrings,
}) {
  // Fetch events from the API

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
        enumerationShape: {
          name: 'Intent Name',
          members: [],
        },
        classifier: 'Enumeration',
      },
      offsetX: 405,
      offsetY: 105,
    },
  ];

  let actionShape = [
    {
      id: 'SpeakAction',
      text: 'Speak',
      width: 250,
      height: 130,
      annotations: [
        {
          // Non-editable annotation at the top
          content: 'Speak',
          offset: { x: 0.5, y: 0.1 }, // Position at the top
          style: {
            color: '#000000', // Text color
            fontSize: 15, // Font size
            fontFamily: 'Arial', // Font family
            bold: true, // Bold text
            italic: false, // Italic text
            textAlign: 'Center', // Text alignment
          },
          constraints: AnnotationConstraints.ReadOnly, // Make it non-editable
        },
      ],
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
      annotations: [
        {
          // Non-editable annotation at the top
          content: 'Fire Event',
          offset: { x: 0.5, y: 0.1 }, // Position at the top
          style: {
            color: '#000000', // Text color
            fontSize: 15, // Font size
            fontFamily: 'Arial', // Font family
            bold: true, // Bold text
            italic: false, // Italic text
            textAlign: 'Center', // Text alignment
          },
          constraints: AnnotationConstraints.ReadOnly, // Make it non-editable
        },
      ],
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
      width: 200,
      height: 150,
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
      annotations: [
        {
          // Non-editable annotation at the top
          content: 'Rest Call Service',
          offset: { x: 0.5, y: 0.1 }, // Position at the top
          style: {
            color: '#000000', // Text color
            fontSize: 15, // Font size
            fontFamily: 'Arial', // Font family
            bold: true, // Bold text
            italic: false, // Italic text
            textAlign: 'Center', // Text alignment
          },
          constraints: AnnotationConstraints.ReadOnly, // Make it non-editable
        },
      ],
      style: {
        fill: '#FFD700',
        strokeWidth: 2,
        strokeColor: '#FFD700',
      },
      borderWidth: 1,
    },
    {
      id: 'SetGlobalSlot',
      text: 'Set Global Slot',
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
      annotations: [
        {
          // Non-editable annotation at the top
          content: 'Set Global Slot',
          offset: { x: 0.5, y: 0.1 }, // Position at the top
          style: {
            color: '#000000', // Text color
            fontSize: 15, // Font size
            fontFamily: 'Arial', // Font family
            bold: true, // Bold text
            italic: false, // Italic text
            textAlign: 'Center', // Text alignment
          },
          constraints: AnnotationConstraints.ReadOnly, // Make it non-editable
        },
      ],
      style: {
        fill: '#FFD700',
        strokeWidth: 2,
        strokeColor: '#FFD700',
      },
      borderWidth: 1, // Set the border width
    },
    {
      id: 'SetFormSlot',
      text: 'Set Form Slot',
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
            symbolWidth={110}
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
