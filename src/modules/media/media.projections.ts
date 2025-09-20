/** Predefined projection objects for querying MediaRecords in MongoDB. */
export const MediaProjections = {
  /** Required fields for uploads list */
  uploadsList: { s3Key: 1, createdAt: 1, _id: 0 },

  /** Full details excluding internal MongoDB fields */
  fullDetails: { _id: 0, __v: 0 }
};
