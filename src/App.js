import { Component } from 'react';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Map from './components/Map/Map';
import './App.css';
import Particles from 'react-particles-js';

var axios = require('axios');
var qs = require('qs');

const particlesOptions = {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 500
      }
    }
  }
}

let accessToken = "empty";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const authenticate = new Promise (function(resolve,reject) {
    console.log("Starting authenticate");
    var data = qs.stringify({
        'grant_type': 'password',
        'username': 'hallam-c',
        'password': '6&m_gHw5'
    });
    var config = {
        method: 'post',
        url: 'https://hallam.sci-toolset.com/api/v1/token',
        headers: {
            'Authorization': 'Basic YjIxNjZlODAtYjczMi00NDA4LTkyZjEtYzUzYTUyM2YyMTIzOjc5YzAwNjMwNDY1Mzk3MTNlMWFkOTljM2EyYWIyNGUyZmQ3ODdiZDM3YWRjYTU4MWUxMWNiYzk1MWZkYWM1ODM=',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            accessToken = response.data.access_token;
            console.log("the received access token: " + accessToken);
            resolve('token recovered and saved');
            
        })
        .catch(function (error) {
            console.log(error);
            reject('error recovering token: '+error);
        });

});

async function getMissions(access_token) {
    console.log("Starting getMissions() with token: " + access_token);
    var config = {
        method: 'get',
        url: 'https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Host': 'hallam.sci-toolset.com',
            'Authorization': 'Bearer ' + access_token
        }
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    return;

};

  authenticate.then (function authenticated(response) {
        console.log("the Token: " + accessToken);
        getMissions(accessToken);
    }).catch(() => {
        console.log("error");
    }); 

class App extends Component {
  constructor() {
    super();
    this.state = {
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        joined: ''      
      }
    }
  }


  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      joined: data.joined  
    }})
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home'
          ? <div>
              <Logo />
              <Map />
            </div>
          : (
             this.state.route === 'signin'
             ? <Signin onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }             
}

export default App;

