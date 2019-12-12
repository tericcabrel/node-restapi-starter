#!/usr/bin/env bash

APP_NAME='node-rest-starter'

if [[ $1 == 'run' ]]; then
    # Install node packages
	yarn

    # If the directory build exists, rename the folder to build-old
	if [[ -d './build' ]]; then
        mv ./build ./build-old
	fi

    # Compile files from Typescript to ES5
	tsc

    # Copy the folders who was not moved during the Typescript compilation
	cp -r ./app/views ./build
	cp -r ./app/locale ./build
    cp -r ./app/core/mailer/templates ./build/core/mailer

	FILE=./build-old/.env.prod

    # If the configuration file exists in build-old copy into build
    # Otherwise, create it's from the .env template file (.env.example)
	if [[ -f "$FILE" ]]; then
		cp ${FILE} ./build/
		rm -rf ./build-old
	else
		cp .env.example ./build/.env.prod
		nano ./build/.env.prod
	fi

    # Launch the application with pm2
	NODE_ENV=production pm2 start ./build/index.js --name ${APP_NAME}
elif [[ $1 == 'restart' ]]; then
	pm2 restart ${APP_NAME}
elif [[ $1 == 'stop' ]]; then
	pm2 stop ${APP_NAME}
elif [[ $1 == 'reset' ]]; then
	pm2 stop ${APP_NAME} && pm2 delete ${APP_NAME}
else
	echo "Unknown command"
fi
