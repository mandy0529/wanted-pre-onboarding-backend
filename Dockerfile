# 개발용 빌드 스테이지
FROM node:18.17 as dev

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]

# 프로덕션용 빌드 스테이지 -----------------------------------------
FROM node:18.17 as prod

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN yarn --production

COPY . .

EXPOSE 3000

CMD ["yarn", "start:prod"]

# 테스트용 빌드 스테이지 -----------------------------------------
FROM node:18.17 as test

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start:test"]