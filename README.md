# Movie Explorer

A movie discovery web application built with React, TypeScript, Vite, React Router, OMDb API, Firebase Authentication, and Firebase Realtime Database.

## Features

Browse movies on the Home page
- Home
- Trending
- Popular
- Top Rated
- New Releases
- Favourites
- Random movie discovery
-  Search movies
- Movie details
- User authentication
- Add/remove favourite movies
- Login/signup prompt for unauthenticated users
- Light/dark theme
- Responsive design
- Accessible interactions
- Custom Movie Explorer favicon

## 1. Project initialization
### Create the React project

Create a new Movie Explorer application using Vite, React, and TypeScript.
Use functional React components and TypeScript throughout the project.
Set up the project so it is ready for further development.
Do not add unnecessary libraries or functionality yet.

### Establish the project architecture

Set up the Movie Explorer project using a strict MVVM architecture.

Use this separation:

- Views are responsible only for rendering UI.
- ViewModels are responsible for React state and user interactions.
- Models are responsible for business logic.
- Services are responsible for external APIs and Firebase communication.
- Components should be reusable.

Use TypeScript types throughout the application.

Keep the architecture clean and scalable because this project will eventually include movie search, authentication, favourites, and AI-based recommendations.

## 2. Application structure and design

### Create the main application structure
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
Do not use placeholders or pseudocode.

## 3. OMDb API integration

### Create the OMDb service

The project foundation is working.
Now implement the OMDb movie service.
Do not implement the Hero, authentication, favourites, search UI, or other features yet.
I want the movie API layer to be completed first because the upcoming Home page will depend on it.
==================================================
REQUIREMENTS
==================================================
Use the existing:
- React
- TypeScript
- Vite
- MVVM architecture
- shared Movie types
- environment variables
Use the existing environment variables:
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
==================================================
FUNCTIONS
==================================================
Implement functions for:
1. Searching movies
searchMovies(query: string): Promise<Movie[]>
2. Getting movie details
getMovieDetails(imdbID: string): Promise<MovieDetails>
3. Searching movies by a specific page when needed
searchMovies(query: string, page?: number): Promise<Movie[]>
If the API design requires a different function structure, choose the cleanest maintainable approach and explain why.
==================================================
ERROR HANDLING
==================================================
Handle all of these cases:
- missing API key
- missing base URL
- empty search query
- network error
- non-OK HTTP response
- OMDb Response: "False"
- no search results
- malformed/unexpected API response
Do not assume HTTP 200 means the request succeeded because OMDb can return logical errors with HTTP 200.
Create readable errors that the ViewModel can display to the user.
==================================================
TYPESCRIPT
==================================================
Use the existing types from:
src/types/Movie.ts
Do not create another Movie interface.
Avoid unnecessary `any`.
Use proper return types.
==================================================
URL / SECURITY
==================================================
Use URLSearchParams or another safe URL-building approach.
Do not manually concatenate unencoded search queries.
Do not hardcode the API key.
Read it from:
import.meta.env.VITE_OMDB_API_KEY
==================================================
IMPORTANT OMDb LIMITATION
==================================================
OMDb does not provide true "Trending", "Popular", or "Top Rated" endpoints like some other movie APIs.
Do not pretend that OMDb provides these endpoints.
For now, create a clean service architecture that allows us to build these sections using an appropriate strategy later.
We can discuss how to handle those sections after the basic API service is working.
==================================================
IMPLEMENTATION STYLE
==================================================
Inspect the existing Movie.ts types before implementing the service.
Preserve the existing architecture.
Do not modify unrelated files.
If a type needs to be improved for the service to work correctly, explain why before changing it and then provide the complete updated file.
Provide:
1. Files created/modified
2. Complete code
3. Explanation of the API data flow
4. Explanation of error handling
5. How the ViewModel will use this service
6. How to test it
7. Any limitations of OMDb relevant to our planned application
Do not implement the next feature yet.

## 4. UX Improvements

I want to make two visual/UX improvements to my Movie Explorer project.
There are TWO things I want to improve.

==================================================
PART 1 — SEARCH DROPDOWN WIDTH
==================================================

The navbar search is currently working correctly.
When I type something such as:
    idiots
the search results dropdown appears underneath the navbar search.
However, the dropdown is currently WIDER than the search input.
I want the dropdown width to be EXACTLY the same width as the search input.

For example:

    ┌──────────────────────────────┐
    │ idiots                       │
    └──────────────────────────────┘
    ┌──────────────────────────────┐
    │ poster  3 Idiots             │
    │         2009                 │
    ├──────────────────────────────┤
    │ poster  The Idiots           │
    │         1998                 │
    ├──────────────────────────────┤
    │ poster  Idiots and Angels    │
    │         2008                 │
    └──────────────────────────────┘

The left and right edges of the dropdown must align exactly with
the left and right edges of the search input.
Do NOT make the dropdown independently wider than the search field.
The dropdown should:

- Have the exact same width as the search input.
- Stay aligned directly underneath it.
- Remain responsive.
- Not overflow the viewport on smaller screens.
- Keep the existing dark/gold visual design.
- Keep the existing scrolling behavior if there are many results.

Please inspect the existing Header and Header CSS and fix this cleanly rather than adding arbitrary fixed widths.
Prefer making the search wrapper the positioning/width reference, for example:

    .header__search-wrapper {
        position: relative;
    }
and have the dropdown use:
    width: 100%;
if that fits the existing implementation.
Do not blindly copy this example if my current architecture has a better solution.
==================================================
PART 2 — PROFESSIONAL CINEMATIC HERO BACKGROUND
==================================================

I now want the Home page hero section to look much more like a professional
movie discovery website.
Currently the hero has:
    Movie Explorer
    Your project foundation is ready...
    [Search Movies]
with a plain dark background.
I want the hero section to have a cinematic movie background image.

The background should automatically change continuously, creating a movie-carousel/slideshow effect.
The background should automatically transition from one movie to another.
For example:

Movie background 1
       ↓
   fade transition
       ↓
Movie background 2
       ↓
   fade transition
       ↓
Movie background 3
       ↓
   fade transition
       ↓
Movie background 4

Use a professional, subtle transition rather than an abrupt image swap.
A duration around 5–8 seconds per movie is reasonable.

 ==================================================
HERO DESIGN REQUIREMENTS
==================================================
The background must NOT make the text difficult to read.
Use layered overlays/gradients.
The design should preserve the existing dark cinematic theme and gold accent.
The hero should have something similar to:

background image
      +
dark gradient overlay
      +
left-side darker gradient
      +
hero content

The left side where the title and button appear should be significantly darkened so the white text remains readable.
The existing design tokens in:

    src/styles/variables.css 
should be reused where appropriate.
Do not introduce random colors.

==================================================
BACKGROUND IMAGE IMPLEMENTATION
==================================================
IMPORTANT:
Before implementing this, inspect what movie image data is currently
available from OMDb and what the existing `movieService.ts` supports.
Do NOT add a completely new movie API unless it is genuinely necessary.
Prefer using the existing OMDb integration and existing movie data.
A small curated set of well-known movies can be used for the hero carousel.

For example, you may use a small list of movie IMDb IDs or another reasonable approach compatible with the existing OMDb service.
Keep the number of API requests reasonable.
Do NOT make dozens of API requests every few seconds.
The hero should load a small set of featured movies and then rotate through the already-loaded images locally.
The images should NOT be fetched again every time the carousel changes.
If the existing OMDb poster images are portrait-oriented, do NOT simply stretch them unnaturally.

Use CSS such as:

    background-size: cover;

and appropriate positioning/overlay treatment.
If OMDb does not provide suitable landscape/backdrop images, do NOT pretend that it does.
In that case, implement the best professional solution possible with the available movie images and clearly explain the limitation afterward.
Do NOT add another API key or another external service without asking me.

CAROUSEL BEHAVIOR
==================================================

The hero carousel should:

- Automatically rotate.
- Have a smooth fade transition.
- Show one movie background at a time.
- Not cause layout jumping.
- Continue working when the user interacts with the navbar search.
- Not interfere with the search dropdown.
- Not repeatedly call the API during each transition.
- Clean up timers when the component unmounts.

Use React state/effects appropriately.
Because this is a React MVVM project, keep the carousel state/behavior out of the purely presentational view if that fits the existing architecture.
If appropriate, create or extend a Home ViewModel such as:

    src/viewmodels/useHomeViewModel.ts

The View should primarily render the data provided by the ViewModel.

HERO CONTENT
==================================================
Keep the existing Movie Explorer identity.
However, the current placeholder text:
    Your project foundation is ready. Features are built next.
is no longer appropriate because this is becoming the real application.
Replace it with a professional movie-discovery message.
For example, something in the style of:

    Discover your next favorite movie.

But choose wording that fits the existing visual design.
Keep:
    Movie Explorer
and the:
    Search Movies
button.
The Search Movies button should continue to work with the existing navbar
search behavior.

Do not break the current search functionality.

HERO HEIGHT
==================================================

The hero should feel like a real movie website hero section.
It should occupy a substantial portion of the first viewport.
It should NOT necessarily occupy the entire page height.
Use responsive sizing such as:
    min-height: ...
or
    height: ...
based on the existing design.
Make sure the navbar remains visible above it.

==================================================
ACCESSIBILITY
==================================================
Please consider accessibility.
For decorative background images:
- Do not make the same image information unnecessarily available to
  screen readers.
- Maintain sufficient contrast.
- Respect the existing visible keyboard focus styles.

If there is meaningful movie information associated with the current hero,
make sure it is represented appropriately in accessible text.

==================================================
RESPONSIVE DESIGN
==================================================

Desktop:
- Large cinematic background.
- Hero content positioned toward the left.
- Search remains correctly positioned in navbar.
- Dropdown remains exactly the same width as the search input.

Tablet:
- Background remains visually strong.
- Hero content scales appropriately.
Mobile:

- Background should remain usable.
- Hero text should not become too large.
- Search input must fit the navbar/viewport.
- Search dropdown must remain exactly the same width as its input.
- No horizontal overflow.

## 5. Home page

### Create the Home View
Create the Home page for Movie Explorer.
The Home page should contain:

- a hero section
- movie discovery content
- movie cards
- new releases
- trending movies
- popular movies
- top-rated movies

Keep the View responsible only for rendering.
Do not call APIs directly from the View.

### Create the Home ViewModel
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

### Create the Home Model
Create HomeModel.ts for Movie Explorer.
The Model should contain Home-specific business logic and communicate with the OMDb service.
Keep API communication outside the View and ViewModel.
Create functions required for loading the Home movie collections.

## 6. Initial movie discovery
### Load movies automatically
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

## 6. Firebase and Authentication
### Configure Firebase

### Phase 1 — Firebase setup
Set up Firebase in a clean way that fits the existing project architecture.
Create a dedicated Firebase configuration/module rather than putting Firebase initialization inside components.
Use environment variables for Firebase configuration. Do NOT hard-code Firebase credentials.
Add the necessary .env.example entries and explain exactly what I need to add to my .env file.
Do not expose or commit secret configuration unnecessarily.

### Phase 2 — Authentication
Implement:
- Sign Up
- Login
- Logout
- Authentication state persistence
- Loading state while Firebase determines the current user
- Proper error messages for invalid credentials, existing email, weak password, etc.
Keep the UI consistent with the existing Movie Explorer design:
- dark theme
- white typography
- gold accent
- existing spacing and button style
- responsive design
Create proper View / ViewModel separation according to the existing project architecture.
For example, authentication logic should NOT be placed directly inside JSX components.

### Phase 3 — Header
Update the existing Header only where necessary.
When logged out:
- show a Login button
When logged in:
- show the user's email/name or a small account indicator
- show Logout
Do not break the existing Search functionality.

### Phase 4 — Favourites

Allow authenticated users to favourite movies.
Use Firestore to store favourites per authenticated user.
Each favourite should store enough information to recreate the movie card/details navigation, such as:
- imdbID
- title
- year
- poster
- type
- timestamp

Use imdbID as the unique movie identifier so the same movie cannot accidentally be saved multiple times.
Add a Favourite button to the appropriate existing movie UI without making the cards visually cluttered.
The button should:
- add a movie to favourites
- remove it from favourites
- clearly indicate whether the movie is already favourited
- handle loading/error states

### Phase 5 — Favourites page
Create a `/favourites` route.
For logged-in users:
- show their saved movies in the existing movie-card style
- allow removing movies
- clicking a movie should open the existing movie details page
For logged-out users:
- show a clean message explaining that they need to log in
- provide a Login button

### Important architecture requirements
Follow the existing project architecture instead of introducing a completely different pattern.
Keep responsibilities separated:

View
↓
ViewModel
↓
Service
↓
Firebase

Do not put Firebase calls directly inside presentational components.
Reuse the existing Movie types wherever possible.
Do not duplicate Movie interfaces.
Do not create a second movie service.
Do not change the existing OMDb service unless absolutely necessary.

### Important performance requirement
The current movie search/loading can already feel slow on mobile/tablet, so do not introduce unnecessary API requests or listeners.
Firebase listeners should only run when needed and should be cleaned up correctly.
Do not refetch OMDb movie details unnecessarily.

### Before coding

First inspect the current project and tell me:
1. Which files you plan to create
2. Which existing files you plan to modify
3. How Firebase authentication and favourites will fit into the current MVVM architecture
Then implement the feature.
After implementation:
- run TypeScript checking
- run linting
- run production build
- report any issues
- tell me exactly what I need to configure in Firebase Console and .env
Most importantly: preserve all currently working functionality and UI.

## 7. Favourites Confirmation

Improve the Favourites page UX.
The existing favourites functionality is already working correctly, so DO NOT rebuild or change the Firebase/favourites architecture.
First inspect my current:
- src/views/FavouritesView.tsx
- src/components/movie/FavouriteButton.tsx
- src/components/movie/FavouriteButton.css
- src/contexts/FavouritesContext.tsx
I want the Favourites page to behave like a professional movie website:
1. Every favourited movie must have an obvious way to remove it.
2. Reuse the existing FavouriteButton/heart functionality rather than creating a separate delete system.
3. Clicking the filled heart on a favourited movie should remove that movie immediately from Firestore and from the visible Favourites page without requiring a refresh.
4. The heart should remain visually consistent with the rest of the application.
5. On hover/focus, provide an accessible indication such as "Remove from favourites".
6. Do NOT add a large or ugly Delete button to every card.
7. When the last favourite is removed, show a professional empty state:
   "No favourite movies yet"
   with a short helpful message and an "Explore Movies" button linking to the existing search page.
8. Do not modify authentication, Firebase configuration, Firestore rules, movie search, Hero, navbar, movie details, or unrelated components.
9. Preserve the existing MVVM architecture.
10. Do not duplicate Movie types or favourite logic.
11. Before changing anything, inspect the current files and explain exactly which files need modification.
12. Then make only the necessary changes.
13. Run:
   npx tsc -b
   npx oxlint
   npm run build
Do not assume that files from previous conversations are present in your workspace. Work only with the files that actually exist in my current project.

### Favourites-page removal
Change the Favourites-page removal UX to require confirmation before removing a movie.
On the `/favourites` page only, clicking the existing heart button must not immediately remove the movie. Instead, show a small professional confirmation UI near/on the movie card:
"Remove from Favourites?"
"Are you sure you want to remove this movie from your favourites?"
Buttons:

* Cancel — closes the confirmation without changing anything.
* Remove — calls the existing favourites removal/toggle logic and removes the movie.

Requirements:

* Do not create duplicate Firestore removal logic.
* Reuse the existing `toggleFavourite` / `removeFavourite` flow.
* Do not change how the heart behaves on Search, Home, or Movie Details pages.
* Only the Favourites page requires confirmation.
* Do not use the browser's native `window.confirm()`. Build a styled in-app confirmation UI consistent with the Movie Explorer design.
* Clicking Cancel must leave the movie in Favourites.
* Clicking Remove must remove it normally and update the Favourites page immediately.
* Pressing Escape should cancel the confirmation.
* The confirmation must be keyboard accessible and have proper focus handling/ARIA labels.
* Clicking the heart again while the confirmation is open should not accidentally remove anything.
* Make the confirmation responsive so it works on desktop, tablet, and mobile.
* Keep the existing card design and heart position unchanged.
* Do not add a permanent Delete/Remove button to every card.
* Do not modify Firebase configuration, Firestore rules, authentication, search, Hero, or movie details.

Before editing, inspect the current `FavouritesView.tsx`, `MovieCard.tsx`, `FavouriteButton.tsx`, `FavouriteButton.css`, and `FavouritesContext.tsx`. Then make the smallest necessary changes.

## 8. Header Links

Add navigation links to the existing Movie Explorer header.

IMPORTANT:
Work ONLY in my current VS Code project and inspect the actual files before making changes.
Do not recreate the project.
Do not use a separate/sandbox project.
Do not assume files from previous conversations.
Preserve the existing architecture and functionality.

CURRENT FILES I have confirmed:

- src/components/layout/Header.tsx
- src/components/layout/Header.css
- src/views/HomeView.tsx
- src/components/MovieRow/MovieRow.tsx
- src/components/MovieRow/MovieRow.css
- src/routes/paths.ts

CURRENT HOME SECTIONS:
1. Hero
2. Trending Movies
3. Popular Movies
4. Top Rated Movies
5. New Releases
GOAL:

Add navigation links to the existing Header.

Desktop navigation should contain:

Home
Trending
Popular
Top Rated
New Releases
Favourites

Keep the existing Search and Log Out / Log In controls.

BEHAVIOR:

1. Home
   - Navigate/scroll to the top of the Home page / Hero.
   - If the user is already on Home, it should scroll to the top.

2. Trending
   - Smoothly scroll to the existing "Trending Movies" MovieRow.

3. Popular
   - Smoothly scroll to the existing "Popular Movies" MovieRow.

4. Top Rated
   - Smoothly scroll to the existing "Top Rated Movies" MovieRow.

5. New Releases
   - Smoothly scroll to the existing "New Releases" MovieRow.

6. Favourites
   - Keep using the existing ROUTE_PATHS.favourites route.
   - Do NOT turn Favourites into an anchor section.
  
## 9. UI and Accessibility
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

i want one more thing if user yet not login or signup and what to click on favourite hearts on movies then he may get a message something like that enthusistic sign or login and look disabled.

On normal movie cards
❤️ Empty → click → movie is added.
❤️ Filled → click → movie is removed normally.
On the Favourites page
❤️ Filled → click → confirmation appears:
Remove from Favourites?
Remove "Schindler's List" from your favourite movies?
Remove | Cancel
Cancel → confirmation disappears, movie stays.
Remove → `toggleFavourite(movie)` runs → Firestore updates → movie disappears from Favourites.
Logged-out user
❤️ Empty → click → movie is not changed → your existing:
Want to save this movie? ❤️
Log in or sign up to add it to your favourites.
appears.                  

### Responsive design
Review the Movie Explorer interface for responsive behaviour.
Improve the layout for desktop, tablet, and mobile.
Do not remove existing functionality.

## 10. Bug Fixing
### Home reload
When I search for a movie and then press Home, the Home page should reload the random movie selection instead of keeping the previous search state.
Debug the existing implementation and make the smallest necessary change.
Do not break Search functionality.

## 11. Deployment
Prepare the Movie Explorer Vite application for deployment on Vercel.

Make sure:

- the build command is correct
- the output directory is correct
- environment variables are read through import.meta.env
- no secret values are committed to Git
- the application works in a production build

Do not expose real API keys in source code.
