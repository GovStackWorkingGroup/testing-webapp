FROM node

#Setup working directory
RUN mkdir -p /testing-webapp
WORKDIR /testing-webapp

#Copy source files
COPY . .

#Install dependencies
RUN yarn install

RUN yarn build
#Running the app
CMD ["yarn","start"]

