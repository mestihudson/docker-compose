#!/bin/sh

while true; do
  test -e cucumber.ok && docker-compose exec frontend /bin/sh -c 'yarn build' && break
done

exit 0
