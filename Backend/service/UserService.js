import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import{
createUser,
findUserByEmail

} from '../repositories/UserRepository';
import { use } from 'react';

dotenv.config();

export const registerUser = async ({
 name,
 email,
 password,
 role = 'user'
})  => {

const user = await findUserByEmail(email);

 if(user){
    throw new Error("Email ja registrado");
  }
 
 const hashedPasword = await bcrypt.hash(password,10);

  const userId = await createUser(
    name,
    email,
    hashedPasword,
    role    
  );
  return userId;
}



export const loginUser = async({
email,
password
}) => {

const user = await findUserByEmail(email)

if(!user){
    throw new Error('Usuário não encontrado.');
}

const isPasswordValid = await bcrypt.compare(
password,
user.password
);

if(!isPasswordValid){
    throw new Error('Senha invalida');
}

const token = jwt.sign(
    {
        id: user.id,
        role: use.role

    },
    JWT_SECRET,
    {
        expiresIn: '1d'
    });

    return {
        token,
        user:{
            id:  user.id,
            name: user.name,
            email: user.email,
            role:user.role
        }
    };
};
