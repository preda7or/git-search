# Git Search SPA
This repo contains an Angular v8 SPA that will allow a user to search github.com repositories by name
and display the relevant information such as URL, description, forks count, stargazers
count, open issues count. After selecting a repository the available issues of the repository is shown.

> To facilitate sharing of a specific search state, the app supports deep linking by storing the state in the query parameters.

> `OnPush` change detection strategy is used throughout the app for optimal performance.

> Unit test of `repo-search-results` component is extended to see if based on set query parameters the right api call would be initiated. The rest of the tests are only adjusted to pass. 

---
## Instructions
### Setup
1. Clone the repo:
```
git clone https://github.com/preda7or/git-search.git
```
2. Inside the cloned folder, install the npm packages:
```
npm install
```
### Run
To run it locally in development mode use:
```
npm start
```
or run
```
ng serve
```
### Build
To build it for production use:
```
npm run build
```
or run
```
ng build --aot --prod
```
You can find the build results in the `dist` folder.

### Test
For running unit tests use:
```
npm run test
```
or run
```
ng test
```