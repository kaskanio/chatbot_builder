import { useRef, useState, useEffect, forwardRef } from 'react';
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

import { handleSymbolDrag } from './handlers';
import { saveDiagramState, loadDiagramState } from '../../store/diagramSlice';
import Button from '../modules/Button';

const Dialogues = forwardRef((props, ref) => {
  const [showDialogSpeak, setShowDialogSpeak] = useState(false);
  const [showDialogFireEvent, setShowDialogFireEvent] = useState(false);
  const [showDialogRest, setShowDialogRest] = useState(false);
  const [showDialogGSlot, setShowDialogGSlot] = useState(false);
  const [showDialogForm, setShowDialogForm] = useState(false);

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

  let content;
  content = (
    <DiagramComponent
      id="container"
      width={'100%'}
      height={'1200px'}
      drop={(args) =>
        handleSymbolDrag(
          args,
          setShowDialogSpeak,
          setShowDialogFireEvent,
          setShowDialogRest,
          setShowDialogGSlot,
          setShowDialogForm,
          setDraggedNode
        )
      }
      ref={(diagram) => {
        diagramInstanceRef.current = diagram;
      }}
      click={handleSaveDiagram}
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
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default Dialogues;
