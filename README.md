# Groupy - Connect with Like-Minded People

This project is currently in development :rocket:

Welcome to Groupy, a social networking platform designed to bring together individuals with shared interests, whether you're looking for a workout buddy, a study group, or a team to work on exciting projects. Groupy aims to make it easy for you to find and connect with others who share your passions.

## Technologies Used

Groupy is built using the following technologies (To be updated):

- Next.js: A popular React framework for building server-side rendered applications.
- TypeScript: A typed superset of JavaScript that enhances code scalability and maintainability.
- tRPC: A simple and fast way to create TypeScript API endpoints.
- Prisma with Supabase: Prisma is used as the ORM to interact with the database, and Supabase provides the backend-as-a-service platform.
- Tailwind CSS: A utility-first CSS framework for rapidly styling the user interface.
- nextAuth: Provides authentication support for Next.js applications.
- Tanstack Query: A powerful data fetching and caching library for managing data in the application.
- RecoilJS: A state management library for managing and sharing the application's global state.
- Zod: A TypeScript-first schema validation library for data validation and sanitization.

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

## Planned Features

There are exciting features in the pipeline to enhance Groupy further:

1. **Searching for Posts through Tags:** Users will be able to filter posts based on tags to find specific groups of interest.
2. **Group Up Feature:** Users can create posts that act as invitations to group chats, with the option to set a limit on the number of people allowed to join.
3. **Live Group Chat:** Upon joining a group, users can engage in real-time group chat with other members.
4. **Admin Controls for Group Chat:** Administrators of group chats will have the ability to select and admit members they wish to join.

# Getting Started

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

## Contribution

Contributions to Groupy are welcome! If you'd like to contribute to the project, follow these steps:

1. Fork the repository and clone it to your local machine.
2. Run the project on your local machine, check the Getting Started section to setup the project.
5. Make your changes and test them thoroughly.
6. Commit your changes with clear and concise messages.
7. Push your changes to your forked repository.
8. Create a pull request detailing your changes and their purpose.

## License

Groupy is licensed under the [MIT License](LICENSE), which allows you to use, modify, and distribute the code freely.

---

Thank you for considering Groupy! Let's build a community where people can connect and thrive together. If you have any questions or feedback, please don't hesitate to reach out. Happy coding!
