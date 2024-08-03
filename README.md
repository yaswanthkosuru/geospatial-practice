## Data Used for developing backend

Restaurant data:https://raw.githubusercontent.com/mongodb/docs-assets/geospatial/restaurants.json

# Project Overview

The main goal of these project is to implement basic authentication system and do crud operations on restaurant dataset and fetch the nearest restaurants based on locations.
i implemented almost all best practices in this project

## Environment Variables

Ensure you have the following environment variables set in your environment or configuration file:

-   `PORT`:The port at which server need to be run
-   `DATABASE_URL`:mongodb+srv://yaswanthkosuru:yaswanth123@cluster0.3abhi8n.mongodb.net
-   `MONGO_DB_NAME`=sample_restaurants
-   `JWT_SECRET`=akdfhuioahu@d3@$%&\*f4d

## How to Run

1. Clone the repository.
2. Set up your environment variables as described above.
   Different ways to run
3. open in Vscode go to package.json and click on run and debug
4. Run `npm run dev` in command prompt
5. Run `docker-compose up --build`

## Deployment

The code is deployed to vercel service with API link
https://geospatial-practice.vercel.app/

# CODE OVERVIEW

1.which uses Express js to create server and mongodb as storage.

# docker

Run server via docker
`docker run -d -p 3000:3000 yaswanthkosuru/geopractice`
now server running in port 3000 in local computer

# Further imporvements

-   use Docker to run new mongodb instance and make these container and node js server communicate with each other.
-   for convinence i am mentioning mongo variables inside readme please use for only testing purposes.
