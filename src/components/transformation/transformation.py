import json
from jinja2 import Environment, FileSystemLoader

# Load JSON files
with open('db.json') as f:
    db = json.load(f)
with open('diagram_weather.json') as f:
    diagram_weather = json.load(f)

# Function to format intent strings
def format_intent_string(intent_string, pretrained_entities, trainable_entities, synonyms):
    parts = intent_string.split(' ')
    formatted_parts = []
    current_string = []
    for part in parts:
        if part.startswith('PE:') or part.startswith('TE:') or part.startswith('S:'):
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

# Extract synonyms
def extract_synonyms(synonyms_data):
    return {synonym['name']: synonym['values'] for synonym in synonyms_data}

# Extract intents
intents = [
    {
        'name': node['addInfo']['intentName'],
        'strings': [format_intent_string(intent_string['string'], extract_pretrained_entities(node['addInfo'].get('pretrainedEntitiesData', [])), extract_trainable_entities(node['addInfo'].get('trainableEntitiesData', [])), extract_synonyms(node['addInfo'].get('synonymsData', []))) for intent_string in node['addInfo']['intentStrings']]
    }
    for node in diagram_weather['nodes']
    if 'addInfo' in node and 'intentName' in node['addInfo']
]

# Extract dialogues
dialogues = [
    {
        'name': 'weather_dialogue',
        'trigger': 'ask_weather',
        'form': {
            'name': 'form1',
            'slots': [
                {
                    'name': 'city_slot',
                    'type': 'str',
                    'prompt': 'For which city?',
                    'entities': ['PE:GPE']
                }
            ],
            'responses': [
                {
                    'name': 'answer',
                    'service': 'weather_svc',
                    'query': ['city=form1.city_slot', 'language="English"'],
                    'header': ['access_token="Q5eJZ8sSLEX6XNmOHyMlWagI"'],
                    'field': 'description'
                },
                {
                    'name': 'answer2',
                    'service': 'weather_svc',
                    'query': ['city=form1.city_slot', 'language="English"'],
                    'header': ['access_token="Q5eJZ8sSLEX6XNmOHyMlWagI"'],
                    'field': 'temp'
                }
            ]
        },
        'action_group': {
            'name': 'answer_back',
            'speak': 'The weather for {{ form1.city_slot }} is {{ form1.answer }} with {{ form1.answer2 }} degrees'
        }
    },
    {
        'name': 'greet_dialogue',
        'trigger': 'greet',
        'action_group': {
            'name': 'greet_back',
            'speak': 'Hello there!!!'
        }
    },
    {
        'name': 'bot_challenge_dialogue',
        'trigger': 'bot_challenge',
        'action_group': {
            'name': 'respond_iambot',
            'speak': 'I am a bot, powered by dFlow and Rasa.'
        }
    }
]

# Extract entities
entities = [
    {
        'name': entity['name'],
        'values': entity['values']
    }
    for entity in db['entities']
]

# Debugging: Print entities to check structure
# EDW EXW ERROR KAI GAMIETAI. KSEKINA APO EDW. PROSPATHW NA FTIAKSW ENTITES
print("Entities:", entities)

# Setup Jinja2 environment
env = Environment(loader=FileSystemLoader('.'))
template = env.get_template('template.dflow.jinja')

# Render template
output = template.render(intents=intents, dialogues=dialogues, services=db['services'], form_slots=db['formSlots'], entities=entities)

# Write to .dflow file
with open('output.dflow', 'w') as f:
    f.write(output)

print('DFlow file created successfully.')