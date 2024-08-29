npx = npx --no-install

build: build-client build-server

build-client:
	${npx} vite build --ssrManifest --outDir ../../dist/client

build-server:
	${npx} vite build --ssr entry-server.tsx --outDir ../../dist/server

lint:
	${npx} eslint .
	${npx} prettier --check .

lint-staged:
	${npx} lint-staged

dev:
	node server

run: build
	NODE_ENV=production node server
