import { useEffect, useState } from "react";
import Button from "../components/Button";
import ListingItem from "../components/ListingItem";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setIsLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/searchListing?${searchQuery}`);
      const data = await res.json();
      if (data.message.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data.message);
      setIsLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "all" ||
      e.target.id === "sale" ||
      e.target.id === "rent"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }

    if (e.target.id === "sort_order") {
      setSideBarData({
        ...sideBarData,
        sort: e.target.value.split("_")[0],
        order: e.target.value.split("_")[1],
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setSideBarData({ ...sideBarData, [e.target.id]: e.target.checked });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/searchListing?${searchQuery}`);
    const data = await res.json();
    console.log(data);
    if (data.message.length > 8) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
    setListings([...listings, ...data.message]);
  };

  return (
    <div className="flex divide-x h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col p-4 gap-4  ">
        <div>
          <label className="text-red-500">Search Term: </label>
          <input
            id="searchTerm"
            type="text"
            className="rounded-md p-2"
            onChange={handleChange}
            value={sideBarData.searchTerm}
          />
        </div>

        <div className="flex gap-3">
          <label className="text-red-500">Type : </label>
          <div>
            <label>Rent & Sale </label>
            <input
              id="all"
              onChange={handleChange}
              checked={sideBarData.type === "all"}
              type="checkbox"
            />
          </div>
          <div>
            <label>Rent </label>
            <input
              id="rent"
              onChange={handleChange}
              checked={sideBarData.type === "rent"}
              type="checkbox"
            />
          </div>
          <div>
            <label>Sale </label>
            <input
              id="sale"
              onChange={handleChange}
              checked={sideBarData.type === "sale"}
              type="checkbox"
            />
          </div>
          <div>
            <label>Offer </label>
            <input
              id="offer"
              type="checkbox"
              onChange={handleChange}
              checked={sideBarData.offer}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <label className="text-red-500">Amenities : </label>
          <div>
            <label>Parking </label>
            <input
              id="parking"
              type="checkbox"
              onChange={handleChange}
              checked={sideBarData.parking}
            />
          </div>
          <div>
            <label>Furnished </label>
            <input
              id="furnished"
              type="checkbox"
              onChange={handleChange}
              checked={sideBarData.furnished}
            />
          </div>
        </div>
        <div>
          <label className="text-red-500">Sort: </label>

          <select
            onChange={handleChange}
            className="ml-2 p-2 rounded-md border"
            id="sort_order"
            defaultValue={"createdAt_desc"}
          >
            <option value="createdAt_desc">Latest</option>
            <option value="createdAt_asc">Oldest</option>
            <option value="regularPrice_desc">Price high to low</option>
            <option value="regularPrice_asc">Price low to high</option>
          </select>
        </div>
        <Button
          loading={isLoading}
          className="bg-slate-700 text-white p-2 rounded-lg"
        >
          Search
        </Button>
      </form>
      <div className="p-4">
        <h2 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5 ">
          Listing Results:{" "}
        </h2>
        <div className="p-7 flex flex-wrap gap-4">
          {!isLoading && listings?.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {isLoading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!isLoading &&
            listings?.length > 0 &&
            listings?.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
