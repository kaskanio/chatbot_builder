import { useState } from 'react';

export const useDialogState = () => {
  const [showDialogSpeak, setShowDialogSpeak] = useState(false);
  const [showDialogEvent, setShowDialogEvent] = useState(false);
  const [eventType, setEventType] = useState('');
  const [showDialogRest, setShowDialogRest] = useState(false);
  const [showDialogGSlot, setShowDialogGSlot] = useState(false);
  const [showDialogFSlot, setShowDialogFSlot] = useState(false);
  const [showDialogForm, setShowDialogForm] = useState(false);
  const [showDialogIntent, setShowDialogIntent] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [initialFormName, setInitialFormName] = useState('');
  const [initialGridDataHRI, setInitialGridDataHRI] = useState([]);
  const [initialGridDataService, setInitialGridDataService] = useState([]);
  const [isDoubleClick, setIsDoubleClick] = useState(false);
  const [initialIntentName, setInitialIntentName] = useState('');
  const [initialIntentStrings, setInitialIntentStrings] = useState([]);
  const [initialPretrainedEntitiesData, setInitialPretrainedEntitiesData] =
    useState([]);

  return {
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
  };
};
