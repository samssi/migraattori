CONTAINER_NAME=migraattori-test-postgres

docker rm -f --name $CONTAINER_NAME
docker build -t $CONTAINER_NAME .
docker run -d --name $CONTAINER_NAME $CONTAINER_NAME
docker logs -f $CONTAINER_NAME