import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./Component/loginPage"
// import Dashboard from "./Component/dashboard"
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Home from "./Component/ChatRoom";

const Router = () => {
  const [user] = useAuthState(auth);
  console.log('user',user);
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/dashboard" element={user &&  <Home/>}/>
        </Routes> 
    </BrowserRouter>
  )
}

export default Router
