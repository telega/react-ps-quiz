import React from 'react';
import _ from 'lodash';


class QuestionCard extends React.Component{

	constructor(props){
		super(props);

		this.renderQuestionAnswers = this.renderQuestionAnswers.bind(this);
		this.handleOptionChange = this.handleOptionChange.bind(this);
		this.checkAnswer = this.checkAnswer.bind(this);

		this.state = {
			selectedOption: null
		}
	}

	handleOptionChange(e){
		this.setState({selectedOption: e.target.value})
	}

	checkAnswer(){
		let correct = ( _.findIndex(this.props.question.a, { option: this.state.selectedOption, correct: true } ) !== -1 ) ? true : false;
		this.props.updateScore(correct);
		this.props.nextQuestion();
	}

	renderQuestionAnswers(){
		return this.props.question.a.map((a, i)=>{
			return (
				<div className = 'radio' key = {i}>
					<label>
						<input type='radio' value = {a.option} checked ={this.state.selectedOption === a.option} onChange = {this.handleOptionChange} /> 
						{a.option}
					</label>
				</div>
			)
		})
	}


	render(){
		return(

			<div>
				<div>Question {this.props.currentQuestion + 1} of {this.props.questionCount} | i= {this.props.i}</div>
				<div className = "questionClass">
					{this.props.question.q}
					<form className="questionAnswers">
						{this.renderQuestionAnswers()}
					</form>
				</div>
				<button onClick = {this.checkAnswer}>Check Answer</button>
			</div>

		)
	}

}


export default class Question extends React.Component{
	

	render(){
		if(this.props.currentQuestion === this.props.i){
			return(
				<QuestionCard {...this.props} />
			)
		}
		return null;
	}
}
