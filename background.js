console.log('background script ')


chrome.runtime.onMessage.addListener(reciever)

//let is not global
function reciever(request, sender, sendResponse) {
  console.log(request)
  window.word = request.text
}
