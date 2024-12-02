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
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'; // Import TextBoxComponent
import { useFetchEntitiesQuery, useFetchServiceQuery } from '../../store';
import Button from '../modules/Button'; // Import Button component

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
  const gridRefHRI = useRef(null);
  const gridRefService = useRef(null);

  useEffect(() => {
    // setFormName(initialFormName);
    setGridDataHRI(initialGridDataHRI);
    setGridDataService(initialGridDataService);
  }, [initialFormName, initialGridDataHRI, initialGridDataService]);

  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  const hideDialog = () => {
    setShowDialogForm(false);
  };

  const handleActionComplete = (args, gridType) => {
    if (gridType === 'HRI') {
      if (args.requestType === 'save') {
        const updatedData = [...gridDataHRI];
        if (args.action === 'add') {
          const existingIndex = updatedData.findIndex(
            (item) => item.id === args.data.id
          );
          if (existingIndex === -1) {
            updatedData.push(args.data);
          }
        } else if (args.action === 'edit') {
          const index = updatedData.findIndex(
            (item) => item.id === args.data.id
          );
          if (index !== -1) {
            updatedData[index] = args.data;
          }
        }
        setGridDataHRI(updatedData);
      }
    } else if (gridType === 'Service') {
      if (args.requestType === 'save') {
        const updatedData = [...gridDataService];
        if (args.action === 'add') {
          const existingIndex = updatedData.findIndex(
            (item) => item.id === args.data.id
          );
          if (existingIndex === -1) {
            updatedData.push(args.data);
          }
        } else if (args.action === 'edit') {
          const index = updatedData.findIndex(
            (item) => item.id === args.data.id
          );
          if (index !== -1) {
            updatedData[index] = args.data;
          }
        }
        setGridDataService(updatedData);
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
      width="1000px"
      height="700px"
      animationSettings={settings}
      enableResize={true}
      showCloseIcon={true}
      footerTemplate={footerTemplate}
      position={{ X: 'center', Y: 'center' }}
    >
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
                  >
                    <ColumnsDirective>
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
                        field="name"
                        headerText="Slot Name"
                        width="100"
                        textAlign="Center"
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
                        field="eServiceInfo"
                        headerText="Service Info"
                        width="200"
                        textAlign="Center"
                      />
                      <ColumnDirective
                        field="entity"
                        headerText="Extract from Entity"
                        width="130"
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
          </TabItemsDirective>
        </TabComponent>
      </Box>
      <Box mt={2} mb={2} textAlign="left"></Box>
    </DialogComponent>
  );
}

export default DialogForm;
