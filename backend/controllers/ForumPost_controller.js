import ForumPost from '../models/ForumPost.js';

export const getPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await ForumPost.findById(postId).populate('user');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving post' });
  }
};

export const getThreadPosts = async (req, res) => {
  const { threadId } = req.params;

  try {
    const posts = await ForumPost.find({ thread: threadId }).populate('user');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export const createPost = async (req, res) => {
  const { threadId } = req.params;
  const { title, content, user, category } = req.body;

  try {
    const newPost = new ForumPost({
      title,
      content,
      user,
      category,
      thread: threadId
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    const updatedPost = await ForumPost.findByIdAndUpdate(postId, { title, content }, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post' });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await ForumPost.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
};
