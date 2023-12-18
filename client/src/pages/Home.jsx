import { Link } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import { Swiper, SwiperSlide } from "swiper/react"; // only npm install swiper (these 4 import can be imported with that)
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";

const Home = () => {
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);

  useEffect(() => {
    const fetchOfferListings = async () => {
      const res = await fetch(`/api/listing/searchListing?offer=true&limit=4`);
      const data = await res.json();
      setOfferListings(data.message);
    };

    fetchOfferListings();
  }, []);

  useEffect(() => {
    const fetchRentListings = async () => {
      const res = await fetch(`/api/listing/searchListing?type=rent&limit=4`);
      const data = await res.json();
      setRentListings(data.message);
    };
    fetchRentListings();
  }, []);

  useEffect(() => {
    const fetchSaleListings = async () => {
      const res = await fetch(`/api/listing/searchListing?type=sale&limit=4`);
      const data = await res.json();
      setSaleListings(data.message);
    };
    fetchSaleListings();
  }, []);

  return (
    <div>
      <div className="p-28 max-w-6xl mx-auto">
        <h1 className="text-slate-700 text-6xl font-bold  ">
          Find your next <span className="text-slate-500">perfect</span>
          <span className="block">place with ease</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm py-5">
          Sezai Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </p>
        <Link
          to="/search"
          className="text-blue-800 font-bold hover:underline text-xs sm:text-sm"
        >
          Let's get started ...
        </Link>
      </div>
      <div>
        <Swiper navigation>
          {offerListings?.length > 0 &&
            offerListings.map((offerListing, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${offerListing.files[0].url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div className="px-28 py-20 gap-">
        <div className="pb-12">
          <h1 className="text-slate-500 font-semibold text-2xl">
            Recent Offers
          </h1>
          <Link to="/search?offer=true" className="text-blue-800 ">
            Show more offers
          </Link>
          <div className="flex flex-wrap gap-4 py-2">
            {offerListings?.map((offerListing, index) => (
              <ListingItem listing={offerListing} key={offerListing._id} />
            ))}
          </div>
        </div>
        <div className="pb-12">
          <h1 className="text-slate-500 font-semibold text-2xl">
            Recent places for rent
          </h1>
          <Link to="/search?type=rent" className="text-blue-800 ">
            Show more places for rent
          </Link>
          <div className="flex flex-wrap gap-4 py-2">
            {rentListings?.map((rentListing) => (
              <ListingItem listing={rentListing} key={rentListing._id} />
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-slate-500 font-semibold text-2xl">
            Recent places for sale
          </h1>
          <Link to="/search?type=sale" className="text-blue-800 ">
            Show more places for sale
          </Link>
          <div className="flex flex-wrap gap-4 py-2">
            {saleListings?.map((saleListing) => (
              <ListingItem listing={saleListing} key={saleListing._id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
