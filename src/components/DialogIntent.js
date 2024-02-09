import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import {
  DiagramTools,
  SymbolPaletteComponent,
} from '@syncfusion/ej2-react-diagrams';
import { useFetchIntentQuery, useAddNodeMutation } from '../store';
import { useState } from 'react';
import Skeleton from './modules/Skeleton';
import Button from './modules/Button';

function DialogIntent() {
  const [dialogVisible, setDialogVisible] = useState(false);

  const { data, error, isLoading } = useFetchIntentQuery();
  const [addNode, addNodeResults] = useAddNodeMutation();
  const [selectedIntent, setSelectedIntent] = useState(null);

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  let intents;

  if (isLoading) {
    intents = <Skeleton className="h-10 w-full" times={3} />;
  } else if (error) {
    intents = <div>Error loading intents.</div>;
  } else {
    intents = data.map((intent) => {
      return intent.name;
    });
  }

  const handleAddNodeIntent = (e) => {
    console.log(selectedIntent);
    e.preventDefault();
    if (selectedIntent) {
      addNode({
        nodeId: selectedIntent,
        shape: 'Gateway',
      });
    }
  };

  const handleIntentChange = (e) => {
    setSelectedIntent(e.value);
    console.log(selectedIntent);
  };

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

  console.log('yolo');

  return (
    <DialogComponent
      id="dialog"
      header="Select Intent"
      visible={dialogVisible}
      close={hideDialog}
      width="250px"
      animationSettings={{ effect: 'None' }}
      footerTemplate={footerTemplate}
    >
      <div className="mt-4">
        <DropDownListComponent
          id="ddlelement"
          dataSource={intents}
          placeholder="Select an Intent"
          change={handleIntentChange}
          className="w-full"
        />
      </div>
    </DialogComponent>
  );
}

export default DialogIntent;
