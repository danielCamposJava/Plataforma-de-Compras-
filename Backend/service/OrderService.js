import{
    findOrdeByUserId,
    createOrder,
    createOrderItem,
    finAllOrderWithItems,
    updateOrderStatus

} from '../repositories/OrderRepository.js';


import {notifyNewOrder} from '../server.js';

//BUSCAR PEDIDOS DO USUÁRIO 

export const gerUserOrderService = async (userId) => {
    const orders = await findOrdeByUserId( userId);
    return orders

}

//CRIAR PEDIDO 

export const createOrderService = async ({
  userId,
  total,
  paymentMethod,
  customerName ='',
  discount = 0,
  cartItems,
}) => {

    //Cacula o valor final 
    
    const totalAmount = Number(total) - Number(discount);

    if(totalAmount < 0) {

        throw new Error('Valor total de pedido invalido');
    }

    const orderId = await createOrder({
        userId,
        total : totalAmount,
        paymentMethod,
        customerName,
        phoneNumber,
        discount
    });


    // Criar items do pedido 

    for ( const item of cartItems ) {
            
        if (!item.productId) {
            throw new Error(
                ' Item do carrinho sem productId'
            );
        }

        await createOrderItem({
           orderId,
           foodId: item.productId,
           quantity: item.quantity,
           price:item.price,
           name: item.name || '',
           description: item.description || '',
           image: item.image || ''
            
        });
    } 

    // Buscar items criados 

    const  items = await findOrdeItems(orderId);


    //Montar Pedido Completo 

    const NewOrderData = { 
     id: orderId, 
     user_id: userId,
     total: totalAmount,
     payment_method: paymentMethod, 
     customer_name: customerName, 
     phone_number: phoneNumber, 
     discount, 
     status: 'Pendente', 
     items
    }

    notifyNewOrder(NewOrderData);

    // Retorna Resultado 
    return {
        orderId,
        order: NewOrderData
    }

}


// CRIAR ITEM DO PEDIDO 

export const createOrderItemService = async ({

    orderId,
    foodId,
    quantity, 
    price, 
    name, 
    description, 
    image

}) => {

    if(!orderId){
        throw new Error(
            'orderId é obrigatório'
        );
    }
    
    if(!quantity || quantity <= 0) {
        throw new Error(
            'Quantidade invalida'
        );
    }

    if(price == null || price < 0) {
        throw new Error(
            'Preço invalido '
        );
    }

    const orderItemId = await createOrderItem({
         orderId, foodId, quantity, 
         price, name: name || '',
         description: description || '', 
         image: image || ''

    });
    
    return orderItemId;
};


// BUSCAR ITEMS DO PEDIDO

export const getOrderItemsService = async ( orderId) => {


    if(!orderId) {

        throw new Error('Id do pedido é obrigatório')
    }

    const items = await finAllOrderWithItems(orderId)

   return items;
}

// ATUALIZAR STATUS 

export const updateOrderStatus = async (

    id,
    status
) => {


if (!id) {

    throw new Error(
        'Id do pedido é obrigatório'
    );
}

if (!status){
    throw new Error( 
        'Status do pedio é obrigatório'
    )
}


const changes = await updateOrderStatus(
    id,
    status
);

if ( changes === 0 ) {

    const error = new Error (

        'Pedido não econtrado '
    );

    error.statusCode = 404;

    throw error;
}

return true;

}