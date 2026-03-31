import jwt from "jsonwebtoken";

export const isAuth = async (req,res,next)=>{
  try {
    const token = req.cookie.token;
     if(!token){
            return res.status(401).json({
                message:'User not authenticated',
                success:false
            });
        }

        const result = await jwt.verify(token, process.env.SECRET_KEY);
        if(!result){
            return res.status(401).json({
                message:'Invalid',
                success:false
            });
        }
        req.id = result.userId;
        next();
  } catch (error) {
    console.log(error)
  }
}