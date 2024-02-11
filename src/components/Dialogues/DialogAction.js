import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useAddNodeMutation } from '../../store';
import { useState, useRef, useEffect } from 'react';
import Button from '../modules/Button';

function DialogAction({ showDialogIntent, setShowDialogIntent }) {
  const [addNode, addNodeResults] = useAddNodeMutation();
  const [actionId, setActionId] = useState(''); // State to store the input value
  const [actionType, setActionType] = useState(''); // State to store the input value
  const inputRef = useRef(); // Create a ref for the input field

  const hideDialog = () => {
    setShowDialogIntent(false);
  };

  const handleInputChange = (e) => {
    setActionId(e.target.value); // Update actionId with the input value
  };

  const handleAddNodeIntent = (e) => {
    e.preventDefault();

    console.log('Action ID:', actionId); // Log the value of actionId
    console.log('Action Type:', actionType); // Log the value of actionType

    addNode({
      nodeId: actionId,
      type: 'Bpmn',
      shape: 'Activity',
      addInfo: actionType,
      activity: 'Task',
      taskType: actionToType(actionType),
    });
    setActionId('');
    hideDialog();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Set focus to the input field after each render
    }
  });

  const handleActionType = (e) => {
    setActionType(e.value); // Update selected action when dropdown value changes
  };

  const actions = [
    'SpeakAction',
    'FireEventAction',
    'RESTCallAction',
    'SetFormSlot',
    'SetGlobalSlot',
  ]; // Define available actions

  const actionToType = (actionType) => {
    console.log('Action type:', actionType); // Log the actionType parameter
    switch (actionType) {
      case 'SpeakAction':
        console.log('Matching case: SpeakAction'); // Log the matched case
        return 'User';
      case 'FireEventAction':
        console.log('Matching case: FireEventAction'); // Log the matched case
        return 'Instantiating Receive';
      case 'RESTCallAction':
        console.log('Matching case: RESTCallAction'); // Log the matched case
        return 'Service';
      case 'SetFormSlot':
        console.log('Matching case: SetFormSlot'); // Log the matched case
        return 'Business Rule';
      case 'SetGlobalSlot':
        console.log('Matching case: SetGlobalSlot'); // Log the matched case
        return 'Manual';
      default:
        console.log('No matching case found'); // Log if no matching case is found
        return '';
    }
  };

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
              handleAddNodeIntent(e);
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
      visible={showDialogIntent}
      close={hideDialog}
      width="600px"
      animationSettings={{ effect: 'None' }}
      footerTemplate={footerTemplate}
    >
      <div className="mt-4">
        <DropDownListComponent
          id="actionDropdown"
          dataSource={actions}
          index={0}
          change={handleActionType}
          popupHeight="200px"
          className="mr-2"
        />{' '}
      </div>
    </DialogComponent>
  );
}

export default DialogAction;
