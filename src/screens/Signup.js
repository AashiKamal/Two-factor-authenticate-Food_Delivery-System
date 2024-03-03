import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom'

export default function Signup() {
  let navigate = useNavigate()
  const [credentials, setcredentials] = useState({ name: "", email: "", password: "", geolocation: "" })
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password, geolocation: credentials.geolocation })
    })
    const json = await response.json()
    console.log(json);
    // if (!json.success) {
    //   alert("Enter valid credentials");
    // }
    if (json.success) {
      //save the auth toke to local storage and redirect
      localStorage.setItem('token', json.authToken)
      navigate("/")

    }
    //add after to check duplicate emails
    else 
      if (json.message === 'Email already in use') {
        alert("Email already exists. Please use a different email.");
      }
    else {
      alert("Enter Valid Credentials")
    }

  }
  const onChange = (event) => {
    setcredentials({ ...credentials, [event.target.name]: event.target.value })
  }
  return (
    <>
      <div className="container">
        {/* //connect to backend */}
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" name="name" value={credentials.name} onChange={onChange} />

          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" className="form-control" name="email" value={credentials.email} onChange={onChange} id="exampleInputEmail1" aria-describedby="emailHelp" />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={credentials.password} onChange={onChange} id="exampleInputPassword1" />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Address</label>
            <input type="text" className="form-control" name="geolocation" value={credentials.geolocation} onChange={onChange} id="exampleInputPassword1" />
          </div>



          <button type="submit" className="btn btn-success">Submit</button>
          <Link to="/login" className="m-3 btn btn-danger">Already a user</Link>
        </form>
      </div>
    </>
  )
}
