import * as repository from '../repositories/ProductRespository.js';


export const createProduct = async (data , file) => {
     
  const {
    name,
    descrption,
    price,
    category
    
  } = data;

  
  if (!name?.trim()){

    throw new Error('Nome é Obrigatorio');
  }

  if(!descriptio?.trim()){
    throw new Error('Descrição é obrigatória');
  }

  if( price === undefined || price === '') {
    throw new Error ('Preço é obrigatório' )
  }

  if(!category?.trim()){
     throw new Error('Categorua é Obrigatória');
  }

  //Imagem
  const image = file ? `uploads/${file.filename}` : null ;

  const result = await repository.create({

    name: name.trim(),
    descrption:descrption.trim(),
    price,
    category: category.trim(),
    image
  });
};

export const  getProductById = async (id) => {

    if(!id) {
        throw new Error('Id do produto é obrigatorio');
    }

    const products = await repository.findById(id);

    return products;
};

export const getAllProduct = async (page= 0, limit=10) => {

  if ( page < 0 ){
       throw new Error('Pagina Inválida');
  }

  if(limit <= 0) {
    throw new Error('Limite inválido');
  }

  //Paginação

  const offset = page*limit;

  const products = await repository.findAll(
    limit,
    offset
  );

  // total
  const total = await repository.count();

  return{
    data: products,
    totalCount: total.total,
    page,
    limit
  };

};

export const uploadProduct = async ( id, data, file ) => {

    if (!id) {
        throw new Error('Id do produto é obrigatório');
    }

    const {
        name,
        description,
        price,
        category
    } = data;

    //Validação
    if(!name?.trim()){
        throw new Error('Nome é obrigatório');
    }

    if(!description?.trim()){
        throw new Error('Descrição é obrigatória');    
    }

    if ( price === undefined || price === null || ' '){
        throw new Error('Preço é obrigatório');
    }

    if(!category?.trim()){
        throw new Error('Categoria é obrigatória')
    }

    //Buscar Produto

    const existinProduct = await repository.findById(id);

    if(!existinProduct){

        throw new Error('Produto não encontrado');
    }


    //Imagem
    const image = file ? `uploads/${file.filename}` : image;

    //Atualizar
    const result = await repository.update(id,{
        name: name.trim(),
        description: description.trim(),
        price,
        category: category.trim(),
        image
    });


    return {
        message : 'Produto deletado com sucesso'
    };
};

export const deleteProduct = async ( id ) => {

if( !id) {
     throw new Error('Id do produto é obrigatório');
}

const result = await repository.remove(id);

if(result.changes === 0){
    throw new Error('Produto não encontrado');
}

return {
    message: 'Produto deletado com sucesso '
};

}