

const User = require("../modles/user")
const bcrypt = require('bcrypt');

const authUser = async (req, res) => {
  try {  
    const { name, password } = req.body; 
   
    // создание нового пользователя
//     const salt = await bcrypt.genSalt(10)
//     const passwordHash = await bcrypt.hash(password, salt)

//     const doc = new User({
//       name: name,
//       password:passwordHash
//     })
// const user = await doc.save()

     const candidat = await User.findOne({ name: name })
     console.log(candidat)
      if (!candidat) {
      return  res.status(400).json({massege:"Не верный логин или пароль"})        
    } 
    const validPassword = bcrypt.compareSync(password, candidat.password);
    if (!validPassword) {
      return  res.status(400).json({massege:"Не верный логин или пароль"})        
    } 
    res.status(200).json({hash:candidat.password, auth:true}) 
  } catch {
    res.status(500).json({ message: "Ошибка" });
  }
};



const authHash = async (req, res) => {
  try {  
    const { hash } = req.body; 
     const candidat = await User.findOne({ password: hash })    
      if (!candidat) {
      return  res.status(400).json({auth:false})        
    } 
   
    res.status(200).json({auth:true}) 
  } catch {
    res.status(500).json({ message: "Ошибка" });
  }
};



module.exports = {
  authUser,
  authHash

};

// `${req.file ? `http://localhost:${process.env.PORT}/static/${req.file.filename}` : ''}`

// `${req.files.file ? `http://localhost:${process.env.PORT}/static/${req.files.file[0].filename}` : ''}`