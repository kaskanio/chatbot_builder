// handlers.js
export function handleSymbolDrag(
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
) {
  const { element } = args;

  console.log('To stoixeio poy petaksa einai: ', element);
  if (element.id.startsWith('SpeakAction')) {
    setShowDialogSpeak(true);
    setDraggedNode(element);
    args.cancel = true;
  } else if (element.id.startsWith('FireEventAction')) {
    setShowDialogEvent(true);
    setEventType('Fire');
    setDraggedNode(element);
    args.cancel = true;
  } else if (element.id.startsWith('EventTrigger')) {
    setShowDialogEvent(true);
    setEventType('Trigger');
    setDraggedNode(element);
    args.cancel = true;
  } else if (element.id.startsWith('RESTCallAction')) {
    setShowDialogRest(true);
    setDraggedNode(element);
    args.cancel = true;
  } else if (element.id.startsWith('SetGlobalSlot')) {
    setShowDialogGSlot(true);
    setDraggedNode(element);
    args.cancel = true;
  } else if (element.id.startsWith('Form')) {
    setShowDialogForm(true);
    setDraggedNode(element);
    args.cancel = true;
  } else if (element.id.startsWith('Intent')) {
    setShowDialogIntent(true);
    setDraggedNode(element);
    args.cancel = true;
  } else if (element.id.startsWith('SetFormSlot')) {
    setShowDialogFSlot(true);
    setDraggedNode(element);
    args.cancel = true;
  }
}

export const handleSpeakAction = (
  actionString,
  speakActionName,
  draggedNode,
  addNewNode,
  setShowDialogSpeak
) => {
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
        "${formattedActionString}"
      </div>
    </div>
  `;

  const { contentWidth, contentHeight } = measureContentSize(newNodeContent);

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

export const handleSelectEvent = (
  event,
  eventType,
  draggedNode,
  addNewNode,
  setShowDialogEvent
) => {
  const isFireEvent = eventType === 'Fire';
  const headerText = isFireEvent ? 'Fire Event' : 'Event Trigger';
  const borderColor = isFireEvent ? '#0056b3' : '#ff5733';
  const backgroundColor = isFireEvent ? '#f9f9f9' : '#fff3e6';
  const headerColor = isFireEvent ? '#0056b3' : '#ff5733';

  const newNodeContent = `
    <div style="padding: 10px; border: 2px solid ${borderColor}; border-radius: 10px; background-color: ${backgroundColor}; height:100%;">
      <h3 style="text-align: center; color: ${headerColor}; font-size: 18px; font-weight: bold;">${headerText}</h3>
      <div style="margin-top: 10px;">
        <strong>Name:</strong> ${event.name}<br>
        <strong>URI:</strong> <i>${event.uri}</i>
        ${
          isFireEvent && event.message
            ? `<br><strong>Message:</strong> ${event.message}`
            : ''
        }
      </div>
    </div>
  `;

  const { contentWidth, contentHeight } = measureContentSize(newNodeContent);

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
      eventUri: event.uri,
      ...(isFireEvent && { message: event.message }),
    },
    annotations: [],
  };

  addNewNode(newNode);
  setShowDialogEvent(false);
};

export const handleSelectService = (
  service,
  draggedNode,
  addNewNode,
  setShowDialogRest
) => {
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

  const { contentWidth, contentHeight } = measureContentSize(newNodeContent);

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

export const handleSelectGSlot = (
  slot,
  draggedNode,
  addNewNode,
  setShowDialogGSlot
) => {
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

  const { contentWidth, contentHeight } = measureContentSize(newNodeContent);

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

export const handleSelectFSlot = (
  slot,
  draggedNode,
  addNewNode,
  setShowDialogFSlot
) => {
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

  const { contentWidth, contentHeight } = measureContentSize(newNodeContent);

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

export const handleForm = (
  formName,
  gridDataHRI,
  gridDataService,
  currentNode,
  draggedNode,
  addNewNode,
  setShowDialogForm,
  setCurrentNode,
  diagramInstanceRef // Add this parameter
) => {
  const combinedSlots = [...gridDataHRI, ...gridDataService].sort(
    (a, b) => a.order - b.order
  );

  const formSlotsContent = combinedSlots
    .map((slot) => {
      if (slot.hriString !== undefined) {
        return `<div><strong>${slot.hriString}</strong></div>`;
      } else {
        return `<div><strong>${slot.serviceString}</strong></div>`;
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
    currentNode.properties.shape.content = newNodeContent;
    currentNode.properties.addInfo = {
      formName,
      gridDataHRI,
      gridDataService,
    };
    currentNode.height =
      contentHeight - 24 * gridDataHRI.length - 42 * gridDataService.length;
    diagramInstanceRef.current.dataBind();
  } else {
    const newNode = {
      id: `formNode_${Date.now()}`,
      offsetX: draggedNode.offsetX,
      offsetY: draggedNode.offsetY,
      width: 200,
      height: contentHeight,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      addInfo: {
        formName,
        gridDataHRI,
        gridDataService,
      },
      annotations: [],
    };
    addNewNode(newNode);
  }

  setShowDialogForm(false);
  setCurrentNode(null);
};

export const handleIntent = (
  intentName,
  intentStrings,
  pretrainedEntitiesData,
  currentNode,
  draggedNode,
  addNewNode,
  setShowDialogIntent,
  setCurrentNode,
  diagramInstanceRef // Add this parameter
) => {
  const intentContent = intentStrings
    .map((str) => `<div>${str}</div>`)
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
    currentNode.properties.shape.content = newNodeContent;
    currentNode.properties.addInfo = {
      intentName,
      intentStrings,
      pretrainedEntitiesData,
    };
    currentNode.height = contentHeight;
    diagramInstanceRef.current.dataBind();
  } else {
    const newNode = {
      id: `intentNode_${Date.now()}`,
      offsetX: draggedNode.offsetX,
      offsetY: draggedNode.offsetY,
      width: contentWidth,
      height: contentHeight,
      shape: {
        type: 'HTML',
        content: newNodeContent,
      },
      addInfo: {
        intentName,
        intentStrings,
        pretrainedEntitiesData,
      },
      annotations: [],
    };
    addNewNode(newNode);
  }

  setShowDialogIntent(false);
  setCurrentNode(null);
};

const measureContentSize = (content) => {
  const tempElement = document.createElement('div');
  tempElement.style.position = 'absolute';
  tempElement.style.visibility = 'hidden';
  tempElement.innerHTML = content;
  document.body.appendChild(tempElement);

  const rect = tempElement.getBoundingClientRect();
  const contentWidth = rect.width;
  const contentHeight = rect.height;

  document.body.removeChild(tempElement);

  return { contentWidth, contentHeight };
};
