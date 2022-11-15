!(function () {
  "use strict";
  var n,
    o,
    i = null !== (n = chrome.action) && void 0 !== n ? n : chrome.browserAction;
  null === i ||
    void 0 === i ||
    null === (o = i.onClicked) ||
    void 0 === o ||
    o.addListener(function () {
      chrome.runtime.openOptionsPage();
    });
})();
