# Uses the node base image with the latest LTS version
FROM node:18.16.0-bullseye-slim
# Informs Docker that the container listens on the 
# specified network ports at runtime
EXPOSE 5001

# set to development so we can compile
ENV NODE_ENV=development

# Copy necessary files into the container
COPY package.json yarn.lock /usr/src/app/
COPY server.js /usr/src/app/
COPY public /usr/src/app/public

# Set the working directory in the container
WORKDIR /usr/src/app

# Installs dependencies on container
RUN yarn install --frozen-lockfile


# Run the app when the container launches
CMD ["node", "server.js"]