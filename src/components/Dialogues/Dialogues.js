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
import {
  handlePropertyChange,
  handleSymbolDrag,
  handleCollectionChange,
} from './handlers';
import { saveDiagramState, loadDiagramState } from '../../store/diagramSlice';

const Dialogues = forwardRef((props, ref) => {
  const [showDialogSpeak, setShowDialogSpeak] = useState(false);
  const [showDialogFireEvent, setShowDialogFireEvent] = useState(false);
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
  }, [diagramData]);

  const handleSaveDiagram = () => {
    if (diagramInstanceRef.current) {
      const serializedData = diagramInstanceRef.current.saveDiagram({
        exclude: ['width', 'height', 'viewport'],
      });
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

  const handleSelectEvent = (event) => {
    if (draggedNode) {
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
      addNewNode(draggedNode);
      setDraggedNode(null);
    }
    setShowDialogFireEvent(false);
  };

  let content;
  content = (
    <div>
      <DiagramComponent
        id="container"
        width={'100%'}
        height={'800px'}
        drop={(args) =>
          handleSymbolDrag(
            args,
            setShowDialogSpeak,
            setShowDialogFireEvent,
            setDraggedNode
          )
        }
        collectionChange={(args) => {
          handleCollectionChange(args);
        }}
        propertyChange={(args) => {
          handlePropertyChange(args);
        }}
        ref={(diagram) => {
          diagramInstanceRef.current = diagram;
        }}
        click={handleSaveDiagram}
        keyUp={(args = 'Delete' || 'Enter') => {
          handleSaveDiagram();
        }}
        contextMenuSettings={{
          show: true,
        }}
      >
        <Inject
          services={[BpmnDiagrams, ConnectorEditing, DiagramContextMenu]}
        />
      </DiagramComponent>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSaveToFile}
        >
          Save Diagram
        </button>
        <input
          type="file"
          accept=".json"
          className="hidden"
          id="loadDiagramInput"
          onChange={handleLoadFromFile}
        />
        <label
          htmlFor="loadDiagramInput"
          className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Load Diagram
        </label>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleResetDiagram}
        >
          Reset Diagram
        </button>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 mb-9">{content}</div>
        <div className="w-1/4 mb-9">
          <DialoguesToolbar diagramInstanceRef={diagramInstanceRef} />
        </div>
      </div>

      {showDialogFireEvent && (
        <DialogEvent
          showDialogFireEvent={showDialogFireEvent}
          setShowDialogFireEvent={setShowDialogFireEvent}
          nodeToAdd={draggedNode}
          onSelectEvent={handleSelectEvent}
        />
      )}
    </div>
  );
});

export default Dialogues;
