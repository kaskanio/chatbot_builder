import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DiagramComponent,
  Inject,
  BpmnDiagrams,
  ConnectorEditing,
  DiagramContextMenu,
  AnnotationConstraints,
} from '@syncfusion/ej2-react-diagrams';
import DialoguesToolbar from './DialoguesToolbar';
import DialogSpeak from './DialogSpeak';
import DialogEvent from './DialogEvent';
import DialogRest from './DialogRest';
import DialogGSlot from './DialogGSlot';
import DialogForm from './DialogForm';
import DialogIntent from './DialogIntent';

import { handleSymbolDrag } from './handlers';
import { saveDiagramState, loadDiagramState } from '../../store/diagramSlice';
import Button from '../modules/Button';

const Dialogues = forwardRef((props, ref) => {
  const [showDialogSpeak, setShowDialogSpeak] = useState(false);
  const [showDialogFireEvent, setShowDialogFireEvent] = useState(false);
  const [showDialogRest, setShowDialogRest] = useState(false);
  const [showDialogGSlot, setShowDialogGSlot] = useState(false);
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
    if (draggedNode) {
      if (draggedNode.properties.shape.activity.task.type === 'User') {
        const newAnnotation = {
          content: `"${actionString}"`, // Wrap the actionString in quotes
          offset: { x: 0.5, y: 0.5 }, // Position at the center
          style: {
            color: '#000000', // Text color
            fontSize: 15, // Font size
            fontFamily: 'Arial', // Font family
            italic: true, // Italic text
            strokeColor: '#0056b3', // Border color
            strokeWidth: 2, // Border width
            textAlign: 'Center', // Text alignment
            textOverflow: 'Wrap', // Text overflow
            padding: { left: 10, right: 10, top: 5, bottom: 5 }, // Padding
            shadow: {
              angle: 45, // Shadow angle
              distance: 5, // Shadow distance
              opacity: 0.5, // Shadow opacity
              color: '#000000', // Shadow color
            },
          },
          constraints: AnnotationConstraints.ReadOnly, // Make it non-editable
        };
        draggedNode.properties.annotations = [
          ...(draggedNode.properties.annotations || []),
          newAnnotation,
        ];
        setShowDialogSpeak(false);
      }
      addNewNode(draggedNode);
      setDraggedNode(null);
    }
  };

  const handleSelectEvent = (event) => {
    console.log('Selected event:', event);
    // Handle the selected event here
    if (draggedNode) {
      if (
        draggedNode.properties.shape.activity.task.type ===
        'InstantiatingReceive'
      ) {
        const newAnnotation = {
          content: event.name,
          offset: { x: 0.5, y: 0.5 }, // Adjust the offset as needed
          style: {
            color: '#000000', // Text color
            fontSize: 12, // Font size
            fontFamily: 'Arial', // Font family
            bold: true, // Bold text
            italic: false, // Italic text
            textAlign: 'Center', // Text alignment
          },
          constraints: AnnotationConstraints.ReadOnly, // Make it non-editable
        };
        draggedNode.properties.annotations = [
          ...(draggedNode.properties.annotations || []),
          newAnnotation,
        ];
        setShowDialogFireEvent(false);
        addNewNode(draggedNode);
        setDraggedNode(null);
      }
    }
  };

  const handleSelectService = (service) => {
    if (draggedNode) {
      const newAnnotation = {
        content: `\n\nName: ${service.name}\nHTTP Verb: ${service.verb}\nHost: ${service.host}\nPort: ${service.port}\nPath: ${service.path}`,
        offset: { x: 0.5, y: 0.5 }, // Position at the center
        style: {
          color: '#000000', // Text color
          fontSize: 12, // Font size
          fontFamily: 'Arial', // Font family
          textAlign: 'Left', // Text alignment
          textOverflow: 'Wrap', // Text overflow
          padding: { left: 10, right: 10, top: 5, bottom: 5 }, // Padding
          border: { color: '#0056b3', width: 1 }, // Border
          background: '#f0f0f0', // Background color
        },
        constraints: AnnotationConstraints.ReadOnly, // Make it non-editable
      };
      draggedNode.properties.annotations = [
        ...(draggedNode.properties.annotations || []),
        newAnnotation,
      ];
      addNewNode(draggedNode);
      setDraggedNode(null);
    }
  };

  const handleSelectGSlot = (slot) => {
    if (draggedNode) {
      const newAnnotation = {
        content: `${slot.name}\nType: ${slot.type}\nValue: ${slot.value}`,
        offset: { x: 0.5, y: 0.5 }, // Position at the center
        style: {
          color: '#000000', // Text color
          fontSize: 12, // Font size
          fontFamily: 'Arial', // Font family
          textAlign: 'Center', // Text alignment
          textOverflow: 'Wrap', // Text overflow
          padding: { left: 10, right: 10, top: 5, bottom: 5 }, // Padding
          border: { color: '#0056b3', width: 1 }, // Border
          background: '#f0f0f0', // Background color
        },
        constraints: AnnotationConstraints.ReadOnly, // Make it non-editable
      };
      draggedNode.properties.annotations = [
        ...(draggedNode.properties.annotations || []),
        newAnnotation,
      ];
      addNewNode(draggedNode);
      setDraggedNode(null);
    }
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

    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9;">
        <h3 style="text-align: center; color: #0056b3;">${formName}</h3>
        <div style="margin-top: 10px;">
          <h4 style="color: #0056b3;">Form Slots with HRI</h4>
          ${formSlotsHRI}
        </div>
        <div style="margin-top: 10px;">
          <h4 style="color: #0056b3;">Form Slots with eService</h4>
          ${formSlotsService}
        </div>
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
        offsetX: 300,
        offsetY: 300,
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

  const handleIntent = (intentName, intentStrings) => {
    const intentContent = intentStrings
      .map(
        (str) => `
        <div style="border: 1px solid #ccc; padding: 10px; margin: 5px; border-radius: 5px;">
          <strong>Intent String:</strong> ${str.string}
        </div>
      `
      )
      .join('');

    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #ff5733; border-radius: 10px; background-color: #fff3e6;">
        <h3 style="text-align: center; color: #ff5733;">${intentName}</h3>
        <div style="margin-top: 10px;">
          ${intentContent}
        </div>
      </div>
    `;

    const newNode = {
      id: `intentNode_${Date.now()}`,
      offsetX: 300,
      offsetY: 300,
      width: 400,
      height: 300,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      annotations: [],
    };
    addNewNode(newNode);
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
    if (args.source.properties.shape.type === 'HTML') {
      const { formName, gridDataHRI, gridDataService } =
        args.source.properties.addInfo;
      setShowDialogForm(true);
      setInitialFormName(formName);
      setInitialGridDataHRI(gridDataHRI);
      setInitialGridDataService(gridDataService);
      setCurrentNode(args.source); // Set the current node being edited
      setIsDoubleClick(true); // Set the flag to indicate double-click
    }
  };

  // Add state to hold initial values for the form
  const [initialFormName, setInitialFormName] = useState('');
  const [initialGridDataHRI, setInitialGridDataHRI] = useState([]);
  const [initialGridDataService, setInitialGridDataService] = useState([]);
  const [isDoubleClick, setIsDoubleClick] = useState(false); // State to track if the dialog is opened by double-click

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
          setShowDialogFireEvent,
          setShowDialogRest,
          setShowDialogGSlot,
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
    <div>
      <div className=" flex-col h-full">
        <div className="flex justify-between mb-4">
          <Button onClick={handleSaveToFile} primary rounded>
            Save Diagram
          </Button>
          <input
            type="file"
            accept=".json"
            className="hidden"
            id="loadDiagramInput"
            onChange={handleLoadFromFile}
          />
          <label
            htmlFor="loadDiagramInput"
            className="label-hover-effect flex items-center px-4 py-1.5 h-12 rounded-full"
          >
            Load Diagram
          </label>
          <Button rounded danger onClick={handleResetDiagram}>
            Reset Diagram
          </Button>
        </div>
        <div className="flex flex-1">
          <div className="flex-1 mb-9">{content}</div>
          <div className="w-1/4 mb-9">
            <DialoguesToolbar diagramInstanceRef={diagramInstanceRef} />
          </div>
          {showDialogSpeak && (
            <DialogSpeak
              showDialogSpeak={showDialogSpeak}
              setShowDialogSpeak={setShowDialogSpeak}
              onTypeString={handleSpeakAction} // Pass handleSpeakAction directly
            />
          )}
          {showDialogFireEvent && (
            <DialogEvent
              showDialogFireEvent={showDialogFireEvent}
              setShowDialogFireEvent={setShowDialogFireEvent}
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
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default Dialogues;
