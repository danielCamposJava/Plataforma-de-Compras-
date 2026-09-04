
import * as  service from '../service/ProductService.js';

export const  createProduct = async (req,res) => {


   try{
            const product = await service.createProduct(
                
                req.body,
                req.file
            
             );

            return res.status(201).json(product);
        
   } catch(error){
            
      console.error(
        ' Erro ao criar produto:',
        error
      );

        return res.status(400).json({
        message: err.message
      
    });
   }
};

export const getCreateById = async (req,res) => {

   try {
    
     const {id} = req.params;
     const product = await service.getProductById(id);

     return res.status(200).json(product);


   }catch(error){
      
    console.error('Erro ao buscar produto:: ', error);

    return res.status(400).json({ message: error.message});
   
  }
};

export const getAllProduct = async (req,res) =>{

    try{
        const page =
        Number(req.query.page ?? 0 );

        const limit =
        Number(req,query.limit ?? 10 );

        const result = await service.getAllProduct(
            page,
            limit
        );

        return res.status(200).json(result);

    }catch(error){
       
        console.error(
            'Erro ao busca alimentos',
            error
        );

        return res.status(500).json({
            message:error.message
        });
    }
};


export const  updateProduct= async (req,res) => {

  try{

    const { id } = req.params;

    const product =  await service.uploadProduct(
      
        id,
        req.body,
        req.file
    
    );

    return res.status(200).json({

    });


  }catch( error){
     
    console.error( 'Erro ao atualizar alimento: ',
    error
    
    );    
    return res.status(400).json({
        message:error.message
    });     
  }
};


export const deleteProduct = async (req,res) => {

    try{

        const {id } = req.params;
        const result = await service.deleteProduct(id);

        return res.status(200).json(result);

    }catch(error) {

        return res.status(404).json({
        message:error.message
       
    });
 }
        
};