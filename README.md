# Frontend Submodule

Welcome to the frontend submodule of the College Compass Visualization Dashboard! This submodule contains the user interface and client-side code for the College Compass web application. This README will guide you through the installation steps and explain how all the components connect together.

## Installation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.5. To get started with the frontend submodule, please follow these steps:

1. Clone the repository: `git clone https://github.com/JayaramKrovvidi/college-compass-frontend.git`

2. Navigate to the project directory: `cd college-compass-frontend`

3. Install the dependencies: `npm install`

6. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

7. Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

8. Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

9. Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

10. Open a web browser and enter the URL where the frontend submodule is deployed. You should now see the College Compass user interface.

## Project Structure

The frontend submodule follows a modular architecture to ensure maintainability and reusability. Here's an overview of the project structure:

- `src/app`: Contains the source code for the frontend submodule.
  - `components/`: Contains reusable UI components used throughout the application.
  - `services/`: Contains service modules for handling API requests and data management.
  - `utils/`: Contains utility functions and helpers.
  - `app.module.ts` and `app-routing-module.ts`: Main application component that handles routing and page rendering.
  - `index.html`: Entry point of the application.

## Connecting with the Backend

The frontend submodule relies on the backend submodule to fetch data and perform API requests. To connect the frontend with the backend, ensure that the following steps are followed:

1. Install and configure the backend submodule by following the instructions provided in its respective README.

2. Update the `API_ENDPOINT` variable in the `src/config.js` file of the frontend submodule to match the URL of the backend API.

By correctly configuring the API endpoint, the frontend will be able to communicate with the backend and retrieve the necessary data for the College Compass application.

## Contributing

We welcome contributions to the frontend submodule of the College Compass project. If you encounter any issues or have ideas for improvements, please open an issue in this repository. Additionally, you can submit pull requests with your proposed changes.

Please ensure that your contributions adhere to our [code of conduct](CODE_OF_CONDUCT.md) and follow the established coding guidelines.

---

Thank you for using the College Compass frontend submodule! If you have any questions or need further assistance, please don't hesitate to reach out to us.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.