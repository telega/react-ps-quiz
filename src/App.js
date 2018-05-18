import React from 'react';
import Quiz from './components/Quiz';
import ReactDOM from 'react-dom';

export const init = (config, quizJSON, id) =>{

	ReactDOM.render(
		<Quiz {...config }
			quizJSON = {quizJSON} 
		/>, 
		document.getElementById(id));
};



