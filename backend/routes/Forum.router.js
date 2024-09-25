import express from 'express';
import { authenticateJWT } from '../middlewares/Auth.js';
import * as postController from '../controllers/ForumPost_controller.js';
import * as threadController from '../controllers/ForumThread_controller.js';
import * as CategoryController from '../controllers/ForumCategory_controller.js';

const forum = express.Router();

//post
forum.get('/posts/:postId', authenticateJWT, postController.getPost);
forum.get('/threads/:threadId/posts', authenticateJWT, postController.getThreadPosts);
forum.post('/threads/:threadId/posts', authenticateJWT, postController.createPost);
forum.put('/posts/:postId', authenticateJWT, postController.updatePost);
forum.delete('/posts/:postId', authenticateJWT, postController.deletePost);

//thread
forum.get('/threads/:threadId', authenticateJWT, threadController.getThread);
forum.get('/categories/:categoryId/threads', authenticateJWT, threadController.getCategoryThreads);
forum.post('/categories/:categoryId/threads', authenticateJWT, threadController.createThread);
forum.put('/threads/:threadId', authenticateJWT, threadController.updateThread);
forum.delete('/threads/:threadId', authenticateJWT, threadController.deleteThread);

//categories
forum.get('/categories', authenticateJWT, CategoryController.getCategories);
forum.get('/categories/:categoryId', authenticateJWT, CategoryController.getCategory);
forum.post('/categories', authenticateJWT, CategoryController.createCategory);
forum.put('/categories/:categoryId', authenticateJWT, CategoryController.updateCategory);
forum.delete('/categories/:categoryId', authenticateJWT, CategoryController.deleteCategory);


export default forum;
