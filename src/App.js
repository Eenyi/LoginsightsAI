import About from "./pages/about/About";
import Admin from "./pages/admin/Admin";
import Contact from "./pages/contact/Contact";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import CustomQuery from "./pages/customQuery/customQuery";
import { useSelector } from "react-redux";

function App() {
  const currentScreen = useSelector((state) => state?.currentScreen);
  return (
    <>
    {currentScreen === "login" && <Login />}
    {currentScreen === "contact" && <Contact />}
    {currentScreen === "about" && <About />}
    {currentScreen === "user" && <Home/>}
    {currentScreen === "admin" && <Admin/>}
    {currentScreen === "customQuery" && <CustomQuery/>}
    </>
  );
}

export default App;
