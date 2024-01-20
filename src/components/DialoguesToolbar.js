import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useFetchIntentQuery, useAddNodeMutation } from '../store';
import { useState } from 'react';
import Skeleton from './modules/Skeleton';
import Button from './modules/Button';

function DialoguesToolbar() {
  const { data, error, isLoading } = useFetchIntentQuery();
  const [addNode, addNodeResults] = useAddNodeMutation();
  const [selectedIntent, setSelectedIntent] = useState(null);

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
  };

  return (
    <div className="flex space-x-4">
      <div className="flex items-center space-x-4">
        <span className="font-semibold">Intents:</span>
        <DropDownListComponent
          id="ddlelement"
          dataSource={intents}
          placeholder="Select an Intent"
          change={handleIntentChange}
        />
      </div>
      <Button
        type="submit"
        onClick={handleAddNodeIntent}
        primary
        loading={addNodeResults.isLoading}
        rounded
      >
        + Add
      </Button>
    </div>
  );
}

export default DialoguesToolbar;
