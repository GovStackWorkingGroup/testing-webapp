FROM node:22.8.0

#Setup working directory
RUN mkdir -p /frontend
WORKDIR /frontend

#Copy source files
COPY ./package.json ./
COPY ./yarn.lock ./

#Install dependencies
RUN yarn install --pure-lockfile

COPY . .

ARG API_URL

RUN yarn build

#Running the app
CMD ["yarn","start"]
