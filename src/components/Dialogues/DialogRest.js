import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useState, useRef } from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import Button from '../modules/Button';
import { useFetchServiceQuery, useAddServiceMutation } from '../../store';
import { TextField, Box, Typography, Grid, Divider } from '@mui/material';
import './dialog.css';

function DialogRest({ showDialogRest, setShowDialogRest, onSelectService }) {
  const [selectedService, setSelectedService] = useState(null);
  const { data: services = [], refetch } = useFetchServiceQuery();
  const [addService, addServiceResults] = useAddServiceMutation();

  const nameRef = useRef('');
  const verbRef = useRef('');
  const hostRef = useRef('');
  const portRef = useRef('');
  const pathRef = useRef('');
  const queryRef = useRef('');
  const headerRef = useRef('');
  const bodyRef = useRef('');

  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  const hideDialog = () => {
    setShowDialogRest(false);
  };

  const handleSelectService = (e) => {
    if (e.itemData && e.itemData.name === 'Add New Service...') {
      setSelectedService('null');
    } else {
      setSelectedService(e.itemData);
    }
  };

  const handleInsertService = () => {
    const query = queryRef.current.value;
    const header = headerRef.current.value;
    const body = bodyRef.current.value;

    const serviceDetails = {
      ...selectedService,
      query,
      header,
      body,
    };

    onSelectService(serviceDetails);
    hideDialog();
  };

  const handleAddService = async () => {
    const newService = {
      name: nameRef.current.value,
      verb: verbRef.current.value,
      host: hostRef.current.value,
      port: parseInt(portRef.current.value, 10),
      path: pathRef.current.value,
      query: queryRef.current.value,
      header: headerRef.current.value,
      body: bodyRef.current.value,
    };

    await addService(newService);
    refetch();
    onSelectService(newService);
    hideDialog();
  };

  const handleSubmit = () => {
    if (selectedService) {
      handleInsertService();
    } else {
      handleAddService();
    }
  };

  const serviceTextFields = (
    <>
      <Grid item xs={6}>
        <TextField
          id="nameInput"
          inputRef={nameRef}
          label="Service Name"
          fullWidth
          size="small"
          margin="dense"
          InputLabelProps={{ shrink: true, style: { fontSize: 12 } }}
          inputProps={{ style: { fontSize: 12 } }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="verbInput"
          inputRef={verbRef}
          label="HTTP Verb"
          fullWidth
          size="small"
          margin="dense"
          InputLabelProps={{ shrink: true, style: { fontSize: 12 } }}
          inputProps={{ style: { fontSize: 12 } }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="hostInput"
          inputRef={hostRef}
          label="Host"
          fullWidth
          size="small"
          margin="dense"
          InputLabelProps={{ shrink: true, style: { fontSize: 12 } }}
          inputProps={{ style: { fontSize: 12 } }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="portInput"
          inputRef={portRef}
          label="Port"
          fullWidth
          size="small"
          margin="dense"
          InputLabelProps={{ shrink: true, style: { fontSize: 12 } }}
          inputProps={{ style: { fontSize: 12 } }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="pathInput"
          inputRef={pathRef}
          label="Path"
          fullWidth
          size="small"
          margin="dense"
          InputLabelProps={{ shrink: true, style: { fontSize: 12 } }}
          inputProps={{ style: { fontSize: 12 } }}
        />
      </Grid>
    </>
  );

  const queryHeaderBodyTextFields = (
    <>
      <Grid item xs={12}>
        <TextField
          id="queryInput"
          inputRef={queryRef}
          label="Query"
          fullWidth
          size="small"
          margin="dense"
          InputLabelProps={{ shrink: true, style: { fontSize: 12 } }}
          inputProps={{ style: { fontSize: 12 } }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="headerInput"
          inputRef={headerRef}
          label="Header"
          fullWidth
          size="small"
          margin="dense"
          InputLabelProps={{ shrink: true, style: { fontSize: 12 } }}
          inputProps={{ style: { fontSize: 12 } }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="bodyInput"
          inputRef={bodyRef}
          label="Body"
          fullWidth
          size="small"
          margin="dense"
          InputLabelProps={{ shrink: true, style: { fontSize: 12 } }}
          inputProps={{ style: { fontSize: 12 } }}
        />
      </Grid>
    </>
  );

  const footerTemplate = () => {
    return (
      <Box display="flex" flexDirection="column" width="100%">
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {selectedService === 'null' && serviceTextFields}
          {selectedService &&
            selectedService.name !== 'Add New Service...' &&
            queryHeaderBodyTextFields}
        </Grid>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            type="button"
            primary
            loading={addServiceResults.isLoading}
            rounded
            className="mr-2"
            onClick={handleSubmit}
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
        </Box>
      </Box>
    );
  };

  const dropdownData = [...services, { name: 'Add New Service...' }];

  return (
    <DialogComponent
      id="dialogRest"
      header="Select a Service to call"
      visible={showDialogRest}
      close={hideDialog}
      width="600px"
      animationSettings={settings}
      footerTemplate={footerTemplate}
      enableResize={true}
      showCloseIcon={true}
      position={{ X: 'center', Y: '150' }}
    >
      <Box mt={1}>
        <Typography mb={4} color="textSecondary">
          Please select a service from the list below:
        </Typography>
        <DropDownListComponent
          id="ddlService"
          dataSource={dropdownData}
          fields={{ text: 'name', value: 'name', groupBy: 'verb' }}
          placeholder="Select a Service"
          className="w-full"
          change={handleSelectService}
        />
        {selectedService &&
          selectedService !== 'null' &&
          selectedService.name !== 'Add New Service...' && (
            <Box
              mt={2}
              p={2}
              border={1}
              borderColor="grey.300"
              borderRadius={1}
            >
              <Typography
                variant="subtitle1"
                mb={1}
                sx={{ fontWeight: 'bold', color: 'black', fontSize: '1.25rem' }}
              >
                Service Details
              </Typography>
              <Typography variant="body2" sx={{ color: 'black' }}>
                <strong>Name:</strong> {selectedService.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'black' }}>
                <strong>Verb:</strong> {selectedService.verb}
              </Typography>
              <Typography variant="body2" sx={{ color: 'black' }}>
                <strong>Host:</strong> {selectedService.host}
              </Typography>
              <Typography variant="body2" sx={{ color: 'black' }}>
                <strong>Port:</strong> {selectedService.port}
              </Typography>
              <Typography variant="body2" sx={{ color: 'black' }}>
                <strong>Path:</strong> {selectedService.path}
              </Typography>
            </Box>
          )}
      </Box>
    </DialogComponent>
  );
}

export default DialogRest;
