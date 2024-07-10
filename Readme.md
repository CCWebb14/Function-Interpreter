# Group 2 Project

-Benjamin Ward  
-Andrew Park  
-Jeremy Gan  
-Farbod Nematifar  
-Cooper Webb

This is a web application that assesses novice-level code comprehension using generative AI. After selecting a question, students explain what sample code does in plain English. This text is then transformed into code by the gen AI and tested against test-cases to determine accuracy.

## Requirements

[Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Instructions for use

### Starting the service

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
_Note: In order to run all the tests provided, the assumption is made that the containers are built and the servers are running._
Please then exec the [npm run test] from the backend docker container

All tests located in: Projects-Groups-02-Lab-B/backend/tests


#### Running commands from docker container
After containers have been built and started:
docker ps [To look at all container IDS]
docker exec -it <containerID of backend from above> npm run test


