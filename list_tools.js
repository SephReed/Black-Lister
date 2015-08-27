/*HORRIBLY UGLY COPY PASTE from list_tools.js
because javascript can't include without a thousand fucking lines of overhead*/



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



//please copy to modify_css.js, black_list.js, and popup.js for every change.

