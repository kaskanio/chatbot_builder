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
  useFetchFormSlotsQuery,
  useAddFormSlotMutation,
  useEditFormSlotMutation,
  useRemoveFormSlotMutation,
} from '../../store';

function FormSlotsList() {
  const { data, error, isLoading } = useFetchFormSlotsQuery();
  const [addFormSlot] = useAddFormSlotMutation();
  const [editFormSlot] = useEditFormSlotMutation();
  const [removeFormSlot] = useRemoveFormSlotMutation();

  const toolbar = ['Delete'];
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };

  const returnFormSlots =
    data?.map((slot) => ({
      id: slot.id, // assuming you still have an `id` field for unique identification
      name: slot.name,
      type: slot.type,
      value: slot.value,
      form: slot.form,
    })) || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleActionComplete = (args) => {
    if (args.requestType === 'save') {
      if (args.action === 'add') {
        // Add new form slot
        addFormSlot({
          name: args.data.name,
          type: args.data.type,
          value: args.data.value,
        });
      } else if (args.action === 'edit') {
        // Edit existing form slot
        editFormSlot({
          id: args.data.id,
          newName: args.data.name,
          type: args.data.type,
          value: args.data.value,
        });
      }
    } else if (args.requestType === 'delete') {
      // Remove form slot
      removeFormSlot({ name: args.data[0].name });
    }
  };

  const content = (
    <div className="p-4">
      <GridComponent
        dataSource={returnFormSlots || []}
        allowPaging={true}
        pageSettings={{ pageSize: 10 }}
        editSettings={editSettings}
        actionComplete={handleActionComplete}
        toolbar={toolbar}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="id"
            headerText="ID"
            isPrimaryKey={true}
            width="40"
            isIdentity={true}
          />
          <ColumnDirective
            field="name"
            headerText="Slot Name"
            width="160"
            isPrimaryKey
          />
          <ColumnDirective
            field="type"
            headerText="Type"
            width="100"
            isPrimaryKey={true}
          />
          <ColumnDirective
            field="value"
            headerText="Value"
            width="250"
            isPrimaryKey={true}
          />
          <ColumnDirective
            field="form"
            headerText="Form Name"
            width="150"
            isPrimaryKey={true}
          />
        </ColumnsDirective>
        <Inject services={[Edit, Toolbar, Page]} />
      </GridComponent>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Form Slots</h1>
      <div>{content}</div>
    </div>
  );
}

export default FormSlotsList;
