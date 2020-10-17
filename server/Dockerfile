FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/learnlab/server/src

# Install app dependencies
COPY package*.json ../
RUN cd ../ && npm install

# Copy app files
COPY ./src .

EXPOSE 4000
CMD ["node", "index.js"]
