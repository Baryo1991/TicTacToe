import './App.css';
import React, {useEffect} from 'react'
import { io } from 'socket.io-client'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import HomeScreen from './Screens/HomeScreen/HomeScreen';
import GameScreen from './Screens/GameScreen/GameScreen'

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
            <Route path = '/game' component = {GameScreen} /> 
            <Route path = '/' component = {HomeScreen} /> 
        </Switch>
      </Router>
    </div>
  );
}

export default App;
