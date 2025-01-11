# Start with an official Redis image from DockerHub
FROM redis:alpine3.16

# Copy the custom Redis configuration file into the container
COPY redis.conf /usr/local/etc/redis/redis.conf

# Set Redis to run with the custom configuration file and environment variables
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
