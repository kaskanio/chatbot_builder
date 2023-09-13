import ExpandablePanel from './modules/ExpandablePanel';
import { useEditStringMutation, useRemoveStingMutation } from '../store';
import Button from './modules/Button';

function IntentContent({ intent, header }) {
  const [editString, resultsEdit] = useEditStringMutation();
  const [removeString, resultsRemove] = useRemoveStingMutation();

  const index = 1;
  const handleEditStrings = () => {
    // editString({ id: intent.id, newStrings: ['NANI', 'NE RE'] });
    removeString({ id: intent.id, index: index });
  };
  let content;

  content = intent.strings;

  return (
    <div>
      {' '}
      <div>
        <ExpandablePanel key={intent.id} header={header} content={content} />
      </div>
      <Button
        onClick={handleEditStrings}
        loading={resultsEdit.isLoading}
        type="submit"
        danger
        rounded
        className="text-xs p-1"
      >
        {' '}
        Edit{' '}
      </Button>
    </div>
  );
}

export default IntentContent;
