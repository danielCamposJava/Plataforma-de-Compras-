import * as categoryRepository from '../repositories/categoryRepository.js';

export const createCategory = async( title, image) => {

    if(!title?.trim()){
        throw new Error('Categoria é obrigatória');
    }

    if(!image){
        throw new Error('Imagem é obrigatoria');
    }

    return await categoryRepository.create(title,image);

};

export const getAllCategories = async () => {
  
    return await categoryRepository.findAll();

}

export const renameCategory = async ( id , title) => {

    if(!id ){

        throw new Error('Id é obrigatório');
    }
   
    if(!title?.trim()) {
        
        throw new Error('Novo nome é obrigatório');
    }

   const update = await categoryRepository.updateName(id, title);

   if( update === 0) {
    throw new Error('Categoria não encontrada');
   }

   return update ;

}

export const deleteCategory  = async (id) => {

  if(!id) {

    throw new Error("Id é obrigatório");
  }

  const deleted = await categoryRepository.remove(id);

  if (deleted === 0) {

    throw new Error('Categoria não econtrada');
  }

  return deleted;

}