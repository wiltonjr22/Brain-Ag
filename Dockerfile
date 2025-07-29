FROM node:24.2.0

WORKDIR /app

COPY package-lock.json package.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

CMD [ "npm", "run", "start:prod" ]