#!/bin/sh

docker-compose exec frontend /bin/sh -c 'yarn pre-dist' &&
docker-compose exec acceptance /bin/sh -c 'npm test && touch ok' &&
test -e ok && docker-compose exec frontend /bin/sh -c 'yarn build'

exit 0
