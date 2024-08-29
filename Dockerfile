FROM mongo:latest

RUN groupadd -g 1000 mongodbuser && \
    useradd -r -u 1000 -g mongodbuser mongodbuser || \
    echo "Usuario o grupo ya existe"

RUN mkdir -p /data/db && chown -R mongodbuser:mongodbuser /data/db

USER mongodbuser
CMD ["mongod"]
