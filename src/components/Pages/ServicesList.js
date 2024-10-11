import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Edit,
  Toolbar,
} from '@syncfusion/ej2-react-grids';

import {
  useFetchServiceQuery,
  useAddServiceMutation,
  useEditServiceMutation,
  useRemoveServiceMutation,
} from '../../store';

function ServicesList() {
  const { data, error, isLoading } = useFetchServiceQuery();
  const [addService] = useAddServiceMutation();
  const [editService] = useEditServiceMutation();
  const [removeService] = useRemoveServiceMutation();

  const toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };

  const returnServices =
    data?.map((service) => ({
      id: service.id,
      name: service.name,
      verb: service.verb,
      host: service.host,
      port: service.port,
      path: service.path,
    })) || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log(returnServices);

  const handleActionComplete = (args) => {
    console.log(args);
    if (args.requestType === 'save') {
      if (args.action === 'add') {
        // Add new service
        addService({
          name: args.data.name,
          customId: args.data.id,
          verb: args.data.verb,
          host: args.data.host,
          port: args.data.port,
          path: args.data.path,
        });
      } else if (args.action === 'edit') {
        // Edit existing service
        editService({
          id: args.data.id,
          newName: args.data.name,
          verb: args.data.verb,
          host: args.data.host,
          port: args.data.port,
          path: args.data.path,
        });
      }
    } else if (args.requestType === 'delete') {
      // Remove service
      removeService({ id: args.data[0].id });
    }
  };

  const content = (
    <div className="p-4">
      <GridComponent
        dataSource={returnServices || []}
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
            width="100"
          />
          <ColumnDirective field="name" headerText="Service Name" width="160" />
          <ColumnDirective field="verb" headerText="verb" />
          <ColumnDirective field="host" headerText="host" />
          <ColumnDirective field="port" headerText="port" />
          <ColumnDirective field="path" headerText="path" />
        </ColumnsDirective>
        <Inject services={[Edit, Toolbar]} />
      </GridComponent>
    </div>
  );
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Services</h1>
      <div>{content}</div>
    </div>
  );
}

export default ServicesList;
