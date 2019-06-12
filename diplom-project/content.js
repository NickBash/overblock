var sait = location.hostname;

chrome.runtime.sendMessage({site:sait});
// отправка сообщения на background.js

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: sait});
  });

