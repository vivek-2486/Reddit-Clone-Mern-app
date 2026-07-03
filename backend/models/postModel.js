import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    subreddit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subreddit",
      required: true,
    },

    upVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    downVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);
postSchema.statics.getRankedFeed = async function (page, limit) {
  const gravity = 1.8;
  const skip = (page - 1) * limit;

  return this.aggregate([
    {
      $addFields: {
        timeElapsedHours: {
          $divide: [
            { $subtract: ["$$NOW", "$createdAt"] },
            3600000
          ]
        }
      }
    },
    {
      $addFields: {
        score: {
          $divide: [
            {
              $add: [
                {
                  $subtract: [
                    { $size: "$upVotes" },
                    { $size: "$downVotes" }
                  ]
                },
                1
              ]
            },
            {
              $pow: [
                { $add: ["$timeElapsedHours", 2] },
                gravity
              ]
            }
          ]
        }
      }
    },

    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator"
      }
    },
    {
      $unwind: "$creator"
    },

    {
      $lookup: {
        from: "subreddits",
        localField: "subreddit",
        foreignField: "_id",
        as: "subreddit"
      }
    },
    {
      $unwind: "$subreddit"
    },

    {
      $sort: { score: -1 }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    }
  ]);
};

export default mongoose.model("post", postSchema);