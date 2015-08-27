
window.addEventListener("load", init, false);


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


function removeMatchingLink(url, list) {
    var target = findMatchingLinkIndex(url, list);
    if(target != -1)  {  list.splice(target, 1);   }
}   
///---------------------------------------------------------------





function Button(id, offText, onText, sublistName)  {
    this.id = id;
    this.onText = onText;
    this.offText = offText;
    this.sublistName = sublistName;
    this.sublist = null;   
    this.element = null;
}


var blamButton = new Button("blam", "BLAM IT!", "UNBLAM IT", "black_list");
var highlightButton = new Button("highlight", "Highlight Site", "Unhighlight Site", "a_list");


// var black_list;
// var blam;
var current_site

function init() {
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
        current_site = arrayOfTabs[0].url;


        chrome.storage.local.get('black_list', function(result){
            if(result.black_list != null)  {  blamButton.sublist = result.black_list;  }
            else {  blamButton.sublist = [];  }

            initButton(blamButton);
        });


        chrome.storage.local.get('a_list', function(result){
            if(result.a_list != null)  {  highlightButton.sublist = result.a_list;  }
            else {  highlightButton.sublist = [];  }

            initButton(highlightButton);
        });
      
    });

    var ln = document.getElementById("title_bar");
    var location = ln.href;
    ln.onclick = function () {  
        chrome.tabs.create({active: true, url: location});  };
}


function initButton(button)  {
    button.element = document.getElementById(button.id);

    updateButton(button, false);
    button.element.onclick = function()  {
        updateButton(button, true);  }
}



function updateButton(button, withFlip)  {
    var linkIndex = findMatchingLinkIndex(current_site, button.sublist);
    console.log(linkIndex);

    var buttonOn = (linkIndex != -1);
    
    if(withFlip == true) {
        if(buttonOn == false)  {
            var link = new Link(getSiteName(current_site));  
            button.sublist.push(link);
        }
        else {  button.sublist.splice(linkIndex, 1);  }

        buttonOn = !buttonOn;

        if(button.sublistName == "black_list")  {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {updateBlam: buttonOn}, function(response) {});
            });
            chrome.storage.local.set({ 'black_list' : button.sublist  }, function() {});   }
        else {
            chrome.storage.local.set({ 'a_list' : button.sublist  }, function() {});   }  
    }

    if(buttonOn == true)  {
        button.element.className = "engaged_button";
        button.element.innerHTML = button.onText;  }
    else  {
        button.element.className = "";
        button.element.innerHTML = button.offText;  }
}






var tlds = [".com", ".net", ".org", ".biz", ".name", ".info", ".edu", ".gov", ".ag"];
function getSiteName(url)  {
    console.log(url);
    for (var i = 0; i < tlds.length; i++) {
        var target = url.indexOf(tlds[i]);
        if(target != -1)  {
            var output = url.substring(0, target+tlds[i].length);
            console.log("lalal");
            return output;
        }
    }
    return url;
}






