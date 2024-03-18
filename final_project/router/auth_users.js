const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}


const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = parseInt(req.params.isbn)
    const user = req.session.authorization.username
    console.log(books[isbn])
    console.log(req.query)
    console.log(req.user)
    console.log(req.session.authorization)
    books[isbn].reviews[user] = req.query.review
    return res.status(200).send(books[isbn])
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = parseInt(req.params.isbn)
    const user = req.session.authorization.username
    console.log(books[isbn])
    console.log(req.query)
    console.log(req.user)
    console.log(req.session.authorization)
    delete books[isbn].reviews[user]
    return res.status(200).send(books[isbn])
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
