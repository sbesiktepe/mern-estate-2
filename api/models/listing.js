import mongoose from "mongoose";

const listingSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    files: {
      public_path: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      type: Array,
      required: true,
    },

    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const listingModel = mongoose.model("listing10", listingSchema);
