import React from 'react'
import { Outlet,Link } from 'react-router-dom'
const Homebutton = () => {
  return (
    <div className='dash-cat'>
        <Link to="/"><button type="button" class="btn btn-primary btn-lg ">Home</button></Link>
     </div>
  )
}

export default Homebutton
