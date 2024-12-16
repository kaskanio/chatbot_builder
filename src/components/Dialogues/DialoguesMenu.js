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

  const handleSaveToFile = () => {
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
      a.download = 'diagram.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

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

  const handleResetDiagram = () => {
    if (diagramInstanceRef.current) {
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

  const menuItems = [
    {
      text: 'Diagram',
      items: [
        { text: 'Save Diagram', id: 'saveDiagram' },
        { text: 'Load Diagram', id: 'loadDiagram' },
        { text: 'Reset Diagram', id: 'resetDiagram' },
      ],
    },
    {
      text: 'Database',
      items: [{ text: 'Reset Database', id: 'resetDB' }],
    },
  ];

  const handleMenuClick = (args) => {
    switch (args.item.id) {
      case 'saveDiagram':
        handleSaveToFile();
        break;
      case 'loadDiagram':
        document.getElementById('loadDiagramInput').click();
        break;
      case 'resetDiagram':
        handleResetDiagram();
        break;
      case 'resetDB':
        handleResetDatabase();
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
    </>
  );
};

export default DialoguesMenu;
