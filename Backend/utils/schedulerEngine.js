const Blog = require('../models/Blog');

const checkScheduledBlogs = async () => {
  try {
    const now = new Date();
    const scheduledBlogs = await Blog.find({
      status: 'SCHEDULED',
      scheduledAt: { $lte: now }
    });

    if (scheduledBlogs.length > 0) {
      for (const blog of scheduledBlogs) {
        blog.status = 'PUBLISHED';
        blog.publishedAt = blog.scheduledAt || now;
        await blog.save();
        console.log(`[AutoScheduler] Blog "${blog.title}" (${blog.slug}) auto-published at ${now.toISOString()}`);
      }
    }
  } catch (error) {
    console.error('[AutoScheduler] Error checking scheduled blogs:', error.message);
  }
};

const startSchedulerEngine = (intervalMs = 60000) => {
  console.log('⏰ Blog Scheduled Publishing Engine started (checking every 60s)...');
  checkScheduledBlogs();
  setInterval(checkScheduledBlogs, intervalMs);
};

module.exports = { startSchedulerEngine };
