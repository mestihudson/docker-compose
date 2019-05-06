#!/bin/sh

apk add curl

while true; do
  result="$(curl -s http://hub:4444 > /dev/null && echo ok || echo fail)"
  if [ "$result" == "ok" ]; then
    break
  fi
  sleep 5
done

while true; do
  result="$(curl -s http://api:4000 > /dev/null && echo ok || echo fail)"
  if [ "$result" == "ok" ]; then
    break
  fi
  sleep 5
done

while true; do
  result="$(curl -s http://frontend:4200 > /dev/null && echo ok || echo fail)"
  if [ "$result" == "ok" ]; then
    break
  fi
  sleep 5
done

exit 0
