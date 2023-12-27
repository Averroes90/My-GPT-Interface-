# My GPT Interface Project

## About
This project is an ongoing self-driven endeavor into software engineering and artificial intelligence. I initiated this for the purposes of self-education, skill acquisition and fulfilling personal curiousity. Undertaken without formal training, this project centers on full-stack development, AI model integrations, and mastering a range of emerging technologies.

## Tech Stack
The project is built using a diverse set of technologies, covering both frontend and backend development:

- **Frontend:**
  - Vue 3
  - Vuex 4.x
  - Vuetify (with Material Design Icons)
  - VeeValidate
  - Webpack
  - highlight.js
  - ESlint
  - Prettier

- **Backend:**
  - Python
  - Flask
  - SQLAlchemy
  - SQLite

- **Utilities:**
  - Concurrently

## AI and Prompt Engineering
The project includes working with and combining multiple AI models, API, and prompt engineering techniques, such as:
- ChatGPT
- FalconAI
- Hugging Face tools (e.g., sentiment analysis, passive feedback techniques)
- Self prompting and agent based modeling


*Note: `__pycache__` and `node_modules` directories are not tracked by Git.*


## Getting Started

### Prerequisites
- Node.js (for managing frontend dependencies)
- Python 3 (for backend development)
- Git (for version control)

### Setting Up the Project

1. **Clone the Repository**


2. **Install Frontend Dependencies:**
  ```
  npm install
  ```

3. **Install Backend Dependencies:**
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

4. **Setup the Database:**
- The project uses SQLAlchemy with SQLite. 

5. **Running the Project:**
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

6. **Accessing the Application:**
- By default, the frontend will be available at `http://localhost:8080` and the backend at `http://localhost:5001`.

### Additional Notes
- For the specific configurations of Webpack, refer to `webpack.config.js`.
- Backend models and database schema are defined in `models.py`.


