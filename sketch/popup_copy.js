

//slider

let slider = document.getElementById('myRange')
let output = document.getElementById('demo')
output.innerHTML = slider.value

slider.oninput = function () {
  output.innerHTML = this.value
}

let setFreq = document.querySelector('.setFreq')
setFreq.addEventListener('click', (e) => {
  let sliderValue = e.target.parentNode.childNodes[1].value
  console.log(sliderValue)
  chrome.storage.local.set({ frequency: sliderValue }, function () {
    // Notify that we saved.
    //also triggers a change in storage
    console.log('freqset')
  })
})

let quizQuestions = []
let file = document.getElementById('filename')
let fileUpload = document.getElementById('upload-csv')
let showName = document.getElementById('name')
let quizScore = document.getElementById('score')
fileUpload.addEventListener('change', () => {
  // reset storage
  chrome.storage.local.clear(function (obj) {
    console.log('cleared')
  })

  var theSplit = fileUpload.value.split('\\')
  let quizName = theSplit[theSplit.length - 1]
  file.innerHTML = quizName
  file.style.background = 'white'
  file.style.color = '#0492ff'

  showName.classList.add('colorText')
  showName.innerText = `Refresh Page to Load Quiz `
  setTimeout(function () {
    showName.classList.remove('colorText')
  }, 2000)

  Papa.parse(fileUpload.files[0], {
    download: true,
    header: true,
    complete: function (results) {
      let quiz = results.data
      let quizQuestions = []
      quiz.forEach((element) => {
        let questions = {}
        let { Question, Correct, ...rest } = element

        if (Question) {
          quizQuestions.push({
            question: Question,
            correctAnswer: Correct,
            answers: rest,
          })
        }
      })
      console.log(quizQuestions)
      //set length varible
      chrome.storage.local.set(
        {
          fileLoaded: quizName,
          quizLength: quizQuestions.length,
          questions: quizQuestions,
        },
        function () {
          // Notify that we saved.
          //also triggers a change in storage
          console.log('file loaded into storage')
        }
      )
      // let params = {
      //   active: true,
      //   currentWindow: true,
      // }
      // get all the tabs with the specifed property
      // chrome.tabs.query(params, gotTabs)

      // function gotTabs(tabs) {
      //   console.log('got tabs')
      //   console.log(tabs)
      //   let message = quizQuestions
      //   console.log(message)
      //   //send message to active tab
      //   chrome.tabs.sendMessage(tabs[0].id, { questions: message })
      // }
    },
  })
})

resetDetails = function () {
  chrome.storage.local.get(
    { score: 0, answeredQuestions: 0, quizLength: 0, fileLoaded: 'NULL' },
    function (items) {
      if (!chrome.runtime.error) {
        console.log(items)

        if (items.fileLoaded != 'NULL') {
          showName.innerText = ` Current Quiz: ${items.fileLoaded}`
        } else {
          showName.innerText = 'Load Your Quiz'
        }
        quizScore.innerText = `${items.score}/${items.quizLength}`
        // if (element.id === 'score') {
        //   element.innerText = `Score: ${items.score}`
        // } else if (element.id === 'corQues') {
        //   element.innerText = `Index of Correct Answers:  ${items.answeredQuestions}`
        //   console.log(items.answeredQuestions)
        // }
      }
    }
  )
}

window.onload = function () {
  // when popup is pressed do this and then force close
  console.log('HEERERRRHIIIIII')

  //find score //kength of question and name oof quiz currently loaded
  //questions remaining
  resetDetails()

  const content = document.querySelector('#reset')
  content.addEventListener('click', () => {
    //Send Message to stop scroll event in conent script
    let params = {
      active: true,
      currentWindow: true,
    }
    // get all the tabs with the specifed property
    chrome.tabs.query(params, gotTabs)

    function gotTabs(tabs) {
      console.log('got tabs')
      console.log(tabs)
      //send message to active tab
      chrome.tabs.sendMessage(tabs[0].id, { stop: 'STOP' })
    }
    chrome.storage.local.clear(function (obj) {
      resetDetails()
      file.style.background = '#0492ff'
      file.style.color = 'white'
      file.innerText = 'Upload Quiz'
      console.log('cleared')
    })
  })

  setTimeout(function () {
    window.close()
  }, 20000)
}

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
