# Anime Search App

A modern, responsive anime search application built with React, TypeScript, and Redux. Search through thousands of anime titles, view detailed information, and explore with an intuitive user interface.

## Live Demo

[Add your deployment URL here after deploying to Netlify/Vercel]

## Features

- **Instant Search** - Real-time anime search with 250ms debouncing for optimal performance
- **Server-Side Pagination** - Efficiently browse through large result sets
- **Detailed Anime Information** - View comprehensive details including synopsis, studios, ratings, and more
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **Smart Caching** - Reduces unnecessary API calls by caching search results
- **Error Handling** - Graceful error recovery with retry functionality

## Tech Stack

- **React 19** - Latest version with React Compiler optimization
- **TypeScript** - Full type safety with zero `any` types
- **Redux Toolkit** - State management for search and pagination
- **React Router v7** - Client-side routing with dynamic routes
- **Vite** - Fast development and optimized production builds
- **Tailwind CSS 4** - Utility-first styling
- **DaisyUI** - Beautiful UI components
- **Axios** - HTTP client with request cancellation
- **Jikan API** - Free anime data from MyAnimeList

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd anime-search-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:4000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # API client and endpoints
│   ├── animeApi.ts   # Jikan API integration
│   ├── client.ts     # Axios instance with interceptors
│   └── types.ts      # TypeScript interfaces for API responses
├── components/       # Reusable UI components
│   ├── AnimeCard/    # Card components with skeleton loader
│   ├── AnimeDetails/ # Detail page sections and skeleton
│   ├── AnimeGrid.tsx # Grid layout for search results
│   ├── AppBar.tsx    # Navigation header
│   ├── EmptyState.tsx
│   ├── ErrorAlert.tsx
│   ├── Pagination.tsx
│   └── SearchBar.tsx
├── hooks/            # Custom React hooks
│   ├── useApi.ts     # Generic API call hook
│   └── useDebounceSearch.ts # Debounced search with cancellation
├── pages/            # Page components
│   ├── SearchPage.tsx
│   ├── AnimeDetailsPage.tsx
│   └── NotFoundPage.tsx
├── store/            # Redux store and slices
│   ├── index.ts      # Store configuration
│   ├── searchSlice.ts # Search state management
│   └── hooks.ts      # Typed Redux hooks
├── App.tsx           # Root component with router
└── main.tsx          # Entry point with providers
```

## Bonus Implementation

This project includes several bonus features that enhance both user experience and technical excellence:

### User Experience Enhancements

1. **Skeleton Loaders**
   - Custom skeleton components for anime cards (`CardSkeleton.tsx`)
   - Detailed skeleton for anime details page (`DetailsSkeleton.tsx`)
   - Smooth loading transitions that maintain layout stability

2. **Empty State Handling**
   - Helpful messaging when no results are found
   - Contextual guidance based on search query
   - User-friendly prompts to improve search

3. **Mobile Responsiveness**
   - Responsive grid layout (2/3/4 columns based on screen size)
   - Mobile-optimized navigation with back button
   - Touch-friendly UI components
   - Breakpoint-based design (sm/md/lg)

4. **Creative UI with "Wow" Factor**
   - Clean, modern design using DaisyUI components
   - Smooth transitions and hover effects
   - Badge system displaying anime status and scores
   - Visually appealing hero sections on detail pages
   - Polished typography and spacing

5. **Meaningful Loading States**
   - Different loading indicators for various operations
   - Loading states don't block user interaction
   - Progress indication during API calls

6. **Additional Features**
   - Intelligent caching layer to minimize redundant API calls
   - Back navigation support
   - 404 page with recovery options
   - Route validation (numeric IDs only)

### Technical Excellence

1. **Comprehensive Error Handling**
   - React Error Boundary for catching component errors
   - Network failure handling with user-friendly messages
   - Retry functionality for failed requests
   - Axios interceptors for centralized error processing
   - Graceful degradation when API is unavailable

2. **Race Condition Handling**
   - AbortController cancels in-flight requests when new searches initiated
   - Prevents stale data from displaying
   - Proper cleanup in useEffect hooks
   - Debouncing prevents excessive API calls

3. **Type Safety**
   - 100% TypeScript implementation (36 source files)
   - Zero usage of `any` type
   - Comprehensive interfaces for all API responses
   - Type-safe Redux hooks and actions
   - Proper typing for all component props

4. **Performance Optimizations**
   - React 19 Compiler enabled for automatic optimizations
   - Smart caching reduces API calls
   - Debounced search prevents unnecessary requests
   - Request cancellation prevents wasted bandwidth

5. **Code Quality**
   - Clean separation of concerns
   - Reusable component architecture
   - Custom hooks for shared logic
   - Consistent code style throughout
   - No class components (hooks only)

6. **Comprehensive Testing**
   - 87 test cases with 100% pass rate
   - Unit tests for hooks, Redux, and utilities
   - Component tests with React Testing Library
   - API integration tests with MSW (Mock Service Worker)
   - Critical debouncing and cancellation tests
   - Test coverage includes edge cases and error scenarios

## Testing

This project includes comprehensive test coverage to ensure code quality and correctness.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Open visual test UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage

**87 total tests** covering:

- **Redux State Management** (10 tests)
  - Action creators and reducers
  - State immutability
  - Cache management

- **Debounced Search** (12 tests) ⭐ **CRITICAL**
  - 250ms debounce verification
  - Request cancellation for race conditions
  - Cache validation logic
  - AbortController cleanup

- **API Layer** (17 tests)
  - Jikan API integration with MSW
  - Request/response handling
  - Error scenarios
  - Axios interceptors

- **Custom Hooks** (11 tests)
  - useApi hook states (loading, data, error)
  - Cancelled request handling
  - Reset functionality

- **UI Components** (37 tests)
  - SearchBar interactions
  - Pagination logic
  - User input handling
  - Accessibility features

### Test Stack

- **Vitest** - Fast, Vite-native test runner
- **React Testing Library** - User-centric component testing
- **MSW** - API mocking for realistic network tests
- **Testing Library User Event** - Realistic user interactions

## API Integration

This app uses the [Jikan API](https://docs.api.jikan.moe/), a free REST API for MyAnimeList data. No authentication is required.

Endpoints used:
- `GET /anime` - Search anime with pagination
- `GET /anime/{id}` - Get detailed anime information

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is created as part of a technical assessment.
