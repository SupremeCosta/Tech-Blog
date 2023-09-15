const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//all comments
router.get('/', async (req, res) => {
    try {
        const Comments = await Comment.findAll();
        return res.json(Comments); 
    } catch (error) {
        return res.status(500).json(error);
    }
});

//comment by id
router.get('/:id', async (req, res) => {
    try {
        const IdComment = await Comment.findAll({
            where : { id : req.params.id }
        })
        return res.json("Hi");
    } catch (error) {
        return res.status(500).json(error);
    }
});


//create comment
router.post('/', withAuth, async (req, res) => {
    // check session
    if (req.session) {
        try {
            const CreatedComment = await Comment.create({
                comment_text: req.body.comment_text, 
                post_id: req.body.post_id,
                user_id: req.session.user_id,
            })
            return res.json(CreatedComment)
        } catch (error) {
            return res.status(400).json(error);
        }
    }
});

//update comment
router.put('/:id', withAuth, async (req, res) => {
    try {
        const ExistingComment = await Comment.findOne({
            where : { id: req.params.id }
        })
        if(!ExistingComment){
            return res.status(404).json({ message: "Comment With This ID Not Found"})
        }
        else {
            const UpdatedComment = await Comment.update(req.body, {
                where : { id : req.params.id }
            })
            return res.json(UpdatedComment);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});


//route to delete a comment
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const ExistingComment = await Comment.findOne({
            where : { id : req.params.id }
        })
        if (!ExistingComment){
            return res.status(404).json({message: "Comment With This ID Not Found"})
        }
        else {
            const DeletedComment = await Comment.destroy({
                where : { id : req.params.id }
            })
            return res.json()
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});


module.exports = router;