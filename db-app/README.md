# NodeJS Database App

## Description
- This in an implementation of [this](https://github.com/TelerikAcademy/Databases/tree/f7c3fc9d6f07bb60859c556184bf23eea334738f/21.%20Databases%20Team%20Work%20Project/2015) assignment, only using NodeJS instead of .NET. Also:
    - MS SQL Server is left out in favor of MariaDB
    - MySQL will be left out in favor of CouchDB

## Starting the server
- `npm start`

## TODO:
- Decide what data to use and model
    - Maybe Northwind db
- Create a raw node http server to serve data requests
    - Should expose a RESTful api
        - for crud over the database models
        - for uploading zips and excel/csv files
        - for downloading generated json/pdf/excel reports
- Create a web client that provides meaningful data visualization
    - should be a single page App
    - use self-implementation of routing
    - use kendoui/jqueryui