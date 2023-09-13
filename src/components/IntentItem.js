import { useState, useRef, useEffect } from 'react';
import { GoTrash, GoXCircle } from 'react-icons/go';
import { AiOutlineEdit } from 'react-icons/ai';
import { useRemoveIntentMutation, useEditIntentMutation } from '../store';
import Button from './modules/Button';
import IntentContent from './IntentContent';

function IntentItem({ intent }) {
  const [removeIntent, resultsRemove] = useRemoveIntentMutation();
  const [editIntent, resultsEdit] = useEditIntentMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedHeader, setEditedHeader] = useState(intent.name);
  const inputRef = useRef(null); // Create a ref for the input element

  useEffect(() => {
    // When isEditing becomes true, focus on the input element
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditIntent = (e) => {
    e.preventDefault();
    editIntent({ id: intent.id, newName: editedHeader })
      .unwrap()
      .then(() => {
        console.log('Intent edited successfully');
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error editing intent:', error);
      });
  };

  const handleRemoveIntent = () => {
    removeIntent(intent);
  };

  const stopEditing = () => {
    // Stop editing and reset the input field to the original value
    setIsEditing(false);
    setEditedHeader(intent.name);
  };

  let header = <div className="font-semibold">{intent.name}</div>;

  if (isEditing) {
    header = (
      <form onSubmit={handleEditIntent} className="flex mb-4">
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
    <div className="flex justify-between items-start">
      <IntentContent key={intent.id} intent={intent} header={header} />
      <div className="space-x-2 ml-2 flex">
        {isEditing ? (
          <Button
            onClick={handleEditIntent}
            loading={resultsEdit.isLoading}
            type="submit"
            danger
            rounded
            className="text-xs p-1"
          >
            <GoXCircle onClick={stopEditing} />{' '}
            {/* Stop editing and reset input */}
          </Button>
        ) : (
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
            type="button"
            primary
            rounded
            className="text-xs p-1"
          >
            <AiOutlineEdit className="w-3 h-3" />
          </Button>
        )}
        <Button
          onClick={handleRemoveIntent}
          loading={resultsRemove.isLoading}
          type="submit"
          primary
          rounded
          className="text-xs p-1"
        >
          <GoTrash className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export default IntentItem;
