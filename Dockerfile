# 개발용 빌드 스테이지
FROM node:18.17 as dev

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]

# 테스트용 빌드 스테이지 -----------------------------------------
FROM node:18.17 as test

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start:test"]

# 배포용 빌드 스테이지 -----------------------------------------
FROM node:18.17 as prd

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start:prd"]


