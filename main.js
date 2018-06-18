javascript: (function (e, s) {
    e.src = s;
    e.onload = function () {
        jQuery.noConflict();
        console.log('jQuery injected');
    };
    document.head.appendChild(e);
})(document.createElement('script'), '//code.jquery.com/jquery-latest.min.js')

document.body.outerHTML = document.body.outerHTML //removes all event listeners that might interfere with 'click link' listener that interrupts redirects outside of current page 


window.onclick = function (e) { //https://jsfiddle.net/hnmdijkema/nn5akf3b/6/ adds event listener that stops page redirection
    var node = e.target;
    while (node != undefined && node.localName != 'a') {
        node = node.parentNode;
    }
    if (node != undefined) {
        alert('Link!: ' + node.href);
        /* Your link handler here */
        return false;  // stop handling the click
    } else {
        //   alert('This is not a link: ' + e.target.innerHTML)
        //   return true;  // handle other clicks
    }
}
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function getPathTo(element) {
    if (element.tagName == 'HTML')
        return '/HTML[1]';
    if (element === document.body)
        return '/HTML[1]/BODY[1]';

    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element)
            return getPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
            ix++;
    }
}

var insertedData;
var pageObjectClass = window.open("");
var capturedIDs = [];
var savedProperties = [];
var down = [];
var on = false;
var recording = false;
function generatePageObject() {
    jQuery(document).ready(function ($) {
        $(document.body).keydown(function (e) {
            down[e.keyCode] = true;
        }).keyup(function (e) {
            if (down[18] && down[80]) {
                if (on == false) {
                    on = true;
                    document.body.addEventListener("click", function creatingAttributes(event) {
                        var format;
                        var id;
                        if (event.path[0].id.length != 0) {
                            id = "(: ,id: " + "'" + event.path[0].id + "'" + ")"
                        }
                        else {
                            id = "(: ,xpath: " + "'" + getPathTo(event.path[0]) + "'" + ")"
                        }

                        if (capturedIDs.includes(id)) {
                            format = "already contained!"
                        }
                        else {

                            if (event.path[0].tagName == "H1") {
                                format = "doesnt matter"
                            }
                            else if (event.path[0].tagName == "BUTTON" || event.path[0].tagName == "INPUT" && event.path[0].type == "submit") {
                                format = "button" + id
                            }
                            else if (event.path[0].tagName == "INPUT" && event.path[0].type == "checbox") {
                                format = "checkbox" + id
                            }
                            else if (event.path[0].tagName == "INPUT" && event.path[0].type == "text") {
                                format = "text_field" + id
                            }
                            else if (event.path[0].tagName == "INPUT" && event.path[0].type == "radio") {
                                format = "radio" + id
                            }
                            else if (event.path[0].tagName = "SELECT") {
                                format = "select_list" + id
                            }
                            else if (event.path[0].tagName = "A") {
                                format = "link" + id
                            }
                            else {
                                format = 'truly does not matter'
                            }
                        }

                        if (format != "already contained!") {
                            var property = window.prompt(event.path[0].outerHTML, format);
                        }

                        if (property != null) {
                            pageObjectClass.document.write("<br>" + property + "<br>");
                            capturedIDs.push(id)
                            savedProperties.push(property)
                        }
                    })
                }
                else {
                    on = false;
                    document.body.outerHTML = document.body.outerHTML
                    generatePageObject()
                }
            }

            if (down[18] && down[82]) {
                on = false;
                var functionName = window.prompt('Enter your method name', "def ")
                if (functionName != null) {
                    pageObjectClass.document.write("<br>" + functionName + "<br>")
                }
                
                if (recording == false) {
                    recording = true;
                    document.body.addEventListener("click", function recordingMethods(event) {
                        var recordingId;
                        if (event.path[0].id.length != 0) {
                            recordingId = "(: ,id: " + "'" + event.path[0].id + "'" + ")"
                        }
                        else {
                            recordingId = "(: ,xpath: " + "'" + getPathTo(event.path[0]) + "'" + ")"
                        }
                        console.log(recordingId)

                        function observeValue() {
                            insertedData = this.value
                        }

                        var pos = 0;
                        console.log('captured ids includes recording id?' + capturedIDs.includes(recordingId))
                        if (capturedIDs.includes(recordingId)) {
                            event.path[0].addEventListener('change', observeValue)
                            for (var x = 0; x < savedProperties.length; x++) {
                                if (savedProperties[x].split("'")[1].indexOf(recordingId.split("'")[1]) > -1) {
                                    console.log(recordingId + 'found at' + x);
                                    pos = x
                                }
                            }
                            var focusedProperty = savedProperties[pos].split('(:')[1].split(',')[0]
                            if (insertedData != undefined) {
                                pageObjectClass.document.write('<br>' + '&ensp; self.' + focusedProperty + " = '" + insertedData + "'" + "<br>")
                                insertedData = undefined
                            }
                        }
                    })
                }
                else {
                    recording = false;
                    document.body.outerHTML = document.body.outerHTML
                    generatePageObject()
                }
            }
            down[e.keyCode] = false;
        });
    })
};

generatePageObject()



