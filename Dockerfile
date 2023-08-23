FROM node:lts-alpine
WORKDIR /src
COPY package.json .
COPY . .
RUN pnpm install
EXPOSE 3000
CMD ["pnpm", "run", "dev"]