import { useEffect, useState } from "react";
import estate from "../assets/land.png";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    // window.history.pushState({}, "", `/search?searchTerm=${searchTerm}`);
  };
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <div className="bg-slate-200 shadow-md">
      <div className=" flex justify-between items-center max-w-3xl  mx-auto p-3 ">
        <Link to={"/"} className="flex gap-1">
          <img src={estate} alt="Sezai-estate" className="w-[30px] h-[30px]" />
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Sezai</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-slate-100 p-3 rounded-lg"
        >
          <input
            type="text"
            placeholder="Search..."
            className="text-xs sm:text-sm bg-transparent focus:outline-none w-24 sm:w-64"
            onChange={handleSearchTermChange}
            value={searchTerm}
          />
          <button>
            <AiOutlineSearch />
          </button>
        </form>
        <nav>
          <ul
            className="flex gap-4
          "
          >
            <li>
              <NavLink
                to="/"
                activeclassname="active"
                className="hover:underline"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                activeclassname="active"
                className="hover:underline"
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                activeclassname="active"
                className="hover:underline"
              >
                {user.name ? (
                  <img
                    className="h-6 w-6 rounded-full mt-0.5 "
                    src={user.avatar}
                  />
                ) : (
                  "Sign In"
                )}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
