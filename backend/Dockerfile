FROM node:16

# Create app directory
WORKDIR /app

COPY . .

RUN yarn install
RUN yarn add nodemon
RUN ls

EXPOSE 5000
ENTRYPOINT ["/app/entrypoint.sh"]
