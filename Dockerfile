FROM node:lts-alpine

WORKDIR /usr/local/app

COPY . .

RUN npm config set registry https://registry.npmmirror.com/ && \
  npm install -g pnpm && \
  pnpm install --frozen-lockfile

RUN pnpm build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
