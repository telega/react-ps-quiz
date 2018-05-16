import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getQuestionScore } from '../services/scores';

class AnswerCardButton extends React.Component{

	render(){
		if(this.props.showResults){
			return( <button className= "button" onClick = {this.props.onClick}>Show Results</button> );
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
						<AnswerCardButton nextQuestionText={this.props.nextQuestionText} onClick = {this.props.nextQuestion} showResults={(this.props.currentQuestion +1 === this.props.questionCount) } />
					</div>
				);
			}
			return (
				<div>	
					<div dangerouslySetInnerHTML={{__html:this.props.question.incorrect}} />
					<AnswerCardButton nextQuestionText={this.props.nextQuestionText} onClick = {this.props.nextQuestion} showResults={(this.props.currentQuestion +1 === this.props.questionCount)} />
				</div>
			);
		}
		return null;
	}
}


class QuestionCard extends React.Component{

	constructor(props){
		super(props);

		this.renderQuestionAnswers = this.renderQuestionAnswers.bind(this);
		this.handleOptionChange = this.handleOptionChange.bind(this);
		this.checkAnswer = this.checkAnswer.bind(this);

		this.state = {
			selectedOptions: [],
			showPreventUnansweredText: false
		};
	}

	handleOptionChange(e){
		//this.setState({selectedOption: e.target.value, showPreventUnansweredText:false});
		let value = e.target.value;
		let selectedOptions = this.state.selectedOptions; 

		let idx = _.indexOf(selectedOptions, value);
		if(idx === -1){
			this.setState(prevState =>({
				selectedOptions: [...prevState.selectedOptions, value]
			}));
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
				let correct =  getQuestionScore(this.props.question.a, this.state.selectedOptions); 
				this.props.updateScore(correct);
			}
		}
	
	}

	renderQuestionAnswers(){
		return this.props.question.a.map((a, i)=>{
			return (
				<div className = 'radio' key = {i}>
					<label>
						<input type='radio' value = {a.option} checked ={ (_.indexOf(this.state.selectedOptions, a.option ) !== -1) } onChange = {this.handleOptionChange} /> 
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
					<div>Question {this.props.currentQuestion + 1} of {this.props.questionCount} | i=  {this.props.i}</div>
					<div className = "questionClass">
						{this.props.question.q}
						<form className="questionAnswers">
							{this.renderQuestionAnswers()}
						</form>
					</div>
					<p>{(this.state.showPreventUnansweredText) ? this.props.preventUnansweredText : null }</p>
					<button onClick = {this.checkAnswer}> {this.props.checkAnswerText}</button>
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
		this.state = {
			showAnswerCard:false,
			isCorrect: false
		};
	}

	updateScore(correct){
		this.props.updateScore(correct);

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
		this.props.nextQuestion();	
	}

	render(){
		if(this.props.currentQuestion === this.props.i){
			return(
				<div>
					<QuestionCard {...this.props} show={!this.state.showAnswerCard} updateScore = {this.updateScore} updateScoreBucket = {this.updateScoreBucket} />
					<AnswerCard {...this.props} show = {this.state.showAnswerCard} isCorrect = {this.state.isCorrect}/>
				</div>
			);
		}
		return null;
	}
}


AnswerCardButton.propTypes = {
	showResults: PropTypes.bool,
	onClick: PropTypes.func,
	nextQuestionText: PropTypes.string,
	nextQuestion: PropTypes.func
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
	i: PropTypes.number
};