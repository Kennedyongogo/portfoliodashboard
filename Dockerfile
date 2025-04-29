FROM node:14-alpine3.14 as build

WORKDIR /usr/src/app
COPY package*.json ./

# Add build argument
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY . ./
RUN npm install
RUN npm rebuild node-sass
RUN npm run-script build

FROM nginx:1.21.3-alpine

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
