import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { useFetchFormSlotsQuery, useEditFormSlotMutation } from '../../store';
import { useState, useRef } from 'react';
import Skeleton from '../modules/Skeleton';
import Button from '../modules/Button';
import { Spinner } from '@syncfusion/ej2-react-popups';
import { Box, Typography } from '@mui/material';
import './dialog.css';

function DialogFSlot({
  showDialogFSlot,
  setShowDialogFSlot,
  handleSelectFSlot,
}) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const newSlotValueRef = useRef('');
  const {
    data: formSlotsData,
    error: formSlotsError,
    isLoading: formSlotsLoading,
    refetch: refetchFormSlots,
  } = useFetchFormSlotsQuery();
  const [editFormSlot, editFormSlotResults] = useEditFormSlotMutation();

  const hideDialog = () => {
    setShowDialogFSlot(false);
  };
  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  let formSlotsNames, content;

  if (formSlotsLoading) {
    formSlotsNames = <Skeleton className="h-10 w-full" times={3} />;
  } else if (formSlotsError) {
    formSlotsNames = <div>Error loading form slots.</div>;
  } else {
    formSlotsNames = formSlotsData.map((slot) => ({
      name: `${slot.name} (${slot.type})`,
      value: slot.name,
    }));
    content = formSlotsData.map((slot) => {
      if (selectedSlot === slot.name) {
        return (
          <div key={slot.id} className="flex items-center mb-2">
            <TextBoxComponent
              value={slot.value}
              ref={newSlotValueRef}
              placeholder="Enter value"
              floatLabelType="Auto"
              cssClass="e-outline"
            />
          </div>
        );
      }
      return null;
    });
  }

  const handleEditSlot = (e) => {
    e.preventDefault();
    const newSlotValue = newSlotValueRef.current.value;
    const selectedSlotObj = formSlotsData.find(
      (slot) => slot.name === selectedSlot
    );

    // Validate the input value based on the slot type
    if (selectedSlotObj.type === 'int' && isNaN(newSlotValue)) {
      setErrorMessage('The value must be an integer.');
      return;
    } else if (selectedSlotObj.type === 'str' && !isNaN(newSlotValue)) {
      setErrorMessage('The value must be a string.');
      return;
    }

    setErrorMessage(''); // Clear any previous error messages

    editFormSlot({
      id: selectedSlotObj.id,
      newName: selectedSlotObj.name,
      type: selectedSlotObj.type,
      value: newSlotValue,
    })
      .unwrap()
      .then((updatedSlot) => {
        handleSelectFSlot(updatedSlot); // Use the function
        setShowDialogFSlot(false);
      })
      .catch((error) => {
        console.error('Error editing slot:', error);
      });
  };

  const handleSlotChange = (e) => {
    setSelectedSlot(e.itemData.value);
    setErrorMessage(''); // Clear any previous error messages
  };

  const footerTemplate = () => {
    return (
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          type="submit"
          primary
          loading={editFormSlotResults.isLoading}
          rounded
          className="mr-2"
          onClick={handleEditSlot}
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
    );
  };

  return (
    <DialogComponent
      id="dialog"
      header="Set Form Slot"
      visible={showDialogFSlot}
      close={hideDialog}
      width="400px"
      animationSettings={settings}
      footerTemplate={footerTemplate}
      enableResize={true}
      showCloseIcon={true}
      position={{ X: 'center', Y: '250' }}
      cssClass="custom-dialog"
    >
      <Box mt={2}>
        {formSlotsLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Spinner />
          </Box>
        ) : formSlotsError ? (
          <Box mt={4} textAlign="center">
            <Typography color="error">Error fetching form slots</Typography>
            <Button onClick={refetchFormSlots} primary rounded>
              Retry
            </Button>
          </Box>
        ) : (
          <>
            <Typography mb={2} color="textSecondary">
              Select a form slot:
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <DropDownListComponent
                id="ddlelement"
                dataSource={formSlotsNames}
                fields={{ text: 'name', value: 'value' }}
                placeholder="Select a Form Slot"
                className="w-1/2 mr-2"
                change={handleSlotChange}
              />
            </Box>
            {selectedSlot && (
              <Box className="submenu">
                <Typography mb={2} color="textSecondary" variant="subtitle2">
                  Set a custom value:
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  {content}
                </Box>
              </Box>
            )}
            {errorMessage && (
              <Typography color="error" mt={2}>
                {errorMessage}
              </Typography>
            )}
          </>
        )}
      </Box>
    </DialogComponent>
  );
}

export default DialogFSlot;
