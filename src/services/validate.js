import freemail from 'freemail-webpack';

//const re = /\S+@\S+\.\S+/;
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line no-useless-escape

// Check if the email meets our criteria 
export function isValidEmail(value, allowFreemail) {
	if( re.test(value) ){
		if(allowFreemail){
			return true;
		} else {
			if(!freemail.isFree(value)){
				return true;
			}
			else {
				return false;
			}
		}
	}
	return false;
}


/*

if(this.props.validateCollectedInfo){
		let re = /\S+@\S+\.\S+/;
		if( re.test(this.state.collectedInfo) ){
			if(!freemail.isFree(this.state.collectedInfo)){
				this.setState({startButtonActive: true} ); 
			}
			else {
				this.setState({startButtonActive: false});
			}
		} 
		else {
			this.setState({startButtonActive: false});
		}
	} else {
		this.setState({startButtonActive: false});
	}

	*/