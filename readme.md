### Builder of minmax approximation, least squares approximation for analytical and discrete functions.

#### https://minmax.netlify.com

#### to push server code to heroku:

```
git subtree push --prefix server heroku master
```

### to start server (inside server folder)

```
docker build -t minmax-app .
docker run -v ${PWD}:/app -v /app/client/node_modules -p 5000:5000 -p 8080:8080 minmax-app
```

### to have livereload on windows use this python program https://pypi.org/project/docker-windows-volume-watcher
