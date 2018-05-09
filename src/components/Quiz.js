import React from 'react';
import Question from './Question';

class QuizHeader extends React.Component{
	render(){
		return(
			<div className = "quizHeader">
				<h1 className = "quizName">{this.props.name}</h1>
				{!this.props.quizStarted ? <div dangerouslySetInnerHTML={{__html:this.props.main}} /> : null}
			</div>
		)
	}
}

class ResultsCard extends React.Component{
	render(){
		if(this.props.show){
			return(
				<div>
				<h2>Results</h2>
				<p>You scored: {this.props.score} out of {this.props.questionCount} </p>
				</div>
			)
		}
	
		return null
	}
}


class StartButton extends React.Component{
	render(){
		if(this.props.show){
			return (<button className = 'button startQuiz' onClick = {this.props.handleClick}>Get Started</button>		)
		}
		return null;
	}
}

export default class Quiz extends React.Component{

	constructor(props){
		super(props);

		this.startQuiz = this.startQuiz.bind(this);
		this.renderQuestions = this.renderQuestions.bind(this);
		this.nextQuestion = this.nextQuestion.bind(this);
		this.updateScore = this.updateScore.bind(this);

		this.state = {
			quizStarted: false,
			quizCompleted: false,
			currentQuestion: 0,
			quizScore: 0,
			questions: this.props.quizJSON.questions || [], 
			questionCount: this.props.quizJSON.questions.length || 0
		}
	}

	renderQuestions(){
		return(
			this.state.questions.map((question,i)=>{
				return <Question 
							question={question} 
							key={i} i={i} 
							currentQuestion = {this.state.currentQuestion} 
							questionCount = {this.state.questionCount} 
							nextQuestion = {this.nextQuestion}
							updateScore = {this.updateScore} />
			})
		)
	}

	startQuiz(){
		this.setState({quizStarted:true})
	}

	updateScore(correct){
		if(correct){
			this.setState({quizScore: this.state.quizScore+1})
		}
	}

	nextQuestion(){
		
		this.setState({currentQuestion: this.state.currentQuestion+1}, ()=>{
			if(this.state.currentQuestion === this.state.questionCount){
				this.setState({quizCompleted: true})
			}
		})
	}

	render(){
		console.log(this.state)
		return(
			<div id="slickQuiz">
				<QuizHeader quizStarted = {this.state.quizStarted} name={this.props.quizJSON.info.name} main={this.props.quizJSON.info.main} />
				<div className = "quizArea">
				<StartButton show={!this.state.quizStarted} handleClick = {this.startQuiz} />
				{this.state.quizStarted ? this.renderQuestions() : null}
				<ResultsCard show={this.state.quizCompleted} score = {this.state.quizScore} questionCount = {this.state.questionCount} />
				</div>
			</div>
		)
	}
}