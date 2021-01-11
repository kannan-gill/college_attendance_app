var bodyParser=require("body-parser");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");
var mongoose=require("mongoose");
var express=require("express");
var app=express();

var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});



var passportLocalMongoose=require("passport-local-mongoose");
var UserSchema=new mongoose.Schema({
   username:String,
   password:String
});

UserSchema.plugin(passportLocalMongoose);
 //var Campground=mongoose.model("Campground",campgroundSchema);
var User=mongoose.model("User",UserSchema);

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("your mongodb link")
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
//app.use(express.static("public")); //to access css in public folder later on 
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var attendanceSchema=new mongoose.Schema({
    Name:String,
    RFid:String,
    SID:Number,
    Branch:String,
    COA:Number,
    AC:Number,
    WC:Number,
    ES:Number,
    Attendance:Number,
    COAtime:[],
    EStime:[],
    ACtime:[],
    WCtime:[]
  //  created:{type:Date,default:Date.now}
});

var Att=mongoose.model("Blog",attendanceSchema);

app.get("/",function(req,res){
   res.render("index"); 
});

app.get("/attendance",isLoggedIn,function(req,res){
  res.render("subjects");
});

app.get("/attendance/subjects/:id",isLoggedIn,function(req,res){
    var f=req.params.id;
     Att.find({},function(err,students){
      if(err){
          console.log(err);
      } 
      else{
          console.log(students);
          res.render("attendance",{students:students,sub:f});
      }
   }); 
});

app.post("/attendance",function(req,res){
   var name=req.body.name; 
   var rfid=req.body.rfid;
   var sid=req.body.sid;
   var branch=req.body.branch;
   var coa=0;
   var es=0;
   var wc=0;
   var ac=0;
   var coatime=[];
   var estime=[];
   var actime=[];
   var wctime=[];
   var newStudent={Name:name,RFid:rfid,SID:sid,Branch:branch,COA:coa,ES:es,WC:wc,AC:ac,COAtime:coatime,EStime:estime,ACtime:actime,WCtime:wctime};
   Att.create(newStudent,function(err,student){
      if(err){
          console.log(err);
      } 
      else{
          console.log(student);
          res.redirect("/");
      }
   });
});

//===

// var t=0;
// Att.find({Ini:"K"},function(err,student){
//   if(err){
//       console.log(err);
//   } 
//   else{
//       t=student[0].Attendance;
//       Att.updateOne({Ini:"K"}, {$set: { Attendance: t+1}}, function (err, user) {
//             if (err) {
//                 console.log(err);
//             }
//             // console.log(user);
//             // console.log("update user complete")
//             });

//      // console.log(t);
//   }
// });

//==


// Att.remove({},function(err){
//     if(err){
//          console.log("removed"); 
//     }
  
// });

app.get("/attendance/:id/:sub",isLoggedIn,function(req,res){
   var t=req.params.id;
   var g=req.params.sub;
   Att.find({_id:t},function(err,student){
      if(err){
          console.log(err);
      } 
      else{
          res.render("timestamp",{student:student,sub:g});
      }
   });
});


app.get("/register",function(req,res){
   res.render("registerform"); 
});

app.get("/signup",function(req,res){
   res.render("signup"); 
});

app.post("/signup",function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
       if(err){
           return res.render("index");
       } 
       else{
           passport.authenticate("local")(req,res,function(){
                res.redirect("/");
           });
       }
    });
    
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",
    {
        successRedirect:"/",
        failureRedirect:"/login",
    }),function(req,res){});
    
app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/");
});

app.get("/getatten",isLoggedIn,function(req,res){
    res.redirect("/attendance");
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
   return next();   
  }
  else{
      res.redirect("/login");
  }
};


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});