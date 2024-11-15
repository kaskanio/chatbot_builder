import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useRef, useEffect } from 'react';
import Button from '../modules/Button';

function DialogSpeak({ showDialogSpeak, setShowDialogSpeak, onTypeString }) {
  const actionStringRef = useRef(); // Create a ref for the input field
  const inputRef = useRef(); // Create a ref for the input field

  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  // Function to hide the dialog
  const hideDialog = () => {
    setShowDialogSpeak(false);
  };

  const handleAddNodeAction = (e) => {
    e.preventDefault();
    console.log('Vale ayto: ', actionStringRef.current.value);
    onTypeString(actionStringRef.current.value); // Pass the user input to the parent component
    hideDialog(); // Hide the dialog after adding a new node
  };

  // UseEffect hook to set focus to the input field after each render
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Set focus to the input field after each render
    }
  }, []);

  // Define the footer template for the dialog, which includes buttons and inputs.
  const footerTemplate = () => {
    return (
      <div className="flex justify-between mt-4">
        <Button
          type="submit"
          onClick={handleAddNodeAction}
          primary
          rounded
          className="mr-2"
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
    );
  };

  return (
    <DialogComponent
      id="dialog"
      header="Speak Action"
      visible={showDialogSpeak}
      close={hideDialog}
      width="600px"
      animationSettings={settings}
      footerTemplate={footerTemplate}
      showCloseIcon={true}
      position={{ X: 'center', Y: 'center' }}
    >
      <div className="mt-4">
        <p className="mb-4 text-gray-600">
          Please type the action string below:
        </p>
        <input
          type="text"
          id="speakActionNameInput"
          ref={actionStringRef}
          className="border border-gray-300 rounded-md p-2 w-full mr-2"
          placeholder="Enter Action..."
        />
      </div>
    </DialogComponent>
  );
}

export default DialogSpeak;
