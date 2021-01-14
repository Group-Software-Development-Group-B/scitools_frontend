import { Component } from 'react';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Map from './components/Map/Map';
import './App.css';
import Particles from 'react-particles-js';

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

let myHeaders = new Headers();
myHeaders.append("Authorization", "Basic YjIxNjZlODAtYjczMi00NDA4LTkyZjEtYzUzYTUyM2YyMTIzOjc5YzAwNjMwNDY1Mzk3MTNlMWFkOTljM2EyYWIyNGUyZmQ3ODdiZDM3YWRjYTU4MWUxMWNiYzk1MWZkYWM1ODM=");

let urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "password");
urlencoded.append("username", "hallam-b");
urlencoded.append("password", "GtA>9Ec?");

let requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("https://hallam.sci-toolset.com/api/v1/token", requestOptions)
  .then(response => response.json())
  .then(data => console.log(data))


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

