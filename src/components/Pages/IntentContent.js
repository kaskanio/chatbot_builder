import { useState, useRef, useEffect } from 'react';
import Skeleton from '../modules/Skeleton';
import {
  useFetchStringQuery,
  useAddStringMutation,
  useRemoveStringMutation,
  useEditStringMutation,
} from '../../store';
import Button from '../modules/Button';
import { GoXCircle } from 'react-icons/go';
import { AiOutlineEdit } from 'react-icons/ai';

function IntentContent({ intent, header }) {
  const { data, error, isLoading } = useFetchStringQuery(intent);
  const [addString, addResults] = useAddStringMutation();
  const [removeString, removeResults] = useRemoveStringMutation();
  const [newStringName, setNewStringName] = useState('');
  const [editString, resultsEdit] = useEditStringMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedHeader, setEditedHeader] = useState('');
  const [editingStringId, setEditingStringId] = useState(null);
  const inputRef = useRef(null); // Create a ref for the input element

  useEffect(() => {
    // When isEditing becomes true, focus on the input element
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleAddString = (e) => {
    e.preventDefault();
    if (newStringName.trim()) {
      addString({ intent, newStringName });
      setNewStringName('');
    }
  };

  const handleRemoveString = (stringId) => {
    console.log('Removing string with ID:', stringId);
    removeString(stringId);
  };

  const handleEditString = (stringId) => {
    if (isEditing && editingStringId === stringId) {
      // Save the edits
      editString({ stringId, newName: editedHeader })
        .unwrap()
        .then(() => {
          console.log('String edited successfully');
          setIsEditing(false);
        })
        .catch((error) => {
          console.error('Error editing string:', error);
        });
    } else {
      // Start editing the string
      setIsEditing(true);
      setEditingStringId(stringId); // Set the currently edited string
      const editedString = data.find((string) => string.id === stringId);
      setEditedHeader(editedString.name);
    }
  };

  const stopEditing = () => {
    // Stop editing and reset the input field to the original value
    setIsEditing(false);
    setEditedHeader('');
    setEditingStringId(null);
  };

  const addButton = () => {
    return (
      <Button
        onClick={handleAddString}
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

  const removeButton = (stringId) => {
    return (
      <Button
        onClick={() => handleRemoveString(stringId)}
        loading={removeResults.isLoading}
        type="submit"
        danger
        rounded
        className="text-xs p-1"
      >
        <GoXCircle className="w-4 h-4" /> {/* Stop editing and reset input */}
      </Button>
    );
  };

  const editButton = (stringId) => {
    if (isEditing && editingStringId === stringId) {
      return (
        <Button
          onClick={() => stopEditing()}
          loading={resultsEdit.isLoading}
          type="submit"
          danger
          rounded
          className="text-xs p-1"
        >
          <GoXCircle onClick={stopEditing} />{' '}
          {/* Stop editing and reset input */}
        </Button>
      );
    } else {
      return (
        <Button
          onClick={() => {
            handleEditString(stringId);
          }}
          type="button"
          warning
          rounded
          className="text-xs p-1"
        >
          <AiOutlineEdit className="w-4 h-4" /> {/* Start editing */}
        </Button>
      );
    }
  };

  let content;

  if (isLoading) {
    content = <Skeleton className="h-10 w-full" times={3} />;
  } else if (error) {
    content = <div>Error loading strings.</div>;
  } else {
    content = data.map((string) => {
      let header = (
        <div className="mb-2 mt-2 flex justify-between mb-1 text-xs">
          {'"' + string.name + '"'}
        </div>
      );

      if (isEditing && editingStringId === string.id) {
        header = (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditString(string.id);
            }}
            className="flex mb-4"
          >
            <input
              ref={inputRef} // Assign the ref to the input element
              type="text"
              value={editedHeader}
              onChange={(e) => setEditedHeader(e.target.value)}
              className="text-xs p-1 border rounded"
            />
          </form>
        );
      }

      return (
        <div key={string.id} className="flex justify-between mb-1">
          {header}
          <div className="space-x-2 ml-2 flex">
            {editButton(string.id)}
            {removeButton(string.id)}
          </div>
        </div>
      );
    });
  }

  const handleStringNameChange = (e) => {
    setNewStringName(e.target.value);
  };

  return (
    <div className="flex-auto mb-2">
      <div>
        <div className="mb-2"> {content}</div>
        <div className="flex-auto">
          <form onSubmit={handleAddString} className="flex mb-4">
            <input
              type="text"
              id="StringNameInput"
              value={newStringName}
              onChange={handleStringNameChange}
              placeholder="Enter string"
              className="flex-grow p-2 border border-gray-400 rounded-full text-sm mt-4"
            />
            {addButton()}
          </form>
        </div>
      </div>
    </div>
  );
}

export default IntentContent;
