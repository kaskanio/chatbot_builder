import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useFetchEventQuery, useAddEventMutation } from '../../store';
import { useState, useRef } from 'react';
import Skeleton from '../modules/Skeleton';
import Button from '../modules/Button';
import { Spinner } from '@syncfusion/ej2-react-popups';
import { Box, Typography, Grid, TextField } from '@mui/material';
import './dialog.css';

function DialogEvent({
  showDialogEvent,
  setShowDialogEvent,
  eventType,
  onSelectEvent,
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const newEventNameRef = useRef('');
  const newEventUriRef = useRef('');
  const messageRef = useRef('');
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
    refetch,
  } = useFetchEventQuery();
  const [addEvent, addEventResults] = useAddEventMutation();

  const hideDialog = () => {
    setShowDialogEvent(false);
  };
  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  let eventsNames, content;

  if (eventsLoading) {
    eventsNames = <Skeleton className="h-10 w-full" times={3} />;
  } else if (eventsError) {
    eventsNames = <div>Error loading events.</div>;
  } else {
    eventsNames = eventsData.map((event) => event.name);
    eventsNames.push('Add New Event...');
    content = eventsData.map((event) => {
      if (selectedEvent === event.name) {
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
    const message = messageRef.current.value;
    if (selectedEvent === 'Add New Event...') {
      addEvent({ name: newEventName, uri: newEventUri, message })
        .unwrap()
        .then((newEvent) => {
          onSelectEvent(newEvent);
        })
        .catch((error) => {
          console.error('Error adding event:', error);
        });
    } else {
      const selectedEventObj = eventsData.find(
        (event) => event.name === selectedEvent
      );
      onSelectEvent({ ...selectedEventObj, message });
    }
  };

  const handleEventChange = (e) => {
    setSelectedEvent(e.value);
  };

  const footerTemplate = () => {
    return (
      <Box display="flex" flexDirection="column" width="100%">
        {selectedEvent === 'Add New Event...' && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                id="eventNameInput"
                inputRef={newEventNameRef}
                label="Event Name"
                fullWidth
                size="small"
                margin="dense"
                inputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="eventUriInput"
                inputRef={newEventUriRef}
                label="Event URI"
                fullWidth
                size="small"
                margin="dense"
                inputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
              />
            </Grid>
          </Grid>
        )}
        {eventType === 'Fire' && selectedEvent && (
          <Box mt={2}>
            <TextField
              id="messageInput"
              inputRef={messageRef}
              label="Message"
              fullWidth
              size="small"
              margin="dense"
              inputProps={{ style: { fontSize: 12 } }}
              InputLabelProps={{ style: { fontSize: 12 } }}
            />
          </Box>
        )}
        <Box display="flex" justifyContent="space-between" mt={2}>
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
        </Box>
      </Box>
    );
  };

  const header = eventType === 'Fire' ? 'Fire Event Action' : 'Event Trigger';

  return (
    <DialogComponent
      id="dialog"
      header={header}
      visible={showDialogEvent}
      close={hideDialog}
      width="600px"
      animationSettings={settings}
      footerTemplate={footerTemplate}
      enableResize={true}
      showCloseIcon={true}
      position={{ X: 'center', Y: '250' }}
      cssClass="custom-dialog"
    >
      <Box mt={2}>
        {eventsLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Spinner />
          </Box>
        ) : eventsError ? (
          <Box mt={4} textAlign="center">
            <Typography color="error">Error fetching events</Typography>
            <Button onClick={refetch} primary rounded>
              Retry
            </Button>
          </Box>
        ) : (
          <>
            <Typography mb={2} color="textSecondary">
              Please select an event from the list below:
            </Typography>
            <DropDownListComponent
              id="ddlelement"
              dataSource={eventsNames}
              placeholder="Select an Event"
              className="w-full"
              change={handleEventChange}
            />
            {selectedEvent && selectedEvent !== 'Add New Event...' && (
              <Box
                mt={2}
                p={2}
                border={1}
                borderColor="grey.300"
                borderRadius={1}
              >
                <Typography
                  variant="subtitle1"
                  mb={1}
                  sx={{
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: '1.25rem',
                  }}
                >
                  Event Details
                </Typography>
                <Typography variant="body2" sx={{ color: 'black' }}>
                  <strong>Name:</strong> {selectedEvent}
                </Typography>
                <Typography variant="body2" sx={{ color: 'black' }}>
                  <strong>URI:</strong>{' '}
                  {
                    eventsData.find((event) => event.name === selectedEvent)
                      ?.uri
                  }
                </Typography>
              </Box>
            )}
            <Box mt={-2}>{content}</Box>
          </>
        )}
      </Box>
    </DialogComponent>
  );
}

export default DialogEvent;
