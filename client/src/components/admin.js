import React from 'react'
import Typography from "@material-ui/core/Typography";

export default class Admin extends React.Component {
  constructor(){
    super()
    this.state = ({})
  }

  render() {
    return(
      <Typography component="span" variant="h4">
            <h4 className='yellow'>Admin Home</h4>
          </Typography>
    )
  }


}