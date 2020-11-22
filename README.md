
  

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

  ![screenshot](https://github.com/ddonny/exchange-rates/blob/master/screenshot/screenshot.PNG?raw=true)

## Deploy

  

* Go to project directory by CLI (Command Line Interface)

* Make sure containers are stopped and deleted already. In our case, container tagged with name `exchange-rates-container`

```bash

docker stop exchange-rates-container

docker rm -v exchange-rates-container

```

* Then we can create the build the image for production distribution. Here we use port 8080 and set bind to Host 0.0.0.0. `latest` are versioning tag (you can changed it, but it should be unique). After building image complete, we can run container with the image.

```bash

docker build -t exchange-rates:latest .

docker run -it -d -p 8080:8080 -e "http.host=0.0.0.0" -e "transport.host=127.0.0.1" --name exchange-rates-container exchange-rates:latest

```

* Or, you can also run by bash script in CLI by move into project directory

```bash

./build.sh latest

```

## Run test

* You might need to run the app first

```bash

npm install

npm run start

```

* after app running on port 3000 and ip 127.0.0.1, add new tab CLI and run:

```bash

cypress:spec

```

* But, if you want to run by not using headless browser, by running command below and selecting specs to be run on selected browser.

```bash

cypress:run

```
