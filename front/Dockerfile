FROM node:20.19.0

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 8000
CMD ["npm", "run", "start"]