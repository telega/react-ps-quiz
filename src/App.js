import React, { Component } from 'react';
import { quizJSON } from  './data/quiz';

import Quiz from './components/Quiz';

class App extends Component {
  render() {
    return (
	  <Quiz quizJSON = {quizJSON} />
    );
  }
}

export default App;
