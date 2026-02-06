import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// Simple scoring-based recommendation engine
export const getRecommendedEvents = async (user) => {
  const now = new Date();

  // Get upcoming events with open registration
  const events = await Event.find({
    dateTime: { $gte: now }
  }).populate('society', 'name');

  if (!events.length) return [];

  // Get user's past registrations
  const registrations = await Registration.find({
    user: user._id,
    status: 'registered'
  }).populate('event', 'category');

  const categoryHistoryCount = {};
  registrations.forEach((reg) => {
    const cat = reg.event?.category;
    if (cat) {
      categoryHistoryCount[cat] = (categoryHistoryCount[cat] || 0) + 1;
    }
  });

  const viewedEventIds = new Set(
    (user.viewedEvents || []).map((v) => String(v.event))
  );

  const interestsSet = new Set(user.interests || []);

  const scored = events.map((event) => {
    let score = 0;

    // 1. Interest match
    if (interestsSet.has(event.category)) {
      score += 50;
    }

    // 2. History boost
    const historyCount = categoryHistoryCount[event.category] || 0;
    score += historyCount * 10;

    // 3. Viewed boost (if seen before, small boost)
    if (viewedEventIds.has(String(event._id))) {
      score += 5;
    }

    // 4. Time proximity (earlier events get small boost)
    const hoursUntil = (event.dateTime - now) / (1000 * 60 * 60);
    if (hoursUntil > 0) {
      score += Math.max(0, 20 - Math.min(hoursUntil, 20)); // 0-20
    }

    // 5. Penalty if registration effectively closed
    if (!event.shouldBeOpen()) {
      score -= 100;
    }

    return { event, score };
  });

  // Filter out very low scores
  const filtered = scored.filter((item) => item.score > 0);

  filtered.sort((a, b) => b.score - a.score);

  return filtered;
};

