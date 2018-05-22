/* eslint-disable */
import { isValidEmail } from './validate';
const  should = require('chai').should(); // we need to assign to variable so we can access null 

it('is false for nonemail text', () => {
	let v = isValid('f23f2', true);
	v.should.be.a('boolean');
	v.should.equal(false);

	let vlong = isValid('wwfefewef@wefwef', true);
	vlong.should.be.a('boolean');
	vlong.should.equal(false);
});

it('is true for a valid email', () =>{
	let v = isValid('test@gmail.com', true);
	v.should.be.a('boolean');
	v.should.equal(true);
})


it('is false for a valid but free email', () => {
	let v = isValid('test@gmail.com', false);
	v.should.be.a('boolean');
	v.should.equal(false);
})

it('is true for a valid buisness email', () => {
	let v = isValid('test@patsnap.com', false);
	v.should.be.a('boolean');
	v.should.equal(true);
})