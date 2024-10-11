import { useState } from 'react';
import { useFetchEntitiesQuery, useAddEntityMutation } from '../../store';
import Skeleton from '../modules/Skeleton';
import Button from '../modules/Button';
import EntityItem from './EntityItem';
import { ListViewComponent } from '@syncfusion/ej2-react-lists';

const pretrainedEntities = [
  'PERSON',
  'NORP',
  'FAC',
  'ORG',
  'GPE',
  'LOC',
  'PRODUCT',
  'EVENT',
  'WORK_OF_ART',
  'LAW',
  'LANGUAGE',
  'DATE',
  'TIME',
  'PERCENT',
  'MONEY',
  'QUANTITY',
  'ORDINAL',
  'CARDINAL',
];

function EntitiesList() {
  const { data, error, isLoading } = useFetchEntitiesQuery();
  const [addEntity, results] = useAddEntityMutation();
  const [newEntityName, setNewEntityName] = useState('');

  const handleAddEntity = (e) => {
    e.preventDefault();
    if (newEntityName.trim()) {
      addEntity(newEntityName);
      setNewEntityName('');
    }
  };

  const handleEntityNameChange = (e) => {
    setNewEntityName(e.target.value);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  let content;

  if (isLoading) {
    content = <Skeleton className="h-10 w-full" times={3} />;
  } else if (error) {
    content = <div>Error loading entities.</div>;
  } else {
    content = data.map((entity) => {
      return <EntityItem key={entity.id} entity={entity} />;
    });
  }

  return (
    <div className="p-4 flex">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Trainable Entities</h1>
        <form onSubmit={handleAddEntity} className="flex mb-4">
          <input
            type="text"
            id="entityNameInput"
            value={newEntityName}
            onChange={handleEntityNameChange}
            placeholder="Enter entity name"
            className="p-2 border border-gray-400 rounded-l"
          />
          <Button
            type="submit"
            primary
            loading={results.isLoading}
            rounded
            className="border-l-0 ml-2"
          >
            + Add Entity
          </Button>
        </form>
        <div>{content}</div>
      </div>
      <div className="w-1/8 ml-4">
        <h2 className="text-xl font-bold mb-4">Pretrained Entities</h2>
        <ListViewComponent
          dataSource={pretrainedEntities}
          showCheckBox={false}
          className="border border-gray-400 rounded p-2"
        />
      </div>
    </div>
  );
}

export default EntitiesList;
