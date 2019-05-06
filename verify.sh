#!/bin/sh

docker-compose up -d

while true; do
  test -e cucumber.ok && break || sleep 10 && echo 'tentando...'
  docker-compose logs frontend acceptance
done
docker-compose exec frontend /bin/sh -c 'yarn build'

exit 0
