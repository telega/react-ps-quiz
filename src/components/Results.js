import React from 'react';
import PropTypes from 'prop-types';

export default class Results extends React.Component{
	
	render(){
		if(this.props.show){
			if(this.props.useScoreBuckets){
				return(
					<div>
						<h2>Results</h2>
						{this.props.buckets.map((bucket,i)=>{
							return( <div key = {i}> {bucket.choice } - {bucket.value} </div>);
						})}
					</div>
				);

			}else{ 
				return(
					<div>
						<h2>Results</h2>
						<p>You scored: {this.props.score} out of {this.props.questionCount} </p>
					</div>
				);
			}
		}
	
		return null;
	}
}

Results.propTypes = {
	show: PropTypes.bool,
	useScoreBuckets: PropTypes.bool,
	buckets: PropTypes.array,
	score: PropTypes.number,
	questionCount: PropTypes.number
};