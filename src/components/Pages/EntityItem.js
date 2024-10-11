import { useState, useRef, useEffect } from 'react';
import { GoTrash, GoXCircle } from 'react-icons/go';
import { AiOutlineEdit } from 'react-icons/ai';
import { useRemoveEntityMutation, useEditEntityMutation } from '../../store';
import Button from '../modules/Button';
import EntityContent from './EntityContent';

function EntityItem({ entity }) {
  const [removeEntity, resultsRemove] = useRemoveEntityMutation();
  const [editEntity, resultsEdit] = useEditEntityMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedHeader, setEditedHeader] = useState(entity.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditEntity = (e) => {
    e.preventDefault();
    editEntity({ id: entity.id, newName: editedHeader })
      .unwrap()
      .then(() => {
        console.log('Entity edited successfully');
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error editing entity:', error);
      });
  };

  const handleRemoveEntity = () => {
    removeEntity(entity);
  };

  const stopEditing = () => {
    setIsEditing(false);
    setEditedHeader(entity.name);
  };

  let header = <div className="font-semibold">{entity.name}</div>;

  if (isEditing) {
    header = (
      <form onSubmit={handleEditEntity} className="flex mb-4">
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
      <EntityContent key={entity.id} entity={entity} header={header} />
      <div className="space-x-2 ml-2 flex">
        {isEditing ? (
          <Button
            onClick={handleEditEntity}
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
          onClick={handleRemoveEntity}
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

export default EntityItem;
