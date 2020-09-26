// // // Wordnik API key

let quizQuestions = []
let btn_upload = document
  .getElementById('btn-upload-csv')
  .addEventListener('onchange', () => {
    console.log('here')
    Papa.parse(document.getElementById('upload-csv').files[0], {
      download: true,
      header: true,
      complete: function (results) {
        let quiz = results.data
        let quizQuestions = []
        quiz.forEach((element) => {
          let questions = {}
          let { question, correct, ...rest } = element

          if (question) {
            quizQuestions.push({
              question: question,
              correctAnswer: correct,
              answers: rest,
            })
          }
        })
        console.log(quizQuestions)

        let params = {
          active: true,
          currentWindow: true,
        }
        // get all the tabs with the specifed property
        chrome.tabs.query(params, gotTabs)

        function gotTabs(tabs) {
          console.log('got tabs')
          console.log(tabs)
          let message = quizQuestions
          console.log(message)
          //send message to active tab
          chrome.tabs.sendMessage(tabs[0].id, message)
        }
      },
    })
  })

// const form = document.getElementById('myForm')
// const newContent = document.getElementById('myInput')

// form.addEventListener('submit', (e) => {
//   e.preventDefault()

//   let params = {
//     active: true,
//     currentWindow: true,
//   }
//   // get all the tabs with the specifed property
//   chrome.tabs.query(params, gotTabs)

//   function gotTabs(tabs) {
//     console.log('got tabs')
//     console.log(tabs)
//     let message = newContent.value
//     console.log(message)
//     //send message to active tab
//     chrome.tabs.sendMessage(tabs[0].id, message)
//   }

//   // send conent as message to content script
// })

document.body.onload = function () {
  console.log(document.querySelector('.content'))

  const content = document.querySelector('#title')
  content.addEventListener('click', () => {
    chrome.storage.sync.clear(function (obj) {
      console.log('cleared')
    })
  })
}

const report = document.querySelector('#report')
report.addEventListener('click', (e) => {
  const element = e.target

  chrome.storage.sync.get(['score', 'answeredQuestions'], function (items) {
    if (!chrome.runtime.error) {
      console.log(items)
      if (element.id === 'score') {
        element.innerText = `Score: ${items.score}`
      } else if (element.id === 'corQues') {
        element.innerText = `Index of Correct Answers:  ${items.answeredQuestions}`
        console.log(items.answeredQuestions)
      }
    }
  })
})

// chrome.storage.sync.set({ score: 7 }, function () {
//   // Notify that we saved.
//   //also triggers a change in storage
//   console.log('score saved')
// })

// because listener runs before page is loaded?
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key]
    console.log(
      'Storage key "%s" in namespace "%s" changed. ' +
        'Old value was "%s", new value is "%s".',
      key, // can filter changes by key
      namespace,
      storageChange.oldValue,
      storageChange.newValue
    )
  }
})

// return Progress report in html popup:
// - score
// - what subject of quiz isFinite( future)
// - last answer before page reloads
//make font bigger
