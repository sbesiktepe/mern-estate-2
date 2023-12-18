import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpThunk } from "../redux/Thunks/addUser";
import { useThunk } from "../utils/useLoadingThunk";
import Button from "../components/Button";
import OAuth from "../components/OAuth";
import { useSelector } from "react-redux";
const SignUp = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [doUser, isSuccess, isLoading, isError] = useThunk(signUpThunk);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user.name) navigate("/profile");
  }, [navigate, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form1Data = new FormData();
    formData.name && form1Data.append("name", formData.name);
    formData.password && form1Data.append("password", formData.password);
    formData.email && form1Data.append("email", formData.email);
    doUser(form1Data);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign UP</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          value={formData.name}
          type="text"
          placeholder="Name"
          className="p-3 rounded-lg border"
          id="name"
          onChange={handleChange}
        />
        <input
          value={formData.email}
          type="email"
          placeholder="Email"
          id="email"
          className="p-3 rounded-lg border"
          onChange={handleChange}
        />
        <input
          value={formData.password}
          type="password"
          placeholder="Password"
          id="password"
          className="p-3 rounded-lg border"
          onChange={handleChange}
        />
        <Button
          loading={isLoading}
          className="bg-slate-700 text-white rounded-lg h-12 hover:opacity-95 disabled:opacity-80"
        >
          SIGN UP
        </Button>

        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p className="mr-7">Have an account ?</p>
        <Link to="/sign-in" className="text-blue-700">
          Sign IN
        </Link>
      </div>
      <div className="text-center text-red-500 mt-4">{isError && isError}</div>
      <div className="text-center text-green-500 mt-4">
        {isSuccess && "Succefully Signed UP"}
      </div>
    </div>
  );
};

export default SignUp;
