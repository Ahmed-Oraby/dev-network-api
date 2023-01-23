const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const { validatePost, validatePostId } = require('../middleware/validatePost');
const validateId = require('../../libs/validateId');

const router = express.Router();

//get all posts as pages
router.get('/', verifyToken, async (req, res) => {
  try {
    const pageNumber = Number(req.query.page_number) || 1;
    const pageSize = Number(req.query.page_size) || 10;
    const posts = await Post.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort('-date')
      .populate([
        {
          path: 'user',
          select: 'name avatar',
        },
        {
          path: 'likes',
          populate: { path: 'user', select: 'name avatar' },
        },
        {
          path: 'comments',
          populate: { path: 'user', select: 'name avatar' },
        },
      ]);

    res.send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

//create new post
router.post('/', [verifyToken, validatePost], async (req, res) => {
  try {
    const post = new Post({
      user: req.body.user.id,
      text: req.body.text,
    });

    await post.save();
    await post.populate('user', 'name avatar');
    res.send(post);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

//get post by id
router.get('/:post_id', verifyToken, async (req, res) => {
  try {
    const postId = req.params.post_id;

    if (!validateId(postId)) {
      return res.status(404).send({ message: 'Post was not found.' });
    }

    const post = await Post.findById(postId).populate([
      {
        path: 'user',
        select: 'name avatar',
      },
      {
        path: 'likes',
        populate: { path: 'user', select: 'name avatar' },
      },
      {
        path: 'comments',
        populate: { path: 'user', select: 'name avatar' },
      },
    ]);
    if (!post) {
      return res.status(404).send({ message: 'Post was not found.' });
    }

    res.send(post);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

//get posts by user id
router.get('/user/:user_id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.user_id;
    if (!validateId(userId)) {
      return res.status(404).send({ message: 'User was not found.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User was not found.' });
    }

    const pageNumber = req.query.page_number || 1;
    const pageSize = req.query.page_size || 10;
    const posts = await Post.find({ user: userId })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort('-date')
      .populate([
        {
          path: 'user',
          select: 'name avatar',
        },
        {
          path: 'likes',
          populate: { path: 'user', select: 'name avatar' },
        },
        {
          path: 'comments',
          populate: { path: 'user', select: 'name avatar' },
        },
      ]);

    res.send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

//delete a post
router.delete('/:post_id', verifyToken, async (req, res) => {
  try {
    const postId = req.params.post_id;

    if (!validateId(postId)) {
      return res.status(404).send({ message: 'Post was not found.' });
    }

    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).send({ message: 'Post was not found.' });
    }

    res.send({ message: 'Post was deleted.' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

//edit a post
router.put('/:post_id', [verifyToken, validatePost], async (req, res) => {
  try {
    const postId = req.params.post_id;

    if (!validateId(postId)) {
      return res.status(404).send({ message: 'Post was not found.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: 'Post was not found.' });
    }

    post.text = req.body.text;
    post.isEdited = true;
    await post.save();
    await post.populate([
      {
        path: 'user',
        select: 'name avatar',
      },
      {
        path: 'likes',
        populate: { path: 'user', select: 'name avatar' },
      },
      {
        path: 'comments',
        populate: { path: 'user', select: 'name avatar' },
      },
    ]);

    res.send(post);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

//like a post
router.put('/like/:post_id', verifyToken, async (req, res) => {
  try {
    const postId = req.params.post_id;

    if (!validateId(postId)) {
      return res.status(404).send({ message: 'Post was not found.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: 'Post was not found.' });
    }

    const liked = post.likes.find(
      (item) => item.user.toString() === req.body.user.id
    );
    if (liked) {
      return res
        .status(400)
        .send({ message: 'Post already liked by this user.' });
    }

    post.likes.unshift({ user: req.body.user.id });
    await post.save();
    await post.populate([
      {
        path: 'user',
        select: 'name avatar',
      },
      {
        path: 'likes',
        populate: { path: 'user', select: 'name avatar' },
      },
      {
        path: 'comments',
        populate: { path: 'user', select: 'name avatar' },
      },
    ]);

    res.send(post);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

//unlike a post
router.put('/unlike/:post_id', verifyToken, async (req, res) => {
  try {
    const postId = req.params.post_id;

    if (!validateId(postId)) {
      return res.status(404).send({ message: 'Post was not found.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: 'Post was not found.' });
    }

    const liked = post.likes.find(
      (item) => item.user.toString() === req.body.user.id
    );
    if (!liked) {
      return res
        .status(400)
        .send({ message: 'Post is not liked by this user.' });
    }

    const removeIndex = post.likes.indexOf(liked);
    post.likes.splice(removeIndex, 1);
    await post.save();
    await post.populate([
      {
        path: 'user',
        select: 'name avatar',
      },
      {
        path: 'likes',
        populate: { path: 'user', select: 'name avatar' },
      },
      {
        path: 'comments',
        populate: { path: 'user', select: 'name avatar' },
      },
    ]);

    res.send(post);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

//add a comment
router.put(
  '/comment/:post_id',
  [verifyToken, validatePost],
  async (req, res) => {
    try {
      const postId = req.params.post_id;

      if (!validateId(postId)) {
        return res.status(404).send({ message: 'Post was not found.' });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: 'Post was not found.' });
      }

      const newComment = {
        user: req.body.user.id,
        text: req.body.text,
      };
      post.comments.unshift(newComment);

      await post.save();
      await post.populate([
        {
          path: 'user',
          select: 'name avatar',
        },
        {
          path: 'likes',
          populate: { path: 'user', select: 'name avatar' },
        },
        {
          path: 'comments',
          populate: { path: 'user', select: 'name avatar' },
        },
      ]);

      res.send(post);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

//delete a comment
router.delete(
  '/comments/:post_id/:comment_id',
  verifyToken,
  async (req, res) => {
    try {
      const postId = req.params.post_id;
      const commentId = req.params.comment_id;

      if (!validateId(postId) || !validateId(commentId)) {
        return res.status(404).send({ message: 'Post/Comment was not found.' });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: 'Post was not found.' });
      }

      const comment = post.comments.find(
        (item) => item.id.toString() === commentId
      );
      if (!comment) {
        return res.status(404).send({ message: 'Comment was not found.' });
      }

      const removeIndex = post.comments.indexOf(comment);
      post.comments.splice(removeIndex, 1);

      await post.save();
      await post.populate([
        {
          path: 'user',
          select: 'name avatar',
        },
        {
          path: 'likes',
          populate: { path: 'user', select: 'name avatar' },
        },
        {
          path: 'comments',
          populate: { path: 'user', select: 'name avatar' },
        },
      ]);

      res.send(post);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

//edit a comment
router.put(
  '/comments/:post_id/:comment_id',
  [verifyToken, validatePost],
  async (req, res) => {
    try {
      const postId = req.params.post_id;
      const commentId = req.params.comment_id;

      if (!validateId(postId) || !validateId(commentId)) {
        return res.status(404).send({ message: 'Post/Comment was not found.' });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: 'Post was not found.' });
      }

      const comment = post.comments.find(
        (item) => item.id.toString() === commentId
      );
      if (!comment) {
        return res.status(404).send({ message: 'Comment was not found.' });
      }

      comment.text = req.body.text;

      await post.save();
      await post.populate([
        {
          path: 'user',
          select: 'name avatar',
        },
        {
          path: 'likes',
          populate: { path: 'user', select: 'name avatar' },
        },
        {
          path: 'comments',
          populate: { path: 'user', select: 'name avatar' },
        },
      ]);

      res.send(post);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
