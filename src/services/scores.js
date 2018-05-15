import _ from 'lodash';

// Determines if percentage of correct values is within a level range
export function inRange(start, end, value) {
	return (value >= start && value <= end);
}

// Calculate levels  
export function calculateLevel(correctAnswers, questionCount) {
	var percent = (correctAnswers / questionCount).toFixed(2),
		level   = null;

	if (inRange(0, 0.20, percent)) {
		level = 4;
	} else if (inRange(0.21, 0.40, percent)) {
		level = 3;
	} else if (inRange(0.41, 0.60, percent)) {
		level = 2;
	} else if (inRange(0.61, 0.80, percent)) {
		level = 1;
	} else if (inRange(0.81, 1.00, percent)) {
		level = 0;
	}

	return level;
}

// Calculate levels for buckets

export function calculateBucketLevel(quizScoreBucket) {	
	let item =  _.maxBy(quizScoreBucket, 'value');
	let level = null;
	
	if (item) {
		return item.choice;
	}
	return level;
}


