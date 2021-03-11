FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/learnlab/server/src

# Install app dependencies
COPY ./ ../
RUN cd ../ && npm install
RUN chmod +x ../server_entrypoint.sh

# PORT=4000
# EXPOSE 4000
ENTRYPOINT ["/bin/sh", "../server_entrypoint.sh"]
