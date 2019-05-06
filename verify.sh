#!/bin/sh

while true; do
  test -e cucumber.ok && break || echo -e '.'
done
docker-compose exec frontend /bin/sh -c 'yarn build'

exit 0
