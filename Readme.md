# Group 2 Project

-Benjamin Ward  
-Andrew Park  
-Jeremy Gan  
-Farbod Nematifar  
-Cooper Webb

This is a web application that assesses novice-level code comprehension using generative AI. After selecting a question, students explain what sample code does in plain English. This text is then transformed into code by the gen AI and tested against test-cases to determine accuracy.

## Organization 
### Frontend
The frontend is organized around src/components. Each section of the app has its own folder of related components. 

To navigate through the frontend was use React's routing system (see App.tsx)
### Backend
Backend has four main sections: controllers, db/models, llm, routes (we left the test section in, but most of these tests have been migrated to the frontend - see testing section below)

controllers/routes: controllers handles incoming requests and processes data logic. Routes handles the actual endpoint/routes to connect our frontend to our backend
db/models: db contains our sqlite database and db creation scripts and models is how we interact with the database
llm: this includes our setup and api to run ollama
tests: this includes our old testing suite before we switched to frontend


## Requirements

[Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Instructions for use

### Docker Compose 
#### Starting the service

```sh
docker compose up -d
```

_Note: This will also build the images if not already built_

To view the associated web pages navigate to
[localhost:4000](http://localhost:4000)

_Note: any modifications made to TypeScript source files will be automatically detected and applied without the need to manually restart the service._

#### Stopping the service

```sh
docker compose down
```

## Test Suite
Once docker is running, all tests can be viewed on the browser using this URL: 
http://localhost:4000/test



