import React from 'react';
import { MenuComponent } from '@syncfusion/ej2-react-navigations';
import { useDispatch } from 'react-redux';
import { saveDiagramState } from '../../store/diagramSlice';
import {
  useFetchFormSlotsQuery,
  useRemoveFormSlotMutation,
  useFetchGlobalSlotsQuery,
  useRemoveGlobalSlotMutation,
  useFetchServiceQuery,
  useRemoveServiceMutation,
  useFetchEventQuery,
  useRemoveEventMutation,
  useFetchSynonymsQuery,
  useRemoveSynonymMutation,
  useFetchEntitiesQuery,
  useRemoveEntityMutation,
} from '../../store/index';
import axios from 'axios';

const DialoguesMenu = ({ diagramInstanceRef }) => {
  const dispatch = useDispatch();

  const { data: formSlots } = useFetchFormSlotsQuery();
  const { data: globalSlots } = useFetchGlobalSlotsQuery();
  const { data: services } = useFetchServiceQuery();
  const { data: events } = useFetchEventQuery();
  const { data: synonyms } = useFetchSynonymsQuery();
  const { data: entities } = useFetchEntitiesQuery();

  const [removeFormSlot] = useRemoveFormSlotMutation();
  const [removeGlobalSlot] = useRemoveGlobalSlotMutation();
  const [removeService] = useRemoveServiceMutation();
  const [removeEvent] = useRemoveEventMutation();
  const [removeSynonym] = useRemoveSynonymMutation();
  const [removeEntity] = useRemoveEntityMutation();

  const handleSaveToFile = (filename = 'diagram.json', directory = '') => {
    if (diagramInstanceRef.current) {
      const serializedData = diagramInstanceRef.current.saveDiagram({
        exclude: ['width', 'height', 'viewport'],
      });
      const formattedData = JSON.stringify(JSON.parse(serializedData), null, 2);
      const blob = new Blob([formattedData], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = directory ? `${directory}/${filename}` : filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleSaveDatabaseToFile = async (
    filename = 'db.json',
    directory = ''
  ) => {
    try {
      const response = await axios.get('http://localhost:3001/db');
      const formattedData = JSON.stringify(response.data, null, 2);
      const blob = new Blob([formattedData], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = directory ? `${directory}/${filename}` : filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('An error occurred while saving the database: ' + error.message);
    }
  };

  // Manually save diagram inside project directory. Not used in this project.
  // const handleSaveDiagram = async () => {
  //   if (diagramInstanceRef.current) {
  //     const serializedData = diagramInstanceRef.current.saveDiagram({
  //       exclude: ['width', 'height', 'viewport'],
  //     });
  //     const formattedData = JSON.stringify(JSON.parse(serializedData), null, 2);
  //     try {
  //       const response = await axios.post(
  //         'http://localhost:8000/save-diagram',
  //         {
  //           filename: 'diagram.json',
  //           directory:
  //             'C:/Users/don_k/Documents/Courses/Diplomatiki/first_attempt',
  //           data: formattedData,
  //         }
  //       );
  //       alert(response.data.message);
  //     } catch (error) {
  //       alert('An error occurred while saving the diagram: ' + error.message);
  //     }
  //   }
  // };

  const handleLoadFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const diagramData = JSON.parse(e.target.result);
        if (diagramInstanceRef.current) {
          diagramInstanceRef.current.loadDiagram(diagramData);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLoadDatabaseFromFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.put(
          'http://localhost:8000/upload-db',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        alert(response.data.message);
        setTimeout(() => {
          window.location.reload(); // Trigger page reload after 1 second to apply all changes
        }, 1000);
      } catch (error) {
        alert('An error occurred while loading the database: ' + error.message);
      }
    }
  };

  const handleResetDiagram = () => {
    if (diagramInstanceRef.current) {
      // Set scrollSettings before clearing the diagram
      diagramInstanceRef.current.scrollSettings = {
        scrollLimit: 'Infinity',
      };
      diagramInstanceRef.current.clear();

      dispatch(saveDiagramState(null));
    }
  };

  const handleResetDatabase = async () => {
    if (formSlots) {
      for (const slot of formSlots) {
        await removeFormSlot({ name: slot.name });
      }
    }
    if (globalSlots) {
      for (const slot of globalSlots) {
        await removeGlobalSlot({ id: slot.id });
      }
    }
    if (services) {
      for (const service of services) {
        await removeService({ id: service.id });
      }
    }
    if (events) {
      for (const event of events) {
        await removeEvent({ id: event.id });
      }
    }
    if (synonyms) {
      for (const synonym of synonyms) {
        await removeSynonym({ id: synonym.id });
      }
    }
    if (entities) {
      for (const entity of entities) {
        await removeEntity({ id: entity.id });
      }
    }
  };

  const handleExportDflow = async (
    filename = 'exported.dflow',
    directory = ''
  ) => {
    try {
      const response = await axios.post('http://localhost:8000/export-dflow');
      alert(response.data.message);

      const formattedData = response.data.output;
      const blob = new Blob([formattedData], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = directory ? `${directory}/${filename}` : filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('An error occurred while exporting: ' + error.message);
    }
  };

  const menuItems = [
    {
      text: 'Diagram',
      items: [
        // { text: 'Save Diagram', id: 'saveDiagram' },
        { text: 'Save Diagram As... ', id: 'saveDiagramAs' },
        { text: 'Load Diagram', id: 'loadDiagram' },
        { text: 'Reset Diagram', id: 'resetDiagram' },
      ],
    },
    {
      text: 'Database',
      items: [
        { text: 'Save Database As...', id: 'saveDBAs' },
        { text: 'Load Database', id: 'loadDB' },
        { text: 'Reset Database', id: 'resetDB' },
      ],
    },
    {
      text: 'Export',
      items: [{ text: 'Export to dflow', id: 'exportDflow' }],
    },
  ];

  const handleMenuClick = (args) => {
    switch (args.item.id) {
      // case 'saveDiagram':
      //   handleSaveDiagram();
      //   break;
      case 'saveDiagramAs':
        handleSaveToFile();
        break;
      case 'loadDiagram':
        document.getElementById('loadDiagramInput').click();
        break;
      case 'resetDiagram':
        handleResetDiagram();
        break;
      case 'saveDBAs':
        handleSaveDatabaseToFile();
        break;
      case 'loadDB':
        document.getElementById('loadDatabaseInput').click();
        break;
      case 'resetDB':
        handleResetDatabase();
        break;
      case 'exportDflow':
        handleExportDflow();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <MenuComponent items={menuItems} select={handleMenuClick} />
      <input
        type="file"
        accept=".json"
        className="hidden"
        id="loadDiagramInput"
        onChange={handleLoadFromFile}
      />
      <input
        type="file"
        accept=".json"
        className="hidden"
        id="loadDatabaseInput"
        onChange={handleLoadDatabaseFromFile}
      />
    </>
  );
};

export default DialoguesMenu;
