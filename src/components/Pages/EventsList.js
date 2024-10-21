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
  useFetchEventQuery,
  useAddEventMutation,
  useEditEventMutation,
  useRemoveEventMutation,
} from '../../store';

function EventsList() {
  const { data, error, isLoading } = useFetchEventQuery();
  const [addEvent] = useAddEventMutation();
  const [editEvent] = useEditEventMutation();
  const [removeEvent] = useRemoveEventMutation();

  const toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };

  const returnEvents =
    data?.map((event) => ({
      id: event.id, // assuming you still have an `id` field for unique identification
      name: event.name,
      uri: event.uri,
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
        // Add new event
        addEvent({
          name: args.data.name,
          uri: args.data.uri,
        });
      } else if (args.action === 'edit') {
        // Edit existing event
        editEvent({
          newName: args.data.name,
          uri: args.data.uri,
        });
      }
    } else if (args.requestType === 'delete') {
      // Remove event
      removeEvent({ id: args.data[0].id });
    }
  };

  const content = (
    <div className="p-4">
      <GridComponent
        dataSource={returnEvents || []}
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
          />
          <ColumnDirective field="name" headerText="Event Name" width="160" />
          <ColumnDirective field="uri" headerText="URI" width="250" />
        </ColumnsDirective>
        <Inject services={[Edit, Toolbar, Page]} />
      </GridComponent>
    </div>
  );
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <div>{content}</div>
    </div>
  );
}

export default EventsList;
