import ForumThread from '../models/ForumThread.js';

export const getThread = async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await ForumThread.findById(threadId).populate('user');
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving thread' });
  }
};

export const getCategoryThreads = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const threads = await ForumThread.find({ category: categoryId }).populate('user');
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching threads' });
  }
};

export const createThread = async (req, res) => {
  const { categoryId } = req.params;
  const { title, content, user } = req.body;

  try {
    const newThread = new ForumThread({
      title,
      content,
      user,
      category: categoryId
    });

    const savedThread = await newThread.save();
    res.status(201).json(savedThread);
  } catch (error) {
    res.status(500).json({ message: 'Error creating thread' });
  }
};

export const updateThread = async (req, res) => {
  const { threadId } = req.params;
  const { title, content } = req.body;

  try {
    const updatedThread = await ForumThread.findByIdAndUpdate(threadId, { title, content }, { new: true });
    if (!updatedThread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    res.json(updatedThread);
  } catch (error) {
    res.status(500).json({ message: 'Error updating thread' });
  }
};

export const deleteThread = async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await ForumThread.findByIdAndDelete(threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    res.json({ message: 'Thread deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting thread' });
  }
};
