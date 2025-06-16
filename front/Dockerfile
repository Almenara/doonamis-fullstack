FROM node:20.19

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 4200
CMD ["npm", "run", "start"]