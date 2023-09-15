const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

//all users
router.get('/', async (req, res) => {
    try {
        const Users = await User.findAll({
            attributes: {exclude : ['[password]']}
        });
        return res.json(Users);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// GET user by id
router.get('/:id', async (req, res) => {
    try {
        const ExistingUser = await User.findOne({
            attributes: { exclude: ['password'] },
            where: {
              id: req.params.id
            },
            include: [
              {
                model: Post,
                attributes: [
                    'id', 
                    'title', 
                    'content', 
                    'created_at']
              },
              // include the Comment model here:
              {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                  model: Post,
                  attributes: ['title']
                }
              },
              {
                model: Post,
                attributes: ['title'],
              }
            ]
          })
          if(!ExistingUser){
            return res.status(404).json({message : "User With This ID Not Found"})
          }
          else {
            return res.json(ExistingUser);
          }
    } catch (error) {
        return res.status(500).json(error)
    }
});

//User Registration
router.post('/', async (req, res) => {
    try {
      // Expects { username: 'Lernantino', password: 'password1234' }
      const { username, password } = req.body;
  
      // Create a new user in the database
      const dbUserData = await User.create({
        username,
        password,
      });
  
      // Store user data during session
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
  
      req.session.save(() => {
        return res.status(201).json(dbUserData);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });
  
//User Login
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      // Find a user with the provided username
      const dbUserData = await User.findOne({
        where: {
          username,
        },
      });
  
      if (!dbUserData) {
        return res.status(400).json({ message: 'Username Not Found!' });
      }
  
      // Verify user's password
      const validPassword = await dbUserData.checkPassword(password);
  
      if (!validPassword) {
        return res.status(400).json({ message: 'Incorrect Password!' });
      }
  
      // Store user data in the session
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
  
      req.session.save(() => {
        return res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });

//Log Out 
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            return res.status(204).end();
        });
    } else {
        return res.status(404).end();
    }
});

//Update User by ID
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Update the user record with the provided ID
      const [updatedRows] = await User.update(req.body, {
        where: {
          id,
        },
      });
  
      if (!updatedRows) {
        return res.status(404).json({ message: 'User With This ID Not Found' });
      }
  
      res.json(updatedRows);
    } catch (error) {
      console.log(error);
      return res.status(500).json(err);
    }
  });
  

//Delete User by ID
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Delete the user record with the provided ID
      const deletedRows = await User.destroy({
        where: {
          id,
        },
      });
  
      if (!deletedRows) {
        return res.status(404).json({ message: 'No user found with this id' });
      }
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  });
  

module.exports = router;