# jansonsa (7868766) - 340CT SEM1

[Stock Inventory project](https://github.coventry.ac.uk/agile/projects/blob/master/17%20Stock%20Inventory.md)

## CI/CD

This repository uses GitHub Actions to run CI/CD Workflows in [github.com/jansonsa/jansonsa-sem1](https://github.com/jansonsa/jansonsa-sem1) repository.
The following workflows exist:
- On every push and pull request: Lint and test the code
- On pushes to master: Deploy the code to Heroku

## Hosting

The code is hosted on Heroku with the name **jansonsa-sem1**. It can be accessed by visiting [jansonsa-sem1.herokuapp.com](https://jansonsa-sem1.herokuapp.com/)

## JSDoc

JSDoc documentation can be generated by running `npm run jsdoc` which will create the documentation in `/docs/jsdoc` directory. You can serve this directory to be accessible from the browser by running `npm run start-docs`. By default it will run on port `3030`, but this can be changed with the environment variable `DOCS_PORT`. You can access the running server by visiting [prelude-include-3030.codio-box.uk/](https://prelude-include-3030.codio-box.uk/).

## Useful commands

- `sqlite3 website.db` - Open website.db with SQLite console
- `.tables` - Lists all tables
- `.schema <TABLE_NAME>` - Displays table schema
- `.read <SQL_SCRIPT>` - Execute SQL script from file
- `.exit` - Exit SQLite console
