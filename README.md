# 🎬 Movie Explorer

A responsive movie discovery web application built with **React, TypeScript, Vite, React Router, OMDb API, Firebase Authentication, and Cloud Firestore**.

Movie Explorer allows users to discover movies through curated movie sections, search for titles, view movie details, and manage their personal favourite movies.

The project was developed using an **AI-assisted development workflow**. AI tools were used as development assistants for project setup, implementation, debugging, refactoring, accessibility improvements, responsive design, and performance improvements. All generated code and suggestions were reviewed, tested, adapted, and integrated into the project.

---

## ✨ Features

* 🏠 Cinematic Home page
* 🎬 Hero movie section with cinematic background
* 🔥 Trending Movies
* ⭐ Popular Movies
* 🏆 Top Rated Movies
* 🆕 New Releases
* 🔎 Movie search
* 🎞️ Movie details
* ❤️ Add and remove favourite movies
* 🔐 User registration and login
* 🚪 Logout functionality
* 👤 Per-user favourite movies
* 🔒 Authentication-aware favourite interactions
* 💬 Login/signup prompt for unauthenticated users
* ⚠️ Confirmation before removing favourites
* 📱 Responsive design for desktop, tablet, and mobile
* ♿ Accessibility-focused interactions
* ⌨️ Keyboard-accessible confirmation interaction
* 🎨 Custom Movie Explorer branding and favicon
* ⚡ Vite-based development and production build
* ☁️ Cloud Firestore integration
* 🔑 Environment-variable-based API and Firebase configuration

---

# 🛠️ Technology Stack

| **TechnologyPurpose**   |                                                           |
| ----------------------- | --------------------------------------------------------- |
| React                   | User interface                                            |
| TypeScript              | Type-safe development                                     |
| Vite                    | Development and production tooling                        |
| React Router            | Client-side routing                                       |
| OMDb API                | Movie search and movie information                        |
| Firebase Authentication | User registration, login, and logout                      |
| Cloud Firestore         | Per-user favourite movie storage                          |
| CSS                     | Styling and responsive layouts                            |
| Git & GitHub            | Version control and project documentation                 |
| AI coding assistants    | Development assistance, debugging, refinement, and review |

---

# 🏗️ Architecture

[svg](https://github.com/Hafsa0104/movie-explorer/blob/master/README.md#%EF%B8%8F-architecture)

Movie Explorer follows a **MVVM-style architecture** that separates UI rendering, application state, and external communication.

```
View
  ↓
ViewModel
  ↓
Service
  ↓
External API / Firebase

```

**svg**

### View

View are responsible primarily for:

* Rendering UI
* Displaying data
* Connecting user interactions to ViewModel actions
* Accessibility markup

Views do not make direct OMDb or Firebase calls.

### ViewModel

Responsible for:

* React state
* Loading state
* Error state
* User interactions
* Calling Service functions
* Preparing data for Views

### Services

Responsible for external communication such as:

Examples include:

* movieService.ts → OMDb API communication
* authService.ts → Firebase Authentication
* favouritesService.ts → Cloud Firestore favourite operations

### Types

Shared TypeScript types describe the shape of application data. For example, movie-related interfaces represent data such as:

* Movie information
* Movie details
* Favourite movie information

These are TypeScript data types, not a separate Model layer.

### Context

Application-wide state such as authentication state is provided through React Context where appropriate.

### Components

Reusable UI components are separated from page-level Views so common elements such as movie cards, 
navigation, buttons, and layout elements can be reused consistently.

---

# 🎥 Movie Data and OMDb API

Movie Explorer uses the OMDb API for movie information.

The application supports operations such as:

* Movie searching
* Movie details
* Movie information used by Home-page collections

OMDb does not provide dedicated real-time endpoints for categories such as Trending, Popular, or Top Rated. 
Therefore, Movie Explorer uses curated movie-title collections and retrieves those movies through supported 
OMDb search operations. The final implementation does not use randomized generic keyword discovery as its Home-page strategy.

---

# 🤖 AI-Assisted Development

AI was used as a **development partner**, not as a replacement for understanding or reviewing the code.

The AI-assisted workflow was used for:

* Project scaffolding
* React and TypeScript implementation
* Architecture planning
* API service development
* Firebase integration
* Authentication implementation
* Favourites functionality
* UI refinements
* Responsive design
* Accessibility improvements
* Debugging
* Bug fixing
* Refactoring
* Performance improvements
* Code review
* Deployment preparation

AI suggestions were not automatically accepted. The implementation was reviewed, tested, and refined throughout development.

---

# 📝 Build Prompts

This section documents the prompts used during the development of Movie Explorer.

The prompts are listed in development order to show how the project evolved from its initial structure into the completed application.

---

# 1. Project Initialization

## Create the React project

```
Create a new Movie Explorer application using Vite, React, and TypeScript.

Use functional React components and TypeScript throughout the project.

Set up the project so it is ready for further development.

Do not add unnecessary libraries or functionality yet.

```

# 2. Application Foundation

```
Implement the initial Movie Explorer project foundation using React, TypeScript, Vite, React Router, reusable components, CSS variables/design tokens, and environment-variable setup.
Focus on the project structure and routing foundation before implementing the movie API, authentication, favourites, and other application features.

```

## Establish the project architecture

```
Set up the Movie Explorer project using MVVM architecture.

Use this separation:

- Views are responsible only for rendering UI.
- ViewModels are responsible for React state and user interactions.
- Services are responsible for external APIs and Firebase communication.
- Components should be reusable.

Use TypeScript types throughout the application.

Keep the architecture clean and scalable because this project will eventually include movie search, authentication, favourites, and additional movie discovery features.

```

---

# 3. Application Structure and Design

## Create the main application structure

```
Implement the initial project foundation now.

Requirements:

- React
- TypeScript
- Vite
- React Router
- MVVM architecture
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

# 4. OMDb API Integration

## Create the OMDb service

```
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

```
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

```
OMDb does not provide true Trending, Popular, or Top Rated endpoints.

Do not pretend that OMDb provides these endpoints.

Create a clean service architecture that allows these sections to be implemented using an appropriate strategy later.

Do not add another API key or external movie service without asking first.

```
---

# 5. UX Improvements

## Search dropdown width

I reviewed the current implementation in the browser and found that the movie search-results dropdown is wider than the search input.

Please inspect the existing Header component and its CSS.

Fix the issue so that:

* the dropdown has exactly the same width as the search input
* it remains aligned directly underneath the input
* it stays responsive on different screen sizes
* it does not cause horizontal overflow
* the existing search functionality is preserved
* the existing visual design is preserved

Do not use an arbitrary fixed viewport width. Use the existing search wrapper as the positioning and width reference.

Make the smallest necessary change and do not modify unrelated functionality.

## Cinematic Hero

```
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

# 6. Home Page

## Create Home View

```
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

```
Create a Home ViewModel for Movie Explorer.

The ViewModel should manage:

- movies
- loading state
- error state
- search state
- selected/hero movie where needed

The ViewModel should communicate with the required Service functions.

Do not call the OMDb service directly from the View.

Do not render JSX inside the ViewModel.

```
---

# 7. Cinematic Hero

```

Improve the Home page Hero section so it looks like a professional movie discovery website.
Add a cinematic movie background that changes automatically with a smooth fade transition.
Avoid repeated API requests for every transition, clean up timers when the component unmounts,
preserve the existing search functionality and dark cinematic theme, and maintain readable text
contrast across desktop, tablet, and mobile.


```
---

# 8. Firebase and Authentication

## Firebase setup

```
Set up Firebase in a clean way that fits the existing project architecture.

Create a dedicated Firebase configuration/module rather than putting Firebase initialization inside components.

Use environment variables for Firebase configuration.

Do NOT hard-code Firebase credentials.

Add the necessary .env.example entries.

Do not expose or commit secret configuration unnecessarily.

```

## Authentication

```
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

```
Update the existing Header only where necessary.

When logged out:

- show a Login button

When logged in:

- show an account indicator
- show Logout

Do not break the existing Search functionality.

```

---

# 9. Favourites

## Per-user favourites

```
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

```
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

# 10. Logged-Out Favourite Behavior & UX Refinement

I reviewed and tested the favourite button while logged out.

I found that clicking the favourite heart does not clearly explain to the user why the movie cannot be saved.

Please improve the existing behaviour.

Requirements:

* When a logged-out user clicks an empty favourite heart, do not save anything to Firestore.
* Do not change the movie's favourite state.
* Show a clear and friendly login/signup message.
* Use messaging similar to: "Want to save this movie? ❤️" "Log in or sign up to add it to your favourites."
* Keep authenticated favourite behaviour unchanged.
* Do not duplicate the existing Firestore logic.
* Preserve the current UI design.

Inspect the existing implementation first and make the smallest necessary change.

# 11. Favourites Confirmation

## Confirmation before removal

I reviewed the Favourites page and found that clicking the heart removes a movie immediately.

I want to prevent accidental removal without changing the existing favourite data layer.

Modify the existing implementation so that on the Favourites page:

* clicking the heart opens an in-app confirmation
* display: "Remove from Favourites?" "Are you sure you want to remove this movie from your favourites?"
* provide Cancel and Remove buttons
* Cancel leaves the movie unchanged
* Remove uses the existing favourite removal logic
* do not create duplicate Firestore removal logic
* do not use window.confirm()
* keep the existing heart position
* preserve the existing page design
* do not modify unrelated functionality

Make the smallest necessary change after inspecting the current implementation.

---

# 12. Header Navigation

```
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

# 13. SEO CONTENT

### 1. Page SEO

```
* Add unique `<title>` and `<meta name="description">` for each route.
* Make movie-detail titles/descriptions dynamic when possible.

```

### 2. Open Graph (OG)


```
Add:

* `og:title`
* `og:description`
* `og:image`
* `og:url`
* `og:type`

Use the movie poster for `og:image` on movie-detail pages when available.

```

### 3. Semantic HTML

```
Improve structure using appropriate semantic elements such as:
`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`.

```

### 4. Client-Side Rendering

```
Keep the current **Vite + React SPA** architecture.
**Do not migrate to Next.js, SSR, or prerendering.** Apply only SEO improvements that are practical within the existing architecture.

```
### 5. Image Performance

```
* Keep/use `loading="lazy"` for non-critical images.
* Preserve the existing `aspect-ratio` containers.
* Add explicit image dimensions where appropriate to reduce **Cumulative Layout Shift (CLS)**.
* Ensure meaningful `alt` text for movie posters.

```

### 6. WebP/AVIF

```
Do **not** convert OMDb images because the app uses external OMDb URLs and does not control those image files.

Do not change application functionality unnecessarily.

Preserve the existing visual design.

```

## 14. Accessibility Refinement

```
I reviewed and tested the favourite-removal confirmation interaction and found that it needed additional keyboard and screen-reader accessibility improvements.

Please inspect the existing confirmation implementation and improve only its accessibility.

Requirements:

- support Escape to cancel
- manage focus appropriately when the confirmation opens
- provide appropriate ARIA attributes
- provide accessible button labels
- maintain visible focus states
- preserve the existing visual design
- do not change the underlying favourite removal logic
- do not modify unrelated functionality

Make the smallest necessary accessibility-focused change.


```

---

# 15. Responsive Design

```
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

# 16. Hero Carousel Optimization

I reviewed the Hero carousel implementation and noticed that changing the hero movie can trigger unnecessary requests for movie images.

Refactor the implementation so that the Hero loads a small collection of movie data once and rotates through the already-loaded movies instead of requesting a new movie image on every transition.

Requirements:

* avoid repeated API requests for every carousel transition
* reuse already-loaded movie data
* maintain the smooth fade transition
* display one hero movie at a time
* prevent layout jumping
* clean up the carousel timer when the component unmounts
* preserve the existing design
* preserve existing search and movie functionality
* do not introduce another API or dependency

Make the smallest performance-focused refactoring necessary.

---

# 17. Deployment

## Prepare for Vercel

```
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

# 18. 🧪 Testing and Verification

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

```
npx tsc -b
npx oxlint
npm run build
```

---

# 19. 🔐 Environment Variables

The project uses environment variables for external configuration.

Example:

```
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

# 20. 📁 Project Structure

The project follows a feature-oriented React architecture.

```
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

```
Views
  ↓
ViewModels
  ↓
Services
  ↓
APIs / Firebase

```

---

# 21. 🔄 Development Approach

The application was developed incrementally rather than attempting to build the entire application in one step.

The development progression was:

```
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

# 22. Manual Improvements, Critical Review & Engineering Decisions

AI accelerated my development, but I treated its output as a starting point rather than final code. 
I inspected the implementation, tested the application, identified issues, and refined the solution 
based on the project's actual requirements.

#### 1. Fixed the search dropdown layout

During browser testing, I noticed that the search-results dropdown was wider than the search input.
I identified the CSS relationship causing the problem and refined the search wrapper/dropdown structure 
so the dropdown matches the input width and remains responsive.

#### 2. Improved unauthenticated favourite behavior

I identified that a logged-out user needed clear feedback when clicking the favourite heart. 
The final interaction explains that login/signup is required instead of silently failing, 
improving the user experience without changing the underlying favourite system.

#### 3. Added safe favourite removal

I identified the risk of accidental removal on the Favourites page and introduced an in-app 
confirmation flow with Remove and Cancel actions.

Remove from Favourites? → [Remove] [Cancel]

The existing favourite logic is reused rather than creating duplicate Firestore logic.

#### 4. Reviewed accessibility beyond visual appearance

I refined the confirmation interaction to support keyboard users, including Escape-to-cancel, 
focus handling, ARIA attributes, and accessible button labels.

### 5. Verified API assumptions

I reviewed the capabilities of OMDb rather than assuming it provided dedicated Trending, Popular, 
or Top Rated endpoints. The final implementation uses supported OMDb searches with curated movie collections.

### 6. Iterated on visual and responsive issues

I tested the Hero, search interface, movie cards, and favourite interactions across screen sizes and refined spacing, 
overlays, readability, and responsive behavior where the initial implementation did not meet the intended UX.

### 7. Improved Favourite Login/Signup Behavior

The original favourite interaction did not clearly explain what happened when a logged-out user clicked the heart. 
I changed it so the user receives a clear prompt: “Want to save this movie? Log in or sign up to add it to your 
favourites.” The movie is only saved to Firestore after authentication. Reason: I improved the UX instead 
of simply disabling the feature.

### 8. Optimized the Hero Carousel

Instead of requesting a new movie image every time the hero changed, I changed the implementation to load 
a small collection of movie images and rotate through the already-loaded data. I also ensured the carousel
timer is cleaned up when the component unmounts. Reason: This reduces unnecessary API requests 
and improves performance.

---

# 23. 📚 What This Project Demonstrates

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

# 24. 🚀 Future Improvements

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
