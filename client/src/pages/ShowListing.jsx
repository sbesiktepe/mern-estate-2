import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useThunk } from "../utils/useLoadingThunk";
import { showListingThunk } from "../redux/Thunks/showListing";
import Skeleton from "../components/Skeleton";
import { Swiper, SwiperSlide } from "swiper/react"; // only npm install swiper (these 4 import can be imported with that)
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";

const ShowListing = () => {
  SwiperCore.use([Navigation]);
  const { listing } = useSelector((state) => state.listings.listing);

  const params = useParams();
  const [doShowListing, _, isShowListingLoading, isShowListingError] =
    useThunk(showListingThunk);
  const [copied, setCopied] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    doShowListing(params.id);
  }, [params.id]);

  let content;

  if (isShowListingLoading) {
    content = <Skeleton className="w-[800px] h-16 m-auto mt-5" times={8} />;
  } else if (isShowListingError) {
    content = <div> {isShowListingError} </div>;
  } else {
    listing &&
      (content = (
        <div>
          <Swiper navigation>
            {listing.files.length > 0 ? (
              listing.files.map((file, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${
                        file.url ||
                        "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                      }) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))
            ) : (
              <div
                className="h-[550px]"
                style={{
                  background: `url(https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            )}
          </Swiper>
          <div
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
            className="hover:opacity-95 opacity-80 fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer"
          >
            <FaShare className="text-slate-500 hover:opacity-80" />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            {!user.name && (
              <p className="text-red-700 text-2xl">
                Please Log-on to send message to Landlord
              </p>
            )}
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  $
                  {(
                    +listing.regularPrice - +listing.discountPrice
                  ).toLocaleString("en-us")}{" "}
                  OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.baths} baths `
                  : `${listing.baths} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {user.name && listing.userRef !== user.id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      ));
  }

  return (
    <div>
      <div>{content}</div>
    </div>
  );
};

export default ShowListing;
