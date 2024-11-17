import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Edit,
  Toolbar,
  Page,
} from '@syncfusion/ej2-react-grids';

import {
  useFetchGlobalSlotsQuery,
  useAddGlobalSlotMutation,
  useEditGlobalSlotMutation,
  useRemoveGlobalSlotMutation,
} from '../../store';

function GlobalSlotsList() {
  const { data, error, isLoading } = useFetchGlobalSlotsQuery();
  const [addGlobalSlot] = useAddGlobalSlotMutation();
  const [editGlobalSlot] = useEditGlobalSlotMutation();
  const [removeGlobalSlot] = useRemoveGlobalSlotMutation();

  console.log('Data:', data);
  console.log('Error:', error);
  console.log('Is Loading:', isLoading);

  const toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };

  const returnGlobalSlots =
    data?.map((slot) => ({
      id: slot.id, // assuming you still have an `id` field for unique identification
      name: slot.name,
      type: slot.type,
      value: slot.value,
    })) || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleActionComplete = (args) => {
    console.log(args);
    if (args.requestType === 'save') {
      if (args.action === 'add') {
        // Add new global slot
        addGlobalSlot({
          name: args.data.name,
          type: args.data.type,
          value: args.data.value,
        });
      } else if (args.action === 'edit') {
        // Edit existing global slot
        editGlobalSlot({
          id: args.data.id,
          newName: args.data.name,
          type: args.data.type,
          value: args.data.value,
        });
      }
    } else if (args.requestType === 'delete') {
      // Remove global slot
      removeGlobalSlot({ id: args.data[0].id });
    }
  };

  const content = (
    <div className="p-4">
      <GridComponent
        dataSource={returnGlobalSlots || []}
        allowPaging={true}
        pageSettings={{ pageSize: 10 }}
        editSettings={editSettings}
        toolbar={toolbar}
        actionComplete={handleActionComplete}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="id"
            headerText="ID"
            isPrimaryKey={true}
            width="40"
            isIdentity={true}
          />
          <ColumnDirective field="name" headerText="Slot Name" width="160" />
          <ColumnDirective field="type" headerText="Type" width="100" />
          <ColumnDirective field="value" headerText="Value" width="250" />
        </ColumnsDirective>
        <Inject services={[Edit, Toolbar, Page]} />
      </GridComponent>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Global Slots</h1>
      <div>{content}</div>
    </div>
  );
}

export default GlobalSlotsList;
