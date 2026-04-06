const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Group description is required'],
    },
    groupImg: {
      type: String,
    },
    groupImgId: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    memberPermissions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        permissions: [
          {
            type: String,
            enum: ['read', 'write', 'delete'],
          },
        ],
      },
    ],
  },
  { timestamps: true },
);
// Middleware to cascade delete posts when a group is deleted
groupSchema.pre('remove', async function (next) {
  await this.model('Post').deleteMany({ group: this._id });
});
const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
