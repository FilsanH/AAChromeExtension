//slider
let sliderContainer = document.getElementById('sliderContainer')
let slider = document.getElementById('myRange')
let output = document.getElementById('demo')

slider.oninput = function () {
  if (this.value == 1) {
    output.textContent = 'Very Often'
  } else if (this.value == 11) {
    output.textContent = 'Less Often'
  } else if (this.value == 21) {
    output.textContent = 'Not Very Often'
  }
  // let sliderValue = e.target.parentNode.childNodes[3].value
  // console.log(sliderValue)
  chrome.storage.local.set({ frequency: this.value }, function () {
    // Notify that we saved.
    //also triggers a change in storage
    console.log('freqset')
    //change view
    // setFreq.disabled = true
  })
}

// let setFreq = document.querySelector('.setFreq')
// setFreq.addEventListener('click', (e) => {
//   let sliderValue = e.target.parentNode.childNodes[3].value
//   console.log(sliderValue)
//   chrome.storage.local.set({ frequency: sliderValue }, function () {
//     // Notify that we saved.
//     //also triggers a change in storage
//     console.log('freqset')
//     //change view
//     slider.disabled = true
//     setFreq.disabled = true
//     setFreq.textContent = 'Frequency Set'
//   })
// })

let quizQuestions = []
let template1 = document.querySelector('#template1')
let template2 = document.querySelector('#template2')
let fileHolder = document.getElementById('fileHolder')
let file = document.getElementById('filename')
let fileUpload = document.getElementById('upload-csv')
let showName = document.getElementById('name')
let quizScore = document.getElementById('score')
let browse = document.getElementById('btn-upload-csv')
fileUpload.addEventListener('change', () => {
  console.log('here')
  // reset storage
  chrome.storage.local.clear(function (obj) {
    console.log('cleared')
  })
  // disable browse button
  fileUpload.disabled = true
  browse.classList.add('disable')
  // browse.textContent = 'Done'
  var theSplit = fileUpload.value.split('\\')
  let quizName = theSplit[theSplit.length - 1]
  file.innerHTML = quizName
  file.style.background = 'white'
  file.style.color = '#0492ff'

  //disable slider
  // slider.disabled = true
  // console.log(sliderContainer)

  showName.classList.add('colorText')
  showName.innerText = `Refreshing Page to Load Quiz `

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
      //disable button to avoid glitch
      // randomise the questions
      const getShuffledArr = (arr) => {
        const newArr = arr.slice()
        for (let i = newArr.length - 1; i > 0; i--) {
          const rand = Math.floor(Math.random() * (i + 1))
          ;[newArr[i], newArr[rand]] = [newArr[rand], newArr[i]]
        }
        return newArr
      }

      quizQuestions = getShuffledArr(quizQuestions)
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

      setTimeout(function () {
        showName.classList.remove('colorText')
        //refresh page
        chrome.tabs.reload()
        //refresh popup
        window.close()
      }, 2000)
    },
  })
})

resetDetails = function () {
  chrome.storage.local.get(
    {
      score: 0,
      answeredQuestions: 0,
      quizLength: 0,
      fileLoaded: 'NULL',
      frequency: 3,
    },
    function (items) {
      if (!chrome.runtime.error) {
        console.log(items)

        if (items.fileLoaded != 'NULL') {
          showName.innerText = ` Current Quiz: ${items.fileLoaded}`
          // disable browse button
          fileUpload.disabled = true
          browse.classList.add('disable')
          //remove useless stuff
          sliderContainer.classList.add('disappear')
          fileHolder.classList.add('disappear')
          template1.classList.add('disappear')
          template2.classList.add('disappear')

          // browse.textContent = 'Done'
          file.innerText = `${items.fileLoaded}`
          file.style.background = 'white'
          file.style.color = '#1D2368'

          // for case when default frequncy taken
          // setFreq.classList.add('disable')
          slider.disabled = true
          // setFreq.disabled = true
          // setFreq.textContent = 'Frequency Set'
          // if (items.frequency == 1) {
          //   output.textContent = 'Very Often'
          // } else if (this.value == 11) {
          //   output.textContent = 'Less Often'
          // } else if (this.value == 21) {
          //   output.textContent = 'Not Very Often'
          // }
        } else {
          showName.innerText = 'Load Your Quiz'

          fileUpload.disabled = false
          browse.classList.remove('disable')
          sliderContainer.classList.remove('disappear')
          fileHolder.classList.remove('disappear')
          template1.classList.remove('disappear')
          template2.classList.remove('disappear')

          // setFreq.classList.remove('disable')
          slider.disabled = false
          // setFreq.disabled = false

          // setFreq.textContent = 'CLick to Set'
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
      file.style.background = '#1D2368'
      file.style.color = 'white'
      file.innerText = 'Upload Quiz'
      console.log('cleared')
    })
  })

  //Automatically close popup

  // setTimeout(function () {
  //   window.close()
  // }, 20000)
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
