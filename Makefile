npx = npx --no-install

all: client server

clean:
	${npx} rimraf dist

client:
	${npx} vite build --ssrManifest --outDir ../../dist/client --emptyOutDir

server: dist/server/server.js $(patsubst src/ui/views/%.tsx,dist/server/views/%.js,$(wildcard src/ui/views/*.tsx))

lint:
	${npx} eslint .
	${npx} prettier --check .

lint-staged:
	${npx} lint-staged

dev: server
	node .

run: all
	NODE_ENV=production node .


dist/server/views/%.js: src/ui/views/%.tsx
	${npx} vite build --ssr views/$*.tsx --outDir ../../dist/server --emptyOutDir false

dist/server/server.js: src/server/server.ts
	tsc --project src/server/tsconfig.json --outDir dist/server
