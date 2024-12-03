import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DiagramComponent,
  Inject,
  BpmnDiagrams,
  ConnectorEditing,
  DiagramContextMenu,
} from '@syncfusion/ej2-react-diagrams';
import DialoguesToolbar from './DialoguesToolbar';
import DialogSpeak from './DialogSpeak';
import DialogEvent from './DialogEvent';
import DialogRest from './DialogRest';
import DialogGSlot from './DialogGSlot';
import DialogForm from './DialogForm';
import DialogIntent from './DialogIntent';
import DialogFSlot from './DialogFSlot'; // Add this import
import { MenuComponent } from '@syncfusion/ej2-react-navigations'; // Add this import

import { handleSymbolDrag } from './handlers';
import { saveDiagramState, loadDiagramState } from '../../store/diagramSlice';

const Dialogues = forwardRef((props, ref) => {
  const [showDialogSpeak, setShowDialogSpeak] = useState(false);
  const [showDialogEvent, setShowDialogEvent] = useState(false);
  const [eventType, setEventType] = useState('');
  const [showDialogRest, setShowDialogRest] = useState(false);
  const [showDialogGSlot, setShowDialogGSlot] = useState(false);
  const [showDialogFSlot, setShowDialogFSlot] = useState(false);
  const [showDialogForm, setShowDialogForm] = useState(false);
  const [showDialogIntent, setShowDialogIntent] = useState(false);
  const [currentNode, setCurrentNode] = useState(null); // State to keep track of the current node being edited

  const [draggedNode, setDraggedNode] = useState(null);

  const diagramInstanceRef = useRef(null);
  const dispatch = useDispatch();
  const diagramData = useSelector((state) => state.diagram.diagramData);

  useEffect(() => {
    if (diagramData) {
      dispatch(loadDiagramState(diagramData));
    }
  }, [dispatch, diagramData]);

  useEffect(() => {
    if (diagramInstanceRef.current && diagramData) {
      diagramInstanceRef.current.loadDiagram(diagramData);
    }
  }, []);

  const handleSaveDiagram = () => {
    if (diagramInstanceRef.current) {
      const serializedData = diagramInstanceRef.current.saveDiagram();
      dispatch(saveDiagramState(serializedData));
    }
  };

  const handleSaveToFile = (args) => {
    if (diagramInstanceRef.current) {
      const serializedData = diagramInstanceRef.current.saveDiagram({
        exclude: ['width', 'height', 'viewport'],
      });
      const blob = new Blob([serializedData], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleLoadFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const diagramData = JSON.parse(e.target.result);
        if (diagramInstanceRef.current) {
          diagramInstanceRef.current.loadDiagram(diagramData);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetDiagram = () => {
    if (diagramInstanceRef.current) {
      diagramInstanceRef.current.clear();
      dispatch(saveDiagramState(null)); // Clear the state in Redux
    }
  };

  const addNewNode = (node) => {
    diagramInstanceRef.current.addNode(node);
  };

  const handleSpeakAction = (actionString) => {
    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9;">
        <h3 style="text-align: center; color: #0056b3; font-size: 24px; font-weight: bold;">Speak Action</h3>
        <div style="margin-top: 10px; font-style: italic;">
          "${actionString}"
        </div>
      </div>
    `;
    const newNode = {
      id: `speakNode_${Date.now()}`,
      offsetX: draggedNode.offsetX,
      offsetY: draggedNode.offsetY,
      width: 350,
      height: 130,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      annotations: [],
    };
    addNewNode(newNode);
    setShowDialogSpeak(false);
  };

  const handleSelectEvent = (event) => {
    const isFireEvent = eventType === 'Fire';
    const headerText = isFireEvent ? 'Fire Event' : 'Event Trigger';
    const borderColor = isFireEvent ? '#0056b3' : '#ff5733';
    const backgroundColor = isFireEvent ? '#f9f9f9' : '#fff3e6';
    const headerColor = isFireEvent ? '#0056b3' : '#ff5733';

    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid ${borderColor}; border-radius: 10px; background-color: ${backgroundColor};">
        <h3 style="text-align: center; color: ${headerColor}; font-size: 18px; font-weight: bold;">${headerText}</h3>
        <div style="margin-top: 10px;">
          <strong>Name:</strong> ${event.name}<br>
          <strong>URI:</strong> <i>${event.uri}</i>
        </div>
      </div>
    `;

    const newNode = {
      id: `eventNode_${Date.now()}`,
      offsetX: draggedNode.offsetX,
      offsetY: draggedNode.offsetY,
      width: 170,
      height: 100,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      annotations: [],
    };

    addNewNode(newNode);
    setShowDialogEvent(false);
  };

  const handleSelectService = (service) => {
    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9;">
        <h3 style="text-align: center; color: #0056b3; font-size: 18px; font-weight: bold;">Service</h3>
        <div style="margin-top: 10px;">
          <strong>Name:</strong> ${service.name}<br>
          <strong>HTTP Verb:</strong> ${service.verb}<br>
          <strong>Host:</strong> ${service.host}<br>
          <strong>Port:</strong> ${service.port}<br>
          <strong>Path:</strong> ${service.path}
        </div>
      </div>
    `;
    const newNode = {
      id: `serviceNode_${Date.now()}`,
      offsetX: draggedNode.offsetX,
      offsetY: draggedNode.offsetY,
      width: 200,
      height: 150,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      annotations: [],
    };
    addNewNode(newNode);
    setShowDialogRest(false);
  };

  const handleSelectGSlot = (slot) => {
    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9;">
        <h3 style="text-align: center; color: #0056b3; font-size: 18px; font-weight: bold;">Set Global Slot</h3>
        <div style="margin-top: 10px;">
          <strong>Name:</strong> ${slot.name}<br>
          <strong>Type:</strong> ${slot.type}<br>
          <strong>Value:</strong> ${slot.value}
        </div>
      </div>
    `;
    const newNode = {
      id: `gSlotNode_${Date.now()}`,
      offsetX: draggedNode.offsetX,
      offsetY: draggedNode.offsetY,
      width: 250,
      height: 100,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      annotations: [],
    };
    addNewNode(newNode);
    setShowDialogGSlot(false);
  };

  const handleSelectFSlot = (slot) => {
    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9;">
        <h3 style="text-align: center; color: #0056b3; font-size: 18px; font-weight: bold;">Set Form Slot</h3>
        <div style="margin-top: 10px;">
          <strong>Name:</strong> ${slot.name}<br>
          <strong>Type:</strong> ${slot.type}<br>
          <strong>Value:</strong> ${slot.value}
        </div>
      </div>
    `;
    const newNode = {
      id: `fSlotNode_${Date.now()}`,
      offsetX: draggedNode.offsetX,
      offsetY: draggedNode.offsetY,
      width: 250,
      height: 100,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      annotations: [],
    };
    addNewNode(newNode);
    setShowDialogFSlot(false);
  };

  const handleForm = (formName, gridDataHRI, gridDataService) => {
    console.log('Form Name:', formName);
    console.log('HRI Grid Data:', gridDataHRI);
    console.log('Service Grid Data:', gridDataService);

    const formSlotsHRI = gridDataHRI
      .map(
        (slot) => `
      <div style="border: 1px solid #ccc; padding: 10px; margin: 5px; border-radius: 5px;">
        <strong>Slot Name:</strong> ${slot.name}<br>
        <strong>Type:</strong> ${slot.type}<br>
        <strong>HRI String:</strong> ${slot.hriString}<br>
        <strong>Entity:</strong> ${slot.entity}
      </div>
    `
      )
      .join('');

    const formSlotsService = gridDataService
      .map(
        (slot) => `
      <div style="border: 1px solid #ccc; padding: 10px; margin: 5px; border-radius: 5px;">
        <strong>Slot Name:</strong> ${slot.name}<br>
        <strong>Type:</strong> ${slot.type}<br>
        <strong>eService Name:</strong> ${slot.eServiceName}<br>
        <strong>Service Info:</strong> ${slot.eServiceInfo}<br>
        <strong>Entity:</strong> ${slot.entity}
      </div>
    `
      )
      .join('');

    const formSlotsHRISection =
      gridDataHRI.length > 0
        ? `
      <div style="margin-top: 10px;">
        <h4 style="color: #0056b3;">Form Slots with HRI</h4>
        ${formSlotsHRI}
      </div>
    `
        : '';

    const formSlotsServiceSection =
      gridDataService.length > 0
        ? `
      <div style="margin-top: 10px;">
        <h4 style="color: #0056b3;">Form Slots with eService</h4>
        ${formSlotsService}
      </div>
    `
        : '';

    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9;">
        <h3 style="text-align: center; font-size: 18px; bold; color: #0056b3;">${formName}</h3>
        ${formSlotsHRISection}
        ${formSlotsServiceSection}
      </div>
    `;

    if (currentNode) {
      // Update the existing node
      currentNode.properties.shape.content = newNodeContent;
      currentNode.properties.addInfo = {
        formName,
        gridDataHRI,
        gridDataService,
      };
      diagramInstanceRef.current.dataBind(); // Refresh the diagram to reflect changes
    } else {
      // Create a new node
      const newNode = {
        id: `formNode_${Date.now()}`,
        offsetX: draggedNode.offsetX,
        offsetY: draggedNode.offsetY,
        width: 400,
        height: 300,
        shape: {
          type: 'HTML',
          content: newNodeContent,
        },
        annotations: [],
        addInfo: {
          formName,
          gridDataHRI,
          gridDataService,
        },
      };
      addNewNode(newNode);
    }

    setShowDialogForm(false); // Close the dialog form
    setCurrentNode(null); // Reset the current node
  };

  //DOULEIA EDW NA TA KANOUME OMORFA OLA TA HTML TEMPLATES

  const handleIntent = (intentName, intentStrings) => {
    const intentContent = intentStrings
      .map((str) => {
        const formattedString = str.string.replace(
          /(TE:\s*\w+|PE:\s*\w+)/g,
          '<strong>$1</strong>'
        );
        return `
          <div style="border: 1px solid #ccc; padding: 10px; margin: 5px; border-radius: 5px;">
           ${formattedString}
          </div>
        `;
      })
      .join('');

    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #ff5733; border-radius: 10px; background-color: #fff3e6;">
        <h3 style="text-align: center; color: #ff5733; font-size: 24px; font-weight: font-size: 18px; bold;;">${intentName}</h3>
        <div style="margin-top: 10px;">
          ${intentContent}
        </div>
      </div>
    `;

    if (currentNode) {
      // Update the existing node
      currentNode.properties.shape.content = newNodeContent;
      currentNode.properties.addInfo = {
        intentName,
        intentStrings,
      };
      diagramInstanceRef.current.dataBind(); // Refresh the diagram to reflect changes
    } else {
      // Create a new node
      const newNode = {
        id: `intentNode_${Date.now()}`,
        offsetX: draggedNode.offsetX,
        offsetY: draggedNode.offsetY,
        width: 600,
        height: 300,
        shape: {
          type: 'HTML',
          content: newNodeContent,
        },
        annotations: [],
        addInfo: {
          intentName,
          intentStrings,
        },
      };
      addNewNode(newNode);
    }

    setShowDialogIntent(false); // Close the dialog form
    setCurrentNode(null); // Reset the current node
  };

  const handleContextMenuClick = (args) => {
    if (args.item.id === 'delete') {
      if (diagramInstanceRef.current) {
        diagramInstanceRef.current.remove();
      }
    }
    if (args.item.id === 'entity') {
      console.log(diagramInstanceRef.current);
    }
  };

  const handleNodeDoubleClick = (args) => {
    if (args.source.id.startsWith('form')) {
      const { formName, gridDataHRI, gridDataService } =
        args.source.properties.addInfo;
      setShowDialogForm(true);
      setInitialFormName(formName);
      setInitialGridDataHRI(gridDataHRI);
      setInitialGridDataService(gridDataService);
      setCurrentNode(args.source); // Set the current node being edited
      setIsDoubleClick(true); // Set the flag to indicate double-click
    } else if (args.source.id.startsWith('intent')) {
      const { intentName, intentStrings } = args.source.properties.addInfo;
      setShowDialogIntent(true);
      setInitialIntentName(intentName);
      setInitialIntentStrings(intentStrings);
      setCurrentNode(args.source); // Set the current node being edited
      setIsDoubleClick(true); // Set the flag to indicate double-click
    }
  };

  // Add state to hold initial values for the form
  const [initialFormName, setInitialFormName] = useState('');
  const [initialGridDataHRI, setInitialGridDataHRI] = useState([]);
  const [initialGridDataService, setInitialGridDataService] = useState([]);
  const [isDoubleClick, setIsDoubleClick] = useState(false); // State to track if the dialog is opened by double-click
  const [initialIntentName, setInitialIntentName] = useState('');
  const [initialIntentStrings, setInitialIntentStrings] = useState([]);

  const menuItems = [
    {
      text: 'Diagram',
      items: [
        { text: 'Save Diagram', id: 'saveDiagram' },
        { text: 'Load Diagram', id: 'loadDiagram' },
        { text: 'Reset Diagram', id: 'resetDiagram' },
      ],
    },
    {
      text: 'Placeholder Options',
      items: [
        { text: 'Placeholder Option 1' },
        { text: 'Placeholder Option 2' },
      ],
    },
  ];

  const handleMenuClick = (args) => {
    switch (args.item.id) {
      case 'saveDiagram':
        handleSaveToFile();
        break;
      case 'loadDiagram':
        document.getElementById('loadDiagramInput').click();
        break;
      case 'resetDiagram':
        handleResetDiagram();
        break;
      default:
        break;
    }
  };

  let content;
  content = (
    <DiagramComponent
      id="container"
      width={'100%'}
      height={'1200px'}
      drop={(args) => {
        handleSymbolDrag(
          args,
          setShowDialogSpeak,
          setShowDialogEvent,
          setEventType,
          setShowDialogRest,
          setShowDialogGSlot,
          setShowDialogFSlot,
          setShowDialogForm,
          setShowDialogIntent,
          setDraggedNode
        );
        setIsDoubleClick(false); // Reset the flag when dragging from the symbol palette
      }}
      ref={(diagram) => {
        diagramInstanceRef.current = diagram;
      }}
      click={handleSaveDiagram}
      doubleClick={handleNodeDoubleClick} // Add double click event handler
      contextMenuSettings={{
        show: true,
        items: [
          { text: 'Delete', id: 'delete' }, // Add the Delete option
          { text: 'Set as Entity', id: 'entity' }, // Add a custom menu option
        ],
        showCustomMenuOnly: false,
      }}
      contextMenuClick={handleContextMenuClick} // Handle context menu click
    >
      <Inject services={[BpmnDiagrams, ConnectorEditing, DiagramContextMenu]} />
    </DiagramComponent>
  );

  return (
    <div className="content-area relative">
      <MenuComponent items={menuItems} select={handleMenuClick} />
      <div className="flex-col h-full">
        <div className="flex justify-between mb-4">
          <input
            type="file"
            accept=".json"
            className="hidden"
            id="loadDiagramInput"
            onChange={handleLoadFromFile}
          />
        </div>
        <div className="flex flex-1">
          <div className="flex-1 mb-9">{content}</div>
          {showDialogSpeak && (
            <DialogSpeak
              showDialogSpeak={showDialogSpeak}
              setShowDialogSpeak={setShowDialogSpeak}
              onTypeString={handleSpeakAction} // Pass handleSpeakAction directly
            />
          )}
          {showDialogEvent && (
            <DialogEvent
              showDialogEvent={showDialogEvent}
              setShowDialogEvent={setShowDialogEvent}
              eventType={eventType}
              onSelectEvent={handleSelectEvent}
            />
          )}
          {showDialogRest && (
            <DialogRest
              showDialogRest={showDialogRest}
              setShowDialogRest={setShowDialogRest}
              onSelectService={handleSelectService}
            />
          )}
          {showDialogGSlot && (
            <DialogGSlot
              showDialogGSlot={showDialogGSlot}
              setShowDialogGSlot={setShowDialogGSlot}
              handleSelectGSlot={handleSelectGSlot} // Pass the function
            />
          )}
          {showDialogForm && (
            <DialogForm
              showDialogForm={showDialogForm}
              setShowDialogForm={setShowDialogForm}
              handleForm={handleForm} // Pass handleForm as a prop
              initialFormName={isDoubleClick ? initialFormName : ''}
              initialGridDataHRI={isDoubleClick ? initialGridDataHRI : []}
              initialGridDataService={
                isDoubleClick ? initialGridDataService : []
              }
            />
          )}
          {showDialogIntent && (
            <DialogIntent
              showDialogIntent={showDialogIntent}
              setShowDialogIntent={setShowDialogIntent}
              handleIntent={handleIntent} // Pass handleIntent as a prop
              initialIntentName={isDoubleClick ? initialIntentName : ''}
              initialIntentStrings={isDoubleClick ? initialIntentStrings : []}
            />
          )}
          {showDialogFSlot && (
            <DialogFSlot
              showDialogFSlot={showDialogFSlot}
              setShowDialogFSlot={setShowDialogFSlot}
              handleSelectFSlot={handleSelectFSlot} // Pass the function
            />
          )}
        </div>
      </div>
      <DialoguesToolbar diagramInstanceRef={diagramInstanceRef} />
    </div>
  );
});

export default Dialogues;
