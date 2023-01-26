const fs = require("fs")

const Post = require("../modles/post")

const getPost =  (req, res) => {
  try {
  
    Post.find().sort({'_id':-1})
      .then((posts) => {
       res.status(200).json(posts);
    })

  } catch {
    res.status(500).json({ message: "Не удалось получить список самолетов, повторите попытку познее" });
  }
};

const getPostId =  (req, res) => {
  try {
    
    Post.findById(req.params.id)
      .then((post) => {
       res.status(200).json(post);
    })      
   
  } catch {
    res.status(500).json({ message: "Не удалось получить новость, повторите попытку познее" });
  }
};

const delPostId =  (req, res) => {
  try {
    // Получаем все самолеты из Монго
    Post.deleteOne({_id: req.params.id})
      .then((post) => {
       res.status(200).json(post);
    })      
   
  } catch {
    res.status(500).json({ message: "Не удалось получить новость, повторите попытку познее" });
  }
};

const createPost =  (req, res) => {
  try {
    const files = req.files.files;
    let paths = []
    if (files) {
      
      files.map(item => {
        paths.push(`${process.env.EDDFILES}:${process.env.PORT}/static/${item.filename}`)
      })
    }

    console.log(req.body)
    const { titleNew, titlePage, views, imgAlt, linkDocument, date, content } = req.body;
    // Получаем все самолеты из Монго
    Post.create({
      titletextindex: titlePage,
      titleimgindex: `${req.files.file ? `${process.env.EDDFILES}:${process.env.PORT}/static/${req.files.file[0].filename}` : ''}`,
      imgindexalt: imgAlt,
      title: titleNew,
      pageimg: paths,
      content: content,
      views: views,
      date: date,
      linkas: linkDocument,
    })
      .then((post) => {
       res.status(200).json(post);
    })      
   
  } catch {
    res.status(500).json({ message: "Не удалось создать запись" });
  }
};

const editPost =  (req, res) => {
  try {
    const files = req.files.files;
    let paths = []
    if (req.body.oldfiles && typeof req.body.oldfiles == "object") {
      paths = [...req.body.oldfiles]
    } 
    if (req.body.oldfiles && typeof req.body.oldfiles == "string") {
      paths.push(req.body.oldfiles)
    } 

    console.log(paths)
    if (files) {     
      files.map(item => {       
        paths.push(`${process.env.EDDFILES}:${process.env.PORT}/static/${item.filename}`)
      })
    }

    const { titleNew, titlePage, views, imgAlt, linkDocument, date, content } = req.body;
  
    Post.updateOne({_id: req.params.id}, {
      titletextindex: titlePage,
      titleimgindex: `${typeof req.files.file == "object" ? `${process.env.EDDFILES}:${process.env.PORT}/static/${req.files.file[0].filename}` : req.body.file}`,
      imgindexalt: imgAlt,
      title: titleNew,
      pageimg: paths,
      content: content,
      views: views,
      date: date,
      linkas: linkDocument,
    })
      .then((post) => {
       res.status(200).json(post);
    })      
   
  } catch {
    res.status(500).json({ message: "Не удалось создать запись" });
  }
};



const delImgFromArrayId =  (req, res) => {
  try {    
    Post.updateOne({_id: req.params.id}, {$pull: {pageimg: req.body.name}})
      .then((post) => {
        res.status(200).json(post);
        // console.log(__dirname +`${req.body.name}`)
        // fs.unlink(`${req.body.name}`, (err) => {
        //   if (err) throw err;        
        //   console.log('Deleted');
        // });
        
    })         
  } catch {
    res.status(500).json({ message: "Не удалось удалить изображение," });
  }
};

const delImgById =  (req, res) => {
  try {    
    console.log(req.body.name)
    console.log(req.params.id)
    Post.updateOne({_id: req.params.id}, {titleimgindex: ''})
      .then((post) => {
       res.status(200).json(post);
    })         
  } catch {
    res.status(500).json({ message: "Не удалось удалить изображение," });
  }
};


module.exports = {
  getPost,
  getPostId,
  delPostId,
  createPost,
  editPost,
  delImgFromArrayId,
  delImgById

};

// `${req.file ? `http://localhost:${process.env.PORT}/static/${req.file.filename}` : ''}`

// `${req.files.file ? `http://localhost:${process.env.PORT}/static/${req.files.file[0].filename}` : ''}`