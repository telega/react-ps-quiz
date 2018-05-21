import React from 'react';
import PropTypes from 'prop-types';
import {calculateBucketLevel, calculateLevel } from '../services/scores';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


class Levels extends React.Component{

	renderLevel(){
		if(this.props.useScoreBuckets){
			let bucketLevel = calculateBucketLevel(this.props.buckets);
			let levelAlpha = 'ABCDEFGHIJK'.charAt(bucketLevel);
			let levelText = this.props.quizJSON.info['level'+ (bucketLevel+1)];
			return(
				<div>
					<h3>Mostly {levelAlpha}:</h3>
					<div dangerouslySetInnerHTML={{__html:levelText}} />
					<div dangerouslySetInnerHTML={{__html:this.props.quizJSON.info.results}} />
				</div>
			);
		} else {
			let level = calculateLevel(this.props.score, this.props.questionCount);
			let levelText = this.props.quizJSON.info['level' + (level+1)];
			return(
				<div>
					<div dangerouslySetInnerHTML={{__html:levelText}} />
					<div dangerouslySetInnerHTML={{__html:this.props.quizJSON.info.results}} />
				</div>
			);
		}
	}

	render(){
		if(this.props.show){
			return ( this.renderLevel() );
		}

		return null;
	}
}

export default class Results extends React.Component{
	
	render(){
		if(this.props.show){
			
			if(this.props.useScoreBuckets){
				return(
					<ReactCSSTransitionGroup
						transitionName="example"
						transitionAppear={true}
						transitionAppearTimeout={500}
						transitionEnter={false}
						transitionLeave={false}>
						<div>
							<h2>Results</h2>
							{this.props.buckets.map((bucket,i)=>{
								return( <div key = {i}> { 'ABCDEFGHIJK'.charAt(bucket.choice) } - {bucket.value} </div>);
							})}
							<Levels {...this.props} show={!this.props.disableRanking}  />
						</div>
					</ReactCSSTransitionGroup>
				);

			} else { 
				return(
					<ReactCSSTransitionGroup
						transitionName="example"
						transitionAppear={true}
						transitionAppearTimeout={500}
						transitionEnter={false}
						transitionLeave={false}>
						<div>
							<h2>Results</h2>
							<p>You scored: {this.props.score} out of {this.props.questionCount} </p>
							<Levels {...this.props} show={!this.props.disableRanking} />
						</div>
					</ReactCSSTransitionGroup>
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
	questionCount: PropTypes.number,
	disableRanking: PropTypes.bool
};

Levels.propTypes = {
	show : PropTypes.bool,
	useScoreBuckets: PropTypes.bool,
	buckets:PropTypes.array,
	quizJSON: PropTypes.object,
	score: PropTypes.number,
	questionCount: PropTypes.number,

};