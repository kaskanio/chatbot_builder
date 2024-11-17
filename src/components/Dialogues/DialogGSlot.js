import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import {
  useFetchGlobalSlotsQuery,
  useEditGlobalSlotMutation,
  useFetchFormSlotsQuery,
} from '../../store';
import { useState, useRef } from 'react';
import Skeleton from '../modules/Skeleton';
import Button from '../modules/Button';
import { Spinner } from '@syncfusion/ej2-react-popups';
import { Box, Typography } from '@mui/material';
import './dialog.css';

function DialogGSlot({
  showDialogGSlot,
  setShowDialogGSlot,
  handleSelectGSlot,
}) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedFormSlot, setSelectedFormSlot] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const newSlotValueRef = useRef('');
  const {
    data: slotsData,
    error: slotsError,
    isLoading: slotsLoading,
    refetch: refetchSlots,
  } = useFetchGlobalSlotsQuery();
  const {
    data: formSlotsData,
    error: formSlotsError,
    isLoading: formSlotsLoading,
    refetch: refetchFormSlots,
  } = useFetchFormSlotsQuery();
  const [editGlobalSlot, editGlobalSlotResults] = useEditGlobalSlotMutation();

  const hideDialog = () => {
    setShowDialogGSlot(false);
  };
  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  let slotsNames, formSlotsNames, content;

  if (slotsLoading) {
    slotsNames = <Skeleton className="h-10 w-full" times={3} />;
  } else if (slotsError) {
    slotsNames = <div>Error loading slots.</div>;
  } else {
    slotsNames = slotsData.map((slot) => ({
      name: `${slot.name} (${slot.type})`,
      value: slot.name,
    }));
    content = slotsData.map((slot) => {
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

  if (formSlotsLoading) {
    formSlotsNames = <Skeleton className="h-10 w-full" times={3} />;
  } else if (formSlotsError) {
    formSlotsNames = <div>Error loading form slots.</div>;
  } else {
    formSlotsNames = formSlotsData.map((slot) => ({
      name: `${slot.name} (${slot.type})`,
      value: slot.name,
    }));
  }

  const handleEditSlot = (e) => {
    e.preventDefault();
    const newSlotValue = newSlotValueRef.current.value;
    const selectedSlotObj = slotsData.find(
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

    editGlobalSlot({
      id: selectedSlotObj.id,
      newName: selectedSlotObj.name,
      type: selectedSlotObj.type,
      value: newSlotValue,
    })
      .unwrap()
      .then((updatedSlot) => {
        handleSelectGSlot(updatedSlot); // Use the function
        setShowDialogGSlot(false);
      })
      .catch((error) => {
        console.error('Error editing slot:', error);
      });
  };

  const handleSlotChange = (e) => {
    setSelectedSlot(e.itemData.value);
    setErrorMessage(''); // Clear any previous error messages
  };

  const handleFormSlotChange = (e) => {
    setSelectedFormSlot(e.itemData.value);
    const selectedFormSlotObj = formSlotsData.find(
      (slot) => slot.name === e.itemData.value
    );
    if (selectedFormSlotObj) {
      newSlotValueRef.current.value = selectedFormSlotObj.value;
    }
    setErrorMessage(''); // Clear any previous error messages
  };

  const footerTemplate = () => {
    return (
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          type="submit"
          primary
          loading={editGlobalSlotResults.isLoading}
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
      header="Edit Global Slot"
      visible={showDialogGSlot}
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
        {slotsLoading || formSlotsLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Spinner />
          </Box>
        ) : slotsError ? (
          <Box mt={4} textAlign="center">
            <Typography color="error">Error fetching slots</Typography>
            <Button onClick={refetchSlots} primary rounded>
              Retry
            </Button>
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
              Select a global slot:
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <DropDownListComponent
                id="ddlelement"
                dataSource={slotsNames}
                fields={{ text: 'name', value: 'value' }}
                placeholder="Select a Global Slot"
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
                <Typography mb={2} color="textSecondary" variant="subtitle2">
                  Or set value from form slot:
                </Typography>
                <Box display="flex" alignItems="center">
                  <DropDownListComponent
                    id="formSlotElement"
                    dataSource={formSlotsNames}
                    fields={{ text: 'name', value: 'value' }}
                    placeholder="Select a Form Slot"
                    className="w-1/2 mr-2"
                    change={handleFormSlotChange}
                  />
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

export default DialogGSlot;
