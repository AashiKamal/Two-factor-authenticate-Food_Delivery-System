
// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom';

// export default function Login() {
//   const [credentials, setcredentials] = useState({ email: "", password: "" })
//   let navigate = useNavigate();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const response = await fetch("http://localhost:5000/api/loginuser", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ email: credentials.email, password: credentials.password })
//     })
//     const json = await response.json()
//     console.log(json);
//     if (!json.success) {
//       alert("Enter valid credentials");
//     }
//     if (!json.success) {
//       navigate("/login");
//     }
//     if (json.success) {
//       localStorage.setItem("userEmail", credentials.email);
//       localStorage.setItem("authToken", json.authToken);
//       console.log(localStorage.getItem("authToken"))
//       navigate("/")
//     }

//   }
//   const onChange = (event) => {
//     setcredentials({ ...credentials, [event.target.name]: event.target.value })
//   }
//   return (
//     <>
//       <div>
//         <div className="container">
//           <form onSubmit={handleSubmit}>

//             <div className="mb-3">
//               <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
//               <input type="email" className="form-control" name="email" value={credentials.email} onChange={onChange} id="exampleInputEmail1" aria-describedby="emailHelp" />
//               <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
//             </div>
//             <div className="mb-3">
//               <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
//               <input type="password" className="form-control" name="password" value={credentials.password} onChange={onChange} id="exampleInputPassword1" />
//             </div>

//             <button type="submit" className="btn btn-success">Submit</button>
//             <Link to="/createuser" className="m-3 btn btn-danger">I am a new user</Link>
//           </form>
//         </div>
//       </div>
//     </>
//   )
// }
// //hello

















































import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [redirectToVerification, setRedirectToVerification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/loginuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password })
      });
      const json = await response.json();
      console.log(json);
      if (!json.success) {
        alert("Enter valid credentials");
      } else {
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("authToken", json.authToken);
        console.log(localStorage.getItem("authToken"));

        try {
          const checkTOTPResponse = await fetch("http://localhost:5000/api/checktotp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: credentials.email })
          });
          const checkTOTPJson = await checkTOTPResponse.json();
          console.log(checkTOTPJson);
          if (checkTOTPJson.success && checkTOTPJson.secretKeyExists) {
            setRedirectToVerification(true);
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("An error occurred while checking secret key:", error);
        }
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  if (redirectToVerification) {
    navigate("/verify-otp");
  }

  return (
    <>
      <div>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                id="exampleInputPassword1"
              />
            </div>
            <button type="submit" className="btn btn-success">
              Submit
            </button>
            <Link to="/createuser" className="m-3 btn btn-danger">
              I am a new user
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
