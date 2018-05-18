import React from 'react';
import Quiz from './components/Quiz';
import ReactDOM from 'react-dom';

export const init = (config, quizJSON) =>{
	ReactDOM.render(<Quiz config = {config} quizJSON = {quizJSON} />, document.getElementById('root'));
};



