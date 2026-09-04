import db from "../config/database";

export const create = async (products) => {
   const sql =  `

     INSERT INTO products
     (name,description,price,category,image)
     VALUES(?,?,?,?,?)

     `;

  return await db.run(sql,[
   
     products.name,
     products.description,
     products.price,
     products.category,
     products.image
  
    ]);

};

export const findById= async (id) =>
    {
        return await db.get(

            'SELECT * FROM products  WHERE id = ? ',
            [id]           
            
        );
  
};

export const findAll = async(limit, offset) => {
  
    if(limit && offset >= 0){

        return await db.all(
           
            'SELECT * FROM products LIMIT ? OFFSET ',
            [limit,offset]
            
        );
    }
};


export const count = async () => {
    return await db.get(
          
        'SELECT COUNT(*) as total FROM products'
    
    );
}

export const update = async (id, products) => {

    const sql = `
        UPDATE products
        SET
            name = ?,
            description = ?,
            price = ?,
            category= ?,
            image = ?,
        WHERE id = ?    
    
    `;

    return await db.run( sql,[
      
        products.name,
        products.description,
        products.price,
        products.category,
        products.image,
        id
    
    ]);
};


export const remove = async (id) => {
   
    return await db.run(
        'DELETE FROM products WHERE id = ? ',
        [id]
    );
};
