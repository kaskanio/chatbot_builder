import json
from jinja2 import Environment, FileSystemLoader

# Load JSON files
with open('db.json') as f:
    db = json.load(f)
with open('diagram.json') as f:
    diagram_weather = json.load(f)

# Function to format intent strings
def format_intent_string(intent_string, pretrained_entities, trainable_entities):
    parts = intent_string.split(' ')
    formatted_parts = []
    current_string = []
    for part in parts:
        if part.startswith('PE:') or part.startswith('TE:'):
            if current_string:
                formatted_parts.append('"{}"'.format(" ".join(current_string)))
                current_string = []
            entity_type, entity_name = part.split(':')
            if entity_type == 'PE':
                entity_values = pretrained_entities.get(entity_name, [])
                formatted_parts.append('{}:{}[{}]'.format(entity_type, entity_name, ", ".join("'{}'".format(value) for value in entity_values)))
            else:
                formatted_parts.append('{}:{}'.format(entity_type, entity_name))
        else:
            current_string.append(part)
    if current_string:
        formatted_parts.append('"{}"'.format(" ".join(current_string)))
    return ' '.join(formatted_parts)

# Extract pretrained entities
def extract_pretrained_entities(pretrained_entities_data):
    return {entity['entity']: entity['values'].split(', ') for entity in pretrained_entities_data}

# Extract trainable entities
def extract_trainable_entities(trainable_entities_data):
    return {entity['name']: entity['values'] for entity in trainable_entities_data}

# Function to transform entity string
def transform_entity_string(entity_string):
    if '(' in entity_string and ')' in entity_string:
        entity, entity_type = entity_string.split(' (')
        entity_type = entity_type.rstrip(')') 
        return f"{entity_type}:{entity}"
    return entity_string

# Extract intents
intents = [
    {
        'name': node['addInfo']['intentName'],
        'strings': [format_intent_string(intent_string['string'], extract_pretrained_entities(node['addInfo'].get('pretrainedEntitiesData', [])), extract_trainable_entities(node['addInfo'].get('trainableEntitiesData', []))) for intent_string in node['addInfo']['intentStrings']]
    }
    for node in diagram_weather['nodes']
    if 'addInfo' in node and 'intentName' in node['addInfo']
]

# Extract dialogues
def extract_dialogues(diagram):
    dialogues = []
    node_map = {node['id']: node for node in diagram['nodes']}
    dialogue_name_counter = {}  # Dictionary to keep track of dialogue name counts
    action_group_name_counter = {}  # Dictionary to keep track of action group name counts

    for connector in diagram['connectors']:
        source_id = connector['sourceID']
        target_id = connector['targetID']
        source_node = node_map[source_id]
        target_node = node_map[target_id]

        if 'intentName' in source_node['addInfo'] or 'eventName' in source_node['addInfo'] and 'eventType'!= 'FireEvent' in source_node['addInfo']:
            # Set the dialogue name
            trigger_name = source_node['addInfo'].get('intentName') or source_node['addInfo'].get('eventName')
            base_dialogue_name = f"{trigger_name}_dialogue"
            dialogue_name = base_dialogue_name

            # Ensure the dialogue name is unique
            if dialogue_name in dialogue_name_counter:
                dialogue_name_counter[dialogue_name] += 1
                dialogue_name = f"{base_dialogue_name}{dialogue_name_counter[dialogue_name]}"
            else:
                dialogue_name_counter[dialogue_name] = 1

            dialogue = {
                'name': dialogue_name,
                'trigger': trigger_name,
                'responses': []
            }
            dialogues.append(dialogue)

            # Collect all actions in a single ActionGroup
            action_names = []
            actions = []

            # Function to process a node and add responses/actions
            def process_node(node):
                if 'addInfo' in node:
                    if 'formName' in node['addInfo']:
                        slots = []
                        form_name = node['addInfo']['formName']
                        slots.extend([
                            {
                                'name': slot['name'],
                                'type': slot['type'],
                                'hriString': process_hri_string(slot['hriString']),
                                'entity': transform_entity_string(slot['entity']) if slot['entity'] else None,
                                'value': slot.get('value'),  # Use get method to avoid KeyError
                                'order': slot.get('order', 0),  # Default order to 0 if not specified
                                'source': 'gridDataHRI'
                            }
                            for slot in node['addInfo'].get('gridDataHRI', [])
                        ])
                        slots.extend([
                            {
                                'name': slot['name'],
                                'type': slot['type'],
                                'service': slot['eServiceName'],
                                'query': ''.join(slot['query']),
                                'header': ''.join(slot.get('header', '')),
                                'path': ''.join(slot.get('path', '')),
                                'body': ''.join(slot.get('body', '')),
                                'order': slot.get('order', 0),  # Default order to 0 if not specified
                                'source': 'gridDataService'
                            }
                            for slot in node['addInfo'].get('gridDataService', [])
                        ])
                        slots.sort(key=lambda x: x['order'])  # Sort slots by order
                        dialogue['responses'].append({
                            'type': 'Form',
                            'name': form_name,
                            'slots': slots
                        })

                    if 'actionType' in node['addInfo']:
                        if node['addInfo']['actionType'] == 'SpeakAction':
                            action_names.append(node['addInfo']['speakActionName'])
                            action_string = node['addInfo']['actionString']
                            parts = action_string.split()
                            formatted_parts = []
                            current_string = []
                            for part in parts:
                                if '.' in part:
                                    if current_string:
                                        formatted_parts.append("'{} '".format(" ".join(current_string)))
                                        current_string = []
                                    formatted_parts.append(part)
                                else:
                                    current_string.append(part)
                            if current_string:
                                formatted_parts.append("'{} '".format(" ".join(current_string)))
                            formatted_action_string = ' '.join(formatted_parts)
                            actions.append({
                                'speak': formatted_action_string
                            })
                        elif node['addInfo']['actionType'] == 'Fire Event':
                            action_names.append(node['addInfo']['eventName'])
                            actions.append({
                                'uri': node['addInfo']['eventUri'],
                                'message': node['addInfo']['message']
                            })
                        elif node['addInfo']['actionType'] == 'RestAction':
                            action_names.append(node['addInfo']['serviceName'])
                            actions.append({
                                'serviceName': node['addInfo']['serviceName'],
                                'serviceQuery': node['addInfo']['serviceQuery'],
                                'serviceHeader': node['addInfo']['serviceHeader'],
                                'servicePath': node['addInfo']['servicePath'],
                                'serviceBody': node['addInfo']['serviceBody']
                            })
                        elif node['addInfo']['actionType'] == 'GlobalSlot':
                            action_names.append(node['addInfo']['slotName'])
                            actions.append({
                                'gslotName': node['addInfo']['slotName'],
                                'gslotValue': node['addInfo']['slotValue']
                            })
                        elif node['addInfo']['actionType'] == 'FormSlot':
                            action_names.append(node['addInfo']['slotName'])
                            actions.append({
                                'formSlotName': node['addInfo']['slotName'],
                                'formSlotValue': node['addInfo']['slotValue']
                            })

            # Process the first target node
            process_node(target_node)

            # Process subsequent responses
            next_target_id = target_id
            while True:
                next_connector = next((c for c in diagram['connectors'] if c['sourceID'] == next_target_id), None)
                if not next_connector:
                    break
                next_target_id = next_connector['targetID']
                next_target_node = node_map[next_target_id]
                process_node(next_target_node)

            # Create the action group name
            action_group_name = "_".join(action_names)
            if action_group_name in action_group_name_counter:
                action_group_name_counter[action_group_name] += 1
                action_group_name = f"{action_group_name}_{action_group_name_counter[action_group_name]}"
            else:
                action_group_name_counter[action_group_name] = 1

            # Add the action group to the dialogue
            action_group = {
                'type': 'ActionGroup',
                'name': action_group_name,
                'actions': actions
            }
            dialogue['responses'].append(action_group)

    return dialogues

# Function to process HRI string
def process_hri_string(hri_string):
    parts = hri_string.split()
    formatted_parts = []
    current_string = []
    for part in parts:
        if '.' in part:
            if current_string:
                formatted_parts.append("'{} '".format(" ".join(current_string)))
                current_string = []
            formatted_parts.append(part)
        else:
            current_string.append(part)
    if current_string:
        formatted_parts.append("'{} '".format(" ".join(current_string)))
    return ' '.join(formatted_parts)

dialogues = extract_dialogues(diagram_weather)

# Setup Jinja2 environment
env = Environment(loader=FileSystemLoader('.'))
template = env.get_template('template.dflow.jinja')

# Render template
output = template.render(intents=intents, dialogues=dialogues, services=db['services'], synonyms=db['synonyms'], entities=db['entities'], gslots=db['globalSlots'], events=db['events'])

# Write to .dflow file
with open('outputPY.dflow', 'w') as f:
    f.write(output)

print('DFlow file created successfully.')