# 🎬 Movie Explorer

A responsive movie discovery web application built with **React, TypeScript, Vite, React Router, OMDb API, Firebase Authentication, and Cloud Firestore**.

Movie Explorer allows users to discover movies, search for titles, explore different movie categories, view movie details, and manage their favourite movies.

The project was developed using an **AI-assisted development workflow**. AI tools were used as development assistants for project setup, implementation, debugging, refactoring, accessibility improvements, responsive design, and documentation. All generated code and suggestions were reviewed, tested, adapted, and integrated into the project.

---

## ✨ Features

* 🏠 Home page with movie discovery sections
* 🎬 Hero movie section with cinematic background
* 🔥 Trending Movies
* ⭐ Popular Movies
* 🏆 Top Rated Movies
* 🆕 New Releases
* 🔎 Movie search
* 🎞️ Movie details
* ❤️ Add/remove favourite movies
* 🔐 User registration and login
* 🚪 Logout functionality
* 👤 Per-user favourite movies
* 🔒 Authentication-aware favourite interactions
* 💬 Login/signup prompt for unauthenticated users
* 🌓 Light/dark theme
* 📱 Responsive design
* ♿ Accessibility-focused interactions
* ⌨️ Keyboard-accessible UI
* 🎨 Custom Movie Explorer branding and favicon
* ⚡ Vite-based development and production build
* ☁️ Firebase-backed user and favourite data

---

# 🛠️ Technology Stack

| Technology              | Purpose                                                          |
| ----------------------- | ---------------------------------------------------------------- |
| React                   | User interface                                                   |
| TypeScript              | Type-safe development                                            |
| Vite                    | Development and production tooling                               |
| React Router            | Application routing                                              |
| OMDb API                | Movie search and movie information                               |
| Firebase Authentication | User registration and login                                      |
| Cloud Firestore         | Per-user favourite movie storage                                 |
| CSS                     | Styling and responsive design                                    |
| Git & GitHub            | Version control and project documentation                        |
| AI coding assistants    | Development assistance, debugging, refinement, and documentation |

---

# 🏗️ Architecture

Movie Explorer follows a **strict MVVM-inspired architecture** to keep UI rendering, application state, business logic, and external services separated.

```text
View
  ↓
ViewModel
  ↓
Model
  ↓
Service
  ↓
External API / Firebase
```

### View

Responsible primarily for:

* Rendering UI
* Displaying data
* Connecting user interactions to ViewModel actions
* Accessibility markup

Views should not contain direct API or Firebase calls.

### ViewModel

Responsible for:

* React state
* Loading state
* Error state
* User interactions
* Calling Model functions
* Preparing data for Views

### Model

Responsible for:

* Feature-specific business logic
* Data preparation
* Validation
* Coordinating with services

### Services

Responsible for external communication such as:

* OMDb API requests
* Firebase Authentication
* Cloud Firestore operations

### Components

Reusable UI components are kept separate so functionality can be shared across pages.

---

# 🤖 AI-Assisted Development

AI was used as a **development partner**, not as a replacement for understanding or reviewing the code.

The AI-assisted workflow was used for:

* Project scaffolding
* React and TypeScript implementation
* MVVM architecture
* API service development
* Firebase integration
* Authentication implementation
* Favourites functionality
* UI improvements
* Responsive design
* Accessibility improvements
* Debugging
* Bug fixing
* Refactoring
* Code review
* Deployment preparation
* README documentation

The development process involved giving the AI specific requirements, reviewing its proposed implementation, testing the result, identifying problems, and giving additional prompts when changes were required.

### AI Development Workflow

```text
Requirement
     ↓
AI Prompt
     ↓
Generated / Suggested Implementation
     ↓
Code Review
     ↓
Manual Testing
     ↓
Bug Identification
     ↓
Follow-up Prompt
     ↓
Refinement
     ↓
Build / TypeScript / Lint Checks
     ↓
Final Implementation
```

### Important principle

AI-generated code was not treated as automatically correct.

The project development process focused on:

* Understanding what the AI generated
* Checking whether it matched the requirements
* Testing functionality
* Finding and correcting bugs
* Preserving the existing architecture
* Avoiding unnecessary changes
* Verifying the final implementation

---

# 📝 Build Prompts

This section documents the prompts used during the development of Movie Explorer.

The prompts are listed in development order to show how the project evolved from its initial structure into the completed application.

---

# 1. Project Initialization

## Create the React project

```text
Create a new Movie Explorer application using Vite, React, and TypeScript.

Use functional React components and TypeScript throughout the project.

Set up the project so it is ready for further development.

Do not add unnecessary libraries or functionality yet.
```

## Establish the project architecture

```text
Set up the Movie Explorer project using a strict MVVM architecture.

Use this separation:

- Views are responsible only for rendering UI.
- ViewModels are responsible for React state and user interactions.
- Models are responsible for business logic.
- Services are responsible for external APIs and Firebase communication.
- Components should be reusable.

Use TypeScript types throughout the application.

Keep the architecture clean and scalable because this project will eventually include movie search, authentication, favourites, and additional movie discovery features.
```

---

# 2. Application Structure and Design

## Create the main application structure

```text
Implement the initial project foundation now.

Requirements:

- React
- TypeScript
- Vite
- React Router
- MVVM architecture
- Firebase-ready structure
- OMDb API-ready structure
- reusable components
- CSS variables/design tokens

Create the project with a clean structure such as:

src/
├── components/
├── views/
├── viewmodels/
├── services/
├── contexts/
├── routes/
├── types/
├── styles/
└── assets/

For this first step, focus only on:

1. Vite + React + TypeScript setup
2. folder structure
3. global CSS/design foundation
4. React Router foundation
5. basic HomeView
6. basic routing structure
7. environment-variable setup for OMDb
8. architecture needed for future Firebase integration

Do NOT implement the movie API, authentication, favourites, hero, search, or other application features yet.

I want complete implementation code.

For every file you create:

- provide the exact file path
- provide the complete file contents
- do not use placeholders or pseudocode
```

---

# 3. OMDb API Integration

## Create the OMDb service

```text
The project foundation is working.

Now implement the OMDb movie service.

Do not implement the Hero, authentication, favourites, search UI, or other features yet.

I want the movie API layer to be completed first because the upcoming Home page will depend on it.

Use the existing:

- React
- TypeScript
- Vite
- MVVM architecture
- shared Movie types
- environment variables

Use:

VITE_OMDB_API_KEY
VITE_OMDB_BASE_URL

Create:

src/services/movieService.ts

The service must be a plain TypeScript module.

It must NOT:

- use React hooks
- use React state
- access Firebase
- contain UI logic
- contain React components
```

## API functions

```text
Implement functions for:

1. Searching movies
2. Getting movie details
3. Supporting paginated movie searches when needed

Handle:

- missing API key
- missing base URL
- empty search query
- network errors
- non-OK HTTP responses
- OMDb Response: "False"
- no search results
- malformed API responses

Do not assume HTTP 200 means the request succeeded because OMDb can return logical errors with HTTP 200.

Use the existing Movie types.

Do not hardcode API keys.

Use URLSearchParams or another safe URL-building approach.
```

## OMDb limitation

```text
OMDb does not provide true Trending, Popular, or Top Rated endpoints.

Do not pretend that OMDb provides these endpoints.

Create a clean service architecture that allows these sections to be implemented using an appropriate strategy later.

Do not add another API key or external movie service without asking first.
```

---

# 4. UX Improvements

## Search dropdown

```text
The navbar search is currently working correctly.

When I type a movie query, the search results dropdown appears underneath the navbar search.

The dropdown must have exactly the same width as the search input.

Requirements:

- exact same width as the search input
- aligned directly underneath it
- responsive
- no viewport overflow
- preserve the existing visual design
- preserve existing scrolling behavior

Inspect the existing Header and Header CSS before making changes.

Prefer using the search wrapper as the positioning and width reference instead of adding arbitrary fixed widths.
```

## Cinematic Hero

```text
Improve the Home page Hero section so it looks like a professional movie discovery website.

Add a cinematic movie background.

The background should automatically change continuously with a smooth fade transition.

Requirements:

- automatic rotation
- smooth fade transition
- one movie background visible at a time
- no layout jumping
- no repeated API request for every transition
- clean up timers on unmount
- preserve the existing search functionality
- preserve the dark cinematic theme
- use the existing design tokens
- maintain readable text contrast
- support desktop, tablet, and mobile

Use the existing OMDb integration where possible.

Do not add another API key or external service without asking.
```

---

# 5. Home Page

## Create Home View

```text
Create the Home page for Movie Explorer.

The Home page should contain:

- Hero section
- movie discovery content
- movie cards
- New Releases
- Trending Movies
- Popular Movies
- Top Rated Movies

Keep the View responsible only for rendering.

Do not call APIs directly from the View.
```

## Create Home ViewModel

```text
Create a Home ViewModel for Movie Explorer.

The ViewModel should manage:

- movies
- loading state
- error state
- search state
- selected/hero movie where needed

The ViewModel should communicate with the Home Model.

Do not call the OMDb service directly from the View.

Do not render JSX inside the ViewModel.
```

## Create Home Model

```text
Create HomeModel.ts for Movie Explorer.

The Model should contain Home-specific business logic and communicate with the OMDb service.

Keep API communication outside the View and ViewModel.

Create the functions required for loading the Home movie collections.
```

---

# 6. Initial Movie Discovery

## Load movies automatically

```text
When the Movie Explorer Home page opens, automatically load a selection of movies instead of showing an empty page.

Use predefined search keywords such as:

Batman
Avengers
Harry Potter
Star Wars
Spider-Man
Marvel
Disney
Matrix
Lord of the Rings
Fast
Mission Impossible
Pixar
Horror
Comedy
Action

Use multiple API searches and combine the results.

Remove duplicate movies using imdbID.

Shuffle the final movie collection.

Keep this logic inside the Home Model.
```

---

# 7. Firebase and Authentication

## Firebase setup

```text
Set up Firebase in a clean way that fits the existing project architecture.

Create a dedicated Firebase configuration/module rather than putting Firebase initialization inside components.

Use environment variables for Firebase configuration.

Do NOT hard-code Firebase credentials.

Add the necessary .env.example entries.

Do not expose or commit secret configuration unnecessarily.
```

## Authentication

```text
Implement:

- Sign Up
- Login
- Logout
- authentication state persistence
- loading state while Firebase determines the current user
- readable authentication errors

Keep the UI consistent with the existing Movie Explorer design.

Create proper View / ViewModel separation.

Authentication logic should NOT be placed directly inside JSX components.
```

## Header authentication state

```text
Update the existing Header only where necessary.

When logged out:

- show a Login button

When logged in:

- show an account indicator
- show Logout

Do not break the existing Search functionality.
```

---

# 8. Favourites

## Per-user favourites

```text
Allow authenticated users to favourite movies.

Use Cloud Firestore to store favourites per authenticated user.

Each favourite should store enough information to recreate the movie card/details navigation, such as:

- imdbID
- title
- year
- poster
- type
- timestamp

Use imdbID as the unique movie identifier.

The Favourite button should:

- add a movie to favourites
- remove it from favourites
- clearly indicate whether the movie is already favourited
- handle loading and error states

Do not place Firebase calls directly inside presentational components.
```

## Favourites page

```text
Create a /favourites route.

For logged-in users:

- show saved movies
- use the existing movie-card style
- allow removing movies
- allow navigation to movie details

For logged-out users:

- show a clean message explaining that login is required
- provide a Login button
```

---

# 9. Favourites Confirmation

## Confirmation before removal

```text
On the /favourites page only, clicking the existing heart button must not immediately remove the movie.

Instead, show an in-app confirmation UI:

"Remove from Favourites?"

"Are you sure you want to remove this movie from your favourites?"

Buttons:

- Cancel
- Remove

Requirements:

- reuse the existing favourite removal/toggle logic
- do not create duplicate Firestore removal logic
- do not use window.confirm()
- Cancel leaves the movie unchanged
- Remove performs the existing removal operation
- Escape cancels the confirmation
- provide proper keyboard accessibility
- provide appropriate ARIA attributes
- keep the existing heart position
- keep the confirmation responsive
- do not modify unrelated functionality
```

---

# 10. Logged-Out Favourite Interaction

```text
Improve the favourite interaction for unauthenticated users.

When a logged-out user clicks an empty favourite heart:

- do not change the movie's favourite state
- do not save anything to Firebase
- show a friendly login/signup prompt

Use messaging similar to:

"Want to save this movie? ❤️"

"Log in or sign up to add it to your favourites."

The heart should appear disabled/inactive for the logged-out state while still providing an understandable interaction.

Authenticated users should continue to have the normal behaviour:

Empty heart → add favourite

Filled heart → remove favourite

On the Favourites page:

Filled heart → confirmation

Cancel → movie remains

Remove → existing favourite removal logic runs
```

---

# 11. Header Navigation

```text
Add navigation links to the existing Movie Explorer Header.

Desktop navigation should contain:

Home
Trending
Popular
Top Rated
New Releases
Favourites

Keep the existing Search and Login/Logout controls.

Home:
- navigate or scroll to the top of the Home page

Trending:
- smoothly scroll to Trending Movies

Popular:
- smoothly scroll to Popular Movies

Top Rated:
- smoothly scroll to Top Rated Movies

New Releases:
- smoothly scroll to New Releases

Favourites:
- continue using the existing favourites route

Do not recreate the project.

Inspect the actual existing files before making changes.

Preserve the existing architecture and functionality.
```

---

# 12. Accessibility

```text
Review the Movie Explorer application for accessibility.

Improve:

- semantic HTML
- button labels
- image alt text
- keyboard navigation
- focus states
- form labels
- dialog accessibility
- ARIA attributes
- colour contrast
- reduced-motion support

Do not change application functionality unnecessarily.

Preserve the existing visual design.
```

---

# 13. Responsive Design

```text
Review the Movie Explorer interface for responsive behaviour.

Improve the layout for:

- desktop
- tablet
- mobile

Requirements:

- no horizontal overflow
- readable typography
- responsive movie cards
- responsive navigation
- responsive search
- responsive Hero
- responsive confirmation UI
- accessible touch targets

Do not remove existing functionality.

Preserve the existing Movie Explorer visual identity.
```

---

# 14. Bug Fixing

## Home reload bug

```text
When I search for a movie and then press Home, the Home page should reload the random movie selection instead of keeping the previous search state.

Debug the existing implementation.

Make the smallest necessary change.

Do not break Search functionality.

Preserve the current architecture.
```

---

# 15. Deployment

## Prepare for Vercel

```text
Prepare the Movie Explorer Vite application for deployment on Vercel.

Make sure:

- the build command is correct
- the output directory is correct
- environment variables are read through import.meta.env
- no secret values are committed to Git
- the application works in a production build

Do not expose real API keys in source code.

After implementation:

- run TypeScript checking
- run linting
- run the production build
- report any issues
- explain required environment variables
```

---

# 🧪 Testing and Verification

Before considering a feature complete, the project should be checked for:

* TypeScript errors
* linting errors
* production build errors
* broken routes
* broken API requests
* authentication failures
* favourite state inconsistencies
* responsive layout problems
* keyboard accessibility issues

Typical verification commands include:

```bash
npx tsc -b
npx oxlint
npm run build
```

---

# 🔐 Environment Variables

The project uses environment variables for external configuration.

Example:

```env
VITE_OMDB_API_KEY=your_omdb_api_key
VITE_OMDB_BASE_URL=https://www.omdbapi.com/

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

Real credentials should never be committed to GitHub.

Use `.env.example` for placeholder values and keep the real `.env` file out of version control.

---

# 📁 Project Structure

The project follows a feature-oriented React architecture.

```text
src/
├── assets/
├── components/
│   ├── layout/
│   ├── movie/
│   └── ...
├── contexts/
├── routes/
├── services/
├── styles/
├── types/
├── viewmodels/
├── views/
└── ...
```

The exact structure may evolve during development, but the main architectural principle remains:

```text
Views
  ↓
ViewModels
  ↓
Models
  ↓
Services
  ↓
APIs / Firebase
```

---

# 🔄 Development Approach

The application was developed incrementally rather than attempting to build the entire application in one step.

The development progression was:

```text
Project Setup
      ↓
Architecture
      ↓
OMDb Service
      ↓
Home Page
      ↓
Movie Discovery
      ↓
Hero / UX
      ↓
Firebase
      ↓
Authentication
      ↓
Favourites
      ↓
Navigation
      ↓
Accessibility
      ↓
Responsive Design
      ↓
Bug Fixing
      ↓
Deployment
```

This incremental approach made it easier to test each feature, identify problems, and preserve previously working functionality.

---

# 🤖 AI Usage and Human Review

AI was used throughout the development process as an **AI-assisted coding and problem-solving tool**.

Examples of AI assistance included:

* generating initial implementation suggestions
* creating React components
* implementing TypeScript logic
* suggesting MVVM structures
* implementing API service functions
* assisting with Firebase integration
* debugging runtime and TypeScript problems
* improving CSS and responsive layouts
* improving accessibility
* reviewing existing implementations
* suggesting bug fixes
* preparing deployment configuration
* generating and organizing documentation

However, AI output was reviewed before being accepted.

The development process required manually checking:

* whether generated code matched the requirements
* whether the architecture remained consistent
* whether existing functionality was preserved
* whether the implementation actually worked
* whether errors were introduced
* whether accessibility requirements were satisfied
* whether the production build succeeded

This means the project demonstrates **AI-assisted software development**, while the developer remains responsible for understanding, reviewing, testing, and integrating the implementation.

---

# 📚 What This Project Demonstrates

Movie Explorer demonstrates practical experience with:

* React development
* TypeScript
* Vite
* React Router
* MVVM architecture
* API integration
* asynchronous JavaScript
* error handling
* Firebase Authentication
* Cloud Firestore
* reusable React components
* React state management
* Context API
* responsive CSS
* accessibility
* environment variables
* Git/GitHub workflow
* production builds
* Vercel deployment
* AI-assisted software development

---

# 🚀 Future Improvements

Possible future improvements include:

* richer movie recommendation functionality
* improved movie discovery strategies
* more detailed movie information
* additional filtering and sorting
* watchlist functionality
* improved caching
* performance optimization
* additional accessibility testing
* automated testing
* richer personalization

Any future AI-powered feature should be explicitly documented separately from the AI-assisted development process.
