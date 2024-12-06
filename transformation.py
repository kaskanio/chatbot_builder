import json
from jinja2 import Environment, FileSystemLoader

# Load JSON files

with open('db.json') as f:
    db = json.load(f)
with open('diagram_weather.json') as f:
    diagram_weather = json.load(f)



# Extract intents
intents = [
    {
        'name': node['addInfo']['intentName'],
        'strings': [intent_string['string'] for intent_string in node['addInfo']['intentStrings']]
    }
    for node in diagram_weather['nodes']
    if 'addInfo' in node and 'intentName' in node['addInfo']
]

# Extract dialogues (simplified example)
dialogues = [
    {
        'name': 'greet_dialogue',
        'trigger': 'greet',
        'action_group': 'greet_back',
        'speak': 'Hello there!!!'
    },
    {
        'name': 'bot_challenge_dialogue',
        'trigger': 'bot_challenge',
        'action_group': 'respond_iambot',
        'speak': 'I am a bot, powered by dFlow and Rasa.'
    }
]

# Setup Jinja2 environment
env = Environment(loader=FileSystemLoader('.'))
template = env.get_template('template.dflow.jinja')

# Render template
output = template.render(intents=intents, dialogues=dialogues)

# Write to .dflow file
with open('output.dflow', 'w') as f:
    f.write(output)

print('DFlow file created successfully.')