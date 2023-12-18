import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useThunk } from "../utils/useLoadingThunk";
import { useSelector } from "react-redux";
import { showListingThunk } from "../redux/Thunks/showListing";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import { updateListingThunk } from "../redux/Thunks/updateListing";

const UpdateListing = () => {
  const { user } = useSelector((state) => state.auth);
  const { listing } = useSelector((state) => state.listings.listing);
  const [showedFiles, setShowedFiles] = useState([]);
  const [formData, setFormData] = useState({
    userRef: user.id,
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    baths: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    files: [],
  });
  const params = useParams();
  const navigate = useNavigate();

  const [
    doListingInfo,
    isDoListingInfoSuccess,
    isListingInfoLoading,
    isListingInfoError,
  ] = useThunk(showListingThunk);

  const [
    doListingUpdate,
    isListingUpdateSuccess,
    isListingUpdateLoading,
    isListingUpdateError,
  ] = useThunk(updateListingThunk);

  useEffect(() => {
    doListingInfo(params.id);
  }, [doListingInfo, params.id]);

  useEffect(() => {
    if (!formData.name) {
      setFormData({ ...listing, files: [] });
    }
  }, [listing]);

  useEffect(() => {
    if (isListingUpdateSuccess) {
      navigate(`/show-listing/${listing._id}`);
    }
  }, [isListingUpdateSuccess]);

  console.log("Test");

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const files1 = Object.values(files);
    if (files1.length > 1) {
      files1.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setShowedFiles((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });

      setFormData({ ...formData, files: files1 });
    }
  };

  const handleFileDelete = (index) => {
    const deletedAndUpdatedShowedFiles = [
      ...showedFiles.slice(0, index),
      ...showedFiles.slice(index + 1),
    ];
    const deletedAndUpdatedFormDataFiles = [
      ...formData.files.slice(0, index),
      ...formData.files.slice(index + 1),
    ];

    setShowedFiles(deletedAndUpdatedShowedFiles);
    setFormData((prev) => ({ ...prev, files: deletedAndUpdatedFormDataFiles }));
  };

  const renderedUploadedImage = showedFiles.map((file, index) => {
    return (
      <div key={index} className="flex items-center justify-between">
        <img src={file} alt="" className="w-[128px] p-4 h-[128px]" />
        <span
          className="text-red-500 text-2xl cursor-pointer"
          onClick={() => handleFileDelete(index)}
        >
          Delete
        </span>
      </div>
    );
  });

  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else if (
      e.target.id === "name" ||
      e.target.id === "description" ||
      e.target.id === "address" ||
      e.target.id === "discountPrice" ||
      e.target.id === "regularPrice" ||
      e.target.id === "bedrooms" ||
      e.target.id === "baths"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData1 = new FormData();

    for (const key in formData) {
      formData1.append(key, formData[key]);
    }
    formData.files.forEach((file1) => formData1.append("files", file1));

    doListingUpdate(formData1);
  };

  let content;

  if (isListingInfoLoading) {
    content = <Skeleton className="w-[800px] h-16 m-auto mt-5" times={8} />;
  } else if (isListingInfoError) {
    content = <div> {isListingInfoError} </div>;
  } else {
    formData.name &&
      (content = (
        <div className="p-3 max-w-4xl mx-auto">
          <h1 className="text-center font-extrabold text-2xl mb-4 p-2">
            Update The Listing
          </h1>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className=" flex flex-col gap-4">
              <input
                value={formData.name}
                id="name"
                maxLength="62"
                minLength="10"
                onChange={handleChange}
                className="rounded-lg p-2"
                type="text"
                placeholder="Name"
                required
              />
              <textarea
                value={formData.description}
                id="description"
                onChange={handleChange}
                className="rounded-lg p-2"
                type="text"
                placeholder="Description"
                required
              />
              <input
                value={formData.address}
                id="address"
                onChange={handleChange}
                className="rounded-lg p-2"
                type="text"
                placeholder="Address"
                required
              />
              <div className="flex gap-4">
                <div>
                  <input
                    type="checkbox"
                    id="sell"
                    onChange={handleChange}
                    checked={formData.type === "sell"}
                  />
                  <label> Sell</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="rent"
                    onChange={handleChange}
                    checked={formData.type === "rent"}
                  />
                  <label> Rent</label>
                </div>
                <div>
                  <input
                    checked={formData.parking}
                    type="checkbox"
                    id="parking"
                    onChange={handleChange}
                  />
                  <label> Parking Spot</label>
                </div>
                <div>
                  <input
                    checked={formData.furnished}
                    type="checkbox"
                    id="furnished"
                    onChange={handleChange}
                  />
                  <label> Furnished</label>
                </div>
              </div>
              <div>
                <input
                  checked={formData.offer}
                  type="checkbox"
                  id="offer"
                  onChange={handleChange}
                />
                <label> Offer</label>
              </div>
              <div className="flex gap-3">
                <div>
                  <input
                    type="number"
                    id="bedrooms"
                    min="1"
                    max="10"
                    className="rounded-lg p-3 border border-gray-300"
                    value={formData.bedrooms}
                    onChange={handleChange}
                  />
                  <label> Beds</label>
                </div>
                <div>
                  <input
                    type="number"
                    id="baths"
                    min="1"
                    max="10"
                    className="rounded-lg p-3 border border-gray-300"
                    value={formData.baths}
                    onChange={handleChange}
                  />
                  <label> Baths</label>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="10000000"
                  className="rounded-lg p-3 border border-gray-300"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <label className="flex flex-col">
                  <span>Regular Price</span>
                  {formData.type === "rent" && <span>($/Month)</span>}
                </label>
              </div>
              {formData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="10000000"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p>Discounted price</p>

                    {formData.type === "rent" && (
                      <span className="text-xs">($ / month)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <p className="mb-3">
                <span className="font-bold">Images:</span> The first image will
                be cover (max 6)
              </p>
              <input
                type="file"
                className="border p-2"
                onChange={handleImageUpload}
                accept="image/*"
                multiple
              />
              <Button
                loading={isListingUpdateLoading}
                className="text-white bg-slate-700 rounded-lg h-9 mt-4"
              >
                Update Listing
              </Button>
              {renderedUploadedImage}
              <div>{isListingInfoError && isListingInfoError}</div>
              <div>{isListingUpdateError && isListingUpdateError}</div>
              <div className="text-green-400 mt-12 text-2xl">
                {isListingUpdateSuccess && "Successfully Updated"}
              </div>
            </div>
          </form>
        </div>
      ));
  }

  return (
    <div>
      <div>{content}</div>
    </div>
  );
};

export default UpdateListing;
