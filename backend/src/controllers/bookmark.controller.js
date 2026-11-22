import { bookmarkQuerySchema } from "../validators/bookmark.validator.js";

import {
  addBookmark as addBookmarkService,
  removeBookmark as removeBookmarkService,
  getMyBookmarks as getMyBookmarksService,
} from "../services/bookmark.service.js";

// Applicant adds a bookmark.
export const addBookmark = async (req, res, next) => {
  try {
    const bookmark = await addBookmarkService(
      req.user.id,
      req.params.jobId
    );

    return res.status(201).json({
      success: true,
      message: "Job bookmarked successfully.",
      data: { bookmark },
    });
  } catch (error) {
    next(error);
  }
};

// Applicant removes a bookmark.
export const removeBookmark = async (req, res, next) => {
  try {
    await removeBookmarkService(
      req.user.id,
      req.params.jobId
    );

    return res.status(200).json({
      success: true,
      message: "Bookmark removed successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Applicant retrieves their bookmarks.
export const getMyBookmarks = async (req, res, next) => {
  try {
    const filters = bookmarkQuerySchema.parse(req.query);

    const result = await getMyBookmarksService(
      req.user.id,
      filters
    );

    return res.status(200).json({
      success: true,
      message: "Bookmarks fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};