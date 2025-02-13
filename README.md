<!-- @format -->

# My GPT Interface Project

## About

This project is an ongoing self-driven endeavor into software engineering and artificial intelligence. I initiated this for the purposes of self-education, skill acquisition and fulfilling personal curiousity. Undertaken without formal training, this project centers on full-stack development, AI model integrations, and mastering a range of emerging technologies.

## Tech Stack

The project is built using a diverse set of technologies, covering both frontend and backend development:

- **Frontend:**

  - TypeScript
  - Vue 3
  - Vuex 4.x
  - Vuetify (with Material Design Icons)
  - VeeValidate
  - Webpack
  - highlight.js
  - ESlint
  - Prettier
  - Joi valiadtion

- **Backend:**

  - Python
  - Flask
  - FastAPI
  - Pydantic
  - SQLAlchemy
  - SQLite
  - Hypercorn
  - Alembic
  - Poetry
  - Redis
  - OpenAI API
  - Gemeni API

- **Utilities:**
  - Concurrently
  - Docker
## Learning topics covered: 

balancing between functional programming and oop. abstract design patters, factory and adapter patterns, strategy, interface and singleton patterns. syncronous vs asyncronous backend, composition over abstraction, dependency injection principle, liskuv principle,  ripository, unit of work, and transactional decorators  patterns for interacting with the database, DTOs, data mapping layers, Normalizr, centralized scalable datamapping and validation for both JS (noramlizr + Joi) and python (pydatntic + fastapi)    


## AI and Prompt Engineering

The project includes working with and combining multiple AI models, API, and prompt engineering techniques, such as:

- OpenAI API
- FalconAI
- Gemeni API
- Hugging Face tools (e.g., sentiment analysis, passive feedback techniques)
- Self prompting and agent based modeling
- Token Management

## Getting Started

### Prerequisites

- Node.js (for managing frontend dependencies)
- Python 3 (for backend development)
- Git (for version control)

### Setting Up the Project

1. **Clone the Repository**

2. **Setting Up Environment Variables**

Before running the project, you need to set up environment variables:

- Create a `.env` file in the root of the project.
- Add the necessary keys and values in the `.env` file:
  ```
  OPENAI_API_KEY=your_api_key_here
  FLASK_ENV=development
  FLASK_SECRET_KEY=your_flask_secret_key_here
  ```
  _Note: the model is set up to work with gpt-4-turbo, you will need to bill $5 to your OpenAI account to get it working_

3. **Install Frontend Dependencies:**

```
npm install
```

4. **Install Backend Dependencies:**

- Ensure you have Python 3 installed.
- It's recommended to use a virtual environment:
  ```
  python -m venv venv
  source venv/bin/activate  # On Windows use `venv\Scripts\activate`
  ```
- Install Python dependencies:
  ```
  pip install -r requirements.txt
  ```

5. **Setup the Database:**

- The project uses SQLAlchemy with SQLite.

6. **Running the Project:**

- To start the frontend development server:
  ```
  npm run webpack
  ```
- To start the Flask backend server:
  ```
  npm run flask
  ```
- Alternatively, to run both concurrently:
  ```
  npm start
  ```
- When making changes to the back end:

  use

  ```
  npm run build
  ```

  to deploy changes to the webpack bundler

7. **Accessing the Application:**

- By default, the frontend will be available at `http://localhost:8080` and the backend at `http://localhost:5001`.

### Additional Notes

- For the specific configurations of Webpack, refer to `webpack.config.js`.
- Backend models and database schema are defined in `models.py`.
