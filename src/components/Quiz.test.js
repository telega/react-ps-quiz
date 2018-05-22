/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import Quiz from './Quiz';


//todo make quiz run without passing this info
const quizJSON = { 
	"info": {
        "name":    "Test Your Knowledge!!",
        "main":    "<p>Think you're smart enough to be on Jeopardy? Find out with this super crazy knowledge quiz!</p>",
        "results": "<h5>Learn More</h5><p>Etiam scelerisque, nunc ac egestas consequat, odio nibh euismod nulla, eget auctor orci nibh vel nisi. Aliquam erat volutpat. Mauris vel neque sit amet nunc gravida congue sed sit amet purus.</p>",
        "level1":  "Jeopardy Ready",
        "level2":  "Jeopardy Contender",
        "level3":  "Jeopardy Amateur",
        "level4":  "Jeopardy Newb",
        "level5":  "Stay in school, kid..." // no comma here
    },
	questions: []
}


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Quiz quizJSON = {quizJSON} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
