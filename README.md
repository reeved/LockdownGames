# Group-13-Emerald-Elephant

## About
Lockdown Games is a social game website, currently featuring three games - Codenames, Poker and Last Card. Lockdown Games is designed to allow you to have fun with your friends, even when you can't see each other in person. It provides multiple games which are great to play with friends, alongside a chat and invitation system, giving you the best social experience possible alongside the games themselves.

Review the [documentation](https://github.com/csdoris/Group-13-Emerald-Elephant/wiki) for more information and guidelines on our application.

## Setting up
Firstly, please ensure that [nodejs](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) are installed on your computer. Npm is used to manage project dependencies.
Once these are installed, navigate to the folder you would like to install the repository in and clone it locally using:     
`git clone https://github.com/csdoris/Group-13-Emerald-Elephant.git`. 

Once this is done, run the application by running the frontend and backend together. Navigate to the root folder of the application using two seperate terminal instances and run the following commands, one in each terminal instance:  

**Frontend:**   
```
cd frontend   
npm install   
npm start
```    
**Backend:**   
```
cd backend    
npm install    
npm start
```
*Note that `npm install` only needs to be run when new packages are added.*     
Before running, ensure that your `frontend/src/Socket.js` file points to your local server by altering the URL specified.

For more information, see the [Getting Started](https://github.com/csdoris/Group-13-Emerald-Elephant/wiki/Getting-Started) page of the wiki.
