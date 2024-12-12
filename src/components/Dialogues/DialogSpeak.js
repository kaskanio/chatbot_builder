import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { useEffect, useState } from 'react';
import Button from '../modules/Button';

function DialogSpeak({ showDialogSpeak, setShowDialogSpeak, onTypeString }) {
  const [speakActionName, setSpeakActionName] = useState(''); // State for speak action name
  const [actionString, setActionString] = useState(''); // State for action string

  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  // Function to hide the dialog
  const hideDialog = () => {
    setShowDialogSpeak(false);
  };

  const handleAddNodeAction = (e) => {
    e.preventDefault();
    console.log('Action String: ', actionString);
    console.log('Speak Action Name: ', speakActionName);
    onTypeString(actionString, speakActionName); // Pass the user input to the parent component
    hideDialog(); // Hide the dialog after adding a new node
  };

  // UseEffect hook to set focus to the input field after each render
  useEffect(() => {
    document.getElementById('speakActionNameInput').focus(); // Set focus to the input field after each render
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
        <TextBoxComponent
          id="speakActionName"
          value={speakActionName}
          onChange={(e) => setSpeakActionName(e.value)}
          placeholder="Please type the name for the speak action below:"
          floatLabelType="Auto"
          cssClass="e-bigger"
        />
        <TextBoxComponent
          id="speakActionNameInput"
          value={actionString}
          onChange={(e) => setActionString(e.value)}
          placeholder="Please type the speak string below:"
          floatLabelType="Auto"
          cssClass="e-bigger"
        />
      </div>
    </DialogComponent>
  );
}

export default DialogSpeak;
