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

### Demo instructions

*Note: Images are required*

#### Loading docker images
```sh
docker load project-groups-02-lab-b-frontend.tar.gz &&
docker load project-groups-02-lab-b-backend.tar.gz
```

#### Running images

##### Option 1 (docker run):

##### Starting the service 

```sh
docker run -p 4000:4000 -d project-groups-02-lab-b-frontend &&
docker run -p 4001:4001 -d project-groups-02-lab-b-backend
```

##### Stopping the service 
```sh
docker stop $frontend_container_id  &&
docker stop $backend_container_id
```

To view the associated web pages navigate to 
[localhost:4000](http://localhost:4000)

##### Option 2 (docker compose):

Create a docker-compose.yml file

```yaml
services:
  group-02-frontend:
    image: project-groups-02-lab-b-frontend
    ports:
      - "4000:4000"

  group-02-backend:
    image: project-groups-02-lab-b-backend
    ports:
      - "4001:4001"
```

##### Starting the service 
```sh
docker compose up -d
```

To view the associated web pages navigate to 
[localhost:4000](http://localhost:4000)

##### Stopping the service
```sh
docker compose down
```

### Development instructions

While in the root directory, run the following commands to launch the service.

#### Starting the service 
```sh
docker compose up -d
```

*Note: This will also build the images*

To view the associated web pages navigate to 
[localhost:4000](http://localhost:4000)

*Note: any modifications made to TypeScript source files will be automatically detected and applied without the need to manually restart the service.*

#### Stopping the service
```sh
docker compose down
```


#### Compressing & Saving images locally

After images are built, you can run the following commands to generate compressed image files for distribution.

```sh
docker save project-groups-02-lab-b-frontend | gzip -c > project-groups-02-lab-b-frontend.tar.gz &&
docker save project-groups-02-lab-b-backend | gzip -c > project-groups-02-lab-b-backend.tar.gz
```

*Note: This will take a while*



