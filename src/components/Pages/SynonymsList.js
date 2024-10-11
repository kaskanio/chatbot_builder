import { useState } from 'react';
import { useFetchSynonymsQuery, useAddSynonymMutation } from '../../store';
import Skeleton from '../modules/Skeleton';
import Button from '../modules/Button';
import SynonymItem from './SynonymItem';

function SynonymsList() {
  const { data, error, isLoading } = useFetchSynonymsQuery();
  const [addSynonym, results] = useAddSynonymMutation();
  const [newSynonymName, setNewSynonymName] = useState('');

  const handleAddSynonym = (e) => {
    e.preventDefault();
    if (newSynonymName.trim()) {
      addSynonym(newSynonymName);
      setNewSynonymName('');
    }
  };

  const handleSynonymNameChange = (e) => {
    setNewSynonymName(e.target.value);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  let content;

  if (isLoading) {
    content = <Skeleton className="h-10 w-full" times={3} />;
  } else if (error) {
    content = <div>Error loading synonyms.</div>;
  } else {
    content = data.map((synonym) => {
      return <SynonymItem key={synonym.id} synonym={synonym} />;
    });
  }

  return (
    <div className="p-4 flex">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Synonyms</h1>
        <form onSubmit={handleAddSynonym} className="flex mb-4">
          <input
            type="text"
            id="synonymNameInput"
            value={newSynonymName}
            onChange={handleSynonymNameChange}
            placeholder="Enter synonym name"
            className="p-2 border border-gray-400 rounded-l"
          />
          <Button
            type="submit"
            primary
            loading={results.isLoading}
            rounded
            className="border-l-0 ml-2"
          >
            + Add Synonym
          </Button>
        </form>
        <div>{content}</div>
      </div>
    </div>
  );
}

export default SynonymsList;
