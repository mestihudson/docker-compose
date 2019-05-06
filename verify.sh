#!/bin/sh

docker-compose up -d

while true; do
  test -e cucumber.ok && break
done
docker-compose exec frontend /bin/sh -c 'yarn build'

exit 0
