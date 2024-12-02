import React, { useState, useEffect } from 'react';
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
import {
  TabComponent,
  TabItemDirective,
  TabItemsDirective,
} from '@syncfusion/ej2-react-navigations';
import { DataManager } from '@syncfusion/ej2-data';
import {
  useFetchEntitiesQuery,
  useEditEntityMutation,
  useFetchSynonymsQuery,
  useEditSynonymMutation,
} from '../../store';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'; // Import TextBoxComponent
import { Box } from '@mui/material';

import Button from '../modules/Button'; // Import Button component

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

function DialogIntent({ showDialogIntent, setShowDialogIntent, handleIntent }) {
  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  const hideDialog = () => {
    setShowDialogIntent(false);
  };

  const [intentName, setIntentName] = useState(''); // State for Intent name
  const [stringsData, setStringsData] = useState([]);
  const [pretrainedEntitiesData, setPretrainedEntitiesData] = useState([]);
  const [trainableEntitiesData, setTrainableEntitiesData] = useState([]);
  const [entitiesData, setEntitiesData] = useState([]);
  const [synonymsData, setSynonymsData] = useState([]);

  const { data: fetchedEntities } = useFetchEntitiesQuery();
  const { data: fetchedSynonyms } = useFetchSynonymsQuery();
  const [editEntity] = useEditEntityMutation();
  const [editSynonym] = useEditSynonymMutation();

  useEffect(() => {
    const initialPretrainedEntitiesData = pretrainedEntities.map((entity) => ({
      entity,
      values: '',
    }));
    setPretrainedEntitiesData(initialPretrainedEntitiesData);
  }, []);

  useEffect(() => {
    if (fetchedEntities) {
      const formattedEntities = fetchedEntities.map((entity) => ({
        ...entity,
        values: entity.values.join(', '), // Add space after comma
      }));
      setEntitiesData(formattedEntities);
    }
  }, [fetchedEntities]);

  useEffect(() => {
    if (fetchedSynonyms) {
      const formattedSynonyms = fetchedSynonyms.map((synonym) => ({
        ...synonym,
        values: synonym.values.join(', '), // Add space after comma
      }));
      setSynonymsData(formattedSynonyms);
    }
  }, [fetchedSynonyms]);

  const handleActionComplete = (args, gridType) => {
    if (args.requestType === 'save') {
      if (gridType === 'Strings') {
        const updatedData = [...stringsData];
        if (args.action === 'add') {
          if (!updatedData.some((item) => item.id === args.data.id)) {
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
        setStringsData(updatedData);
      } else if (gridType === 'PretrainedEntities') {
        const updatedData = [...pretrainedEntitiesData];
        if (args.action === 'edit') {
          const index = updatedData.findIndex(
            (item) => item.entity === args.data.entity
          );
          if (index !== -1) {
            updatedData[index] = args.data;
          }
        }
        setPretrainedEntitiesData(updatedData);
      } else if (gridType === 'TrainableEntities') {
        const updatedData = [...trainableEntitiesData];
        if (args.action === 'add') {
          if (!updatedData.some((item) => item.entity === args.data.entity)) {
            updatedData.push(args.data);
          }
        } else if (args.action === 'edit') {
          const index = updatedData.findIndex(
            (item) => item.entity === args.data.entity
          );
          if (index !== -1) {
            updatedData[index] = args.data;
          }
        }
        setTrainableEntitiesData(updatedData);
      }
    }
  };

  const entityParams = {
    params: {
      actionComplete: () => false,
      dataSource: new DataManager(
        pretrainedEntities.map((entity) => ({ entity }))
      ),
      sortOrder: 'None',
      fields: { text: 'entity', value: 'entity' },
      placeholder: 'Select an entity',
    },
  };

  const boldEntities = (props) => {
    const text = props.entity || props.string || '';
    const boldText = text
      .replace(/PE: (\w+)/g, '<b>PE: $1</b>')
      .replace(/TE: (\w+)/g, '<b>TE: $1</b>');
    return <span dangerouslySetInnerHTML={{ __html: boldText }} />;
  };

  const handleInsert = () => {
    handleIntent(intentName, stringsData);
    hideDialog();
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
      id="dialogIntent"
      header="Intent Dialog"
      visible={showDialogIntent}
      close={hideDialog}
      width="1000px"
      height="700px"
      animationSettings={settings}
      showCloseIcon={true}
      footerTemplate={footerTemplate}
      position={{ X: 'center', Y: 'center' }}
    >
      <div style={{ marginBottom: '10px', color: 'gray' }}>
        To insert a pretrained entity in your string, type "PE: entity_name". To
        insert a trainable entity, type "TE: entity_name".
        <br />
        <i>For example, "PE: PERSON" or "TE: color".</i>
      </div>
      <Box mt={2} mb={2} textAlign="center">
        <TextBoxComponent
          value={intentName}
          change={(e) => setIntentName(e.value)}
          placeholder="Enter Intent name"
          floatLabelType="Auto"
          width="300px"
          height="40px"
        />
      </Box>
      <TabComponent>
        <TabItemsDirective>
          <TabItemDirective
            header={{ text: 'Strings' }}
            content={() => (
              <GridComponent
                dataSource={stringsData}
                editSettings={{
                  allowEditing: true,
                  allowAdding: true,
                  allowDeleting: true,
                }}
                allowPaging={true}
                pageSettings={{ pageSize: 10 }}
                toolbar={['Add', 'Edit', 'Delete', 'Update', 'Cancel']}
                actionComplete={(args) => handleActionComplete(args, 'Strings')}
              >
                <ColumnsDirective>
                  <ColumnDirective
                    field="string"
                    headerText="String"
                    width="200"
                    textAlign="Center"
                    isPrimaryKey={true}
                    template={boldEntities}
                  />
                </ColumnsDirective>
                <Inject services={[Edit, Toolbar, Page]} />
              </GridComponent>
            )}
          />
          <TabItemDirective
            header={{ text: 'Pretrained Entities' }}
            content={() => (
              <GridComponent
                dataSource={pretrainedEntitiesData}
                editSettings={{
                  allowEditing: true,
                  allowAdding: false,
                  allowDeleting: false,
                }}
                allowPaging={true}
                pageSettings={{ pageSize: 10 }}
                toolbar={['Edit', 'Update', 'Cancel']}
                actionComplete={(args) =>
                  handleActionComplete(args, 'PretrainedEntities')
                }
              >
                <ColumnsDirective>
                  <ColumnDirective
                    field="entity"
                    headerText="Pretrained Entity"
                    width="50"
                    textAlign="Center"
                    textBold={true}
                    editType="dropdownedit"
                    edit={entityParams}
                    isPrimaryKey={true}
                    template={boldEntities}
                  />
                  <ColumnDirective
                    field="values"
                    headerText="Values (separated by a comma)"
                    width="200"
                    textAlign="Center"
                  />
                </ColumnsDirective>
                <Inject services={[Edit, Toolbar, Page]} />
              </GridComponent>
            )}
          />

          <TabItemDirective
            header={{ text: 'Trainable Entities' }}
            content={() => (
              <GridComponent
                dataSource={entitiesData}
                allowPaging={true}
                pageSettings={{ pageSize: 10 }}
              >
                <ColumnsDirective>
                  <ColumnDirective
                    field="name"
                    headerText="Trainable Entity"
                    width="50"
                    textAlign="Center"
                    isPrimaryKey={true}
                  />
                  <ColumnDirective
                    field="values"
                    headerText="Values (separated by a comma)"
                    width="200"
                    textAlign="Center"
                  />
                </ColumnsDirective>
                <Inject services={[Edit, Toolbar, Page]} />
              </GridComponent>
            )}
          />
          <TabItemDirective
            header={{ text: 'Synonyms' }}
            content={() => (
              <GridComponent
                dataSource={synonymsData}
                allowPaging={true}
                pageSettings={{ pageSize: 10 }}
              >
                <ColumnsDirective>
                  <ColumnDirective
                    field="name"
                    headerText="Synonym"
                    width="50"
                    textAlign="Center"
                    isPrimaryKey={true}
                  />
                  <ColumnDirective
                    field="values"
                    headerText="Values (separated by a comma)"
                    width="200"
                    textAlign="Center"
                  />
                </ColumnsDirective>
                <Inject services={[Edit, Toolbar, Page]} />
              </GridComponent>
            )}
          />
        </TabItemsDirective>
      </TabComponent>
    </DialogComponent>
  );
}

export default DialogIntent;
