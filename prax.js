const fs = require('fs') 
var list=[];
  
// Reading data in utf-8 format 
// which is a type of character set. 
// Instead of 'utf-8' it can be  
// other character set also like 'ascii' 
fs.readFile('textcap2.txt', 'utf-8', function(err,data){
	if(err){
		console.log(err);
	}
	else{
		// var g="";
		// g+="m"
		var y="";
		var p=0;
		for(var g=0;g<data.length;g++){
			if(data[g]==="m"){
				y+=data[g];
				list[p]=y;
				p++;
				y="";
				g++;
			}
			y+=data[g];
		}
		//console.log(g);

		 for(var f=0;f<list.length;f++){
		 	console.log(list[f]);
		 }
		//console.log(list[25]);

		//console.log(data[32]);
	}
});


