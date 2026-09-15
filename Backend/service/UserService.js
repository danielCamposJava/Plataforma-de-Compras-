
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import {
    createUser,
    findUserByEmail
} from '../repositories/UserRepository.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// VERIFICAR JWT_SECRET

if (!JWT_SECRET) {
    throw new Error(
        'JWT_SECRET não foi configurado no arquivo .env'
    );
}

// CADASTRO

export const registerUser = async ({
    name,
    email,
    password,
    role = 'user',
    cnpj = null
}) => {

    const user = await findUserByEmail(email);

    if (user) {
        throw new Error('Email já registrado');
    }

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    const userId = await createUser(
        name,
        email,
        hashedPassword,
        role,
        cnpj
    );

    return userId;
};

// LOGIN

export const loginUser = async ({
    email,
    password
}) => {

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error(
            'Usuário não encontrado.'
        );
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error(
            'Senha inválida'
        );
    }


    // GERAR TOKEN

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: '1d'
        }
    );

    // RETORNAR USUÁRIO

    return {
        token,

        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            cnpj: user.cnpj || null
        }
    };
};
