import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useThunk } from "../utils/useLoadingThunk";
import { createListingThunk } from "../redux/Thunks/createListing";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetIsCreatedListingId } from "../redux/Slices/listing";

const CreateListing = () => {
  const { isCreatedListingId } = useSelector((state) => state.listings.listing);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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
  const [
    doListingCreate,
    isListingCreateSuccess,
    isListingCreateLoading,
    isListingCreateError,
  ] = useThunk(createListingThunk);
  const [showedFiles, setShowedFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isListingCreateSuccess) {
      navigate(`/show-listing/${isCreatedListingId}`);
      dispatch(resetIsCreatedListingId());
    }
  }, [isListingCreateSuccess]);

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
    if (e.target.id === "sale" || e.target.id === "rent") {
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
    doListingCreate(formData1);
  };

  return (
    <div className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center font-extrabold text-2xl mb-4 p-2">
        Create a Listing
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
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <label> Sale</label>
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
              <input type="checkbox" id="parking" onChange={handleChange} />
              <label> Parking Spot</label>
            </div>
            <div>
              <input type="checkbox" id="furnished" onChange={handleChange} />
              <label> Furnished</label>
            </div>
          </div>
          <div>
            <input type="checkbox" id="offer" onChange={handleChange} />
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
            <span className="font-bold">Images:</span> The first image will be
            cover (max 6)
          </p>
          <input
            type="file"
            className="border p-2"
            onChange={handleImageUpload}
            accept="image/*"
            multiple
          />
          <Button
            loading={isListingCreateLoading}
            className="text-white bg-slate-700 rounded-lg h-9 mt-4"
          >
            Create Listing
          </Button>
          {renderedUploadedImage}
          <div>{isListingCreateError && isListingCreateError}</div>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
