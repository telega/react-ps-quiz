/* eslint-disable */
import { calculateLevel, calculateBucketLevel } from '../services/scores';
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

