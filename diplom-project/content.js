var sait = location.hostname;

chrome.runtime.sendMessage({site:sait}); // отправка сообщения на background.js


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
