FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/learnlab/web

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy app files
COPY . .

EXPOSE 3000
CMD yarn start
