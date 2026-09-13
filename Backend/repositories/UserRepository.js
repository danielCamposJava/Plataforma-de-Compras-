import db from '../config/database.js';



export const createUser =( name, email, password,role =' user') => {

    return new Promise((resolve, reject) => {
     
        const query = 'INSERT INTO users (name, email, password, role ) VALUES (?, ? , ? , ?)';
        db.run( query,[ name,email,password,role], function(err){
             if (err) return reject(err);

             resolve(this.lastID);
        } );
    });

};

export const findUserByEmail = (email) =>{
  return new Promise((resolve, reject) => { 
      const query = 'SELECT * FROM  users WHERE email = ? ';

      db.get( query, [email], (err, row) => {
             
              if (err) return reject(err);
              resolve(row);

      } ); 
  });
};


export const findUserById = (id) => {
  return new Promise((resolve,reject) => {
    const query = 'SELECT * FROM user WHER id = ? ';

    db.get(query, [id], ( err, row) => {
          
       if (err)  return reject(err);
       resolve(row);
    
    });
  });
};