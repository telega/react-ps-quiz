/* eslint-disable */
import { calculateLevel, calculateBucketLevel, getQuestionScore } from '../services/scores';
const  should = require('chai').should(); // we need to assign to variable so we can access null 

// normal scoring

it('calculates level 4', () => {
	const l = calculateLevel(0,10);
	l.should.be.a('number');
	l.should.equal(4);
});

it('calculates level 3', () => {
	const l = calculateLevel(3,10);
	l.should.be.a('number');
	l.should.equal(3);
})

it('calculates level 2', () => {
	const l = calculateLevel(5,10);
	l.should.be.a('number');
	l.should.equal(2);
})

it('calculates level 1', () => {
	const l = calculateLevel(7,10);
	l.should.be.a('number');
	l.should.equal(1);
})

it('calculates level 0', () => {
	const l = calculateLevel(9,10);
	l.should.be.a('number');
	l.should.equal(0);
})

// bucket scoring

it('calculates bucket level 1', () => {
	const quizScoreBucket = [
		{choice:1, value: 10},{ choice: 2, value: 9}
	]
	const l = calculateBucketLevel(quizScoreBucket);
	l.should.be.a('number');
	l.should.equal(1);
});

it('calculates bucket level 2', () => {
	const quizScoreBucket = [
		{choice:2, value: 10},{ choice: 1, value: 9}
	]
	const l = calculateBucketLevel(quizScoreBucket);
	l.should.be.a('number');
	l.should.equal(2);
});

it('calculates bucket with no items(null)', () => {
	const quizScoreBucket = []
	const l = calculateBucketLevel(quizScoreBucket);
	should.not.exist(l);
});


// calculate question score

it('checks if a basic question response is correct', () =>{

	let basicQuestion = { // Question 1 - Multiple Choice, Single True Answer
		"q": "What number is the letter A in the English alphabet?",
		"a": [
			{"option": "8",      "correct": false},
			{"option": "14",     "correct": false},
			{"option": "1",      "correct": true},
			{"option": "23",     "correct": false} // no comma here
		],
		"correct": "<p><span>That's right!</span> The letter A is the first letter in the alphabet!</p>",
		"incorrect": "<p><span>Uhh no.</span> It's the first letter of the alphabet. Did you actually <em>go</em> to kindergarden?</p>" // no comma here
	}

	const incorrect = getQuestionScore(basicQuestion.a,["8"]);
	incorrect.should.be.a('boolean');
	incorrect.should.equal(false);

	const correct = getQuestionScore(basicQuestion.a,["1"])
	correct.should.be.a('boolean');
	correct.should.equal(true);
	
})


it('returns the index of a selcetion for bucketing', () =>{

	let basicQuestion = { 
		"q": "What number is the letter A in the English alphabet?",
		"a": [
			{"option": "8",      "correct": false},
			{"option": "14",     "correct": false},
			{"option": "1",      "correct": true},
			{"option": "23",     "correct": false} // no comma here
		],
		"correct": "<p><span>That's right!</span> The letter A is the first letter in the alphabet!</p>",
		"incorrect": "<p><span>Uhh no.</span> It's the first letter of the alphabet. Did you actually <em>go</em> to kindergarden?</p>" // no comma here
	}

	const index_zero = getQuestionScore(basicQuestion.a,["8"],true);
	index_zero.should.be.a('number');
	index_zero.should.equal(0);

	const index_one = getQuestionScore(basicQuestion.a,["14"],true);
	index_one.should.be.a('number');
	index_one.should.equal(1);

	const index_two = getQuestionScore(basicQuestion.a,["1"],true);
	index_two.should.be.a('number');
	index_two.should.equal(2);

	const index_three = getQuestionScore(basicQuestion.a,["23"],true);
	index_three.should.be.a('number');
	index_three.should.equal(3);

	const index_none = getQuestionScore(basicQuestion.a,[],true);
	index_none.should.be.a('number');
	index_none.should.equal(-1);

})

