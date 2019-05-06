#!/bin/sh

docker-compose up -d

while true; do
  test -e cucumber.ok && break || sleep 10
done
docker-compose logs frontend
docker-compose logs acceptance
docker-compose exec frontend /bin/sh -c 'yarn build'

exit 0
