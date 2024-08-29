npx = npx --no-install

all: client server

client:
	${npx} vite build --ssrManifest --outDir ../../dist/client --emptyOutDir

server: $(patsubst src/ui/views/%.tsx,dist/server/views/%.js,$(wildcard src/ui/views/*.tsx))
	${npx} tsc

lint:
	${npx} eslint .
	${npx} prettier --check .

lint-staged:
	${npx} lint-staged

dev:
	node server

run: all
	NODE_ENV=production node server


dist/server/views/%.js: src/ui/views/%.tsx
	${npx} vite build --ssr views/$*.tsx --outDir ../../dist/server --emptyOutDir
