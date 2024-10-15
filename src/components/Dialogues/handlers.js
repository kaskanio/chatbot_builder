// handlers.js
export function handleSymbolDrag(
  args,
  setNodeToAdd,
  setShowDialogIntentRefresh,
  setShowDialogSpeak,
  setShowDialogFireEvent
) {
  console.log('To stoixeio pou petaksa einai to: ', args);

  if (args.element.propName === 'nodes') {
    const node = {
      id: args.element.id,
      offsetX: 100,
      offsetY: 100,
      width: args.element.width,
      height: args.element.height,
      annotations: args.element.annotations,
      shape: args.element.shape,
      style: args.element.style,
      borderWidth: args.element.borderWidth,
    };

    setNodeToAdd(node);

    if (args.element.properties.shape.shape === 'Gateway') {
      setShowDialogIntentRefresh(true);
    } else if (args.element.properties.shape.activity.task.type === 'User') {
      setShowDialogSpeak(true);
    } else if (
      args.element.properties.shape.activity.task.type ===
      'InstantiatingReceive'
    ) {
      setShowDialogFireEvent(true);
    }
  }
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
