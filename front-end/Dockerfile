FROM node:16-alpine

RUN apk add --no-cache bash

RUN addgroup -S -g 1001 frontendgroup && \
    adduser -S -u 1001 -G frontendgroup frontenduser

WORKDIR /front-end

COPY package.json package-lock.json ./
RUN chown -R frontenduser:frontendgroup /front-end

USER frontenduser

RUN npm config set timeout 600000 && \
    npm install && \
    npm i next

COPY . .

USER root
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

RUN chown -R frontenduser:frontendgroup /front-end
USER frontenduser
RUN npm run build
EXPOSE 3000

# Comando para correr la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]
# Comando para correr la aplicación en producción
# CMD ["npm", "start"]
