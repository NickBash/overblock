var sait = location.hostname;
let sait1 = sait.toString();

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

// document.body.innerHTML = `<h3 id="sc1" style="text-align: center" class="text_y">Нежелательное ПО!</h3>`

// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name == "address");
//   port.onMessage.addListener(function(msg) {
//     if (msg.joke == "url")
//       port.postMessage({url: sait});
//   });
// });




//window.onfocus = onFocus; // если окно приобретает фокус
// function sec() //выполняется каждую секунду
// {
//   if(document.webkitVisibilityState == 'visible')//если страница активна
//   {
//     localStorage[sait] =  parseInt(localStorage[sait],10) +1; // обновляем данные о сайте в локальном хранилище
//   }
// }
 // на каком сайте находится скрипт
// localStorage[sait] = '0';
// setInterval(sec, 1000);
