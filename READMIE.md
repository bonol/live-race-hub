# Live Race Hub

## Overview

Live Race Hub is a web-based application designed to help teachers manage race results for student competitions. The system allows teachers to set up races, assign students to lanes, record race results, and view the final rankings. The application ensures fairness in scoring, handles tied results correctly, and stores data locally using browser `localStorage`.

## Features

- Create races with at least two students.
- Assign students to specific lanes.
- Ensure no duplicate lane assignments or student reassignments within the same race.
- Record race results with proper placement validation.
- Handle tie scenarios according to race placement rules.
- View race results in a structured format.
- Store all race data locally for persistence across sessions.

## Installation & Setup

### Prerequisites

- Node.js installed on your machine.
- npm (Node Package Manager).

### Steps to Run the Application

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd live-race-hub
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the application:
   ```sh
   npm start
   ```
   The application will run in your default browser.

## Running Tests

To execute the full test suite and ensure code correctness:

```sh
npm test
```

Tests provide coverage for race creation, result recording, and data validation.

## Data Storage

All race-related data is stored in the browser using `localStorage`, ensuring that information persists across page reloads.

## Upcoming Enhancements

- UI improvements for a better user experience.
- Exporting race results as a downloadable file.
- Option to reset all stored race data.

For further details on the implementation, refer to the project code and commit history. More documentation will be added as needed.

---

Developed as part of the Liveheats Coding Challenge.

