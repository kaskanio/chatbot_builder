import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import {
  DiagramTools,
  SymbolPaletteComponent,
} from '@syncfusion/ej2-react-diagrams';
import { useFetchIntentQuery, useAddNodeMutation } from '../store';
import { useState } from 'react';
import Skeleton from './modules/Skeleton';
import Button from './modules/Button';

function DialoguesToolbar(diagramInstanceRef) {
  const [dialogVisible, setDialogVisible] = useState(false);

  const { data, error, isLoading } = useFetchIntentQuery();
  const [addNode, addNodeResults] = useAddNodeMutation();
  const [selectedIntent, setSelectedIntent] = useState(null);

  let connectorSymbols = [
    {
      id: 'Link1',
      type: 'Orthogonal',
      sourcePoint: {
        x: 0,
        y: 0,
      },
      targetPoint: {
        x: 40,
        y: 40,
      },
      targetDecorator: {
        shape: 'Arrow',
      },
    },
    {
      id: 'Link21',
      type: 'Straight',
      sourcePoint: {
        x: 0,
        y: 0,
      },
      targetPoint: {
        x: 40,
        y: 40,
      },
      targetDecorator: {
        shape: 'Arrow',
      },
    },
    {
      id: 'link33',
      type: 'Bezier',
      sourcePoint: {
        x: 0,
        y: 0,
      },
      targetPoint: {
        x: 40,
        y: 40,
      },
      style: {
        strokeWidth: 2,
      },
      targetDecorator: {
        shape: 'None',
      },
    },
  ];

  let basicShapes = [
    {
      id: 'Rectangle',
      shape: {
        type: 'Basic',
        shape: 'Rectangle',
      },
    },
    {
      id: 'Ellipse',
      shape: {
        type: 'Basic',
        shape: 'Ellipse',
      },
    },
    {
      id: 'Hexagon',
      shape: {
        type: 'Basic',
        shape: 'Hexagon',
      },
    },
  ];

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  let intents;

  if (isLoading) {
    intents = <Skeleton className="h-10 w-full" times={3} />;
  } else if (error) {
    intents = <div>Error loading intents.</div>;
  } else {
    intents = data.map((intent) => {
      return intent.name;
    });
  }

  const handleAddNodeIntent = (e) => {
    console.log(selectedIntent);
    e.preventDefault();
    if (selectedIntent) {
      addNode({
        nodeId: selectedIntent,
        shape: 'Gateway',
      });
    }
  };

  const handleIntentChange = (e) => {
    setSelectedIntent(e.value);
    console.log(selectedIntent);
  };

  const footerTemplate = () => {
    return (
      <div className="flex justify-between">
        <Button
          type="submit"
          onClick={(e) => {
            handleAddNodeIntent(e);
            hideDialog();
          }}
          primary
          loading={addNodeResults.isLoading}
          rounded
          className="mr-2"
        >
          Insert
        </Button>
        <Button
          onClick={() => {
            hideDialog();
          }}
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

  const handleButtonClick = () => {
    const connectors = {
      id: 'connector1',
      type: 'Orthogonal',
      segments: [
        {
          type: 'Orthogonal',
        },
      ],
    };
    diagramInstanceRef.current.drawingObject = connectors;
    diagramInstanceRef.current.tool = DiagramTools.DrawOnce;
    diagramInstanceRef.current.dataBind();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div className="flex">
          <SymbolPaletteComponent
            id="palette1"
            expandMode="Multiple"
            palettes={[
              {
                id: 'connectors',
                expanded: true,
                symbols: connectorSymbols,
                title: 'Connectors',
                iconCss: 'e-ddb-icons e-connector',
              },
              {
                id: 'basic',
                expanded: true,
                symbols: basicShapes,
                title: 'Basic Shapes',
                iconCss: 'e-ddb-icons e-basic',
              },
            ]}
            symbolHeight={80}
            symbolWidth={80}
          />
        </div>

        <div className="ml-4 flex">
          <Button secondary rounded onClick={showDialog} className="width">
            Add Intent
          </Button>
        </div>
      </div>

      <DialogComponent
        id="dialog"
        header="Select Intent"
        visible={dialogVisible}
        close={hideDialog}
        width="250px"
        animationSettings={{ effect: 'None' }}
        footerTemplate={footerTemplate}
      >
        <div className="mt-4">
          <DropDownListComponent
            id="ddlelement"
            dataSource={intents}
            placeholder="Select an Intent"
            change={handleIntentChange}
            className="w-full"
          />
        </div>
      </DialogComponent>
    </div>
  );
}

export default DialoguesToolbar;
