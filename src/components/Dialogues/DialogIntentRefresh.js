import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useFetchIntentQuery, useFetchStringQuery } from '../../store';
import { useState, useEffect, useRef } from 'react';
import Skeleton from '../modules/Skeleton';
import Button from '../modules/Button';
import { useAddIntentNodeMutation } from '../../store';

function DialogIntentRefresh({
  showDialogIntentRefresh,
  setShowDialogIntentRefresh,
  nodeToAdd,
}) {
  const [selectedIntent, setSelectedIntent] = useState(null);
  const dialogRef = useRef(null);
  const {
    data: intentsData,
    error: intentsError,
    isLoading: intentsLoading,
  } = useFetchIntentQuery();
  const {
    data: stringsData,
    error: stringsError,
    isLoading: stringsLoading,
  } = useFetchStringQuery(
    { id: selectedIntent?.id },
    { skip: !selectedIntent }
  );
  const [addIntentNode, { isLoading: isAdding }] = useAddIntentNodeMutation();

  // Function to hide the dialog
  const hideDialog = () => {
    setShowDialogIntentRefresh(false);
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
  }

  // Fetch the strings related to the selected intent
  if (selectedIntent) {
    if (stringsLoading) {
      content = <Skeleton className="h-10 w-full" times={3} />;
    } else if (stringsError) {
      content = <div>Error loading strings.</div>;
    } else if (stringsData) {
      content = (
        <div className="mt-4">
          {stringsData.map((string) => (
            <div
              key={string.id}
              className="mb-2 mt-2 p-2 bg-gray-100 rounded shadow-sm text-sm"
            >
              "{string.name}"
            </div>
          ))}
        </div>
      );
    }
  }

  // Function to handle the change of the selected intent
  const handleIntentChange = (e) => {
    const selected = intentsData.find((intent) => intent.name === e.value);
    setSelectedIntent(selected);
  };

  // Function to handle the addition of a new intent node
  const handleAddIntentNode = async (e) => {
    e.preventDefault();
    if (selectedIntent && stringsData) {
      await addIntentNode({
        nodeId: `${selectedIntent.name}Intent`,
        classShapeName: selectedIntent.name,
        attributes: stringsData.map((string) => string.name),
        offsetX: 100,
        offsetY: 100,
      });
      hideDialog();
    }
  };

  // Define the footer template for the dialog
  const footerTemplate = () => {
    return (
      <div className="flex justify-between">
        <Button
          type="submit"
          onClick={handleAddIntentNode}
          primary
          loading={isAdding}
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

  // Adjust the dialog position based on content height
  useEffect(() => {
    if (dialogRef.current) {
      const dialogElement = dialogRef.current.element;
      const contentHeight =
        dialogElement.querySelector('.e-dlg-content').scrollHeight;
      const windowHeight = window.innerHeight;
      const dialogHeight = Math.min(contentHeight, windowHeight * 0.8); // Limit dialog height to 80% of window height
      dialogElement.style.height = `${dialogHeight}px`;
      dialogElement.style.top = `${(windowHeight - dialogHeight) / 2}px`;
    }
  }, [content]);

  return (
    <DialogComponent
      id="dialog"
      header="Select Intent"
      visible={showDialogIntentRefresh}
      close={hideDialog}
      width="600px"
      animationSettings={settings}
      footerTemplate={footerTemplate}
      enableResize={true}
      position={{ X: 'center', Y: 'center' }} // Adjust the position here
      ref={dialogRef}
      minHeight="200px" // Set a minimum height for the dialog
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

export default DialogIntentRefresh;
