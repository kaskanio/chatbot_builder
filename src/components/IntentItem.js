import { useState, useRef, useEffect } from 'react';
import { GoTrash, GoXCircle } from 'react-icons/go';
import { AiOutlineEdit } from 'react-icons/ai';
import { useRemoveIntentMutation, useEditIntentMutation } from '../store';
import Button from './Button';
import ExpandablePanel from './ExpandablePanel';

function IntentItem({ intent }) {
  const [removeIntent, resultsRemove] = useRemoveIntentMutation();
  const [editIntent, resultsEdit] = useEditIntentMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedHeader, setEditedHeader] = useState(intent.name);
  const originalHeader = intent.name; // Store the original value

  const inputRef = useRef(null);

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
    // Add an event handler to stop editing
    setIsEditing(false);
    setEditedHeader(originalHeader);
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
      <ExpandablePanel key={intent.id} header={header}>
        <div className="whitespace-pre-line">
          {`-"what time is it" 
            -"what's the time" 
            -"tell me the time"
            -"is it late already"`}
        </div>
      </ExpandablePanel>
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
            <GoXCircle onClick={stopEditing} /> {/* Stop editing on click */}
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
