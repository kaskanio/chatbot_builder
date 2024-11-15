import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useState } from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import Button from '../modules/Button';
import { useFetchServiceQuery, useAddServiceMutation } from '../../store';
import { Spinner } from '@syncfusion/ej2-react-popups';
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
  const {
    data: services = [],
    error,
    isLoading,
    refetch,
  } = useFetchServiceQuery();
  const [addService, addServiceResults] = useAddServiceMutation();

  const settings = { effect: 'Zoom', duration: 400, delay: 0 };

  const hideDialog = () => {
    setShowDialogRest(false);
  };

  const handleSelectService = (e) => {
    if (e.itemData && e.itemData.name === 'Add New Service') {
      setShowAddServiceForm(true);
      setSelectedService(null);
    } else {
      setSelectedService(e.itemData);
      setShowAddServiceForm(false);
      onSelectService(e.itemData); // Pass the selected service details to the parent component
    }
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
              onClick={hideDialog}
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

  if (isLoading) {
    return (
      <DialogComponent
        id="dialogRest"
        header="Select a Service"
        visible={showDialogRest}
        close={hideDialog}
        width="600px"
        animationSettings={settings}
        enableResize={true}
        showCloseIcon={true}
        position={{ X: 'center', Y: '200' }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Spinner />
        </Box>
      </DialogComponent>
    );
  }

  if (error) {
    return (
      <DialogComponent
        id="dialogRest"
        header="REST Call Service"
        visible={showDialogRest}
        close={hideDialog}
        width="600px"
        animationSettings={settings}
        enableResize={true}
        showCloseIcon={true}
      >
        <Box mt={4} textAlign="center">
          <Typography color="error">Error fetching services</Typography>
          <Button onClick={refetch} primary rounded>
            Retry
          </Button>
        </Box>
      </DialogComponent>
    );
  }

  const dropdownData = [...services, { name: 'Add New Service' }];

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
      cssClass="custom-dialog"
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
            <Typography variant="subtitle1" mb={1}>
              Service Details
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {selectedService.name}
            </Typography>
            <Typography variant="body2">
              <strong>Verb:</strong> {selectedService.verb}
            </Typography>
            <Typography variant="body2">
              <strong>Host:</strong> {selectedService.host}
            </Typography>
            <Typography variant="body2">
              <strong>Port:</strong> {selectedService.port}
            </Typography>
            <Typography variant="body2">
              <strong>Path:</strong> {selectedService.path}
            </Typography>
          </Box>
        )}
      </Box>
    </DialogComponent>
  );
}

export default DialogRest;
