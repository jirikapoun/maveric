npx = npx --no-install

all: client server

clean:
	${npx} rimraf dist

client:
	cd src/ui && ${npx} vite build

server:
	cd src/server && ${npx} vite build
	cd src/server && ${npx} tsc --outDir ../../dist/server

lint:
	${npx} eslint .
	${npx} prettier --check .

dev:
	cd src/server && node ./server-dev.js

run: all
	cd dist/server && node ./server.js
