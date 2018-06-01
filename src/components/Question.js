import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getQuestionScore, useCheckBoxes } from '../services/scores';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


class AnswerCardButton extends React.Component{

	render(){
		if(this.props.showResults && (this.props.completeQuizText.length > 0) ){
			return( <button className= "button" onClick = {this.props.onClick} dangerouslySetInnerHTML={{__html:this.props.completeQuizText}} />); 
		}
		return(
			<button className= "button" 
				onClick = {this.props.onClick} 
				dangerouslySetInnerHTML={{__html:this.props.nextQuestionText}}
			/>
		);
	}
}

class AnswerCard extends React.Component{

	render(){
		if(this.props.show){
			if(this.props.isCorrect){
				return(
					<div>
						<div dangerouslySetInnerHTML={{__html:this.props.question.correct}} />
						<AnswerCardButton {...this.props} nextQuestionText={this.props.nextQuestionText} onClick = {this.props.nextQuestion} showResults={(this.props.currentQuestion +1 === this.props.questionCount) } />
					</div>
				);
			}
			return (
				<div>	
					<div dangerouslySetInnerHTML={{__html:this.props.question.incorrect}} />
					<AnswerCardButton {...this.props} nextQuestionText={this.props.nextQuestionText} onClick = {this.props.nextQuestion} showResults={(this.props.currentQuestion +1 === this.props.questionCount)} />
				</div>
			);
		}
		return null;
	}
}

class QuestionCardButton extends React.Component{
	
	render(){
		if(this.props.showResults && (this.props.completeQuizText.length > 0) ){
			return( <button className= "button" onClick = {this.props.onClick} dangerouslySetInnerHTML={{__html:this.props.completeQuizText}} />); 
		}
		return(
			<button className= "button" 
				onClick = {this.props.onClick} 
				dangerouslySetInnerHTML={{__html:this.props.checkAnswerText}}
			/>
		);
	}

}


class QuestionCard extends React.Component{

	constructor(props){
		super(props);

		this.renderQuestionAnswers = this.renderQuestionAnswers.bind(this);
		this.handleOptionChange = this.handleOptionChange.bind(this);
		this.checkAnswer = this.checkAnswer.bind(this);

		this.state = {
			selectAny: this.props.question.select_any || false,
			selectedOptions: [],
			showPreventUnansweredText: false,
			useCheckBoxes: useCheckBoxes( this.props.question.a )
		};
	}

	handleOptionChange(e){
		let inputType = e.target.type;
		let value = e.target.value;
		let selectedOptions = this.state.selectedOptions; 

		let idx = _.indexOf(selectedOptions, value);
		
		if(idx === -1){
			if(inputType === 'radio'){
				this.setState({selectedOptions:[value]});
			} else {
				this.setState(prevState =>({
					selectedOptions: [...prevState.selectedOptions, value]
				}));
			}
		} else {
			selectedOptions = _.without(selectedOptions, value);
			this.setState(()=>({selectedOptions:selectedOptions}));
		}
	}

	checkAnswer(){
	
		if(this.props.preventUnanswered && (this.state.selectedOptions.length === 0) ){
			this.setState({showPreventUnansweredText:true});
		} else {

			if(this.props.useScoreBuckets){
				let index = getQuestionScore(this.props.question.a, this.state.selectedOptions, true );
				this.props.updateScoreBucket(index);
			} else {
				if(this.state.selectAny){
					let correct =  getQuestionScore(this.props.question.a, this.state.selectedOptions, false, true); 
					this.props.updateScore(correct);
				} else {
					let correct =  getQuestionScore(this.props.question.a, this.state.selectedOptions); 
					this.props.updateScore(correct);
				}

			}
		}
	
	}

	renderQuestionAnswers(){
		return this.props.question.a.map((a, i)=>{
			return (
				<div className = 'radio' key = {i}>
					<label>
						<input type={this.state.useCheckBoxes? 'checkbox' : 'radio'} value = {a.option} checked ={ (_.indexOf(this.state.selectedOptions, a.option ) !== -1) } onChange = {this.handleOptionChange} /> 
						{a.option}
					</label>
				</div>
			);
		});
	}

	render(){
		
		if(this.props.show){
			return(
				<div>
					<div>Question {this.props.currentQuestion + 1} of {this.props.questionCount} </div>
					<div className = "questionClass">
						{this.props.question.q}
						<form className="questionAnswers">
							{this.renderQuestionAnswers()}
						</form>
					</div>
					<p>{(this.state.showPreventUnansweredText) ? this.props.preventUnansweredText : null }</p>
					<QuestionCardButton {...this.props} onClick = {this.checkAnswer} checkAnswerText= {this.props.checkAnswerText} showResults={(this.props.currentQuestion +1 === this.props.questionCount)}/>
				</div>

			);
		}
		return null;
	}
}

export default class Question extends React.Component{
	constructor(props){
		super(props);
		this.updateScore = this.updateScore.bind(this);
		this.updateScoreBucket = this.updateScoreBucket.bind(this);
		this.renderCards = this.renderCards.bind(this);
		this.state = {
			showAnswerCard:false,
			isCorrect: false
		};
	}

	updateScore(correct){
		this.props.updateScore(correct);

		this.props.updateQuizResponses({
			questionNumber: this.props.i,
			questionText: this.props.question.q,
			response: correct
		});

		if(this.props.perQuestionResponseMessaging){
			this.setState({
				isCorrect: correct,
				showAnswerCard: true
			});
		} else {
			this.props.nextQuestion();
		}
	
	}

	updateScoreBucket(item){
		this.props.updateScoreBucket(item);

		this.props.updateQuizResponses({
			questionNumber: this.props.i,
			questionText: this.props.question.q,
			response: item
		});

		this.props.nextQuestion();	
	}

	renderCards(){
		if(this.state.showAnswerCard){
			return(<AnswerCard key = {2} {...this.props} show = {this.state.showAnswerCard} isCorrect = {this.state.isCorrect}/>) ;
		} else {
			return (<QuestionCard key={1} {...this.props} show={!this.state.showAnswerCard} updateScore = {this.updateScore} updateScoreBucket = {this.updateScoreBucket} />
			);
		}
	}

	render(){
		if(this.props.currentQuestion === this.props.i){
			return(
				<div>    
					<ReactCSSTransitionGroup
						transitionName="quizCard"
						transitionAppear={true}
						transitionAppearTimeout={500}
						transitionEnterTimeout={500}
						transitionLeave={false} >
						{this.renderCards()}
					</ReactCSSTransitionGroup >
				</div>
			);
		}
		return null;
	}
}


// TODO : Merge buttons ? 
AnswerCardButton.propTypes = {
	showResults: PropTypes.bool,
	onClick: PropTypes.func,
	nextQuestionText: PropTypes.string,
	nextQuestion: PropTypes.func,
	completeQuizText: PropTypes.string,
};

QuestionCardButton.propTypes = {
	showResults: PropTypes.bool,
	onClick: PropTypes.func,
	checkAnswerText: PropTypes.string,
	completeQuizText: PropTypes.string,
};

AnswerCard.propTypes = {
	show:PropTypes.bool,
	isCorrect:PropTypes.bool,
	question:PropTypes.object,
	nextQuestionText: PropTypes.string,
	nextQuestion: PropTypes.func,
	currentQuestion: PropTypes.number,
	questionCount: PropTypes.number,
	//preventUnanswered: PropTypes.bool,

};

QuestionCard.propTypes = {
	preventUnanswered: PropTypes.bool,
	useScoreBuckets: PropTypes.bool,
	question: PropTypes.object,
	updateScore: PropTypes.func,
	updateScoreBucket: PropTypes.func,
	show: PropTypes.bool,
	currentQuestion: PropTypes.number,
	questionCount: PropTypes.number,
	i:PropTypes.number, //its an index innit? 
	preventUnansweredText: PropTypes.string,
	checkAnswerText: PropTypes.string,
	
};



Question.propTypes = {
	updateScore: PropTypes.func,
	perQuestionResponseMessaging: PropTypes.bool,
	nextQuestion: PropTypes.func,
	updateScoreBucket: PropTypes.func,
	currentQuestion: PropTypes.number,
	i: PropTypes.number,
	updateQuizResponses: PropTypes.func,
	question: PropTypes.object,
};