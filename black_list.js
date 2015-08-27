///---------Include list_tools.js------------------------------
function Link(url)  {
   this.url = url;
   this.hits = 0;
}


function findMatchingLink(url, list) {
    var target = findMatchingLinkIndex(url, list);
    if(target != -1)  {  return list[target];  }
    else return null;
}   

function findMatchingLinkIndex(url, list) {
    if(list == null)  { return -1; }
    
    for (var i = 0; i < list.length; i++)  {
        if (url.indexOf(list[i].url) != -1) {
            return i;  }
    }   
    return -1;
} 



//specialized
function removeMatchingLink(url, list) {
    // var target = findMatchingLinkIndex(url, list);
    // if(target != -1)  {  list.splice(target, 1);   }


    if(list == null)  { return false; }
    
    for (var i = 0; i < list.length; i++)  {
        if (url == list[i].url) {
            list.splice(i, 1);  
            return true;
        }
    }   
    return false;


}   
///---------------------------------------------------------------



var black_btn;
var a_btn;

window.onload = function(e){ 
    black_btn = document.getElementById("black_list_btn");
    black_btn.onclick = function() {
    	console.log("hey");
    	black_btn.className = "button_on";
    	a_btn.className = "";
    	document.getElementById("the_a_list").style.display = "none";
    	document.getElementById("the_black_list").style.display = "block";
    }

    a_btn = document.getElementById("a_list_btn");
    a_btn.onclick = function() {
    	console.log("hey");
    	a_btn.className = "button_on";
    	black_btn.className = "";
    	document.getElementById("the_a_list").style.display = "block";
    	document.getElementById("the_black_list").style.display = "none";
    }

    document.getElementById('blam_add_me').onkeypress=function(e){
    	console.log("HEYHE");
	    if(e.keyCode==13){
	        document.getElementById('blam_add_item').click();
	    }
	}

	var addBtn = document.getElementById("blam_add_item");
		addBtn.onclick = function()  {
		
		var add_me_input = document.getElementById("blam_add_me");
		var url = add_me_input.value;
		var link = new Link(url);  
        black_list.push(link);

		chrome.storage.local.set({ 'black_list' : black_list  }, function() {}); 

		addItem(url, black_list);
	}

	document.getElementById('highlight_add_me').onkeypress=function(e){
	    if(e.keyCode==13){
	        document.getElementById('highlight_add_item').click();
	    }
	}

	var addBtn = document.getElementById("highlight_add_item");
		addBtn.onclick = function()  {
		
		var add_me_input = document.getElementById("highlight_add_me");
		var url = add_me_input.value;
		var link = new Link(url);  
        a_list.push(link);

		chrome.storage.local.set({ 'a_list' : a_list  }, function() {}); 

		addItem(url, a_list);
	}
}








var black_list;
chrome.storage.local.get('black_list', function(result)  {
	black_list = result.black_list;
	displayList(black_list);
});


var a_list;
chrome.storage.local.get('a_list', function(result)  {
	a_list = result.a_list;
	displayList(a_list);
});



function displayList(list)  {
	for(var i = 0; i < list.length; i++)  {
		var url = list[i].url;
		addItem(url, list);
	}
}







function addItem(url, list) {
	var item = document.createElement("DIV");
	item.name = url;

	var button = document.createElement("BUTTON");
	button.innerHTML = "-";
	button.name = url;
	button.className = "unblock_item";

	item.appendChild(button);

	var span = document.createElement("SPAN");
	span.innerHTML = url;

	if(list == a_list)  {
		span.className = "good_link";  }

	item.appendChild(span);

	item.innerHTML += "<br>";

	if(list == black_list) {
		var add_me = document.getElementById("blam_add_me");
		add_me.parentNode.insertBefore(item, add_me.nextSibling);  }
	else if(list == a_list) {
		var add_me = document.getElementById("highlight_add_me");
		add_me.parentNode.insertBefore(item, add_me.nextSibling);  }

	var buttons = item.getElementsByTagName("BUTTON");
	buttons[0].onclick = function() {
		var link = this.name;

		console.log(link);

		removeMatchingLink(link, list); 	
		if(list == black_list) {
			chrome.storage.local.set({ 'black_list' : list  }, function() {});  }
		if(list == a_list) {
			chrome.storage.local.set({ 'a_list' : list  }, function() {});  }

        var container = this.parentNode;
        container.parentNode.removeChild(container);
    
	}
}


















