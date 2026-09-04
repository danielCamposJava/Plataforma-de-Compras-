import db from '../config/database.js'

export const create = ( title, image  ) => {

    return new Promise((resolve,reject) =>{
            const sql = `
         INSERT INTO category(title, image)
         VALUES (?,?)
        `;

        db.run(sql,[title, image],  function (err) {

          if(err){
            reject(err);
          }

          resolve({
            id: this.lastID
          })

        });
    });
};

export const findAll = () => {
    
    return new Promise((resolve,reject) => {
    
        db.all(
        'SELECT * FROM cateogory', [],
        (err,rows) =>{
           
            if (err) {
                reject(err);
            }

            resolve(rows);
        });
    });
};

export const updateName = ( id , title) => {
    
    return new Promise((resolve,reject) => {
       const sql = `
        UPDATE category
        SET title = ?
        WHERE id = ? 
       `;
       
       db.run(sql, [title, id ], function (err){
        
        if(err) {
            reject(err)
        }

        resolve(this.changes);

       });
    });
};

export const remove = ( id ) => {

    return new Promise((resolve,reject) =>{

        const sql =`
         DELETE FROM category
         WHERE id = ? `;

         db.run(
            sql,[id], function(er){

            if(err){
                reject(err);
            }

            resolve(this.changes);
        });
    });
};