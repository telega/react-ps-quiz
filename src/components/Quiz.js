import React from 'react';
import PropTypes from 'prop-types';
import Question from './Question';
import Results from './Results';
import _ from 'lodash';
import { isValidEmail } from '../services/validate';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class QuizHeader extends React.Component{
	render(){
		return(
			<div className = "quizHeader">
				<h1 className = "quizName">{this.props.name}</h1>
				{!this.props.quizStarted ? <div key={1} dangerouslySetInnerHTML={{__html:this.props.main}} /> : null}
				<ReactCSSTransitionGroup
					transitionName="example"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={300}>
					{!this.props.quizStarted && this.props.collectInfo ? <div dangerouslySetInnerHTML={{__html:this.props.collectInfoText}}/> :null }
				</ReactCSSTransitionGroup>
				{!this.props.quizStarted && this.props.collectInfo ? <form className="emailForm" ><input type='text'value={this.props.value} onChange = {this.props.handleInfoChange} ></input></form> : null }
			</div>
		);
	}
}

class StartButton extends React.Component{
	
	render(){
		if(this.props.show){
			return (<button disabled = {!this.props.active} className = 'button startQuiz' onClick = {this.props.handleClick}>Get Started</button> );				
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
		this.updateScoreBucket = this.updateScoreBucket.bind(this);
		this.handleInfoChange = this.handleInfoChange.bind(this);
		this.updateQuizResponses = this.updateQuizResponses.bind(this);

		this.state = {
			quizStarted: false,
			quizCompleted: false,
			currentQuestion: 0,
			collectInfo: this.props.collectInfo,
			collectedInfo: '',
			startButtonActive: !this.props.collectInfo,
			quizScore: 0,
			quizScoreBucket:[],
			questions: this.props.quizJSON.questions || [], 
			questionCount: this.props.quizJSON.questions.length || 0,
			quizScoreLevel: 0,
			quizResponses:[]
		};
	}

	handleInfoChange(e){
		this.setState({collectedInfo:e.target.value}, ()=>{
			// block submission when using fremail providers.. 
			let startButtonActive = isValidEmail(this.state.collectedInfo,this.props.allowFreemail);
			this.setState({startButtonActive: startButtonActive} );
		});
	}


	renderQuestions(){
		return(
			this.state.questions.map((question,i)=>{
				return( 
				
					<Question 
						{...this.props}
						question={question} 
						key={i} 
						i={i} 
						currentQuestion = {this.state.currentQuestion} 
						questionCount = {this.state.questionCount} 
						nextQuestion = {this.nextQuestion}
						updateScore = {this.updateScore}
						updateQuizResponses = {this.updateQuizResponses}
						updateScoreBucket = {this.updateScoreBucket}
					/>

		
				);
			})
		);
	}

	startQuiz(){
		this.setState({quizStarted:true}, ()=>{
			this.props.events.onStartQuiz({options:{}});
		});
	}

	updateScore(correct){
		if(correct){
			this.setState({quizScore: this.state.quizScore+1});
		}
	}

	updateQuizResponses(item){
		this.setState(prevState=> ({
			quizResponses: [...prevState.quizResponses, item]
		}));
	}

	updateScoreBucket(item){
		let bucketIndex = _.findIndex(this.state.quizScoreBucket, {choice:item});
		if( bucketIndex === -1 ){
			this.setState(prevState => ({
				quizScoreBucket: [...prevState.quizScoreBucket, {choice:item, value: 1}]
			}));
		} else{
			let bucket = this.state.quizScoreBucket[bucketIndex];
			let quizScoreBucket = this.state.quizScoreBucket;
			bucket.value = bucket.value+1;
			quizScoreBucket[bucketIndex] = bucket;

			this.setState(() => ({
				quizScoreBucket: quizScoreBucket
			}));
		}
	}

	nextQuestion(){	
		this.setState({currentQuestion: this.state.currentQuestion+1}, ()=>{
			if(this.state.currentQuestion === this.state.questionCount){
				this.setState({quizCompleted: true}, ()=>{

					this.props.events.onCompleteQuiz({
						options:{
							score:this.state.quizScore,
							questionCount:this.state.questionCount,
							collectedInfo:this.state.collectedInfo,
							quizScoreBucket: this.state.quizScoreBucket,
							quizResponses: this.state.quizResponses
						}
					});
				});
			}
		});
	}

	render(){
		return(
			<div id="slickQuiz">
				<QuizHeader 
					collectInfoText = {this.props.collectInfoText} 
					collectInfo = {this.state.collectInfo} 
					quizStarted = {this.state.quizStarted} 
					name = {this.props.quizJSON.info.name}
					handleInfoChange = {this.handleInfoChange}
					value = {this.state.collectedInfo} 
					main = {this.props.quizJSON.info.main} 
				/>
				<div className = "quizArea">
					<StartButton active={this.state.startButtonActive} show={!this.state.quizStarted} handleClick = {this.startQuiz} />
					{this.state.quizStarted ? this.renderQuestions() : null}
					<Results {...this.props} show={this.state.quizCompleted} score = {this.state.quizScore} buckets = {this.state.quizScoreBucket}  questionCount = {this.state.questionCount} />
				</div>
			</div>
		);
	}
}

Quiz.propTypes= {
	quizJSON: PropTypes.object,
	events: PropTypes.object,
	collectInfo: PropTypes.bool,
	collectInfoText: PropTypes.string,
	allowFreemail: PropTypes.bool,
};

StartButton.propTypes = {
	handleClick: PropTypes.func,
	show: PropTypes.bool,
	startButtonActive: PropTypes.bool,
	active:PropTypes.bool
};

QuizHeader.propTypes = {
	name: PropTypes.string,
	quizStarted: PropTypes.bool,
	main: PropTypes.string,
	collectInfo: PropTypes.bool,
	collectInfoText: PropTypes.string,
	value: PropTypes.string,
	handleInfoChange: PropTypes.func
};

Quiz.defaultProps = {
	checkAnswerText:  'Check My Answer!',
	nextQuestionText: 'Next &raquo;',
	// backButtonText: '',
	// completeQuizText: '',
	// tryAgainText: '',
	// questionCountText: 'Question %current of %total',
	preventUnansweredText: 'You must select at least one answer.',
	// questionTemplateText:  '%count. %text',
	// scoreTemplateText: '%score / %total',
	// nameTemplateText:  '<span>Quiz: </span>%name',
	// skipStartButton: false,
	// numberOfQuestions: null,
	// randomSortQuestions: false,
	// randomSortAnswers: false,
	preventUnanswered: false,
	// disableScore: false,
	disableRanking: false,
	// scoreAsPercentage: false,
	perQuestionResponseMessaging:false,
	// perQuestionResponseAnswers: false,
	// completionResponseMessaging: false,
	// displayQuestionCount: true,   // Deprecate?
	// displayQuestionNumber: true,  // Deprecate?
	useScoreBuckets: true,
	collectInfo: true,
	allowFreemail: false,
	collectInfoText: '<p>Enter your Email address to get started.</p>',
	// animationCallbacks: { // only for the methods that have jQuery animations offering callback
	// 	setupQuiz: function () {},
	// 	startQuiz: function () {},
	// 	resetQuiz: function () {},
	// 	checkAnswer: function () {},
	// 	nextQuestion: function () {},
	// 	backToQuestion: function () {},
	// 	completeQuiz: function () {}
	// },
	events: {
		onStartQuiz: function (options) {}, // eslint-disable-line
		onCompleteQuiz: function (options) {}  //eslint-disable-line 
	}
};