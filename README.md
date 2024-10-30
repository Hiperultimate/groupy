# Groupy - Connect with Like-Minded People

This project is currently in development :rocket:

Welcome to Groupy, a social networking platform designed to bring together individuals with shared interests, whether you're looking for a workout buddy, a study group, or a team to work on exciting projects. Groupy aims to make it easy for you to find and connect with others who share your passions.

## Technologies Used

Groupy is built using the following technologies:

- TurboRepo: A package manager facilitating dependency management for projects
- Socket.io: Enabling real-time, bidirectional communication between web clients and servers, utilizing WebSockets or alternative transport mechanisms.
- Express: Server-side logic and HTTP request handling for chat server.
- Next.js: A popular React framework for building server-side rendered applications.
- TypeScript: A typed superset of JavaScript that enhances code scalability and maintainability.
- tRPC: A simple and fast way to create TypeScript API endpoints.
- Redis: In-memory data structure store serving as a database, cache, and message broker, supporting various data structures and offering high performance and scalability.
- Prisma with Supabase: Prisma is used as the ORM to interact with the database, and Supabase provides the backend-as-a-service platform.
- Tailwind CSS: A utility-first CSS framework for rapidly styling the user interface.
- NextAuth: Provides authentication support for Next.js applications.
- Tanstack Query: A powerful data fetching and caching library for managing data in the application.
- RecoilJS: A state management library for managing and sharing the application's global state.
- Zod: A TypeScript-first schema validation library for data validation and sanitization.
- Vitest : A fast, Vite-native testing framework tailored for unit and integration testing.
- Cypress : A robust end-to-end testing framework for verifying the application's functionality in a browser environment.

## Project Structure

- `packages/db_prisma`: Contains Prisma ORM which is used to talk to PostgreSQL database.
- `packages/db_redis`: Contains Dockerfile to run Redis instance locally.
- `packages/supabase-suite`: Contains supabase config to run supabase in docker locally.
- `apps/chatServer`: This folder contains the chat server which is runs on express and socket.io. 
- `apps/chatServer/utils`: Consists of utility functions for chatServer.
- `apps/groupy/src/pages`: This directory contains the Next.js pages used to structure the application's frontend.
- `apps/groupy/src/components`: Inside this folder, you'll find the components that are utilized within the pages located in `src/pages`.
- `apps/groupy/public`: This directory holds SVG files converted into TypeScript (tsx) files, as well as the fonts used throughout Groupy. It serves as a repository for static assets accessible to both the frontend and the backend.
- `apps/groupy/src/common`: Contains a collection of functions that are shared between both the frontend and the backend for Groupy.
- `apps/groupy/src/utils`: Consists of utility functions for Groupy.
- `apps/groupy/src/store`: Contains Recoil states, which help manage the state of the React components efficiently.
- `apps/groupy/src/server`: This directory is dedicated to the backend for Groupy. It contains backend APIs and a Prisma connector for interacting with the database. Server logic and API endpoints are implemented here.
- `apps/groupy/prisma`: This folder contains Prisma migrations and a **schema.prisma** file. The **schema.prisma** file serves as the blueprint for the database models, defining their structure and relationships.

## Completed Features

So far, the following features have been implemented in Groupy:

1. **Creating Account:** Users can sign up and create their accounts.
2. **Updating Account Information:** Users can edit and update their account details.
3. **Creating Posts with Image Uploads:** Users can create posts and upload images to share their interests.
4. **Data Fetching and Caching:** Data is efficiently fetched and cached using Tanstack Query to provide a seamless user experience.
5. **Notifications Handling:** Users receive notifications for important events.
6. **Writing Comments for Posts:** Users can comment on posts to engage in discussions.
7. **Bandwidth-Saving Comment Loading:** A limited number of comments are initially loaded per post, with dynamic loading of more comments as the user scrolls to optimize bandwidth usage.
8. **Sending Friend Requests:** Users can connect with others by sending friend requests.
9. **Creating Groups:** Users can create groups through posts and can toggle instant join option which lets other users join the group on a single click or sends notification to the group moderator if Instant join is set to false.
10. **Live Chatting:**  Chat page is now available where users can see their joined groups and actively participate while chatting.

## Planned Features

There are exciting features in the pipeline to enhance Groupy further:

1. **Searching for Posts through Tags:** Users will be able to filter posts based on tags to find specific groups of interest.
2. **Group Moderation Options:** Group moderators will be able to add or remove users from their group .

# Getting Started

There are two ways you can run Groupy on your machine. Choose the one which suits you the most.

**Setup Method 1** : Local Groupy with your database environment variables
To run Groupy locally, follow these steps:

1. Clone the repository.
2. Install the required dependencies using `npm install`.
3. Run the command `turbo db:generate` to generate Prisma Client.
4. Rename the `env.example` file to `.env`.
5. Add the following keys and replace the values with your own:

   - Replace `DATABASE_URL` with your postgresql database url
   - Replace `YOUR_NEXTAUTH_URL` with the URL of your Next.js application where NextAuth should handle authentication.
   - Replace `YOUR_NEXTAUTH_SECRET` with a random secret key for NextAuth. You can generate one using a tool like `openssl rand -hex 32`.
   - Replace `YOUR_SUPABASE_PROJECT_URL` with the URL of your Supabase project.
   - Replace `YOUR_SUPABASE_PROJECT_ANON_KEY` with the anonymous key for your Supabase project.

    Requirements for chat-server
   - Replace `NEXT_PUBLIC_CHATSERVER_URL` with the URL where `chat-server` is running at (For development : `http://localhost:4000`).
   - Replace `REDIS_PORT` with port of your redis server.
   - Replace `REDIS_HOST` with host data of your redis server.
   - Replace `REDIS_PASSWORD` with the password of your redis server.
   - Replace `CS_PORT` with the PORT number where you want to run your chat-server.

6. Run database migrations using `npm run prisma-migrate`.
7. Run the development server using `npm run dev`.


**Setup Method 2** : Local Groupy with Docker database Setup

1. Clone the repository.
2. Install the required dependencies using `npm install`.
3. Run the command `turbo db:generate` to generate Prisma Client.
4. Run the command `npm run dev-local`, this may take sometime to setup. (Note: This step utilizes **.env.test** file for environment variables instead of **.env**)

# Testing 

To run E2E test locally you can simply run these commands in order:

**NOTE**: Ensure Docker is running in the background. This allows Groupy to set up local instances of **Supabase** and **Redis** and use the `.env.test` file for configuration.

1. `npm run dev-local` : This command ensures you are running all the databases and storages locally on docker and also starts Groupy dev instance locally.
2. `npm run e2e-groupy` : Runs cypress tests. 

If you are adding tests and want to open cypress dev environment, simply run `npm run e2e-groupy-dev` instead of step 2 above.

# Running local DB instances on Docker 
You can start or stop database instances using the following command:
1. `npm run db-up` : Starts Supabase and redis services on docker.
2. `npm run db-down` : Stops Supabase and redis services on docker.


**Warning**: Running `npm run e2e-groupy` will work but it also generates new data in databases which might be unwanted. It is best to use the local instances for this purpose which you can run by following step 1.

## Contribution

Contributions to Groupy are welcome! If you'd like to contribute to the project, follow these steps:

1. Fork the repository and clone it to your local machine.
2. Run the project on your local machine, check the Getting Started section to setup the project.
3. Make your changes and test them thoroughly.
4. Commit your changes with clear and concise messages.
5. Push your changes to your forked repository.
6. Create a pull request detailing your changes and their purpose.

## License

Groupy is licensed under the [MIT License](LICENSE), which allows you to use, modify, and distribute the code freely.

---

Thank you for considering Groupy! Let's build a community where people can connect and thrive together. If you have any questions or feedback, please don't hesitate to reach out. Happy coding!
