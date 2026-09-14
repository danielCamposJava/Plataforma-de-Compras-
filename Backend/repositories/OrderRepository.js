import db from '../config/database.js'

export const findOrdeByUserId = (UserId) => {
  
    return new Promise((resolve, reject) => {
   const query = `
   SELECT*FROM
   orders WHERE user_id = ?
   ORDER BY id DESC
   `;

   db.all(query, [UserId],(err,rows) =>{

     if(err){
         return reject(err)
     }

     resolve(rows);

   });
  });
};

export const createOrder = ({
userId,
total,
paymentMethod,
customerName,
phoneNumber,
discount
}) =>{

    return new Promise((resolve,reject) =>{
      const query = `
         INSERT INTO orders(
          user_id,
          total,
          payment_method,
          customer_name,
          phone_number,
          discount,
          status
         )
          VALUES (?,?,?,?,?,? 'Pendent')
         `; 
        
        db.run( query,[userId,total,paymentMethod,customerName,phoneNumber,discount],
            function(err){
                if(err) {

                return reject(err);
                }
                resolve(this.lastID);
            });
        });
};

export const createOrderItem = ({
    orderId,
    foodId,
    quantity,
    price,
    name,
    description,
    image
}) => {
   return new Promise((resolve,reject) =>{
    const query = `
    INSERT INTO order_items(
    order_id,
    food_id,
    quantity,
    price,
    name,
    description,
    image
    )
    VALUES(?,?,?,?,?,?,?)
    `;

    db.run(
        query,[orderId,foodId,quantity,price,name,description,image],
       
        function(err){
           if(err) {

            return(this.lastID);
           }
        },
        
        resolve(this.lastID)
    );
   });
}

export const finAllOrderWithItems = () => {
    return new Promise((resolve,reject)=>{
       const query = `
       
        SELECT
        o.id AS order_id,
        o.user_id,
        o.total,
        o.payment_method,
        o.customer_name,
        o.phone_number,
        o.discount,
        o.status,
        o.created_at,

        oi.id AS order_item_id,
        oi.food_id,
        oi.quantity,
        oi.price,
        oi.name AS item_name,
        oi.description AS item_description,
        oi.image AS item_image

      FROM orders o

      LEFT JOIN order_items oi
        ON o.id = oi.order_id

      ORDER BY o.id DESC, oi.id

       `;

       db.all( query, [], (err, rows) => {
          if(err){
            return reject(err);
          }
          resolve(rows);
       });
    });
};

export const updateOrderStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE orders
      SET status = ?
      WHERE id = ?
    `;

    db.run(query, [status, id], function (err) {
      if (err) {
        return reject(err);
      }

      resolve(this.changes);
    });
  });
};