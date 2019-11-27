# Node REST API Starter

A starter project to build REST API in node.js with Typescript, Express Framework and MongoDB
## Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Documentation](#documentation)
- [Internationalization](#internationalization)
- [Docker](#docker)
- [Test](#test)

## Features
This features are available in this project

- **User Registration:** Register with the email confirmation sent
- **Password reset**
- **Authentication with JWT:** Generate Access token and Refresh token the login
- **Logger:** Log info/error message into a log file
- **Internationalization:** API can respond with the message in the language provided. French and English are available
- **Socket.io:** Socket communication
- **Transformer:** Customize the data returned by the API

## Prerequisites
- Node.js
- MongoDB
- Redis

## Installation
- Clone the repository
```bash
$ git clone https://github.com/tericcabrel/node-restapi-starter.git [project_name]
```

- Install dependencies
```bash
$ cd [project_name]
$ yarn
```
- Create the configuration file and update with your local config
```bash
$ cp .env.example .env
$ nano .env
```
- Start Application
```bash
$ yarn start
```
The application will be launched by [Nodemon](https://nodemon.com) so it's will restart automatically when a file changed

## Documentation
[ RESTful API Modeling Language (RAML)](https://raml.org/) is used to design our API documentation
An editor is provide to write our specification after we use a command to generate the documentation
- Launch the Editor
```bash
$ yarn api-designer
```
Open the browser and navigate to http://localhost:4000

- Import API specification <br>
The documentation for the available endpoints have already wrote.
We just have to continue by adding our own. For that, you need to:<br>
1- Zip the content of the folder `public/apidoc`<br>
2- Import the zip in the API designer<br>
3- Add or edit specification

- Generate API Documentation
```bash
$ yarn apidoc
```
Open the browser and navigate to http://localhost:7010/api/documentation

## Internationalization
The API can send response in the based on the language of the client.
For that, you need to set the language in the header of the request
````json
{ "Accept-Header":  "fr"} 
````
API will respond in french. Only french and english are available but it's easy to add another language 

## Docker
To run the project with docker, just run
```bash
$ docker-compose up --build
```

## Test
Mocha and Chai is used to write unit test.
```bash
$ yarn test
```
