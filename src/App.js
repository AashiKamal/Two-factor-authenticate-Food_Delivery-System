//Importing all the important files from same directory
import './App.css';
import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import MyOrder from './screens/MyOrder';
import TwoFAc from './screens/TwoFAc';
import VerifyOTP from './screens/VerifyOTP';//new......................






//Import all the react components from routing library
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";





//importing of bootstrap frpm nodemodules because images were not change dynamic application
import "../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"


import { CartProvider } from './components/ContextReducer';





function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            

            <Route exact path="/createuser" element={<Signup />} />
            <Route exact path="/myorder" element={<MyOrder />} />
            <Route exact path="/createtotp" element={<TwoFAc />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
          </Routes>

        </div>
      </Router>
    </CartProvider>

  );
}




export default App;