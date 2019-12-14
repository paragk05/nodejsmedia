const express= require('express');

const app=express();


const multer=require('multer');

const crypto= require('crypto');

const hash= crypto.createHash('md5');

const mysql= require('mysql');

const bodyParser= require('body-parser');

const ejs=require('ejs');

const path = require('path');


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended:false}));


app.use(express.static('./public'));



const connection= mysql.createConnection({

    database : 'School',
    user : 'root',
    password: 'Parag@765',
    host : 'localhost'
});


app.get('/',(req,res)=>res.render('index'));


app.post('/stud_reg',(req,res)=>
{
    const inputQuery= "INSERT INTO student(s_department,s_first_name,s_last_name,s_password,s_user_name,s_year) VALUES(?,?,?,?,?,?)"

    
    const fname= req.body.sfirst;
    const lname= req.body.slast;
    const department= req.body.sdepa;
    const year= req.body.syear;
    const user= req.body.suser;
    const pass= req.body.spass;

    
    connection.query(inputQuery,[department,fname,lname,pass,user,year],(err,row,field)=>
    {
        if(err)
            console.log(err);
        else
        {
            console.log('Data inserted successfully..')
            res.redirect('./index.html');
        }
    })


});

app.post('/stud_login',(req,res)=>
{
    const user=req.body.suser;
    const pass=req.body.spass;

    const inputQuery= 'select * from student where s_user_name=? AND s_password=?'

    connection.query(inputQuery,[user,pass],(err,row,field)=>
    {
        if(err)
        console.log(err);
        else
        {
            
            res.redirect('./student.html');
        }
        
    });
});


app.get('/user',(req,res)=>
{
    const inputQuery='SELECT * FROM user';

    connection.query(inputQuery,(err,row,field)=>
    {
        if(err)
        res.send(err);
        else
        {
        console.log("data displayed");
        res.json(row);
        }
    });

});

app.get('/user/:id',(req,res)=>{

    const inputQuery= "SELECT * FROM user WHERE id=?"
    const userId=req.params.id;

    connection.query(inputQuery,[userId],(err,row,field)=>
    {
        if(err)
        console.log(err);
        else{
            console.log("data displayed");
            res.json(row);
        }
    });
});

//set views files
//app.set('views',path.join(__dirname,'views'));


//set view engine
app.set('view engin','ejs');
app.set(bodyParser.json());

//Multer Storage
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.originalname);
    }
  });
  

//file uplaod

const upload = multer({
    storage: storage
  }).single('myfile');


  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /mp3|wav/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Mp3 Only!');
    }
  }


app.post('/upload', (req, res) => 
{
    upload(req, res, (err) => 
    {
      if(err)
      {
        res.render('index', 
        {
          msg: err
        });
      } 
      else 
      {
        if(req.file == undefined)
        {
          res.render('index', 
          {
            msg: 'Error: No File Selected!'
          });
        } 
        else 
        {
            
            const filePath=req.file.path;
            const inputQuery='insert into file(path) values (?)';

            connection.query(inputQuery,[filePath],(err,row,field)=>
            {
                if(err)
                console.log(err)
                else
                console.log('data inserted');
            })

            console.log(req.file);
            console.log(filePath);
          res.render('index', 
          {
            msg: 'File Uploaded!',
            file: `uploads/${req.file.filename}`
          });
        }
      }
    });
  });

  app.get(('/download/:filename'),(req,res)=>
  {
      const fileN=req.params.filename;

      const inputQuery='select * from file where path=?'

      connection.query(inputQuery,[fileN],(err,row,field)=>
      {
          if(err)
          console.log(err)
          else
          res.download('./public/uploads/'+fileN);
        

      })


  })

app.listen(3000,()=>
{
    console.log("serever started on port 3000");
})