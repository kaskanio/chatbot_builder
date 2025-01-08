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
import DialoguesMenu from './DialoguesMenu';
import { handleSymbolDrag } from './handlers';
import { saveDiagramState, loadDiagramState } from '../../store/diagramSlice';
import axios from 'axios';

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

  useEffect(() => {
    const loadDiagramFromServer = async () => {
      try {
        const response = await axios.get('http://localhost:8000/load-diagram');
        const diagramData = response.data;
        if (diagramInstanceRef.current && diagramData) {
          diagramInstanceRef.current.loadDiagram(diagramData);
          dispatch(loadDiagramState(diagramData));
        }
      } catch (error) {
        console.error(
          'An error occurred while loading the diagram:',
          error.message
        );
      }
    };

    loadDiagramFromServer();
  }, [dispatch]);

  const handleSaveDiagram = async () => {
    if (diagramInstanceRef.current) {
      const serializedData = diagramInstanceRef.current.saveDiagram();
      dispatch(saveDiagramState(serializedData));
      const formattedData = JSON.stringify(JSON.parse(serializedData), null, 2);
      try {
        await axios.post('http://localhost:8000/save-diagram', {
          filename: 'diagram.json',
          directory: '', // You can specify a directory if needed
          data: formattedData,
        });
      } catch (error) {
        console.error(
          'An error occurred while saving the diagram:',
          error.message
        );
      }
    }
  };

  const addNewNode = (node) => {
    diagramInstanceRef.current.addNode(node);
  };

  const handleSpeakAction = (actionString, speakActionName) => {
    // Use a regular expression to find words separated by a dot and wrap them in <strong> tags
    const formattedActionString = actionString.replace(
      /(\b\w+\.\w+\b)/g,
      '<strong>$1</strong>'
    );

    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9; height:100%;">
        <h3 style="text-align: center; color: #0056b3; font-size: 24px; font-weight: bold;">
          Speak Action: ${speakActionName}
        </h3>
        <div style="margin-top: 10px;">
          ${formattedActionString}
        </div>
      </div>
    `;

    // Create a temporary element to measure the content size
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.innerHTML = newNodeContent;
    document.body.appendChild(tempElement);

    // Measure the size of the content using getBoundingClientRect
    const rect = tempElement.getBoundingClientRect();
    const contentWidth = rect.width;
    const contentHeight = rect.height;

    // Remove the temporary element
    document.body.removeChild(tempElement);

    const newNode = {
      id: `speakNode_${Date.now()}`,
      offsetX: draggedNode.offsetX,
      offsetY: draggedNode.offsetY,
      width: contentWidth,
      height: contentHeight,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      addInfo: {
        actionType: 'SpeakAction',
        actionString,
        speakActionName,
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

    const uriToDisplay = event.changedUri || event.uri;
    console.log('Event: ', event);

    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid ${borderColor}; border-radius: 10px; background-color: ${backgroundColor}; height:100%;">
        <h3 style="text-align: center; color: ${headerColor}; font-size: 18px; font-weight: bold;">${headerText}</h3>
        <div style="margin-top: 10px;">
          <strong>Name:</strong> ${event.name}<br>
          <strong>URI:</strong> <i>${uriToDisplay}</i>
          ${
            isFireEvent && event.message
              ? `<br><strong>Message:</strong> ${event.message}`
              : ''
          }
        </div>
      </div>
    `;

    // Create a temporary element to measure the content size
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.innerHTML = newNodeContent;
    document.body.appendChild(tempElement);

    // Measure the size of the content using getBoundingClientRect
    const rect = tempElement.getBoundingClientRect();
    const contentWidth = rect.width;
    const contentHeight = rect.height;

    // Remove the temporary element
    document.body.removeChild(tempElement);

    const newNode = {
      id: `eventNode_${Date.now()}`,
      offsetX: draggedNode.offsetX,
      offsetY: draggedNode.offsetY,
      width: contentWidth,
      height: contentHeight,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      addInfo: {
        actionType: headerText,
        eventName: event.name,
        eventUri: uriToDisplay,
        ...(isFireEvent && { message: event.message }),
      },
      annotations: [],
    };

    console.log(newNode);

    addNewNode(newNode);
    setShowDialogEvent(false);
  };

  const handleSelectService = (service) => {
    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9; height:100%;">
        <h3 style="text-align: center; color: #0056b3; font-size: 18px; font-weight: bold;">Call Service</h3>
        <div style="margin-top: 10px;">
          <strong>Name:</strong> ${service.name}<br>
          <strong>HTTP Verb:</strong> ${service.verb}<br>
          <strong>Host:</strong> ${service.host}<br>
          <strong>Port:</strong> ${service.port}<br>
          <strong>Path:</strong> ${service.path}<br>
          <strong>Query:</strong> ${service.query || ''}<br>
          <strong>Header:</strong> ${service.header || ''}<br>
          <strong>Body:</strong> ${service.body || ''}<br>
        </div>
      </div>
    `;

    // Create a temporary element to measure the content size
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.innerHTML = newNodeContent;
    document.body.appendChild(tempElement);

    // Measure the size of the content using getBoundingClientRect
    const rect = tempElement.getBoundingClientRect();
    const contentWidth = rect.width;
    const contentHeight = rect.height;

    // Remove the temporary element
    document.body.removeChild(tempElement);

    const newNode = {
      id: `serviceNode_${Date.now()}`,
      offsetX: draggedNode.offsetX,
      offsetY: draggedNode.offsetY,
      width: contentWidth,
      height: contentHeight,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      addInfo: {
        actionType: 'RestAction',
        serviceName: service.name,
        serviceVerb: service.verb,
        serviceHost: service.host,
        servicePort: service.port,
        servicePath: service.path,
        serviceQuery: service.query,
        serviceHeader: service.header,
        serviceBody: service.body,
      },
      annotations: [],
    };
    addNewNode(newNode);
    setShowDialogRest(false);
  };

  const handleSelectGSlot = (slot) => {
    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9; height:100%;">
        <h3 style="text-align: center; color: #0056b3; font-size: 18px; font-weight: bold;">Set Global Slot</h3>
        <div style="margin-top: 10px;">
          <strong>Name:</strong> ${slot.name}<br>
          <strong>Type:</strong> ${slot.type}<br>
          <strong>Value:</strong> ${slot.value}
        </div>
      </div>
    `;

    // Create a temporary element to measure the content size
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.innerHTML = newNodeContent;
    document.body.appendChild(tempElement);

    // Measure the size of the content using getBoundingClientRect
    const rect = tempElement.getBoundingClientRect();
    const contentWidth = rect.width;
    const contentHeight = rect.height;

    // Remove the temporary element
    document.body.removeChild(tempElement);

    const newNode = {
      id: `gSlotNode_${Date.now()}`,
      offsetX: draggedNode.offsetX,
      offsetY: draggedNode.offsetY,
      width: contentWidth,
      height: contentHeight,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      addInfo: {
        actionType: 'GlobalSlot',
        slotName: slot.name,
        slotType: slot.type,
        slotValue: slot.value,
      },
      annotations: [],
    };
    addNewNode(newNode);
    setShowDialogGSlot(false);
  };

  const handleSelectFSlot = (slot) => {
    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9; height:100%;">
        <h3 style="text-align: center; color: #0056b3; font-size: 18px; font-weight: bold;">Set Form Slot</h3>
        <div style="margin-top: 10px;">
          <strong>Name:</strong> ${slot.name}<br>
          <strong>Type:</strong> ${slot.type}<br>
          <strong>Value:</strong> ${slot.value}
        </div>
      </div>
    `;

    // Create a temporary element to measure the content size
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.innerHTML = newNodeContent;
    document.body.appendChild(tempElement);

    // Measure the size of the content using getBoundingClientRect
    const rect = tempElement.getBoundingClientRect();
    const contentWidth = rect.width;
    const contentHeight = rect.height;

    // Remove the temporary element
    document.body.removeChild(tempElement);

    const newNode = {
      id: `fSlotNode_${Date.now()}`,
      offsetX: draggedNode.offsetX,
      offsetY: draggedNode.offsetY,
      width: contentWidth,
      height: contentHeight,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      addInfo: {
        actionType: 'FormSlot',
        slotName: slot.name,
        slotType: slot.type,
        slotValue: slot.value,
      },
      annotations: [],
    };
    addNewNode(newNode);
    setShowDialogFSlot(false);
  };

  const measureContentSize = (content) => {
    // Create a temporary element to measure the content size
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.innerHTML = content;
    document.body.appendChild(tempElement);

    // Measure the size of the content using getBoundingClientRect
    const rect = tempElement.getBoundingClientRect();
    const contentWidth = rect.width;
    const contentHeight = rect.height;

    // Remove the temporary element
    document.body.removeChild(tempElement);

    return { contentWidth, contentHeight };
  };

  const handleForm = (formName, gridDataHRI, gridDataService) => {
    console.log('Form Name:', formName);
    console.log('HRI Grid Data:', gridDataHRI);
    console.log('Service Grid Data:', gridDataService);

    // Combine and sort the form slots by order
    const combinedSlots = [...gridDataHRI, ...gridDataService].sort(
      (a, b) => a.order - b.order
    );

    // Generate the HTML content based on the sorted array
    const formSlotsContent = combinedSlots
      .map((slot) => {
        if (slot.hriString !== undefined) {
          // HRI slot
          return `
            <div style="margin-top: 10px;">
              <h4 style="color: #0056b3;">${slot.name}</h4>
            </div>
            <div style="border: 1px solid #ccc; padding: 10px; margin: 5px; border-radius: 5px;">
              <strong>Type:</strong> ${slot.type}<br>
              <strong>HRI String:</strong> ${slot.hriString}<br>
              <strong>Value:</strong> ${slot.value}<br>
              <strong>Entity:</strong> ${slot.entity}
            </div>
          `;
        } else {
          // Service slot
          return `
            <div style="margin-top: 10px;">
              <h4 style="color: #0056b3;">${slot.name}</h4>
            </div>
            <div style="border: 1px solid #ccc; padding: 10px; margin: 5px; border-radius: 5px;">
              <strong>Type:</strong> ${slot.type}<br>
              <strong>Service:</strong> ${slot.eServiceName}<br>
              <div style="margin-left: 10px;">
                <strong>Query:</strong> ${slot.query}<br>
                <strong>Header:</strong> ${slot.header}<br>
                <strong>Path:</strong> ${slot.path}<br>
                <strong>Body:</strong> ${slot.body}
              </div>
            </div>
          `;
        }
      })
      .join('');

    const newNodeContent = `
      <div style="padding: 10px; border: 2px solid #0056b3; border-radius: 10px; background-color: #f9f9f9;">
        <h3 style="text-align: center; font-size: 18px; bold; color: #0056b3;">${formName}</h3>
        ${formSlotsContent}
      </div>
    `;

    const { contentHeight } = measureContentSize(newNodeContent);

    if (currentNode) {
      // Update the existing node
      currentNode.properties.shape.content = newNodeContent;
      currentNode.properties.addInfo = {
        formName,
        gridDataHRI,
        gridDataService,
      };
      currentNode.height =
        contentHeight - 30 * gridDataHRI.length - 42 * gridDataService.length;
      diagramInstanceRef.current.dataBind(); // Refresh the diagram to reflect changes
    } else {
      // Create a new node
      console.log(contentHeight);
      const newNode = {
        id: `formNode_${Date.now()}`,
        offsetX: draggedNode.offsetX,
        offsetY: draggedNode.offsetY,
        width: 600,
        height:
          contentHeight - 30 * gridDataHRI.length - 42 * gridDataService.length, // 24 pixels for each HRI slot, 54 pixels for each service slot
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

  const handleIntent = (intentName, intentStrings, pretrainedEntitiesData) => {
    const intentContent = intentStrings
      .map((str) => {
        const formattedString = str.string.replace(
          /(TE:\w+|PE:\w+|S:\w+)/g,
          '<strong>$1</strong>'
        );
        return `
          <div style="border: 1px solid #ccc; padding: 10px; margin: 5px; border-radius: 5px;">
           ${formattedString}
          </div>
        `;
      })
      .join('');

    const uniqueId = `intentNode_${Date.now()}`;
    const newNodeContent = `
      <div id="${uniqueId}" style="padding: 10px; border: 2px solid #ff5733; border-radius: 10px; background-color: #fff3e6;">
        <h3 style="text-align: center; color: #ff5733; font-size: 24px; font-weight: font-size: 18px; bold;;">${intentName}</h3>
        <div style="margin-top: 10px;">
          ${intentContent}
        </div>
      </div>
    `;

    const { contentWidth, contentHeight } = measureContentSize(newNodeContent);

    if (currentNode) {
      // Update the existing node
      currentNode.properties.shape.content = newNodeContent;
      currentNode.width = contentWidth;
      currentNode.height = contentHeight - 6 * intentStrings.length; // 6 pixels per string
      currentNode.properties.addInfo = {
        intentName,
        intentStrings,
        pretrainedEntitiesData, // Include pretrainedEntitiesData
      };
      diagramInstanceRef.current.dataBind(); // Refresh the diagram to reflect changes
      console.log('Add Info: ', currentNode.properties.addInfo);
    } else {
      // Create a new node
      const newNode = {
        id: uniqueId,
        offsetX: draggedNode.offsetX,
        offsetY: draggedNode.offsetY,
        width: contentWidth,
        height: contentHeight - 6 * intentStrings.length, // 6 pixels per string
        shape: {
          type: 'HTML',
          content: newNodeContent,
        },
        annotations: [],
        addInfo: {
          intentName,
          intentStrings,
          pretrainedEntitiesData, // Include pretrainedEntitiesData
        },
      };
      console.log('Add Info: ', newNode.addInfo);
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
      const { intentName, intentStrings, pretrainedEntitiesData } =
        args.source.properties.addInfo;
      setShowDialogIntent(true);
      setInitialIntentName(intentName);
      setInitialIntentStrings(intentStrings);
      setInitialPretrainedEntitiesData(pretrainedEntitiesData); // Pass pretrainedEntitiesData
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
  const [initialPretrainedEntitiesData, setInitialPretrainedEntitiesData] =
    useState([]); // Add this state

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
        ],
        showCustomMenuOnly: false,
      }}
      contextMenuClick={handleContextMenuClick} // Handle context menu click
      scrollSettings={{
        scrollLimit: 'Infinity',
      }}
    >
      <Inject services={[BpmnDiagrams, ConnectorEditing, DiagramContextMenu]} />
    </DiagramComponent>
  );

  return (
    <div className="content-area relative">
      <DialoguesMenu diagramInstanceRef={diagramInstanceRef} />
      <div className="flex-col h-full">
        <div className="flex justify-between mb-4"></div>
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
