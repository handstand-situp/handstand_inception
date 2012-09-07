
/*
 * GET home page.
 */

var redis=require('node-redis'),
	client=redis.createClient();





exports.login=function(req,res){
		if(req.body.username=="admin" && req.body.password=="1234"){
				req.session.username="admin";
				req.session.role="admin";
			
					res.redirect("/users");
			}else(
				client.hmget("hash:user:"+req.body.username,"password","role",function(err,doc){
						if(doc[0]=req.body.password){
								if(doc[1]=="teacher"){
									req.session.username=req.body.username;
									req.session.role="teacher";
									res.redirect("/users/show/students");
								}else{
									res.redirect("/error/login.html");
									}
							}else{
									res.redirect("/error/login.html");
								}
					})
			
			)
	};

exports.list = function(req, res){
	
	if(!req.session.role){
		res.redirect("/logout");
		
		}else{
		
	var users=[];
	var user_data=[];
	var users_record=0;
    	
	function showpage(){
	console.log(user_data.length);
		if(user_data.length==users_record){
			console.log(user_data.length);
            user_data.sort();
            count=0;
          for(var b in  user_data ){
            data=user_data[b].split("~~~");
            var user={};
           count++;
			for(var a in data ){
            user.id=count;
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
							case "5":
								user.role=data[a];
								
								break;
							case "6":
								user.created_at=data[a];
								
								break;
						
						}
					
					}
						users.push(user);
						
				}


			res.render('user/list', { title: '使用者列表',users:users, user_data:user_data });
			}else{
							setTimeout(function(){showpage();},1000);
				}
		}
	client.keys("hash:user:*",function(err,key,value){
		users_record=key.length;
		console.log(users_record);
		key.forEach(function(k,i){
		
	        
			console.log(users_record);
			client.hmget(k,"username","password","email","firstname","lastname","role","created_at",function(err,data){
				var user_info="";
				for(var a in data){
						user_info +=data[a]+"~~~";
						
					}
				    user_data.push(user_info);
				    
				 
				
				});
			
			});
			
			setTimeout(function(){showpage();},1000);
		});
	
	}
};

exports.add=function(req,res){
	if(!req.session.role){
		res.redirect("/logout");
		
		}else{
		
	
  res.render('course/add',{title:'新增課程'});	
  
	}
};

exports.edit=function(req,res){
	
	if(!req.session.role){
		res.redirect("/logout");
	}else{
		
		
	if(req.session.role=="admin"){
	var roles=[{value:"teacher",label:"老師"},{value:"student",label:"學生"}];
		}else{
	var roles=[{value:"student",label:"學生"}];
	}
console.log(req.session);	
	client.hgetall("hash:user:"+req.params.username,function(err,data){
			if(err){
				res.send(err);
				}else{
					var user=[];
					person={}
					for(i=0;i<data.length;i=i+2){
							var key=data[i];
					
							person[key]=data[i+1];
							user.push(person);
						}
						console.log(user);
					res.render('user/edit', { title: '編輯使用者',user:user[0],roles:roles });
	
				}
		
		});
	}
  
};


exports.logout=function(req,res){
		req.session.destroy();
		res.redirect("/");
	
	};

exports.save=function(req,res){
		
	client.sismember("set:users","user:"+req.body.username,function(err, doc){
		if(doc>0){
			res.send("此帳號已存在！");
			}else{
				
	client.hmset("hash:user:"+req.body.username,"username",req.body.username,
	"password",req.body.password,"lastname",req.body.lastname,"email",req.body.email,"role",req.body.role,"firstname",req.body.firstname,"created_at",Math.round((new Date()).getTime()/1000),function(err,result){
			
		
		
		if(err){console.log(err);res.redirect("/");
		
			}else{
				
	
			client.sadd("set:users","user:"+req.body.username,"username");
			client.sadd("set:"+req.body.role+"s","user:"+req.body.username,"username");
			res.redirect("/users");}
		});
				
				
				}
		
		});
	

	
};




exports.show = function(req, res){
	
	if(!req.session.role){
		res.redirect("/logout");
		
		}else{
		
	
	
	var users=[];
	var user_data=[];
	var users_record=0;
    var role=req.params.role;
    console.log(role);
	function showpage(){
	console.log(user_data.length);
		if(user_data.length==users_record){
			console.log(user_data.length);
            user_data.sort();
            count=0;
          for(var b in  user_data ){
            data=user_data[b].split("~~~");
            var user={};
           count++;
			for(var a in data ){
            user.id=count;
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
							case "5":
								user.role=data[a];
								
								break;
							case "6":
								user.created_at=data[a];
								
								break;
						
						}
					
					}
						users.push(user);
						
				}


			res.render('user/list', { title: '使用者列表',users:users, user_data:user_data });
			}else{
							setTimeout(function(){showpage();},1000);
				}
		}
	client.smembers("set:"+role,function(err,key,value){
		console.log(key.length);
		users_record=key.length;
		console.log(users_record);
		key.forEach(function(k,i){
		
	        
			console.log(users_record);
			client.hmget(k,"username","password","email","firstname","lastname","role","created_at",function(err,data){
				var user_info="";
				for(var a in data){
						user_info +=data[a]+"~~~";
						
					}
				    user_data.push(user_info);
				    
				 
				
				});
			
			});
			
			setTimeout(function(){showpage();},1000);
		});
	}
 
};



exports.delete=function(req,res){
	if(!req.session.role){
		res.redirect("/logout");
		
		}else{
		
		client.srem("set:teachers","user:"+req.params.username,"username");
		client.srem("set:students","user:"+req.params.username,"username");
		client.srem("set:users","user:"+req.params.username,"username");
		client.del("hash:user:"+req.params.username,function(err,doc){console.log(err);console.log(doc+req.params.username)});
		res.redirect("/users");
			
		}
	
	
	
	};

exports.update=function(req,res){
		

				
	client.hmset("hash:user:"+req.body.username,
	"password",req.body.password,"lastname",req.body.lastname,"email",req.body.email,"role",req.body.role,"firstname",req.body.firstname,"created_at",Math.round((new Date()).getTime()/1000),function(err,result){
			
		
		
		if(err){console.log(err);res.redirect("/");
		
			}else{
				client.srem("set:teachers","user:"+req.body.username,"username");
				client.srem("set:students","user:"+req.body.username,"username");
				
				client.sadd("set:"+req.body.role+"s","user:"+req.body.username,"username");
		
			res.redirect("/users");}
		});
				
				
		
	
};

