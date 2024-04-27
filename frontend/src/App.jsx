import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../src/pages/Home"
import About from "../src/pages/About"
import Profile from "../src/pages/Profile"
import SignIn from "../src/pages/SignIn"
import SignUp from "../src/pages/SignUp"
import Header from "../src/components/Header"

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-out" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
