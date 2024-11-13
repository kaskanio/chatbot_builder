import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useFetchEventQuery, useAddEventMutation } from '../../store';
import { useState, useRef } from 'react';
import Skeleton from '../modules/Skeleton';
import Button from '../modules/Button';

function DialogEvent({
  showDialogFireEvent,
  setShowDialogFireEvent,
  onSelectEvent,
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const newEventNameRef = useRef('');
  const newEventUriRef = useRef('');
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useFetchEventQuery();
  const [addEvent, addEventResults] = useAddEventMutation();

  const hideDialog = () => {
    setShowDialogFireEvent(false);
  };
  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  let eventsNames, content;

  if (eventsLoading) {
    eventsNames = <Skeleton className="h-10 w-full" times={3} />;
  } else if (eventsError) {
    eventsNames = <div>Error loading events.</div>;
  } else {
    eventsNames = eventsData.map((event) => {
      return `${event.name} (${event.uri})`;
    });
    eventsNames.push('Add New Event');
    content = eventsData.map((event) => {
      if (selectedEvent === `${event.name} (${event.uri})`) {
        if (event.strings) {
          return event.strings.map((string) => (
            <div
              key={string}
              className="mb-2 mt-2 flex justify-between mb-1 text-xs"
            >
              {'"' + string + '"'}{' '}
            </div>
          ));
        }
      }
      return null;
    });
  }

  const handleAddNodeEvent = (e) => {
    e.preventDefault();
    const newEventName = newEventNameRef.current.value;
    const newEventUri = newEventUriRef.current.value;
    if (selectedEvent === 'Add New Event') {
      addEvent({ name: newEventName, uri: newEventUri })
        .unwrap()
        .then((newEvent) => {
          onSelectEvent(newEvent);
        })
        .catch((error) => {
          console.error('Error adding event:', error);
        });
    } else {
      const selectedEventObj = eventsData.find(
        (event) => `${event.name} (${event.uri})` === selectedEvent
      );
      onSelectEvent(selectedEventObj);
    }
  };

  const handleEventChange = (e) => {
    setSelectedEvent(e.value);
  };

  const headerTemplate = () => {
    return (
      <div>
        <div title="Select Event" className="e-icon-settings dlg-template">
          Select Event
        </div>
      </div>
    );
  };

  const footerTemplate = () => {
    return (
      <div className="flex flex-col w-full">
        {selectedEvent === 'Add New Event' && (
          <div className="flex flex-col">
            <input
              id="eventNameInput"
              ref={newEventNameRef}
              type="text"
              placeholder="Event Name"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
            />
            <input
              id="eventUriInput"
              ref={newEventUriRef}
              type="text"
              placeholder="Event URI"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
            />
          </div>
        )}
        <div className="flex justify-between mt-4">
          <Button
            type="submit"
            primary
            loading={addEventResults.isLoading}
            rounded
            className="mr-2"
            onClick={handleAddNodeEvent}
          >
            Insert
          </Button>
          <Button
            onClick={hideDialog}
            type="button"
            danger
            rounded
            className="text-xs p-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  return (
    <DialogComponent
      id="dialog"
      header={headerTemplate}
      visible={showDialogFireEvent}
      close={hideDialog}
      width="600px"
      animationSettings={settings}
      footerTemplate={footerTemplate}
      enableResize={true}
    >
      <div className="mt-4">
        <DropDownListComponent
          id="ddlelement"
          dataSource={eventsNames}
          placeholder="Select an Event"
          className="w-full"
          change={handleEventChange}
        />
        <div>{content}</div>
      </div>
    </DialogComponent>
  );
}

export default DialogEvent;
