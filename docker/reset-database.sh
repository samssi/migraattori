CONTAINER_NAME=migraattori-test-postgres

docker rm -f $CONTAINER_NAME
docker run -d -p 5432:5432 --name $CONTAINER_NAME $CONTAINER_NAME