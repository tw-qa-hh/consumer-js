# consumer-js
Description: Service written in javascript. It uses provider API to fetch address information.

How to run (requires nodejs installed):
```
npm i
npm run start 
```

How to build and run with Docker:
```
docker build . -t consumer-js
docker run -p3000:3000 consumer-js
```

To check: `open in browser http://localhost:3000/`

How to run contract test(dependencies had to be installed):
```
npm run test
```
