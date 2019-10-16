### Builder of minmax approximation, least squares approximation for analytical and discrete functions.

#### https://blevantovych.github.io/Diplom

#### to push server code to heroku:

```
git subtree push --prefix server heroku master
```

### to start server (inside server folder)

```
docker build -t minmax-app .
docker run -p 5000:5000 -p 8080:8080 minmax-app
```
