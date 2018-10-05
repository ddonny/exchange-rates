#!/usr/bin/env bash
# disable exit on non 0
set +e
if [ $# -eq 0 ]
  then
    tag='latest'
  else
    tag=$1
fi

docker stop exchange-rates-container || errorWhileStop=true
if [ !$errorWhileStop ]
then
  docker rm -v exchange-rates-container || errorWhileRemove=true
fi

# enable exit
set -e
docker build -t exchange-rates:$tag . && docker run -it -d -p 8080:8080 -e "http.host=0.0.0.0" -e "transport.host=127.0.0.1" --name exchange-rates-container exchange-rates:$tag && exit 1

