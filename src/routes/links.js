const express = require('express');
const router = express.Router();

const pool=require('../database');
router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add',async (req, res) => {
    const {title,url,description}=req.body;
    const newlink={
        title,url,description
    };
    await pool.query('INSERT INTO LINKS set ?',[newlink]);
    req.flash('success','Link saved successfully');
    res.redirect('/links');
});
router.get('/',async (req, res) => {
    const links=await pool.query('SELECT * FROM LINKS');
    res.render('links/list',{links});
});

router.get('/delete/:id',async (req, res) => {
    const {id}=req.params;
    await pool.query('DELETE FROM links WHERE ID=?',[id]);
    req.flash('success','Link Removed Successfully');
    res.redirect('/links');
});
router.get('/edit/:id',async (req, res) => {
    const {id}=req.params;
    const links=await pool.query('SELECT * FROM LINKS WHERE id=?',[id]);
    res.render('links/edit',{link:links[0]});
});
router.post('/edit/:id',async (req, res) => {
    const {title,description,url}=req.body;
    const  {id}=req.params;

    const newlink={title,description,url};
    await pool.query('UPDATE links set ? WHERE id=?',[newlink,id]);
    req.flash('success','Link Updated Successfully');
    res.redirect('/links');
});

module.exports=router;
