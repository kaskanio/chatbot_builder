// utils.js
export function createProperty(type, name) {
  return { type: type, name: name };
}

export function mapNodes(data) {
  return data.map((node) => ({
    id: node.id,
    offsetX: node.offsetX || 100,
    offsetY: node.offsetY || 100,
    width: node.width || 130,
    height: node.height || 130,
    annotations: [
      {
        content: node.id.toString(),
      },
    ],
    shape: {
      type: node.shape.type,
      shape: node.shape.shape,
      activity: {
        activity: node.shape.activity.activity || 'None',
        task: {
          type: node.shape.activity.task.type || 'None',
        },
      },
    },
    style: {
      fill: node.style.fill,
      strokeWidth: node.style.strokeWidth,
      strokeColor: node.style.strokeColor,
    },
    addInfo: node.addInfo || 'None',
  }));
}

export function mapIntentNodes(intentNodesData) {
  return intentNodesData.map((node) => ({
    id: node.id,
    offsetX: node.offsetX || 250,
    offsetY: node.offsetY || 250,
    shape: {
      type: node.shape.type,
      classifier: node.shape.classifier,
      classShape: {
        name: node.shape.classShape.name,
        attributes: node.shape.classShape.attributes.map((attr) => ({
          type: attr.type,
          name: attr.name,
        })),
      },
    },
  }));
}

export function mapConnectors(connectorData) {
  return connectorData.map((connector) => ({
    id: connector.id,
    sourceID: connector.sourceId,
    targetID: connector.targetId,
    type: connector.type || 'Orthogonal',
    targetDecorator: connector.targetDecorator,
    sourcePoint: {
      x: connector.sourcePointX,
      y: connector.sourcePointY,
    },
    targetPoint: {
      x: connector.targetPointX,
      y: connector.targetPointY,
    },
  }));
}
