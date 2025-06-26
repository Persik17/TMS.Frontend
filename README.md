# TmsFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser at [http://localhost:4200/](http://localhost:4200/) and the app will automatically reload on code changes.

## Code scaffolding

To generate a new component, use:

```bash
ng generate component my-component
```

For a full list of schematics, run:

```bash
ng generate --help
```

## Building the project

To build the project for production:

```bash
ng build --configuration=production
```

Build artifacts will be stored in the `dist/` directory.

## Running unit tests

To execute unit tests via [Karma](https://karma-runner.github.io):

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) tests:

```bash
ng e2e
```

> Angular CLI does not include an e2e framework by default. You can add one as needed.

## Docker

You can build and run the production-ready Docker image:

```bash
docker build -t tms-frontend .
docker run -p 8080:8080 tms-frontend
```

Your app will be available at [http://localhost:8080/](http://localhost:8080/).

## Additional Resources

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
