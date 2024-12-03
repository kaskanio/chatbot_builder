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
