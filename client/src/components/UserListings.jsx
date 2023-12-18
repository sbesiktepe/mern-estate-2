import { Link } from "react-router-dom";
import Button from "./Button";
import { useThunk } from "../utils/useLoadingThunk";
import { deleteListingThunk } from "../redux/Thunks/deleteListing";
import { useSelector } from "react-redux";

const UserListings = ({ listing }) => {
  const { user } = useSelector((state) => state.auth);
  const [
    doDeleteListing,
    isDeleteListingSuccess,
    isDeleteListingLoading,
    isDeleteListingError,
  ] = useThunk(deleteListingThunk);

  const handleListingDelete = (id) => {
    const confirmation = confirm("Listing'i Silmek için eminmisiniz ?");
    if (confirmation) {
      doDeleteListing({ userId: user.id, listingId: id });
    }
  };

  return (
    <div
      key={listing._id}
      className=" border rounded-lg p-3 flex justify-between items-center gap-4"
    >
      <Link to={`/show-listing/${listing._id}`}>
        <img
          src={
            listing?.files[0]?.url ||
            "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
          }
          alt="listing cover"
          className="h-16 w-16 object-contain"
        />
      </Link>
      <Link
        to={`/show-listing/${listing._id}`}
        className="text-slate-700 font-semibold flex-1 hover:underline truncate"
      >
        <p>{listing.name}</p>
      </Link>
      <div className="flex flex-col">
        <Button
          loading={isDeleteListingLoading}
          onClick={() => handleListingDelete(listing._id)}
          className="text-red-700 uppercase"
        >
          Delete
        </Button>
        <Link to={`/update-listing/${listing._id}`}>
          <button className="text-green-700 uppercase">Edit</button>
        </Link>
      </div>
    </div>
  );
};

export default UserListings;
