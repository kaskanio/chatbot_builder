import React, { useState } from 'react';
import {
  SymbolPaletteComponent,
  Inject,
  BpmnDiagrams,
} from '@syncfusion/ej2-react-diagrams';
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { GoChevronRight, GoChevronLeft } from 'react-icons/go';

function DialoguesToolbar({ diagramInstanceRef }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
  ];

  let triggerShapes = [
    {
      id: 'Intent',
      text: 'Intent',
      shape: {
        type: 'HTML',
        content: `
          <div style="padding: 10px; border: 2px solid #ff5733; border-radius: 10px; background-color: #fff3e6;">
            <h3 style="text-align: center; color: #ff5733; font-size: 10px; font-weight: bold;">Intent</h3>
            <div style="margin-top: 5px;">
              <div style="border: 1px solid #ccc; padding: 5px; margin: 2px; border-radius: 3px; font-size: 8px;">
              </div>
              <div style="border: 1px solid #ccc; padding: 5px; margin: 2px; border-radius: 3px; font-size: 8px;">
              </div>
            </div>
          </div>
        `,
      },
      offsetX: 405,
      offsetY: 105,
    },
    {
      id: 'EventTrigger',
      text: 'Event',
      shape: {
        type: 'HTML',
        content: `
          <div style="padding: 10px; border: 2px solid #ff5733; border-radius: 10px; background-color: #fff3e6;">
            <h3 style="text-align: center; color: #ff5733; font-size: 10px; font-weight: bold;">Event Trigger</h3>
            <div style="margin-top: 5px;">
              <div style="border: 1px solid #ccc; padding: 5px; margin: 2px; border-radius: 3px; font-size: 8px;">
              </div>
            </div>
          </div>
        `,
      },
      offsetX: 405,
      offsetY: 105,
    },
  ];

  let actionShape = [
    {
      id: 'SpeakAction',
      shape: {
        type: 'HTML',
        content: `
          <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9;">
            <h3 style="text-align: center; color: #0056b3; font-size: 10px; font-weight: bold;">Speak Action</h3>
            <div style="margin-top: 5px; font-style: italic;">
            </div>
          </div>
        `,
      },
      offsetX: 405,
      offsetY: 105,
    },
    {
      id: 'Form',
      shape: {
        type: 'HTML',
        content: `
          <div style="padding: 5px; border: 1px solid #0056b3; border-radius: 5px; background-color: #f9f9f9; font-size: 8px;">
            <h3 style="text-align: center; color: #0056b3; font-size: 10px;">Form</h3>
            <div style="margin-top: 5px;">
              <div style="border: 1px solid #ccc; padding: 5px; margin: 2px; border-radius: 3px; font-size: 8px;">
              </div>
              <div style="border: 1px solid #ccc; padding: 5px; margin: 2px; border-radius: 3px; font-size: 8px;">
              </div>
            </div>
          </div>
        `,
      },
      offsetX: 405,
      offsetY: 105,
    },
    {
      id: 'FireEventAction',
      shape: {
        type: 'HTML',
        content: `
          <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9;">
            <h3 style="text-align: center; color: #0056b3; font-size: 10px; font-weight: bold;">Fire Event</h3>
            <div style="margin-top: 5px;">
            </div>
          </div>
        `,
      },
      offsetX: 405,
      offsetY: 105,
    },
    {
      id: 'RESTCallAction',
      shape: {
        type: 'HTML',
        content: `
          <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9;">
            <h3 style="text-align: center; color: #0056b3; font-size: 10px; font-weight: bold;">Service</h3>
            <div style="margin-top: 5px;">
            </div>
          </div>
        `,
      },
      offsetX: 405,
      offsetY: 105,
    },
    {
      id: 'SetGlobalSlot',
      shape: {
        type: 'HTML',
        content: `
          <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9;">
            <h3 style="text-align: center; color: #0056b3; font-size: 10px; font-weight: bold;">Set Global Slot</h3>
            <div style="margin-top: 5px;">
            </div>
          </div>
        `,
      },
      offsetX: 405,
      offsetY: 105,
    },
    {
      id: 'SetFormSlot',
      shape: {
        type: 'HTML',
        content: `
          <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9;">
            <h3 style="text-align: center; color: #0056b3; font-size: 10px; font-weight: bold;">Set Form Slot</h3>
            <div style="margin-top: 5px;">
       
            </div>
          </div>
        `,
      },
      offsetX: 405,
      offsetY: 105,
    },
  ];

  return (
    <div className="absolute top-0 right-0 h-full flex">
      <SidebarComponent
        isOpen={isSidebarOpen}
        width="300px"
        target=".content-area"
        position="Right"
        type="Over"
        enableGestures={false}
      >
        <div className="flex justify-between">
          <div className="flex">
            <SymbolPaletteComponent
              id="palette1"
              expandMode="Multiple"
              palettes={[
                {
                  id: 'intentsForms',
                  expanded: true,
                  symbols: triggerShapes,
                  title: 'Intents & Forms',
                },
                {
                  id: 'connectors',
                  expanded: true,
                  symbols: connectorSymbols,
                  title: 'Connectors',
                  iconCss: 'e-ddb-icons e-connector',
                },
                {
                  id: 'actions',
                  expanded: true,
                  symbols: actionShape,
                  title: 'Actions',
                },
              ]}
              symbolHeight={100}
              symbolWidth={110}
              getSymbolInfo={(symbol) => {
                if (symbol['text'] !== undefined) {
                  return {
                    width: 75,
                    height: 60,
                    description: {
                      text: symbol['text'],
                      overflow: 'Wrap',
                      orientation: 'Bottom',
                    },
                  };
                }
                return {
                  width: 75,
                  height: 60,
                  description: {
                    text: symbol.shape['shape'],
                    overflow: 'Wrap',
                    orientation: 'Bottom',
                  },
                };
              }}
            >
              <Inject services={[BpmnDiagrams]} />
            </SymbolPaletteComponent>
          </div>
        </div>
      </SidebarComponent>
      <button
        onClick={toggleSidebar}
        className="m-2 p-2 bg-gray-200 rounded-full shadow-lg absolute transform transition-transform"
        style={{
          zIndex: 1000,
          top: '40%',
          transform: 'translateY(-50%)',
          right: isSidebarOpen ? '300px' : '0',
          transition:
            'right 0.5s ease' /* Ensure the button has the same transition duration */,
        }}
      >
        {isSidebarOpen ? <GoChevronRight /> : <GoChevronLeft />}
      </button>
    </div>
  );
}

export default DialoguesToolbar;
