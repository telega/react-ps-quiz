import React from 'react';

export default class Results extends React.Component{
	
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
