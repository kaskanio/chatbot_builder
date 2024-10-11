import { useState, useRef, useEffect } from 'react';
import { GoTrash, GoXCircle } from 'react-icons/go';
import { AiOutlineEdit } from 'react-icons/ai';
import { useRemoveSynonymMutation, useEditSynonymMutation } from '../../store';
import Button from '../modules/Button';
import SynonymContent from './SynonymContent';

function SynonymItem({ synonym }) {
  const [removeSynonym, resultsRemove] = useRemoveSynonymMutation();
  const [editSynonym, resultsEdit] = useEditSynonymMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedHeader, setEditedHeader] = useState(synonym.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditSynonym = (e) => {
    e.preventDefault();
    editSynonym({ id: synonym.id, newName: editedHeader })
      .unwrap()
      .then(() => {
        console.log('Synonym edited successfully');
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error editing synonym:', error);
      });
  };

  const handleRemoveSynonym = () => {
    removeSynonym(synonym);
  };

  const stopEditing = () => {
    setIsEditing(false);
    setEditedHeader(synonym.name);
  };

  let header = <div className="font-semibold">{synonym.name}</div>;

  if (isEditing) {
    header = (
      <form onSubmit={handleEditSynonym} className="flex mb-4">
        <input
          ref={inputRef}
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
      <SynonymContent key={synonym.id} synonym={synonym} header={header} />
      <div className="space-x-2 ml-2 flex">
        {isEditing ? (
          <Button
            onClick={handleEditSynonym}
            loading={resultsEdit.isLoading}
            type="submit"
            danger
            rounded
            className="text-xs p-1"
          >
            <GoXCircle onClick={stopEditing} />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
            type="button"
            warning
            rounded
            className="text-xs p-1"
          >
            <AiOutlineEdit className="w-3 h-3" />
          </Button>
        )}
        <Button
          onClick={handleRemoveSynonym}
          loading={resultsRemove.isLoading}
          type="submit"
          danger
          rounded
          className="text-xs p-1"
        >
          <GoTrash className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export default SynonymItem;
