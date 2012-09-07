
/*
 * GET home page.
 */

var redis=require('node-redis'),
	client=redis.createClient();


module.exports.login=function(username,password,callback){
		if(username=="admin" && password=="1234"){
				req.session.username="admin";
				req.session.role="admin";
				callback("admin");
			}else(
				client.hmget("teacher:"+username,"password",function(err,doc){
						if(doc==password){
								req.session.username=username;
								req.session.role="teacher";
								callback("teacher");
							}else{
									callback(null);
								}
					})
			
			)
	};

module.exports.list = function(req, res,callback){
	users=[];
	var users_record=0;
	
	function showpage(){
	
		if(users.length==users_record){
	
			callback(users);
			}
		}
	client.keys("teacher:*",function(err,key,value){
		users_record=key.length;
		key.forEach(function(k,i){
			var user={};
			console.log(users_record);
			client.hmget(k,"username","password","email","firstname","lastname",function(err,data){
		
				for(var a in data){
						switch(a){
							case "0":
								user.username=data[a];
								break;
							case "1":
								user.password=data[a];
								break;
							case "2":
								user.email=data[a];
								break;
							case "3":
								user.firstname=data[a];
								break;
							case "4":
								user.lastname=data[a];
								break;
						
						}
					}
			
				
				 users.push(user);
				 showpage();
				});
			
			});
			
		});
	
 
};

module.exports.add=function(req,res,callback){
	var roles=[{value:"teacher",label:"老師"},{value:"student",label:"學生"}];
	callback(roles);
};

module.exports.save=function(req,res,callback){
		
	client.sismember("teachers","teacher:"+req.body.username,function(err, doc){
		if(doc>0){
			callback("error:帳號已存在");
			}else{
				
	client.hmset("teacher:"+req.body.username,"username",req.body.username,
	"password",req.body.password,"lastname",req.body.lastname,"email",req.body.email,function(err,result){
			
		
				
				if(err){
					callback(null);
				
				}else{
				
					client.sadd("teachers","teacher:"+req.body.username,"username");
					callback("success");
				}
		});
				
				
				}
		
		});
	

	
};
