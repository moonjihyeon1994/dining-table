import React from 'react';
// import logo from './logo.svg';
import '../App.css';

function Form() {
  return (
			<form id="signup-form" method="post" action="#">
				<input type="email" name="email" id="email" placeholder="Email Address" />
				<input type="submit" value="Sign Up" />
			</form>

  );
}

export default Form;
