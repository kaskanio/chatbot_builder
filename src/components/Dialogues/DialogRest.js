import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useState } from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import Button from '../modules/Button';
import { useFetchServiceQuery, useAddServiceMutation } from '../../store';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Box, Typography, Grid } from '@mui/material';
import './dialog.css';

const validationSchema = Yup.object({
  name: Yup.string().required('Service Name is required'),
  verb: Yup.string().required('HTTP Verb is required'),
  host: Yup.string().required('Host is required'),
  port: Yup.number().required('Port is required').positive().integer(),
  path: Yup.string().required('Path is required'),
});

function DialogRest({ showDialogRest, setShowDialogRest, onSelectService }) {
  const [selectedService, setSelectedService] = useState(null);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const { data: services = [], refetch } = useFetchServiceQuery();
  const [addService, addServiceResults] = useAddServiceMutation();

  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  const hideDialog = () => {
    setShowDialogRest(false);
  };

  const handleSelectService = (e) => {
    if (e.itemData && e.itemData.name === 'Add New Service...') {
      setShowAddServiceForm(true);
      setSelectedService(null);
    } else {
      setSelectedService(e.itemData);
    }
  };

  const handleInsertService = () => {
    setShowAddServiceForm(false);
    setSelectedService(selectedService);
    onSelectService(selectedService); // Pass the service
    hideDialog();
  };

  const handleAddService = async (values) => {
    await addService(values);
    refetch();
    setShowAddServiceForm(false);
    onSelectService(values); // Pass the service details to the parent component
    hideDialog();
  };

  const footerTemplate = () => {
    return (
      <Box display="flex" flexDirection="column" width="100%">
        {showAddServiceForm && (
          <Formik
            initialValues={{
              name: '',
              verb: '',
              host: '',
              port: '',
              path: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await handleAddService(values);
              hideDialog();
            }}
          >
            {({ errors, touched, handleSubmit }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Field
                      name="name"
                      as={TextField}
                      label="Service Name"
                      fullWidth
                      size="small"
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                      InputLabelProps={{ style: { fontSize: 12 } }}
                      inputProps={{ style: { fontSize: 12 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      name="verb"
                      as={TextField}
                      label="HTTP Verb"
                      fullWidth
                      size="small"
                      error={touched.verb && !!errors.verb}
                      helperText={touched.verb && errors.verb}
                      InputLabelProps={{ style: { fontSize: 12 } }}
                      inputProps={{ style: { fontSize: 12 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      name="host"
                      as={TextField}
                      label="Host"
                      fullWidth
                      size="small"
                      error={touched.host && !!errors.host}
                      helperText={touched.host && errors.host}
                      InputLabelProps={{ style: { fontSize: 12 } }}
                      inputProps={{ style: { fontSize: 12 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      name="port"
                      as={TextField}
                      label="Port"
                      fullWidth
                      size="small"
                      error={touched.port && !!errors.port}
                      helperText={touched.port && errors.port}
                      InputLabelProps={{ style: { fontSize: 12 } }}
                      inputProps={{ style: { fontSize: 12 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="path"
                      as={TextField}
                      label="Path"
                      fullWidth
                      size="small"
                      error={touched.path && !!errors.path}
                      helperText={touched.path && errors.path}
                      InputLabelProps={{ style: { fontSize: 12 } }}
                      inputProps={{ style: { fontSize: 12 } }}
                    />
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    type="submit"
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
              </Form>
            )}
          </Formik>
        )}
        {!showAddServiceForm && (
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              type="button"
              primary
              rounded
              className="mr-2"
              onClick={handleInsertService}
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
        )}
      </Box>
    );
  };

  const dropdownData = [...services, { name: 'Add New Service...' }];

  return (
    <DialogComponent
      id="dialogRest"
      header="Select a Service"
      visible={showDialogRest}
      close={hideDialog}
      width="600px"
      animationSettings={settings}
      footerTemplate={footerTemplate}
      enableResize={true}
      showCloseIcon={true}
      position={{ X: 'center', Y: '250' }}
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
        {selectedService && (
          <Box mt={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
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
