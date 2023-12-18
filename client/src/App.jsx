import { BrowserRouter, Routes, Route } from "react-router-dom";
import SingIn from "./pages/SingIn";
import SignUp from "./pages/SignUp";
import Header from "./layouts/Header";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import About from "./pages/About";
import Profile from "./pages/Profile";
import PrivateRoute from "./utils/PrivateRoute";
import { useDispatch } from "react-redux";
import { checkUser } from "./redux/Slices/auth";
import CreateListing from "./pages/CreateListing";
import ShowListing from "./pages/ShowListing";
import UpdateListing from "./pages/UpdateListing";
import Search from "./pages/Search";

function App() {
  const dispatch = useDispatch();

  dispatch(checkUser());

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SingIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:id" element={<UpdateListing />} />
        </Route>
        <Route path="/show-listing/:id" element={<ShowListing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
