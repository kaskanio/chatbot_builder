import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useAddNodeMutation } from '../../store';
import { useState, useRef, useEffect } from 'react';
import Button from '../modules/Button';

function DialogSpeak({ showDialogSpeak, setShowDialogSpeak, nodeToAdd }) {
  const [addNode, addNodeResults] = useAddNodeMutation();
  const [actionId, setActionId] = useState(''); // State to store the input value
  const [actionType, setActionType] = useState(''); // State to store the input value
  const inputRef = useRef(); // Create a ref for the input field

  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  // Function to hide the dialog
  const hideDialog = () => {
    setShowDialogSpeak();
  };

  // Function to handle when changing the action type on the DropDownList Component.
  const handleInputChange = (e) => {
    setActionId(e.target.value); // Update actionId with the input value
  };

  // Function to add a node to my database, based on the selected action.
  const handleAddNodeAction = (e) => {
    e.preventDefault();

    console.log('Action ID:', actionId); // Log the value of actionId
    console.log('Action Type:', actionType); // Log the value of actionType
    console.log('Ayto vazw: ', nodeToAdd);
    addNode({
      nodeId: actionId,
      shape: nodeToAdd.shape.properties.shape,
      type: nodeToAdd.shape.properties.type,
      activity: nodeToAdd.shape.activity.activity,
      taskType: nodeToAdd.shape.activity.task.type,
      fill: nodeToAdd.style.fill,
      strokeWidth: nodeToAdd.style.strokeWidth,
      strokeColor: nodeToAdd.style.strokeColor,
    });
    setActionId('');
    hideDialog(); // Reload the page after adding a new node
  };

  // UseEffect hook to set focus to the input field after each render
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Set focus to the input field after each render
    }
  });

  // Function to handle the action type when the dropdown value changes
  const handleActionType = (e) => {
    setActionType(e.value); // Update selected action when dropdown value changes
  };

  // Define available actions and match them to the dflow types.
  const actions = [
    'SpeakAction',
    'FireEventAction',
    'RESTCallAction',
    'SetFormSlot',
    'SetGlobalSlot',
  ];

  // Function to match the action type to the dflow type
  const actionToType = (actionType) => {
    console.log('Action type:', actionType); // Log the actionType parameter
    switch (actionType) {
      case 'SpeakAction':
        console.log('Matching case: SpeakAction'); // Log the matched case
        return 'User';
      case 'FireEventAction':
        console.log('Matching case: FireEventAction'); // Log the matched case
        return 'InstantiatingReceive';
      case 'RESTCallAction':
        console.log('Matching case: RESTCallAction'); // Log the matched case
        return 'Service';
      case 'SetFormSlot':
        console.log('Matching case: SetFormSlot'); // Log the matched case
        return 'BusinessRule';
      case 'SetGlobalSlot':
        console.log('Matching case: SetGlobalSlot'); // Log the matched case
        return 'Manual';
      default:
        console.log('No matching case found'); // Log if no matching case is found
        return '';
    }
  };

  // Define the footer template for the dialog, which includes buttons and inputs.
  const footerTemplate = () => {
    return (
      <div className="flex justify-between items-center">
        <input
          ref={inputRef}
          type="text"
          id="actionNameInput"
          value={actionId}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2 w-full mr-2"
          placeholder="Enter Action..."
        />
        <div className="flex">
          <Button
            type="submit"
            onClick={(e) => {
              handleAddNodeAction(e);
              hideDialog();
            }}
            primary
            loading={addNodeResults.isLoading}
            rounded
            className="mr-2"
          >
            Insert
          </Button>
          <Button
            onClick={() => {
              hideDialog();
            }}
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
      header="Add a new Action"
      visible={showDialogSpeak}
      close={hideDialog}
      width="600px"
      animationSettings={settings}
      footerTemplate={footerTemplate}
    >
      <div className="mt-4"></div>
    </DialogComponent>
  );
}

export default DialogSpeak;
