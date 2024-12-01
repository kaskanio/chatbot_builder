import { useState, useRef } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Edit,
  Inject,
  Toolbar,
} from '@syncfusion/ej2-react-grids';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Box, TextField } from '@mui/material';
import {
  TabComponent,
  TabItemDirective,
  TabItemsDirective,
} from '@syncfusion/ej2-react-navigations';
import { useFetchEntitiesQuery } from '../../store';
import { useFetchServiceQuery } from '../../store';
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

function DialogForm({ showDialogForm, setShowDialogForm, handleForm }) {
  // Add handleForm to props
  const { data: trainableEntities = [] } = useFetchEntitiesQuery();
  const { data: services = [] } = useFetchServiceQuery();
  const [gridDataHRI, setGridDataHRI] = useState([]);
  const [gridDataService, setGridDataService] = useState([]);
  const [formName, setFormName] = useState('');
  const gridRefHRI = useRef(null);
  const gridRefService = useRef(null);

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
      } else if (args.requestType === 'delete') {
        const updatedData = gridDataHRI.filter(
          (item) => item.id !== args.data[0].id
        );
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
        <Button
          onClick={hideDialog}
          type="button"
          danger
          rounded
          className="text-xs p-1"
        >
          Cancel
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
      animationSettings={settings}
      enableResize={true}
      showCloseIcon={true}
      footerTemplate={footerTemplate}
      position={{ X: 'center', Y: 'center' }}
    >
      <Box mt={2} mb={2} textAlign="center">
        <TextField
          label="Form Name"
          variant="outlined"
          size="small"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          style={{ width: '300px' }}
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
                    <Inject services={[Edit, Toolbar]} />
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
                    <Inject services={[Edit, Toolbar]} />
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
