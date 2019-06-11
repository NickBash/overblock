var sait = location.hostname;
let sait1 = sait.toString();

chrome.runtime.sendMessage({site:sait});
// отправка сообщения на background.js

chrome.untime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: sait});
  });

// document.body.innerHTML = `<h3 id="sc1" style="text-align: center" class="text_y">Нежелательное ПО!</h3>`
