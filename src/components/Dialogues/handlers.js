// handlers.js
export function handleSymbolDrag(
  args,
  setShowDialogSpeak,
  setShowDialogFireEvent,
  setDraggedNode
) {
  console.log('To stoixeio pou petaksa einai to: ', args);

  if (args.element.propName === 'nodes') {
    if (args.element.properties.shape.properties.type === 'Bpmn') {
      if (args.element.properties.shape.activity.task.type === 'User') {
        setShowDialogSpeak(true);
        console.log('To petixa?');
      } else if (
        args.element.properties.shape.activity.task.type ===
        'InstantiatingReceive'
      ) {
        setShowDialogFireEvent(true);
        setDraggedNode(args.element);
        args.cancel = true;
      } else if (
        args.element.properties.shape.activity.task.type === 'Service'
      ) {
        console.log('REST Call');
      } else if (
        args.element.properties.shape.activity.task.type === 'BusinessRule'
      ) {
        console.log('BusinessRule');
      } else if (
        args.element.properties.shape.activity.task.type === 'Manual'
      ) {
        console.log('Manual');
      }
    }
  }
}

export function handlePropertyChange(args) {
  console.log('To stoixeio pou allaksa einai to: ', args);
}

export function handleCollectionChange(args) {
  /* This is very weird, it is not working as expected. 
  That's because i want the strings to be deleted from the db.json when i delete them from the diagram, 
  but the intents should not be deleted from the db.json if i delete them from the diagram. 
  The user will be confused with this behaviour. */
  // if (
  //   args.type === 'Removal' &&
  //   args.state === 'Changed' &&
  //   args.element.umlIndex
  // ) {
  //   // Check if the element being removed is part of a node
  //   if (args.element.parentId) {
  //     console.log('Element is part of a node, not removing string:', args);
  //   }
  //   console.log(
  //     'Paw na sviso:  ',
  //     args.element.properties.annotations[0].properties.content
  //   );
  //   const matchingString = stringsData.find(
  //     (string) =>
  //       string.name ===
  //       args.element.properties.annotations[0].properties.content
  //   );
  //   if (matchingString) {
  //     const stringId = matchingString.id;
  //     removeString(stringId);
  //   }
  // }
}
// export function handleCollectionChange(
//   args,
//   deleteNode,
//   addConnector,
//   deleteConnector,
//   diagramInstanceRef
// ) {
//   if (
//     args.type === 'Removal' &&
//     args.element.propName === 'nodes' &&
//     args.state === 'Changed'
//   ) {
//     const deletedNodeId = args.element.properties.id;
//     console.log(`Node with ID ${deletedNodeId} is deleted.`, args);
//     deleteNode(args.element.properties.id);
//   } else if (
//     args.type === 'Addition' &&
//     args.element.propName === 'connectors'
//   ) {
//     console.log(`Connector with ID ${args.element.id} is added.`, args);
//     addConnector({
//       connectorId: args.element.id,
//       sourceId: args.element.sourceID,
//       targetId: args.element.targetID,
//       type: args.element.type,
//       sourcePointX: args.element.sourcePoint.x,
//       sourcePointY: args.element.sourcePoint.y,
//       targetPointX: args.element.targetPoint.x,
//       targetPointY: args.element.targetPoint.y,
//     });
//   } else if (
//     args.type === 'Removal' &&
//     args.element.propName === 'connectors' &&
//     args.state === 'Changed'
//   ) {
//     const deletedConnectorId = args.element.properties.id;
//     console.log(`Connector with ID ${deletedConnectorId} is deleted.`);
//     deleteConnector(args.element.properties.id);
//   }
// }

// export function handlePositionChange(
//   args,
//   updateNode,
//   updateIntentNode,
//   updateConnector,
//   diagramInstanceRef
// ) {
//   const nodeId = args.source.properties.id;
//   if (args.state === 'Completed') {
//     if (args.source.propName === 'nodes') {
//       if (args.source.properties.shape.classifier === 'Class') {
//         // updateIntentNode({
//         //   nodeId: nodeId,
//         //   updatedOffsetX: args.newValue.offsetX,
//         //   updatedOffsetY: args.newValue.offsetY,
//         // })
//         //   .unwrap()
//         //   .then((result) => {
//         //     console.log('Update node successful:', result);
//         //   })
//         //   .catch((error) => {
//         //     console.error('Update failed:', error);
//         //   });
//       } else if (args.source.properties.shape.properties.type === 'Bpmn') {
//         updateNode({
//           nodeId: nodeId,
//           updatedOffsetX: args.newValue.offsetX,
//           updatedOffsetY: args.newValue.offsetY,
//         })
//           .unwrap()
//           .then((result) => {
//             console.log('Update node successful:', result);
//           })
//           .catch((error) => {
//             console.error('Update failed:', error);
//           });
//       }
//       const connectedConnectors = diagramInstanceRef.current.connectors.filter(
//         (connector) =>
//           connector.sourceID === nodeId || connector.targetID === nodeId
//       );

//       connectedConnectors.forEach((connector) => {
//         updateConnector({
//           connectorId: connector.id,
//           updatedSourcePointX: connector.sourcePoint.x,
//           updatedSourcePointY: connector.sourcePoint.y,
//           updatedTargetPointX: connector.targetPoint.x,
//           updatedTargetPointY: connector.targetPoint.y,
//         })
//           .unwrap()
//           .then((result) => {
//             console.log('Update connector successful:', result);
//           })
//           .catch((error) => {
//             console.error('Update failed:', error);
//           });
//       });
//     } else if (args.source.propName === 'connectors') {
//       updateConnector({
//         connectorId: nodeId,
//         updatedSourcePointX: args.newValue.sourcePoint.x,
//         updatedSourcePointY: args.newValue.sourcePoint.y,
//         updatedTargetPointX: args.newValue.targetPoint.x,
//         updatedTargetPointY: args.newValue.targetPoint.y,
//       })
//         .unwrap()
//         .then((result) => {
//           console.log('Update successful:', result);
//         })
//         .catch((error) => {
//           console.error('Update failed:', error);
//         });
//     } else if (args.source.propName === 'selectedItems') {
//       const selectedItems = args.source.nodes || args.source.connectors;
//       if (selectedItems) {
//         selectedItems.forEach((item) => {
//           console.log('Selected item:', item);
//           if (item.properties.shape.classifier === 'Class') {
//             console.log('To class mou einai ', args);
//             // updateIntentNode({
//             //   nodeId: item.id,
//             //   updatedOffsetX: args.newValue.offsetX,
//             //   updatedOffsetY: args.newValue.offsetY,
//             // })
//             //   .unwrap()
//             //   .then((result) => {
//             //     console.log('Update node successful:', result);
//             //   })
//             //   .catch((error) => {
//             //     console.error('Update failed:', error);
//             //   });
//           } else if (item.properties.shape.type === 'Bpmn') {
//             updateNode({
//               nodeId: item.id,
//               updatedOffsetX: args.newValue.offsetX,
//               updatedOffsetY: args.newValue.offsetY,
//             })
//               .unwrap()
//               .then((result) => {
//                 console.log('Update successful:', result);
//               })
//               .catch((error) => {
//                 console.error('Update failed:', error);
//               });
//           }
//           const connectedConnectors =
//             diagramInstanceRef.current.connectors.filter(
//               (connector) =>
//                 connector.sourceID === item.id || connector.targetID === item.id
//             );

//           connectedConnectors.forEach((connector) => {
//             updateConnector({
//               connectorId: connector.id,
//               updatedSourcePointX: connector.sourcePoint.x,
//               updatedSourcePointY: connector.sourcePoint.y,
//               updatedTargetPointX: connector.targetPoint.x,
//               updatedTargetPointY: connector.targetPoint.y,
//             })
//               .unwrap()
//               .then((result) => {
//                 console.log('Update successful:', result);
//               })
//               .catch((error) => {
//                 console.error('Update failed:', error);
//               });
//           });
//         });
//       }
//     }
//   }
// }

// export function handleSizeChange(
//   args,
//   updateNode,
//   updateConnector,
//   diagramInstanceRef
// ) {
//   if (args.state === 'Completed') {
//     const nodeId = args.source.nodes[0].properties.id;

//     updateNode({
//       nodeId: nodeId,
//       updatedOffsetX: args.newValue.offsetX,
//       offsetY: args.newValue.offsetY,
//       updatedWidth: args.newValue.width,
//       updatedHeight: args.newValue.height,
//     })
//       .unwrap()
//       .then((result) => {
//         console.log('Update successful:', result);
//       })
//       .catch((error) => {
//         console.error('Update failed:', error);
//       });
//     if (args.source.propName === 'selectedItems') {
//       const selectedItems = args.source.nodes || args.source.connectors;

//       if (selectedItems) {
//         selectedItems.forEach((item) => {
//           console.log('Selected item:', item);
//           if (item.propName === 'nodes') {
//             updateNode({
//               nodeId: item.id,
//               updatedOffsetX: args.newValue.offsetX,
//               updatedOffsetY: args.newValue.offsetY,
//             })
//               .unwrap()
//               .then((result) => {
//                 console.log('Update successful:', result);
//               })
//               .catch((error) => {
//                 console.error('Update failed:', error);
//               });
//             const connectedConnectors =
//               diagramInstanceRef.current.connectors.filter(
//                 (connector) =>
//                   connector.sourceID === item.id ||
//                   connector.targetID === item.id
//               );

//             connectedConnectors.forEach((connector) => {
//               updateConnector({
//                 connectorId: connector.id,
//                 updatedSourcePointX: connector.sourcePoint.x,
//                 updatedSourcePointY: connector.sourcePoint.y,
//                 updatedTargetPointX: connector.targetPoint.x,
//                 updatedTargetPointY: connector.targetPoint.y,
//               })
//                 .unwrap()
//                 .then((result) => {
//                   console.log('Update successful:', result);
//                 })
//                 .catch((error) => {
//                   console.error('Update failed:', error);
//                 });
//             });
//           }
//         });
//       }
//     }
//   }
// }

// export function handleConnectionChange(
//   args,
//   updateConnector,
//   diagramInstanceRef
// ) {
//   if (args.state === 'Changed') {
//     console.log(args);
//     updateConnector({
//       connectorId: args.connector.id,
//       updatedSourceId: args.connector.sourceID,
//       updatedTargetId: args.connector.targetID,
//       updatedSourcePointX: args.connector.sourcePoint.x,
//       updatedSourcePointY: args.connector.sourcePoint.y,
//       updatedTargetPointX: args.connector.targetPoint.x,
//       updatedTargetPointY: args.connector.targetPoint.y,
//     })
//       .unwrap()
//       .then((result) => {
//         console.log('Update successful:', result);
//         diagramInstanceRef.updateConnector(args.connector.id, args.connector);
//       })
//       .catch((error) => {
//         console.error('Update failed:', error);
//       });
//   }
// }
