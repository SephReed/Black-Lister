//Scott Jaromin Copywrite
//January 2014
//This code retrieves the color codes for specific parts and them applies
//them to all elements listed under that part in elements_and_settings.json

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
    if(target != -1)  {  list.splice(target, 1);   return true;  }
    return false;
}   
///---------------------------------------------------------------





var black_list;
var a_list;


chrome.storage.local.get('black_list', function(result){
    if(result.black_list != null)  {  
        black_list = result.black_list;  }
    else {  black_list = [];  }

    if(findMatchingLinkIndex(document.URL, black_list) != -1) {
        nukePage();
    }

    applyList(black_list, "bad_link");
});


chrome.storage.local.get('a_list', function(result){
    if(result.a_list != null)  {  
        a_list = result.a_list;  }
    else {  a_list = [];  }

    applyList(a_list, "good_link");
});


function applyList(list, className)  {
    // chrome.tabs.getSelected(null,function(tab) {
    console.log(list);

    var current_site = document.URL;
    removeMatchingLink(current_site, list);


    var my_body_is_ready = setInterval(function(){
            //
        var body = document.getElementsByTagName('body');
        if(body != undefined)
        {
            clearInterval(my_body_is_ready);

            var target = document.querySelector('body');

            modLinks(target, list, className);

            var observer = new WebKitMutationObserver(function(mutations) {
                mutations.forEach ( function (mutation) {
                    // console.log(mutation.target.nodeName)
                    // if(mutation.target.nod)
                    var newNodes = mutation.addedNodes;
                    
                    for(var i = 0; i < newNodes.length; i++) {
                        if(newNodes[i].nodeName.charAt(0) != "#")  {
                            // console.log(newNodes[i].nodeName.charAt(0));
                            modLinks(newNodes[i], list, className);

                    }   }
                });
            });


            var config = { childList: true, subtree: true };
            observer.observe(target, config);

        }
    }, 50);
}











function modLinks(nodeTree, list, className) {
        //
    var links = nodeTree.getElementsByTagName('a');

    if(links != undefined)  {
        for(var i = 0; i < links.length; i++)  {
            var link = links[i];

            for(var j = 0; j < list.length; j++) {
                    //
                if(link.href.indexOf(list[j].url) != -1) {
                    link.className = link.className + " " +className;
                    j = list.length;
                }
            }
        }
    }
}





function nukePage()  {
    console.log("hi");
    var nuke = document.createElement('div');
    nuke.id = "nuke_overlay";

    var nukeImage = document.createElement('div');
    nukeImage.id = "nuke_image";

    var blammedText = document.createElement('div');
    blammedText.id = "page_blammed_textbox";
    blammedText.innerHTML = "BLAMMED!<br>You should probably go to a different site<br>";
    // blammedText.innerHTML += "<input type = 'button' value = 'View Anyways' onClick = 'clearNuke()'>";

    var viewAnyways = document.createElement('button');
    viewAnyways.id = "view_anyways";
    viewAnyways.innerHTML = "View Anyways";
    // viewAnyways.onClick = clearNuke;

    nuke.appendChild(nukeImage);
    nuke.appendChild(blammedText);
    blammedText.appendChild(viewAnyways);

    var body = document.body;
    body.insertBefore(nuke, body.firstChild);


    var buttons = nuke.getElementsByTagName("BUTTON");
    buttons[0].onclick = function() {  clearNuke();  }
}


function clearNuke() {  
    var nuke = document.getElementById("nuke_overlay");  
    nuke.parentNode.removeChild(nuke);
}



chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    console.log(request.updateBlam);
    if (request.updateBlam == true) {  
        nukePage();  }
    else if (request.updateBlam == false) {  
        clearNuke();  }
});















