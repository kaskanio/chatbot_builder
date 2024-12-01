import React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';

const HelloWorldDialog = ({ visible, onClose, content, addInfo }) => {
  console.log('The added info is :', addInfo);

  return (
    <DialogComponent
      width="400px"
      height="300px"
      visible={visible}
      header="Node Content"
      content={content}
      close={onClose}
      showCloseIcon={true}
    />
  );
};

export default HelloWorldDialog;
