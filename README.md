# Chatbot Builder

Chatbot Builder is a web application that enables users to create interactive chatbot workflows using a visual diagram-based interface. The tool generates structured data based on the DSL dFlow that can be exported in a format compatible with the Rasa framework for chatbot development.

## Features

- **Drag-and-Drop Interface**: Easily create chatbot flows using an intuitive UI.
- **Syncfusion Components**: Utilizes Syncfusion libraries for rich UI components like diagrams, buttons, dropdowns, and modals.
- **State Management**: Uses Redux Toolkit for efficient state handling.
- **Data Persistence**: Supports JSON-based storage and export functionality.
- **React-Based Frontend**: Built with React and Tailwind CSS for a modern, responsive design.

## Installation

To set up the project locally, follow these steps:

### Prerequisites

- Docker & Docker Compose installed on your machine

### Steps

```bash
# Clone the repository
git clone https://github.com/kaskanio/chatbot_builder.git
cd chatbot_builder

# Build the Docker image
docker-compose build

# Run the application
docker-compose up
```

The application will be available at `http://localhost:3000/`.

## Dependencies

Key dependencies used in this project:

- **React & Redux**: Frontend framework and state management
- **Syncfusion**: UI components (`@syncfusion/ej2-react-diagrams`, etc.)
- **Tailwind CSS**: Styling framework
- **React Icons**: Icon library
- **Axios**: HTTP client for API requests

## Exporting Chatbot Data

The chatbot flow data can be exported in a structured format for use with Rasa. To export:

1. Design the chatbot flow using the UI.
2. Click the **Export** button.
3. The generated JSON file will be downloaded, ready to be used with Rasa.

## Future Enhancements

- Integration with Rasa for real-time testing
- Additional chatbot templates
- Improved data validation and error handling

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
