const router = require('express').Router();
const { Post, User, Comment} = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const Posts = await Post.findAll({
        attributes: ['id', 
                    'title',
                    'content',
                    'created_at'
                    ],
        order: [['created_at', 'DESC']],          
        include: [
            {
            model: User,
            attributes: ['username']
            },
            {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
            }
        ]
    })
    return res.json(Posts);  
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET a single post 
router.get('/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ['id', 'content', 'title', 'created_at'],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });

    if (!dbPostData) {
      return res.status(404).json({ message: 'No post found with this id' });
    }

    return res.json(dbPostData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});


// creating a post
router.post('/', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });
    return res.json(dbPostData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});


// update a post title
router.put('/:id', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!dbPostData[0]) {
      return res.status(404).json({ message: 'No post found with this id' });
    }

    return res.json(dbPostData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});


// delete a post 
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!dbPostData) {
      return res.status(404).json({ message: 'No post found with this id' });
    }

    return res.json(dbPostData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});


module.exports = router;