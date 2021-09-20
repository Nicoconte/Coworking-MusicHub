FROM node:14


WORKDIR /Coworking-MusicHub-Server

COPY package.*json ./

RUN npm install

COPY . .

CMD ["npm", "start"]