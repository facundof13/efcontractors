import React from 'react'
import { Redirect } from 'react-router-dom'

export default class Auth extends React.Component {
  constructor() {
    super()
  }

  render() {
    return(
      <Redirect to="/" />
    )
  }
}