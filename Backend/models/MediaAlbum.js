const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MediaAlbumSchema = new Schema(
  {
    name:        { type: String, required: true, trim: true, maxlength: 100 },
    slug:        { type: String, trim: true, lowercase: true },
    description: { type: String, trim: true, maxlength: 500 },
    coverImage:  { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
    createdBy:   { type: String, default: 'admin', index: true },
  },
  { timestamps: true }
);

MediaAlbumSchema.index({ name: 'text', description: 'text' });

module.exports = {
  MediaAlbum: model('MediaAlbum', MediaAlbumSchema)
};
