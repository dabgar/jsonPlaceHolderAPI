const express = require('express')
const fetch = require('node-fetch');
const fs = require('fs');
var UserJSON = require('./users.json');
var mongoose = require("mongoose");
var Response = require('./response');
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var session = require('express-session');

app.use(session({
  secret: 'djhxcvxfgshjfgjhgsjhfgakjeauytsdfy', 
  resave: false,
  saveUninitialized: true
}));
var PostsJSON = require('./posts.json');
var CommentsJSON = require('./comments.json');
const port = 3000

for(var k=0;k<PostsJSON.length;k++){
	for(var l=0;l<CommentsJSON.length;l++){
		
		if(PostsJSON[k].id==CommentsJSON[l].postId){
var comments;
	PostsJSON[k].comments=CommentsJSON[l];
	//console.log("PostsJSON+++++++",PostsJSON[k]);
		}
	}
}
	
 
	
for(var i=0;i<UserJSON.length;i++)
{
	var password;
	UserJSON[i].password="root123";
}
for(var i=0;i<UserJSON.length;i++)
{
	var role;
	
	if(i%2==0)
	{
		//console.log("i--------",i)
	UserJSON[i].role="admin";
	}
	else{
		UserJSON[i].role="viewer";
	}
}
 var postSchema = new mongoose.Schema({
 posts:{
	  userId: Number,
	  id: Number,
	  title: String,
	  body: String
  },
  comments:{
	  postId: Number,
	  id: Number,
	  name: String,
	  email: String,
	  body: String
  }
});
 var nameSchema = new mongoose.Schema({
	 
id: Number,
email: String,
  password: String,
  status:String,
  role: String,
  fileUrl:String,
  
}); 
var connections = {};

var getDatabaseConnection = function(dbName) {

    if(connections[dbName]) {
		//console.log("exists----",dbName);
        //database connection already exist. Return connection object
        return connections[dbName];
    } else {
		//console.log("dbName----",dbName);
        connections[dbName] = mongoose.createConnection('mongodb://localhost:27017/' + dbName);
		connections[dbName].on('error', console.error.bind(console, 'MongoDB connection error:'));
        return connections[dbName];
    }       
}
var Connection=getDatabaseConnection("Master");

var User = Connection.model("user", nameSchema);
User.collection.insertMany(UserJSON, function(err,r) {
	//console.log("Inserted")

});
/* User.collection.insertOne(UserJSON[i].password, function(err,r) {
	//console.log("Inserted")

});
User.collection.insertOne(UserJSON[i].role, function(err,r) {
	//console.log("Inserted")

}); */

//var User = mongoose.model("User", nameSchema);
for(var i=0;i<UserJSON.length;i++)
{
	console.log("name----",UserJSON[i].id);
	
var Connection=getDatabaseConnection(UserJSON[i].id);

var Post=Connection.model("Post", postSchema);
	
	for(var j=0;j<PostsJSON.length;j++)
		//console.log("PostsJSON[1]+++++++",PostsJSON[j]);
	{ 
if(UserJSON[i].id==PostsJSON[j].userId){
	
Post.collection.insertOne(PostsJSON[j], function(err,r) {
	
	//console.log(PostsJSON);
});
}	
}
}




/* Login */
app.post('/login', function(req, res) {
 var email = req.body.email;
 var password = req.body.password;
 User.findOne({email: email, password: password}, function(err,user){
   if(err){
     console.log(err);
      Response.errorResponse(err.message,res);
   }
   if(!user){
     Response.notFoundResponse('Invalid Email Id or Password!',res);
   }else{
	   User.findOneAndUpdate({email: req.body.email},{$set: { status : "login"}}, function(err, res) {
  upsert: true
    if (err) throw err;
    console.log("status updated to login");
//	user.save(fileUrl);
    
  });
     req.session.user = user;
     Response.successResponse('User loggedin successfully!',res,user);
   }
   
 })
});
/* user Details */
app.get('/userDetails', function(req, res) {
	
	
 var email = req.body.email;
 var password = req.body.password;
 User.findOne({email: email, password: password}, function(err,user){
	 if(user.status=="login"){
   if(err){
     console.log(err);
      Response.errorResponse(err.message,res);
   }
   if(!user){
     Response.notFoundResponse('Invalid Email Id or Password!',res);
   }else{
     
     Response.successResponse('User Details',res,user);
   }
   
 }else{
		res.send("you have not logged in");
	}
	})
	
	
});
/* post Details */
app.get('/postDetails', function(req, res) {
		var email = req.body.email;
 var password = req.body.password;
 User.findOne({email: email,password: password}, function(err,user){
	 if(user.status=="login"){
 
   if(err){
     console.log(err);
      Response.errorResponse(err.message,res);
   }
   if(!user){
     Response.notFoundResponse('Invalid Email Id or Password!',res);
   }else{
	   var Connection=getDatabaseConnection(user.id);
	   var postDetail=Connection.model("Post", postSchema);
    postDetail.find({}, function(err,allpost){
   if(err){
     console.log(err);
      
   }
    
	 res.send(allpost);
   });
   }
   
 }else{
		res.send("you have not logged in");
	}
		})
		
		
});
/* user Details For Admin */
app.get('/userDetailsForAdmin', function(req, res) {
		
 var email = req.body.email;
 var password = req.body.password;
 
 User.findOne({email: email, password: password}, function(err,user){
	 if(user.status=="login"){
   if(err){
     console.log(err);
      Response.errorResponse(err.message,res);
   }
   if(!user){
     Response.notFoundResponse('Invalid Email Id or Password!',res);
   }else{
	   if(user.role=="admin"){
     //req.session.user = user
        //console.log(names); // [{ name: 'dbname.myCollection' }
		User.find({}, function(err,alluser){
   if(err){
     console.log(err);
      
   }
     Response.successResponse('You are Admin',res,alluser);
   });
   }
   else
   {
	  console.log('You are a Viewer'); 
	  res.send('You are a Viewer');
   }
   }
 }
 else{
		res.send("you have not logged in");
	}
		})
		
		
 }
);
/* post Details For Admin */
app.get('/postDetailsForAdmin', function(req, res) {
		
  var email = req.body.email;
 var password = req.body.password;
 User.findOne({email: email,password: password}, function(err,user){
	 if(user.status=="login"){
   if(err){
     console.log(err);
      Response.errorResponse(err.message,res);
   }
   if(!user){
     Response.notFoundResponse('Invalid Email Id or Password!',res);
   }else{
	   if(user.role=="admin"){
	   var Connection=getDatabaseConnection(user.id);
	   var postDetail=Connection.model("Post", postSchema);
    postDetail.find({}, function(err,allpost){
   if(err){
     console.log(err);
      res.send("You are not admin");
   }
  
	 res.send(allpost);
   });
   }
   else
   {
	   res.send("You are not admin");
   }
   }
 }
 else{
		res.send("you have not logged in");
	}
		})
		
		
 }
);
/* update image */
app.post('/upload', function(req, res,next) {
		
	var email = req.body.email;
 var password = req.body.password;
 var fileUrl = req.body.fileUrl;
 User.findOne({email: email, password: password}, function(err,user){
	 if(user.status=="login"){
   if(err){
     console.log(err);
      Response.errorResponse(err.message,res);
   }
   if(!user){
     Response.notFoundResponse('Invalid Email Id or Password!',res);
   }else{
	   
      if(!req.body.fileUrl) {
    res.status(404);
    return next("Enter the file to be uploaded");
  }
  let doc=User.findOneAndUpdate({email: req.body.email},{$set: { "fileUrl" : req.body.fileUrl}}, function(err, res) {
  upsert: true
    if (err) throw err;
    console.log("1 document updated");
//	user.save(fileUrl);
    
  });
     res.json({ fileUrl: fileUrl });
	 console.log("doc=====",doc);
   }
   
 }
 else{
		res.send("you have not logged in");
	}
	})
	
		
  
})

/* GET LOGOUT */
app.post('/logout', function(req, res) {
	var email = req.body.email;
 var password = req.body.password;
  req.session.destroy(function(err){
if(user.status=="login"){	  
        if(err){  
            console.log(err); 
            Response.errorResponse(err.message,res); 
        }  
        else  
        {  
	User.findOneAndUpdate({email: req.body.email},{$set: { status : "logout"}}, function(err, res) {
  upsert: true
    if (err) throw err;
    console.log("status updated to login");
//	user.save(fileUrl);
    
  });
            Response.successResponse('User logged out successfully!',res,{}); 
        } 
}
else{
		res.send("you have not logged in");
	}		
    });
});

  

 
app.listen(port, () => console.log(`app listening on port ${port}!`))