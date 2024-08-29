FROM node:16-alpine

RUN addgroup -S -g 1000 dbgroup && \
    adduser -S -u 1000 -G dbgroup dbuser || \
    echo "Usuario o grupo ya existe"

WORKDIR /API
COPY package*.json ./
RUN npm install

COPY . .
RUN node "Model/cargarTabla.js"
RUN chown -R 1000:1000 /API

EXPOSE 3001
USER 1000
CMD ["node", "Controller/Api.js"]

