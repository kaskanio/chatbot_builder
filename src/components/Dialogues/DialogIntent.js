import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useFetchIntentQuery, useAddNodeMutation } from '../../store';
import { useState } from 'react';
import Skeleton from '../modules/Skeleton';
import Button from '../modules/Button';
function DialogIntent({ showDialogIntent, setShowDialogIntent, nodeToAdd }) {
  const [selectedIntent, setSelectedIntent] = useState(null);
  const {
    data: intentsData,
    error: intentsError,
    isLoading: intentsLoading,
  } = useFetchIntentQuery();
  const [addNode, addNodeResults] = useAddNodeMutation();

  // Function to hide the dialog
  const hideDialog = () => {
    setShowDialogIntent(false);
  };
  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  let intentsNames, content;

  // Fetch the intents from the database
  if (intentsLoading) {
    intentsNames = <Skeleton className="h-10 w-full" times={3} />;
  } else if (intentsError) {
    intentsNames = <div>Error loading intents.</div>;
  } else {
    intentsNames = intentsData.map((intent) => {
      return intent.name;
    });
    content = intentsData.map((intent) => {
      if (selectedIntent === intent.name) {
        if (intent.strings) {
          return intent.strings.map((string) => (
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

  // Function to handle the addition of a new node based on the selected intent.
  const handleAddNodeIntent = (e) => {
    console.log(selectedIntent);
    e.preventDefault();
    if (selectedIntent) {
      addNode({
        nodeId: selectedIntent,
        shape: nodeToAdd.shape.properties.shape,
        type: nodeToAdd.shape.properties.type,
        activity: nodeToAdd.shape.activity.activity,
        taskType: nodeToAdd.shape.activity.task.type,
        fill: nodeToAdd.style.fill,
        strokeWidth: nodeToAdd.style.strokeWidth,
        strokeColor: nodeToAdd.style.strokeColor,
      });
      hideDialog();
    }
  };

  // Function to handle the change of the selected intent
  const handleIntentChange = (e) => {
    setSelectedIntent(e.value);
  };

  // Define the footer template for the dialog
  const footerTemplate = () => {
    return (
      <div className="flex justify-between">
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
    );
  };

  return (
    <DialogComponent
      id="dialog"
      header="Select Intent"
      visible={showDialogIntent}
      close={hideDialog}
      width="600px"
      animationSettings={settings}
      footerTemplate={footerTemplate}
      enableResize={true}
    >
      <div className="mt-4">
        <DropDownListComponent
          id="ddlelement"
          dataSource={intentsNames}
          placeholder="Select an Intent"
          className="w-full"
          change={handleIntentChange}
        />
        <div>{content}</div>
      </div>
    </DialogComponent>
  );
}

export default DialogIntent;
