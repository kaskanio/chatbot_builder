import { useState, useRef, useEffect } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Edit,
  Inject,
  Toolbar,
  Page,
} from '@syncfusion/ej2-react-grids';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Box } from '@mui/material';
import {
  TabComponent,
  TabItemDirective,
  TabItemsDirective,
} from '@syncfusion/ej2-react-navigations';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import {
  useFetchEntitiesQuery,
  useFetchServiceQuery,
  useAddFormSlotMutation,
  useRemoveFormSlotMutation,
} from '../../store';
import Button from '../modules/Button';

const formSlotTypes = ['int', 'float', 'str', 'bool', 'list', 'dict'];
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

function DialogForm({
  showDialogForm,
  setShowDialogForm,
  handleForm,
  initialFormName = '',
  initialGridDataHRI = [],
  initialGridDataService = [],
}) {
  const { data: trainableEntities = [] } = useFetchEntitiesQuery();
  const { data: services = [] } = useFetchServiceQuery();
  const [gridDataHRI, setGridDataHRI] = useState(initialGridDataHRI);
  const [gridDataService, setGridDataService] = useState(
    initialGridDataService
  );
  const [formName, setFormName] = useState(initialFormName);
  const [editingFormSlot, setEditingFormSlot] = useState(null);
  const gridRefHRI = useRef(null);
  const gridRefService = useRef(null);
  const [addFormSlot] = useAddFormSlotMutation(); // Use the mutation hook
  const [removeFormSlot] = useRemoveFormSlotMutation(); // Use the mutation hook

  useEffect(() => {
    // setFormName(initialFormName);
    setGridDataHRI(initialGridDataHRI);
    setGridDataService(initialGridDataService);
  }, [initialFormName, initialGridDataHRI, initialGridDataService]);

  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  const hideDialog = () => {
    setShowDialogForm(false);
  };

  const handleActionBegin = (args) => {
    if (args.requestType === 'beginEdit') {
      console.log(args.rowData);
      setEditingFormSlot(args.rowData.name); // Save the string before editing
    }
  };
  const handleActionComplete = async (args, gridType) => {
    if (args.requestType === 'save') {
      if (!args.data.order) {
        args.data.order = totalLength + 1;
      }
      if (gridType === 'HRI') {
        const updatedData = [...gridDataHRI];
        if (args.action === 'add') {
          if (!updatedData.some((item) => item.name === args.data.name)) {
            updatedData.push(args.data);
          }
          console.log('Edw exw: ', args.data);
          addFormSlot({
            name: args.data.name,
            type: args.data.type,
            form: formName,
          });
        } else if (args.action === 'edit') {
          const index = updatedData.findIndex(
            (item) => item.name === editingFormSlot // Use the saved form slot name to find the correct item
          );
          if (index !== -1) {
            updatedData[index] = args.data;
          }
        }
        setGridDataHRI(updatedData);
      } else if (gridType === 'Service') {
        const updatedData = [...gridDataService];
        if (args.action === 'add') {
          if (!updatedData.some((item) => item.name === args.data.name)) {
            updatedData.push(args.data);
          }
        } else if (args.action === 'edit') {
          const index = updatedData.findIndex(
            (item) => item.name === editingFormSlot // Use the saved form slot name to find the correct item
          );
          if (index !== -1) {
            updatedData[index] = args.data;
          }
        }
        setGridDataService(updatedData);
      }
    } else if (args.requestType === 'delete') {
      if (gridType === 'HRI') {
        removeFormSlot({ name: args.data[0].name });
      }
    }
  };

  const allEntities = [
    ...trainableEntities.map((entity) => ({
      value: entity.name,
      displayText: `${entity.name} (TE)`,
    })),
    ...pretrainedEntities.map((entity) => ({
      value: entity,
      displayText: `${entity} (PE)`,
    })),
  ];

  const totalLength = gridDataHRI.length + gridDataService.length;
  const orderOptions = Array.from({ length: totalLength }, (_, i) => i + 1);

  const typeParams = {
    params: {
      actionComplete: () => false,
      dataSource: new DataManager(formSlotTypes.map((type) => ({ type }))),
      sortOrder: 'None',
      fields: { text: 'type', value: 'type' },
      placeholder: 'Select a type',
    },
  };

  const serviceParams = {
    params: {
      actionComplete: () => false,
      dataSource: new DataManager(services),
      sortOrder: 'None',
      fields: { text: 'name', value: 'name' },
      placeholder: 'Select a service',
      query: new Query(),
    },
  };

  const entityParams = {
    params: {
      actionComplete: () => false,
      dataSource: new DataManager(allEntities),
      sortOrder: 'None',
      fields: { text: 'displayText', value: 'displayText' },
      placeholder: 'Select an entity',
      query: new Query(),
    },
  };

  const orderParams = {
    params: {
      actionComplete: () => false,
      dataSource: new DataManager(orderOptions.map((order) => ({ order }))),
      sortOrder: 'None',
      fields: { text: 'order', value: 'order' },
      placeholder: 'Select an order',
    },
  };

  const handleInsert = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    handleForm(formName, gridDataHRI, gridDataService);
    setFormName(''); // Clear the form name after inserting
    setGridDataHRI([]); // Clear the grid data after inserting
    setGridDataService([]); // Clear the grid data after inserting
    hideDialog(); // Hide the dialog after inserting
  };

  const footerTemplate = () => {
    return (
      <div className="flex justify-between mt-4">
        <Button
          type="submit"
          onClick={handleInsert}
          primary
          rounded
          className="mr-2"
        >
          Insert
        </Button>
      </div>
    );
  };

  return (
    <DialogComponent
      id="dialogForm"
      header="Form Dialog"
      visible={showDialogForm}
      close={hideDialog}
      width="1600px"
      height="700px"
      animationSettings={settings}
      enableResize={true}
      showCloseIcon={true}
      footerTemplate={footerTemplate}
      position={{ X: 'center', Y: 'center' }}
    >
      <div style={{ marginBottom: '10px', color: 'gray' }}>
        The value of the form slot is optional. If you want to provide it, use
        the syntax: trigger_name:value. If you want to provide more values,
        seperate them by comma.
        <br />
        <i>For example, "trigger1:value1".</i>
      </div>
      <Box mt={2} mb={2} textAlign="center">
        <TextBoxComponent
          value={formName}
          change={(e) => setFormName(e.value)}
          placeholder="Enter Form name"
          floatLabelType="Auto"
          width="300px"
          height="40px"
        />
      </Box>
      <Box mt={2} mb={2} textAlign="center">
        <TabComponent headerPlacement="Top" style={{ display: 'inline-block' }}>
          <TabItemsDirective>
            <TabItemDirective
              header={{ text: 'Form Slot with HRI' }}
              content={() => (
                <Box mt={2} textAlign="center">
                  <GridComponent
                    ref={gridRefHRI}
                    dataSource={gridDataHRI}
                    editSettings={{
                      allowEditing: true,
                      allowAdding: true,
                      allowDeleting: true,
                    }}
                    allowPaging={true}
                    pageSettings={{ pageSize: 10 }}
                    toolbar={['Add', 'Edit', 'Delete', 'Update', 'Cancel']}
                    actionComplete={(args) => handleActionComplete(args, 'HRI')}
                    actionBegin={handleActionBegin}
                  >
                    <ColumnsDirective>
                      <ColumnDirective
                        field="order"
                        headerText="Set Order"
                        width="50"
                        textAlign="Center"
                        editType="dropdownedit"
                        edit={orderParams}
                      />
                      <ColumnDirective
                        field="name"
                        headerText="Slot Name"
                        width="100"
                        textAlign="Center"
                        isPrimaryKey={true}
                      />
                      <ColumnDirective
                        field="type"
                        headerText="Type"
                        width="100"
                        textAlign="Center"
                        editType="dropdownedit"
                        edit={typeParams}
                      />
                      <ColumnDirective
                        field="hriString"
                        headerText="HRI String"
                        width="200"
                        textAlign="Center"
                      />
                      <ColumnDirective
                        field="value"
                        headerText="Value"
                        width="100"
                        textAlign="Center"
                      />
                      <ColumnDirective
                        field="entity"
                        headerText="Extract from Entity"
                        width="100"
                        textAlign="Center"
                        editType="dropdownedit"
                        edit={entityParams}
                      />
                    </ColumnsDirective>
                    <Inject services={[Edit, Toolbar, Page]} />
                  </GridComponent>
                </Box>
              )}
            />
            <TabItemDirective
              header={{ text: 'Form Slot with eService' }}
              content={() => (
                <Box mt={2} textAlign="center">
                  <GridComponent
                    ref={gridRefService}
                    dataSource={gridDataService}
                    editSettings={{
                      allowEditing: true,
                      allowAdding: true,
                      allowDeleting: true,
                    }}
                    allowPaging={true}
                    pageSettings={{ pageSize: 10 }}
                    toolbar={['Add', 'Edit', 'Delete', 'Update', 'Cancel']}
                    actionComplete={(args) =>
                      handleActionComplete(args, 'Service')
                    }
                  >
                    <ColumnsDirective>
                      <ColumnDirective
                        field="order"
                        headerText="Set Order"
                        textAlign="Center"
                        width="60"
                        editType="dropdownedit"
                        edit={orderParams}
                      />
                      <ColumnDirective
                        field="name"
                        headerText="Slot Name"
                        width="100"
                        textAlign="Center"
                        allowEditing={false}
                        isPrimaryKey={true}
                      />
                      <ColumnDirective
                        field="type"
                        headerText="Type"
                        width="80"
                        textAlign="Center"
                        editType="dropdownedit"
                        edit={typeParams}
                      />
                      <ColumnDirective
                        field="eServiceName"
                        headerText="eService"
                        width="100"
                        textAlign="Center"
                        editType="dropdownedit"
                        edit={serviceParams}
                      />
                      <ColumnDirective
                        field="query"
                        headerText="Query (seperated by comma)"
                        width="150"
                        textAlign="Center"
                      />
                      <ColumnDirective
                        field="header"
                        headerText="Header"
                        width="150"
                        textAlign="Center"
                      />
                      <ColumnDirective
                        field="path"
                        headerText="Specify Path"
                        width="150"
                        textAlign="Center"
                      />
                      <ColumnDirective
                        field="body"
                        headerText="Body"
                        width="150"
                        textAlign="Center"
                      />
                    </ColumnsDirective>
                    <Inject services={[Edit, Toolbar, Page]} />
                  </GridComponent>
                </Box>
              )}
            />
          </TabItemsDirective>
        </TabComponent>
      </Box>
      <Box mt={2} mb={2} textAlign="left"></Box>
    </DialogComponent>
  );
}

export default DialogForm;
