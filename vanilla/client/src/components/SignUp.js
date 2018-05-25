import React, { Component } from 'react';
import './SignUp.css';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '',
      trueFlag: null
    };
  }

  handleflagChanged(e) {
    this.setState({
      flag: e.currentTarget.value,
      trueFlag: null
    })
  }

  onSubmit = e => {
    e.preventDefault();
    const flag = this.state.flag;
    const solution = { flag };
    const conf = {
      method: 'POST',
      body: JSON.stringify(solution),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    fetch('api/flags/', conf).then((response) => {return response.json()}).then(retJSON => this.setState({trueFlag: retJSON['flag']}));
  }

  render() {
    return (
      <div className="App">
        <div className="form">
          <div className="tab-content">
            <div className="field-wrap">
              <input id="0"
                className="signupInput"
                onChange={this.handleflagChanged.bind(this)}
                required
                placeholder="Challenge Solution"
                autoComplete="off"/>
            </div>
            <button type="submit" 
              className="button button-block"
              onClick={this.onSubmit.bind(this)}>Get Flag</button>
            {this.state.trueFlag && <div className='flag-row'>
              {this.state.trueFlag}
            </div>}
          </div>  
        </div>
      </div>
    );
  }
}