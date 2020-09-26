console.log('hello from chrome extension')

//setUP:

// check if quiz has been cleared:

chrome.runtime.onMessage.addListener((message, sender, sendRequest) => {
  console.log(message)
  if (message.stop) {
    console.log('STOPPPPPPPPPPPPPPPPPPPPPPPPPPP')
    // define new my_question and set as quiz
    window.removeEventListener('scroll', controlFeed, true)
  }
})

let myQuestions
chrome.storage.local.get(
  {
    score: 'NULL',
    questions: 'NULL',
    answeredQuestions: 'NULL',
    fileLoaded: 'NULL',
    frequency: 3,
  },
  function (quiz) {
    if (!chrome.runtime.error) {
      console.log(quiz)
      n = quiz.frequency
      console.log(`FREQUENCY IS ${n}`)
      if (quiz.fileLoaded == 'NULL') {
        console.log('QUIZZ IS NOT SET STOP FEED BUT WAIT FOR INPUT')
        //Stop scroll event but continue to listen out for quiz questions
        // let quizQuestions
        // chrome.runtime.onMessage.addListener(gotMessaage)

        // function gotMessaage(message, sender, sendRequest) {
        //   console.log(message)
        //   if (message.questions) {
        //     quizQuestions = message.questions
        //     console.log('QUIZZZ QUESTIONS SETT')
        //     // define new my_question and set as quiz
        //     chrome.storage.local.set({ questions: quizQuestions }, function () {
        //       console.log('myquestion SET as quiz')
        //       myQuestions = quizQuestions
        //     })
        //   }
      } else {
        console.log('quizz set to something')
        myQuestions = quiz.questions
        // start my_question as quiz
        // UPDATE quiz based on correct answers
        // remove elementa of myQuestion with these indecies
        if (quiz.answeredQuestions) {
          myQuestions = myQuestions.filter(
            (el, index) => !quiz.answeredQuestions.includes(index)
          )
        }
        //update quiz questions
        chrome.storage.local.set({ questions: myQuestions }, function () {
          console.log('Quiz has been updated')
        })
        // always remove tracked questoions on page reload
        chrome.storage.local.remove(['answeredQuestions'], function (obj) {
          console.log('list of answered question removed')
        })
        window.addEventListener('scroll', controlFeed, true)
      }
      console.log(quiz)
    }
  }
)
// chrome.storage.sync.set(('Quiz': myQuestions))
// runs once at the beginning

//feed post html:

//track liked and unliked posts by looking at the legnth of the nodelist doesnt work
var liked_list = document.querySelectorAll('[aria-label="Remove Like"]')
var unliked_list = document.querySelectorAll('[aria-label="Like"]')

const feed = document.querySelector('[role = "feed"]')
// only for the new facebook because has data-pagelet
let feedContent = document.querySelectorAll('[data-pagelet^="FeedUnit_"]') // with specific prefix
let feedLength = feedContent.length
let three = 0
let oldThree
// while scrolling
console.log(`Start feedcontent ${feedContent}`)

//setup frequency
let n
let cum = 0
let pointer
function controlFeed() {
  feedContent = document.querySelectorAll('[data-pagelet^="FeedUnit_"]') // with specific prefix
  newFeedLength = feedContent.length
  //number three post something add three wait until
  //console.log(newFeedLength)
  //check if feed content id greater than three n if so add 3 to n
  let difference

  if (feedLength < newFeedLength) {
    //new content added to feed
    console.log(`new ${newFeedLength}`)
    console.log(` old ${feedLength}`)
    difference = newFeedLength - feedLength //amount loaded
    //else do maths based on difference
    //assume no significant change at the begin so posts can still be seen
    console.log(cum)
    cum = cum + difference
    console.log(difference)
    console.log(`score is ${cum}`)
    if (cum > n) {
      // when differnece is signifcant
      console.log('CONTENT HAS BEEEEN INSERTED ')
      times = Math.floor(cum / n)
      // if (!pointer) {
      //   pointer = feedLength
      // }
      for (i = 0; i < times; i++) {
        insertContent(feedLength + n * i, feedContent)
        console.log(`insert content: ${feedLength + n * i}`)
      }
      cum = 0
      // use pointer to keep track of last place content was added into
    } else if (cum < n) {
      console.log('FALSE')
    }
    feedLength = newFeedLength
  } else {
    console.log('heeeeeeeeeeeeeeeeeeerrrrrrrrrrrrrrrreeeeeeeeeeeeeeeeeeeeeee')
    // keep track of cumlative difference
  }
  //console.log('scrolling')
}

//variables for insert content:

let answerGiven
let check
let count = 0
// fucntion to add data to feed

function insertContent(num, feedContent) {
  // adjust content
  let params = `INSERT CONTENT HERE ${num}`
  // message is recieved once?

  let simpleContent = `
    

      <div class="quiz-container">
        <div class="quiz"></div>
      </div>
      <div id="results"></div>
      
   
`

  console.log(`COUNT IS ${count}`)
  if (count <= myQuestions.length - 1) {
    // need to add DOM event listeners here
    let question = feedContent[num].insertAdjacentHTML(
      'afterend',
      simpleContent
    )
    console.log('hello')

    // Variables

    let insertedElement = feedContent[num].nextSibling.nextElementSibling // finds the whole thing next sibling doesnt
    const quizContainer = insertedElement.querySelector('.quiz')
    //const nextButton = insertedElement.querySelector('#next')
    //nextButton.addEventListener('click', showNextQuestion)

    // count < myQuestions.length - 1 ? count++ : (count = 0)
    // Stop inserting content when questions have finished

    //function showNextQuestion() {
    // variable to store the HTML output

    const answers = []
    let index = 0
    // and for each available answer...
    for (letter in myQuestions[count].answers) {
      // ...add an HTML radio button
      console.log(letter)
      answers.push(
        `    
        <li class = "list" >
    <input type="radio" id="question${count}${index}" name="question${count}" value="${letter}">
    <label class="labels" for="question${count}${index}"> <strong> ${letter} : </strong>
              ${myQuestions[count].answers[letter]}</label>
    
    <div class="check"></div>
  </li>`
      )
      index++
    }

    const output = []
    // for each question...
    ///myQuestions.forEach((currentQuestion, questionNumber) => {
    // add this question and its answers to the output
    // output.push(
    //   `
    //     <div class = "question${count}">
    //       ${myQuestions[count].question}
    //       <input type="text" id ="${count}" name="attempt${count}">
    //                   <div class="answers"> ${answers.join('')} </div>

    //                 <button class = "check">Check</button>

    //     </div>
    //     `
    // )
    output.push(
      `
      <div  class = "question${count}" id="container">
	
	<h1 class = "questions" >${myQuestions[count].question}</h2>
	 <ul class="answers" id =${count} name="attempt${count}"> ${answers.join('')} 

        <button class="checkQuestion ">
     Check Answer
    </button></ul>
      </div> `
    )
    //     <div class = "question${count}">
    //       ${myQuestions[count].question}
    //                   <div class="answers" id =${count} name="attempt${count}"> ${answers.join(
    //   ''
    // )} </div>
    //                 <button class = "check">Check</button>

    //     </div>

    //edits html of box
    quizContainer.innerHTML = output.join('')
    answerGiven = quizContainer.querySelector('.answers') //1 is answer //3 is submit
    check = quizContainer.querySelector('.checkQuestion')

    console.log(check, answerGiven)
    // add event listeners to elements created
    // make count an attribute of check element
    check.count = count
    check.addEventListener('click', checkAnswer)
    // }
  } else {
    console.log('HERERER')

    window.removeEventListener('scroll', controlFeed, true)
  }

  count++
}

// on enter submit answer into a place
// variables for checkanswer
let answerdQuestions = []
let numCorrect
function checkAnswer(e) {
  console.log(`hiiiii `)

  // change the colour of the text box
  // keep count of score
  // return score when count is reached
  // keep track of user's answers

  // return the answergiven value by event propogation

  let userAnswerBox = e.target.parentNode
  console.log(userAnswerBox)

  let id = userAnswerBox.id
  let userAnswer = (
    userAnswerBox.querySelector(`input[name="question${id}"]:checked`) || {}
  ).value

  // ${myQuestions[count].question}
  console.log(id, userAnswer)

  // userAnswerBox.style.color = 'lightgreen'
  // // if answer is correct
  if (userAnswer === myQuestions[id].correctAnswer) {
    // add to the number of correct answers
    // Notify that we saved.
    e.target.disabled = true
    e.target.textContent = 'CORRECT'

    e.target.parentNode.parentNode.parentNode.classList.add('backgroundC')

    // element.classList.add('mystyle')
    let checkBoxes = userAnswerBox.querySelectorAll(
      `input[name="question${id}"]`
    )

    let checkBox = userAnswerBox.querySelector(
      `input[name="question${id}"]:checked`
    )
    checkBoxes.forEach((cur) => {
      if (cur != checkBox) {
        cur.disabled = true
        cur.parentNode.remove()
      } else {
        console.log('herererer')
      }
    })

    //Update answerdQuestions

    answerdQuestions.push(e.target.count)
    console.log('score andquestion numbers saved')

    // check that score define if not set to 0
    chrome.storage.local.get({ score: 0 }, function (item) {
      if (!chrome.runtime.error) {
        console.log(item)
        numCorrect = item.score + 1
        chrome.storage.local.set(
          { score: numCorrect, answeredQuestions: answerdQuestions },
          function () {}
        )
      }
    })

    // color the answers green
    userAnswerBox.style.backgroundColor = 'lightgreen'
  }
  // if answer is wrong or blank
  else {
    // color the answers red
    // e.target.textContent = 'Try Again'
    // e.target.classList.to('shake')

    e.target.textContent = 'Try Again'
    e.target.parentNode.parentNode.parentNode.classList.add('backgroundF')
    e.target.classList.add('shake')

    setTimeout(function () {
      e.target.classList.remove('shake')
      e.target.parentNode.parentNode.parentNode.classList.remove('backgroundF')

      e.target.textContent = 'Check Answer'
    }, 2000)

    let checkBox = userAnswerBox.querySelector(
      `input[name="question${id}"]:checked`
    )
    checkBox.parentNode.style.opacity = '0'
    userAnswerBox.style.backgroundColor = 'red'
  }
}

//  looks for active tab ans sends message restrict only to fb?

// check the last question that was submitted then store questions left and the score ..
// make sure you can't answer a question twice or else it will mess up the score
// could add in pop ups to notify person when wrong
//problem of storing progress what happens if user has a different tab open?

// save scores
// read questions from csv
// load questions via box
// neaten it up

// information that needs to be stored:
// -- last question and store
// -- on window scroll event access local storage and retreive info
// -- load the next question
// -- can go on to store a list of wrong question and write questions
// -- could analyse the frequecny and present them inorder of worst to best and so on

// if using storgae must also store quiz documents?
// option to load preoaded questions

// store quiz info as object?
// quiz name ==> do that afterwards
// set quiz object

// The plan :
// code that it save last correct answer and beigns loading questions from there
// Create button  on the popup page that create an empty quiz then update inner html
// acess quiz object and set values in contnet script
// Quiz = [ 'Quiz': { quiz: one, score : 5, questionNumber: 5}]
// check
// disable button so can't submit question (could also make element dissappear or change into a 'correct' message)

// way of tracking indexes of correct answers in a list use count
// find count of question submtted from the id of the container and update the list of correct answers here
//send info with score each time
