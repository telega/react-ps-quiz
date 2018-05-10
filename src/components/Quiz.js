import React from 'react';
import Question from './Question';
import Results from './Results';

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

	showResults(){



	}

	nextQuestion(){	
		this.setState({currentQuestion: this.state.currentQuestion+1}, ()=>{
			if(this.state.currentQuestion === this.state.questionCount){
				this.setState({quizCompleted: true})
			}
		})
	}

	render(){
		return(
			<div id="slickQuiz">
				<QuizHeader quizStarted = {this.state.quizStarted} name={this.props.quizJSON.info.name} main={this.props.quizJSON.info.main} />
				<div className = "quizArea">
				<StartButton show={!this.state.quizStarted} handleClick = {this.startQuiz} />
				{this.state.quizStarted ? this.renderQuestions() : null}
				<Results show={this.state.quizCompleted} score = {this.state.quizScore} questionCount = {this.state.questionCount} />
				</div>
			</div>
		)
	}
}

Quiz.defaultProps = {
	checkAnswerText:  'Check My Answer!',
	nextQuestionText: 'Next &raquo;',
	backButtonText: '',
	completeQuizText: '',
	tryAgainText: '',
	questionCountText: 'Question %current of %total',
	preventUnansweredText: 'You must select at least one answer.',
	questionTemplateText:  '%count. %text',
	scoreTemplateText: '%score / %total',
	nameTemplateText:  '<span>Quiz: </span>%name',
	skipStartButton: false,
	numberOfQuestions: null,
	randomSortQuestions: false,
	randomSortAnswers: false,
	preventUnanswered: false,
	disableScore: false,
	disableRanking: false,
	scoreAsPercentage: false,
	perQuestionResponseMessaging: true,
	perQuestionResponseAnswers: false,
	completionResponseMessaging: false,
	displayQuestionCount: true,   // Deprecate?
	displayQuestionNumber: true,  // Deprecate?
	animationCallbacks: { // only for the methods that have jQuery animations offering callback
		setupQuiz: function () {},
		startQuiz: function () {},
		resetQuiz: function () {},
		checkAnswer: function () {},
		nextQuestion: function () {},
		backToQuestion: function () {},
		completeQuiz: function () {}
	},
	events: {
		onStartQuiz: function (options) {},
		onCompleteQuiz: function (options) {}  // reserved: options.questionCount, options.score
	}
}