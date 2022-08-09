FROM node

WORKDIR /frontend

COPY ./package.json ./package-lock.json ./

RUN npm clean-install

COPY . ./

RUN vite build

CMD ["npm", "run", "dev", "--host", "0.0.0.0:3000"]
