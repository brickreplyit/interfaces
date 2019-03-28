FROM node:10-alpine


ENV NODE_ENV=production

WORKDIR /supply
COPY . .
RUN npm install 

#EXPOSE 3000

CMD npm test
