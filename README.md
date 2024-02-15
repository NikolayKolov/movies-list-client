# React Vite frontend for a Node.js movies list database

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 20.0.0+

## Install the Node.js Backend from [here](https://github.com/NikolayKolov/movies-list-server).

## Getting started
- Clone the repository. The cloned folder must in the same folder where you cloned the Node.js Backend. Run the backend.

- Containing folder
  - movies-list-client
  - movies-list-server

```
git clone https://github.com/NikolayKolov/movies-list-client
```
- Install dependencies
```
cd movies-list-client
npm install
```
- Build and run the project
```
npm run dev
```


# Repository purpose
The main purpose of this repository is to hold a project for a responsive React frontend for a movies list backend. The front end uses latest HTML5/CSS3 features with about 80% or more support across modern browsers.

The frontend loads the initial movies list data locally in a Redux store, and stores it in localStorage as a string containing a JSON array. After the user closes the browser tab and reopens it, the data should be fetched from localStorage, provided it has not expired. The expiry time is 12 hours.

The data can be modified - add, delete or update movies. Upon each update an indicator appears tha the data has changed and should be updated from the server database. There is a request that checks on regular intervals if the server data has changed since last update and prompts the user to update.

Modifying the data requires the user to log in. The authentication is handled using JWT tokens. Each request to modify data must contain a JWT token that the server validates. The user interface is also dependant on successful login, as some pages or elements will not be show to unauthorized users.

The movies list is displayed in the form of a grid with infinite scroll.