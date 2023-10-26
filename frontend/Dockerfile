FROM node

#Setup working directory
RUN mkdir -p /frontend
WORKDIR /frontend

#Copy source files
COPY . .

#Install dependencies
RUN yarn install

RUN yarn build
#Running the app
CMD ["yarn","start"]

