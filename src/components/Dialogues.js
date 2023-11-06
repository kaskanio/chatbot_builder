import { DiagramComponent } from '@syncfusion/ej2-react-diagrams';
import { useFetchNodeQuery, useAddNodeMutation } from '../store';
import Button from '../components/modules/Button';
import Skeleton from './modules/Skeleton';

function Dialogues() {
  const { data, error, isLoading } = useFetchNodeQuery();
  const [addNode, results] = useAddNodeMutation();

  console.log('API Response:', data);

  let content;

  if (isLoading) {
    content = <Skeleton className="h-10 w-full" times={3} />;
  } else if (error) {
    content = <div>Error loading intents: {error.message}</div>;
  } else {
    const returnNodes = data.map((node) => ({
      id: node.name,
      offsetX: node.offsetX,
      offsetY: node.offsetY,
      width: node.width,
      height: node.height,
    }));
    return (
      <DiagramComponent
        id="container"
        width={'100%'}
        height={'600px'}
        nodes={returnNodes}
      />
    );
  }

  const handleAddNode = (e) => {
    e.preventDefault();
    addNode('fotiaa');
  };

  return (
    <div>
      <div>
        <Button
          type="submit"
          onClick={handleAddNode}
          primary
          loading={results.isLoading}
          rounded
          className="border-l-0 ml-2"
        >
          + Add Node
        </Button>
      </div>
      <div>{content}</div>
    </div>
  );
}

export default Dialogues;
