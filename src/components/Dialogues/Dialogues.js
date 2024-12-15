import React, { useRef, useEffect, forwardRef } from 'react';
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
import DialogFSlot from './DialogFSlot';
import { MenuComponent } from '@syncfusion/ej2-react-navigations';

import { handleSymbolDrag } from './handlers';
import { saveDiagramState, loadDiagramState } from '../../store/diagramSlice';
import { useDialogState } from './dialogState';
import {
  handleSpeakAction,
  handleSelectEvent,
  handleSelectService,
  handleSelectGSlot,
  handleSelectFSlot,
  handleForm,
  handleIntent,
} from './handlers';

const Dialogues = forwardRef((props, ref) => {
  const {
    showDialogSpeak,
    setShowDialogSpeak,
    showDialogEvent,
    setShowDialogEvent,
    eventType,
    setEventType,
    showDialogRest,
    setShowDialogRest,
    showDialogGSlot,
    setShowDialogGSlot,
    showDialogFSlot,
    setShowDialogFSlot,
    showDialogForm,
    setShowDialogForm,
    showDialogIntent,
    setShowDialogIntent,
    currentNode,
    setCurrentNode,
    draggedNode,
    setDraggedNode,
    initialFormName,
    setInitialFormName,
    initialGridDataHRI,
    setInitialGridDataHRI,
    initialGridDataService,
    setInitialGridDataService,
    isDoubleClick,
    setIsDoubleClick,
    initialIntentName,
    setInitialIntentName,
    initialIntentStrings,
    setInitialIntentStrings,
    initialPretrainedEntitiesData,
    setInitialPretrainedEntitiesData,
  } = useDialogState();

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

  const addNewNode = (newNode) => {
    if (diagramInstanceRef.current) {
      diagramInstanceRef.current.add(newNode);
    }
  };

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
      const formattedData = JSON.stringify(JSON.parse(serializedData), null, 2);
      const blob = new Blob([formattedData], {
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
      dispatch(saveDiagramState(null));
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

  const handleNodeDoubleClick = (args) => {
    if (args.source.id.startsWith('form')) {
      const { formName, gridDataHRI, gridDataService } =
        args.source.properties.addInfo;
      setShowDialogForm(true);
      setInitialFormName(formName);
      setInitialGridDataHRI(gridDataHRI);
      setInitialGridDataService(gridDataService);
      setCurrentNode(args.source);
      setIsDoubleClick(true);
    } else if (args.source.id.startsWith('intent')) {
      const { intentName, intentStrings, pretrainedEntitiesData } =
        args.source.properties.addInfo;
      setShowDialogIntent(true);
      setInitialIntentName(intentName);
      setInitialIntentStrings(intentStrings);
      setInitialPretrainedEntitiesData(pretrainedEntitiesData);
      setCurrentNode(args.source);
      setIsDoubleClick(true);
    }
  };

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
      text: 'Database',
      items: [{ text: 'Reset Database', id: 'resetDB' }],
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
        setIsDoubleClick(false);
      }}
      ref={(diagram) => {
        diagramInstanceRef.current = diagram;
      }}
      click={handleSaveDiagram}
      doubleClick={handleNodeDoubleClick}
      contextMenuSettings={{
        show: true,
        items: [{ text: 'Delete', id: 'delete' }],
        showCustomMenuOnly: false,
      }}
      contextMenuClick={handleContextMenuClick}
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
              onTypeString={(actionString, speakActionName) =>
                handleSpeakAction(
                  actionString,
                  speakActionName,
                  draggedNode,
                  addNewNode,
                  setShowDialogSpeak
                )
              }
            />
          )}
          {showDialogEvent && (
            <DialogEvent
              showDialogEvent={showDialogEvent}
              setShowDialogEvent={setShowDialogEvent}
              eventType={eventType}
              onSelectEvent={(event) =>
                handleSelectEvent(
                  event,
                  eventType,
                  draggedNode,
                  addNewNode,
                  setShowDialogEvent
                )
              }
            />
          )}
          {showDialogRest && (
            <DialogRest
              showDialogRest={showDialogRest}
              setShowDialogRest={setShowDialogRest}
              onSelectService={(service) =>
                handleSelectService(
                  service,
                  draggedNode,
                  addNewNode,
                  setShowDialogRest
                )
              }
            />
          )}
          {showDialogGSlot && (
            <DialogGSlot
              showDialogGSlot={showDialogGSlot}
              setShowDialogGSlot={setShowDialogGSlot}
              handleSelectGSlot={(slot) =>
                handleSelectGSlot(
                  slot,
                  draggedNode,
                  addNewNode,
                  setShowDialogGSlot
                )
              }
            />
          )}
          {showDialogForm && (
            <DialogForm
              showDialogForm={showDialogForm}
              setShowDialogForm={setShowDialogForm}
              handleForm={(formName, gridDataHRI, gridDataService) =>
                handleForm(
                  formName,
                  gridDataHRI,
                  gridDataService,
                  currentNode,
                  draggedNode,
                  addNewNode,
                  setShowDialogForm,
                  setCurrentNode,
                  diagramInstanceRef // Pass this parameter
                )
              }
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
              handleIntent={(
                intentName,
                intentStrings,
                pretrainedEntitiesData
              ) =>
                handleIntent(
                  intentName,
                  intentStrings,
                  pretrainedEntitiesData,
                  currentNode,
                  draggedNode,
                  addNewNode,
                  setShowDialogIntent,
                  setCurrentNode,
                  diagramInstanceRef // Pass this parameter
                )
              }
              initialIntentName={isDoubleClick ? initialIntentName : ''}
              initialIntentStrings={isDoubleClick ? initialIntentStrings : []}
              initialPretrainedEntitiesData={
                isDoubleClick ? initialPretrainedEntitiesData : []
              }
            />
          )}
          {showDialogFSlot && (
            <DialogFSlot
              showDialogFSlot={showDialogFSlot}
              setShowDialogFSlot={setShowDialogFSlot}
              handleSelectFSlot={(slot) =>
                handleSelectFSlot(
                  slot,
                  draggedNode,
                  addNewNode,
                  setShowDialogFSlot
                )
              }
            />
          )}
        </div>
      </div>
      <DialoguesToolbar diagramInstanceRef={diagramInstanceRef} />
    </div>
  );
});

export default Dialogues;
