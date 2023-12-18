import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSelector } from "react-redux";
import { useThunk } from "../utils/useLoadingThunk";
import { useEffect, useState } from "react";
import { signInThunk } from "../redux/Thunks/signInUser";
import OAuth from "../components/OAuth";

const SingIn = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [doSignIn, isSignInSuccess, isSignInLoading, isSignInError] =
    useThunk(signInThunk);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user.name) navigate("/profile");
  }, [navigate, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form1Data = new FormData();
    formData.email && form1Data.append("email", formData.email);
    formData.password && form1Data.append("password", formData.password);
    doSignIn(form1Data);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign IN</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="p-3 rounded-lg border"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="p-3 rounded-lg border"
          onChange={handleChange}
        />
        <Button
          loading={isSignInLoading}
          className="bg-slate-700 text-white rounded-lg h-12 hover:opacity-95 disabled:opacity-80"
        >
          SIGN IN
        </Button>

        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p className="mr-7">Dont have an account ?</p>
        <Link to="/sign-up" className="text-blue-700">
          Sign UP
        </Link>
      </div>
      <div className="text-center text-red-500 mt-4">
        {isSignInError && isSignInError}
      </div>
      <div className="text-center text-green-500 mt-4">
        {isSignInSuccess && "Signed In Successfully"}
      </div>
    </div>
  );
};

export default SingIn;
