const fs = require('fs');
const Handlebars = require('handlebars');

// Register the `eq` helper
Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

// Load JSON files
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
const diagramWeather = JSON.parse(
  fs.readFileSync('diagram_weather.json', 'utf8')
);

// Function to format intent strings
function formatIntentString(
  intentString,
  pretrainedEntities,
  trainableEntities
) {
  const parts = intentString.split(' ');
  const formattedParts = [];
  let currentString = [];
  parts.forEach((part) => {
    if (part.startsWith('PE:') || part.startsWith('TE:')) {
      if (currentString.length) {
        formattedParts.push(`"${currentString.join(' ')}"`);
        currentString = [];
      }
      const [entityType, entityName] = part.split(':');
      if (entityType === 'PE') {
        const entityValues = pretrainedEntities[entityName] || [];
        formattedParts.push(
          `${entityType}:${entityName}[${entityValues
            .map((value) => `'${value}'`)
            .join(', ')}]`
        );
      } else {
        formattedParts.push(`${entityType}:${entityName}`);
      }
    } else {
      currentString.push(part);
    }
  });
  if (currentString.length) {
    formattedParts.push(`"${currentString.join(' ')}"`);
  }
  return formattedParts.join(' ');
}

// Extract pretrained entities
function extractPretrainedEntities(pretrainedEntitiesData) {
  return pretrainedEntitiesData.reduce((acc, entity) => {
    acc[entity.entity] = entity.values.split(', ');
    return acc;
  }, {});
}

// Extract trainable entities
function extractTrainableEntities(trainableEntitiesData) {
  return trainableEntitiesData.reduce((acc, entity) => {
    acc[entity.name] = entity.values;
    return acc;
  }, {});
}

// Function to transform entity string
function transformEntityString(entityString) {
  if (entityString.includes('(') && entityString.includes(')')) {
    const [entity, entityType] = entityString.split(' (');
    return `${entityType.slice(0, -1)}:${entity}`;
  }
  return entityString;
}

// Extract intents
const intents = diagramWeather.nodes
  .filter((node) => node.addInfo && node.addInfo.intentName)
  .map((node) => ({
    name: node.addInfo.intentName,
    strings: node.addInfo.intentStrings.map((intentString) =>
      formatIntentString(
        intentString.string,
        extractPretrainedEntities(node.addInfo.pretrainedEntitiesData || []),
        extractTrainableEntities(node.addInfo.trainableEntitiesData || [])
      )
    ),
  }));

// Extract dialogues
function extractDialogues(diagram) {
  const dialogues = [];
  const nodeMap = diagram.nodes.reduce((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});
  const dialogueNameCounter = {};
  const actionGroupNameCounter = {};

  diagram.connectors.forEach((connector) => {
    const sourceNode = nodeMap[connector.sourceID];
    const targetNode = nodeMap[connector.targetID];

    if (sourceNode.addInfo && sourceNode.addInfo.intentName) {
      const baseDialogueName = `${sourceNode.addInfo.intentName}_dialogue`;
      let dialogueName = baseDialogueName;

      if (dialogueNameCounter[dialogueName]) {
        dialogueNameCounter[dialogueName] += 1;
        dialogueName = `${baseDialogueName}${dialogueNameCounter[dialogueName]}`;
      } else {
        dialogueNameCounter[dialogueName] = 1;
      }

      const dialogue = {
        name: dialogueName,
        trigger: sourceNode.addInfo.intentName,
        responses: [],
      };
      dialogues.push(dialogue);

      const actionNames = [];
      const actions = [];

      function processNode(node) {
        if (node.addInfo) {
          if (node.addInfo.formName) {
            const slots = [];
            const formName = node.addInfo.formName;
            slots.push(
              ...node.addInfo.gridDataHRI.map((slot) => ({
                name: slot.name,
                type: slot.type,
                hriString: slot.hriString,
                entity: transformEntityString(slot.entity),
                order: slot.order || 0,
                source: 'gridDataHRI',
              }))
            );
            slots.push(
              ...node.addInfo.gridDataService.map((slot) => ({
                name: slot.name,
                type: slot.type,
                service: slot.eServiceName,
                query: slot.query.join(''),
                header: slot.header.join(''),
                body: slot.body.join(''),
                order: slot.order || 0,
                source: 'gridDataService',
              }))
            );
            slots.sort((a, b) => a.order - b.order);
            dialogue.responses.push({
              type: 'Form',
              name: formName,
              slots,
            });
          }

          if (node.addInfo.actionType) {
            if (node.addInfo.actionType === 'SpeakAction') {
              actionNames.push(node.addInfo.speakActionName);
              actions.push({ speak: node.addInfo.actionString });
            } else if (node.addInfo.actionType === 'Fire Event') {
              actionNames.push(node.addInfo.eventName);
              actions.push({
                uri: node.addInfo.eventUri,
                message: node.addInfo.message,
              });
            } else if (node.addInfo.actionType === 'RestAction') {
              actionNames.push(node.addInfo.serviceName);
              actions.push({
                serviceName: node.addInfo.serviceName,
                serviceQuery: node.addInfo.serviceQuery,
                serviceHeader: node.addInfo.serviceHeader,
                servicePath: node.addInfo.servicePath,
                serviceBody: node.addInfo.serviceBody,
              });
            } else if (node.addInfo.actionType === 'GlobalSlot') {
              actionNames.push(node.addInfo.slotName);
              actions.push({
                gslotName: node.addInfo.slotName,
                gslotValue: node.addInfo.slotValue,
              });
            } else if (node.addInfo.actionType === 'FormSlot') {
              actionNames.push(node.addInfo.slotName);
              actions.push({
                formSlotName: node.addInfo.slotName,
                formSlotValue: node.addInfo.slotValue,
              });
            }
          }
        }
      }

      processNode(targetNode);

      let nextTargetId = connector.targetID;
      while (true) {
        const nextConnector = diagram.connectors.find(
          (c) => c.sourceID === nextTargetId
        );
        if (!nextConnector) break;
        nextTargetId = nextConnector.targetID;
        processNode(nodeMap[nextTargetId]);
      }

      let actionGroupName = actionNames.join('_');
      if (actionGroupNameCounter[actionGroupName]) {
        actionGroupNameCounter[actionGroupName] += 1;
        actionGroupName = `${actionGroupName}_${actionGroupNameCounter[actionGroupName]}`;
      } else {
        actionGroupNameCounter[actionGroupName] = 1;
      }

      dialogue.responses.push({
        type: 'ActionGroup',
        name: actionGroupName,
        actions,
      });
    }
  });

  return dialogues;
}

const dialogues = extractDialogues(diagramWeather);

// Setup Handlebars environment
const templateSource = fs.readFileSync('template.dflow.hbs', 'utf8');
const template = Handlebars.compile(templateSource);

// Render template
const output = template({
  intents,
  dialogues,
  services: db.services,
  synonyms: db.synonyms,
  entities: db.entities,
  gslots: db.globalSlots,
});

// Write to .dflow file
fs.writeFileSync('output.dflow', output);

console.log('DFlow file created successfully.');
