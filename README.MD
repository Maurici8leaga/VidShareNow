# VidShareNow

This is a social video web application where users can upload their own videos and view other users' videos. In this app, the user will be able to comment on videos and also like them. The purpose of this page is educational for Escalab Bootcamp only.

##Get Started

The first thing to do is open the terminal of your code editor of your choice and once there you will have to make sure to enter the folder called "vidsharenow", to enter it you must write "cd vidsharenow".

```sh
   cd ..
   cd VidShareNow
```

## Available Scripts

In the project directory, you can run:

### `yarn run dev`

In this folder is our Backend, once we enter and execute the following command it will only run the code on the side of the BackEnd. To get started in the user interface section, you will need to type the following command;

### `yarn run lint:check`

This command will review all files with a ".ts" extension in the project and provide you with information about any errors, style issues, or problematic patterns it finds in the TypeScript code.

### `yarn run lint:fix`

This command will walk through all the files in the project and apply automatic fixes to styling issues and lint errors that it can fix based on configured rules. This helps keep your code consistent and free of styling issues, saving you time by not having to manually fix every issue detected by ESLint.

### `yarn run prettier:check`

This command will run Prettier will check the format of the TypeScript files in the "src" folder and its subfolders. If it finds any file that does not meet the set format rules, it will display an error message on the console.

### `yarn run prettier:fix`

This command will automatically format the TypeScript files in the "src" folder and its subfolders, applying the established formatting rules. Prettier will make changes directly to existing files to ensure they conform to the correct format. This allows you to maintain a uniform and consistent code style in your project without having to manually make formatting changes.

### `yarn run test`

This command will run Jest with the specified options and settings. It will run tests, generate a coverage report, monitor open handles, and be in continuous watch mode to automatically detect and run tests when there are changes.

### `yarn run build`

The TypeScript compiler "ttsc" will compile the TypeScript files to JavaScript based on the settings set in the "tsconfig.json" file. This will allow you to generate a compiled, production-ready version of your project in JavaScript, which can be executed in production environments.

### ABOUT

This project was built with; bcryptjs, bunyan, compression, cookie-session, cors, dotenv, express, express-async-errors, helmet, hpp, http-status-codes, ip, joi, jsonwebtoken, lodash, moment, mongoose.

Additionally, it should be noted that for the structure of this project was implemented Onion architecture with design patterns and SOLID principles. Which are;

| Design patterns          |              SOLID principles              |
| :----------------------- | :----------------------------------------: |
| Chains of responsability | Interface SegregationInterface Segregation |
| Doble token security     |             Liskov Sustitution             |
| Prototype                |                Open / close                |
| Mediator                 |           Single responsability            |
| Singleton                |                                            |
| Facade                   |                                            |
