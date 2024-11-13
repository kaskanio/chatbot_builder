// EventSelectionDialog.js
import React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useFetchEventQuery } from '../../store';

const EventSelectionDialog = ({ show, onClose, onSelectEvent }) => {
  const { data: eventsData, error, isLoading } = useFetchEventQuery();

  const dialogClose = () => {
    onClose();
  };

  const dialogOpen = () => {
    // Additional logic if needed when dialog opens
  };

  return (
    <DialogComponent
      width="400px"
      visible={show}
      header="Select an Event"
      showCloseIcon={true}
      close={dialogClose}
      open={dialogOpen}
    >
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading events</div>}
      {eventsData && (
        <ul>
          {eventsData.map((event) => (
            <li key={event.id} onClick={() => onSelectEvent(event)}>
              {event.name}
            </li>
          ))}
        </ul>
      )}
      <button onClick={onClose}>Close</button>
    </DialogComponent>
  );
};

export default EventSelectionDialog;
