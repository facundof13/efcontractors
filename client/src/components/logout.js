import React from 'react'
import { Redirect } from 'react-router-dom'

export default class Logout extends React.Component {
  constructor() {
    super()
    this.state = {
      loggedOut: false
    }
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  componentDidMount() {
    fetch('/logout')
    .then(() => {
      this.setState({loggedOut: true})
      this.props.updateUser({
        loggedIn: false,
        username: ''
    })
    })
  }

  render() {
    if(this.state.loggedOut) {
      return <Redirect to='/' />
    }
    return(
      <h3>Logging out now, going home...</h3>
    )
  }

}

