const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here

    res.send(JSON.stringify(books,null,4));

    return res.status(200).json({message: "Book List Sent!"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here

    const isbn = parseInt(req.params.isbn)
    if (books[isbn]){
        res.send(JSON.stringify(books[isbn], null, 4))
        return res.status(200).json({message: "Book with ISBN " + isbn + " Sent!"});
    }else{
        return res.status(404).json({message: "No book with ISBN " + isbn + " found"})
    }
    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here

    const writer = req.params.author
    console.log(writer)
    let bookList = Object.keys(books)
    console.log(bookList)
    bookList.forEach( book => {
        console.log(books[book])
        if (books[book].author === writer){
            res.send(JSON.stringify(books[book], null, 4))
            return res.status(200).json({message: `Book written by ${writer} was sent!`})
        }
    })
    return res.status(404).json({message: `Book written by ${writer} not found.`})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  	//Write your code here
      const name = req.params.title
      console.log(name)
      let bookList = Object.keys(books)
      console.log(bookList)
      bookList.forEach( book => {
          console.log(books[book])
          if (books[book].title === name){
              res.send(JSON.stringify(books[book], null, 4))
              return res.status(200).json({message: `Book written by ${name} was sent!`})
          }
      })
      return res.status(404).json({message: `Book written by ${name} not found.`})

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
	//Write your code here
	const isbn = parseInt(req.params.isbn)
    if (books[isbn]){
        res.send(JSON.stringify(books[isbn].reviews, null, 4))
        return res.status(200).json({message: "Book with ISBN " + isbn + " Sent!"});
    }else{
        return res.status(404).json({message: "No book with ISBN " + isbn + " found"})
    }

});

module.exports.general = public_users;


