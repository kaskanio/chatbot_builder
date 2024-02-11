import { useState } from 'react';
import { useFetchIntentQuery, useAddIntentMutation } from '../../store';
import Skeleton from '../modules/Skeleton';
import Button from '../modules/Button';
import IntentItem from './IntentItem';

function IntentsList() {
  const { data, error, isLoading } = useFetchIntentQuery();
  const [addIntent, results] = useAddIntentMutation();
  const [newIntentName, setNewIntentName] = useState('');

  const handleAddIntent = (e) => {
    e.preventDefault();
    if (newIntentName.trim()) {
      addIntent(newIntentName);
      setNewIntentName('');
    }
  };

  const handleIntentNameChange = (e) => {
    setNewIntentName(e.target.value);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  let content;

  if (isLoading) {
    content = <Skeleton className="h-10 w-full" times={3} />;
  } else if (error) {
    content = <div>Error loading intents.</div>;
  } else {
    content = data.map((intent) => {
      return <IntentItem key={intent.id} intent={intent} />;
    });
  }

  return (
    <div className="p-4">
      <form onSubmit={handleAddIntent} className="flex mb-4">
        <input
          type="text"
          id="intentNameInput"
          value={newIntentName}
          onChange={handleIntentNameChange}
          placeholder="Enter intent name"
          className="p-2 border border-gray-400 rounded-l"
        />
        <Button
          type="submit"
          primary
          loading={results.isLoading}
          rounded
          className="border-l-0 ml-2"
        >
          + Add Intent
        </Button>
      </form>
      <div>{content}</div>
    </div>
  );
}

export default IntentsList;
