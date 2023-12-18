import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { useRef, useState } from "react";
import { useThunk } from "../utils/useLoadingThunk";
import { signOutThunk } from "../redux/Thunks/signOutUser";
import { updateUserThunk } from "../redux/Thunks/userUpdate";
import { deleteUserThunk } from "../redux/Thunks/userDelete";
import InfoMessage from "../utils/InfoMessage";
import { showUserListingsThunk } from "../redux/Thunks/showUserListings";
import UserListings from "../components/UserListings";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { userListings } = useSelector((state) => state.listings.listing);
  const ref = useRef(null);
  const [doSignOut, isSignOutSuccess, isSignOutLoading, isSignOutError] =
    useThunk(signOutThunk);
  const [
    doUserUpdate,
    isUserUpdateSuccess,
    isUserUpdateLoading,
    isUserUpdateError,
  ] = useThunk(updateUserThunk);
  const [
    doUserDelete,
    isUserDeleteSuccess,
    isUserDeleteLoading,
    isUserDeleteError,
  ] = useThunk(deleteUserThunk);
  const [
    doShowUserListings,
    isShowUserListingsSuccess,
    isShowUserListingsLoading,
    isShowUserListingsError,
  ] = useThunk(showUserListingsThunk);
  const [avatarImage, setAvatarImage] = useState(undefined);
  const [formData, setFormData] = useState({
    id: user.id || null,
  });
  const [openShowListings, setOpenShowListings] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUserChangeSubmit = (e) => {
    e.preventDefault();
    const form1Data = new FormData();
    formData.avatar && form1Data.append("avatar", formData.avatar);
    formData.name && form1Data.append("name", formData.name);
    formData.password && form1Data.append("password", formData.password);
    formData.id && form1Data.append("id", formData.id);
    doUserUpdate(form1Data);
  };

  const handleSignOut = () => {
    doSignOut();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatarImage(reader.result);
        setFormData({ ...formData, avatar: file });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDeleteUser = () => {
    const confirmation = confirm("Kullanıcıyı Silmek için eminmisiniz ?");

    if (confirmation) {
      doUserDelete(formData.id);
    }
  };

  const handleShowListings = () => {
    if (!openShowListings) {
      setOpenShowListings(true);
      doShowUserListings(formData.id);
    } else {
      setOpenShowListings(false);
    }
  };

  const renderedShowUserListings =
    openShowListings &&
    userListings &&
    userListings.map((listing, index) => (
      <UserListings key={index} listing={listing} />
    ));

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleUserChangeSubmit}
        encType="multipart/form-data"
      >
        <input
          onChange={handleImageUpload}
          type="file"
          ref={ref}
          accept="image"
          hidden
        />
        <img
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={avatarImage ? avatarImage : user.avatar}
          onClick={() => ref.current.click()}
          alt="Uploaded"
        />
        <h2 className="text-center text-xl">{user.email}</h2>

        <input
          defaultValue={user.name}
          type="text"
          placeholder="Name"
          className="p-3 rounded-lg border"
          id="name"
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
          loading={isUserUpdateLoading}
          onClick={handleUserChangeSubmit}
          className="bg-slate-700 text-white rounded-lg h-12 hover:opacity-95 disabled:opacity-80"
        >
          UPDATE
        </Button>

        <Link to="/create-listing">
          <Button
            type="button"
            className="bg-green-700 text-white rounded-lg w-full h-12 hover:opacity-95 disabled:opacity-80"
          >
            CREATE LISTING
          </Button>
        </Link>
      </form>

      <div className="flex justify-between gap-2 mt-7">
        <Button
          loading={isUserDeleteLoading}
          onClick={handleDeleteUser}
          className="text-red-700"
        >
          Delete Account
        </Button>
        <Button
          onClick={handleSignOut}
          loading={isSignOutLoading}
          className="text-red-700"
        >
          Sign Out
        </Button>
      </div>
      <Link className="flex justify-center mt-7">
        <Button
          loading={isShowUserListingsLoading}
          onClick={handleShowListings}
          type="button"
          className={!openShowListings ? "text-green-700" : "text-red-700"}
        >
          {!openShowListings ? "Show Listings" : "Close Listings"}
        </Button>
      </Link>
      {userListings && openShowListings && (
        <div>
          <h1 className="text-center mt-7 text-2xl font-semibold mb-4">
            Your Listings
          </h1>
          {renderedShowUserListings}
        </div>
      )}
      <div className="text-center text-red-500 mt-4">
        {isSignOutError && <InfoMessage message={isSignOutError} />}
      </div>
      <div className="text-center text-red-500 mt-4">
        {isUserUpdateError && <InfoMessage message={isUserUpdateError} />}
      </div>
      <div className="text-center text-red-500 mt-4">
        {isUserDeleteError && <InfoMessage message={isUserDeleteError} />}
      </div>
      <div className="text-center text-green-500 mt-4">
        {isUserUpdateSuccess && <InfoMessage message="Successfully Updated" />}
      </div>
    </div>
  );
};

export default Profile;
