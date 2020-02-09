const fetch = require('node-fetch');
const fs = require('fs');

	fetch('https://jsonplaceholder.typicode.com/users')
   .then(res => {
	   
        const dest = fs.createWriteStream('./users.json');
        res.body.pipe(dest);
   })
  .then(json => console.log(json))

  



	fetch('https://jsonplaceholder.typicode.com/posts')
   .then(res => {
	   
        const dest = fs.createWriteStream('./posts.json');
        res.body.pipe(dest);
   })
  .then(json => console.log(json))




	fetch('https://jsonplaceholder.typicode.com/comments')
   .then(res => {
	   
        const dest = fs.createWriteStream('./comments.json');
        res.body.pipe(dest);
   })
  .then(json => console.log(json))

  
module.exports;
