# React PS Quiz
React Quiz Component inspired by [SlickQuiz](https://github.com/jewlofthelotus/SlickQuiz)

## Goal
Create quizzes while keeping the same question/config structure as SlickQuiz so I can reuse them in React.

* Eventually implement all of the functionality of SlickQuiz excluding animation callbacks
* Doesnt currently support randomization of questions
* Added some additional functionality:
	* A 'bucket' style quiz where you get placed into a group based on whether the majority of answers fall into a particular category (like magazine quizzes)
	* The ability to collect email addresses at the start of the quiz. Thes are passed to the function that runs on completion.