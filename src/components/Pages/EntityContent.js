import { useState } from 'react';
import ExpandablePanel from '../modules/ExpandablePanel';
import Button from '../modules/Button';
import { GoTrash } from 'react-icons/go';
import { useAddValueMutation, useRemoveValueMutation } from '../../store';

function EntityContent({ entity, header }) {
  const [addValue, addResults] = useAddValueMutation();
  const [removeValue, removeResults] = useRemoveValueMutation();
  const [newValue, setNewValue] = useState('');

  const handleAddValue = (e) => {
    e.preventDefault();
    if (newValue.trim()) {
      console.log('Adding value:', newValue, 'to entity:', entity.id);
      let addValues = [...entity.values, newValue] || [];
      addValue({ entityId: entity.id, values: addValues })
        .unwrap()
        .then(() => {
          setNewValue('');
        })
        .catch((error) => {
          console.error('Error adding value:', error, newValue);
        });
    }
  };

  const handleRemoveValue = (value) => {
    console.log('Removing value:', value);
    let removedValue = entity.values.filter((v) => v !== value);
    console.log(removedValue);
    removeValue({ entityId: entity.id, values: removedValue });
  };

  const addButton = () => {
    return (
      <Button
        onClick={handleAddValue}
        loading={addResults.isLoading}
        type="submit"
        secondary
        rounded
        className="text-xs p-1 ml-1 mt-4"
      >
        {' '}
        +{' '}
      </Button>
    );
  };

  const removeButton = (value) => {
    return (
      <Button
        onClick={() => handleRemoveValue(value)}
        loading={removeResults.isLoading}
        type="submit"
        danger
        rounded
        className="text-xs p-1"
      >
        <GoTrash className="w-4 h-4" />
      </Button>
    );
  };

  const content = (entity.values || []).map((value, index) => {
    let header = (
      <div className="mb-2 mt-2 flex justify-between mb-1 text-xs">
        {'"' + value + '"'}
      </div>
    );

    return (
      <div key={index} className="flex justify-between mb-1">
        {header}
        <div className="space-x-2 ml-2 flex">{removeButton(value)}</div>
      </div>
    );
  });

  const handleValueChange = (e) => {
    setNewValue(e.target.value);
  };

  return (
    <div className="flex-auto mb-2">
      <div>
        <ExpandablePanel header={header}>
          <div className="mb-2"> {content}</div>
          <div className="flex-auto">
            <form onSubmit={handleAddValue} className="flex mb-4">
              <input
                type="text"
                id="ValueInput"
                value={newValue}
                onChange={handleValueChange}
                placeholder="Enter value"
                className="flex-grow p-2 border border-gray-400 rounded-full text-sm mt-4"
              />
              {addButton()}
            </form>
          </div>
        </ExpandablePanel>
      </div>
    </div>
  );
}

export default EntityContent;
