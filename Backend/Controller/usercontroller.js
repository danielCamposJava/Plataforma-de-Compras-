import{

  registerUser,
  loginUser
} from '../service/UserService'


export const register = async ( req , res ) =>{

    const{
      name,
      email,
      password,
      role
    } = req.body;

    if( !name || !email || !password){

      return res.status(400).jsom({
          message: 'Todos os campos são obrigatórios.'
      });
    }

    try{

      const userId = await registerUser({
        name,
        email,
        password,
        role
        });

        return res.status(201).json({
            message: 'Usuário registrado com sucesso !',
            userId
        });

    }catch(err){
      return res.status(400).json({
          message:err.message

      });
    }
};

export const login = async (req, res)  => {
  const{
    email,
    password
  } = req.body;

   if ( !email || !password){
    
    return res.status(400).json({
      message:'Todos os campos são obrigatórios.'
    });
   }

   try{
    const result = await loginUser({
      email,
      password
    });

    return res.status(200).json({
      message: 'Login bem-sucedido!',
      ...result
    });

   } catch (err){
      return res.status(401).json({
           message: err.message
      });
   }
}
