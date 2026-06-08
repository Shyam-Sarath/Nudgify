FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production=false --silent

# Copy app source
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
