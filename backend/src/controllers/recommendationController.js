import { getRecommendedEvents } from '../utils/recommendationEngine.js';

// @desc    Get recommended events for current user
// @route   GET /api/recommendations
// @access  Private (student)
export const getRecommendations = async (req, res, next) => {
  try {
    const scored = await getRecommendedEvents(req.user);

    res.json(
      scored.map((item) => ({
        score: item.score,
        event: item.event
      }))
    );
  } catch (error) {
    next(error);
  }
};

