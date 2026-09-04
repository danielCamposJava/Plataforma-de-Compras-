import db from '../config/database.js'


export const createBooking = (req, res) => {
  const { user_id, table_id, name, phone, date, time } = req.body;

  if (!user_id || !table_id || !name || !phone || !date || !time) {
    return res.status(400).json({ message: 'Campos obrigatórios não fornecidos' });
  }

  const query = `
    INSERT INTO booking (user_id, table_id, name, phone, date, time)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [user_id, table_id, name, phone, date, time], function (err) {
    if (err) {
      console.error('Erro ao criar a reserva:', err.message);
      return res.status(500).json({ message: 'Erro interno ao criar reserva' });
    }

    return res.status(201).json({ message: 'Reserva criada com sucesso', bookingId: this.lastID });
  });
};
    //Lista de reservas 

    export const getAllBookings = (req, res) => {


      db.all('SELECT * FROM booking', [], (err, rows) => {

        if(err) return res.status(500).json({error: err.message})

          return res.status(200).json(rows)
      })
    }


    // Busvar reserva por ID 

    export const getBookingById = (req,res) =>{

    const {id} = req.params;

    db.get(

      'SELECT * FROM booking WHERE id = ?', [id], (err,req) =>{



      }
    )

    }

    // Atualizar reserva 

    export const updatebooking = (req,res) =>{

      const {id} = req.params;
      const {name, phone, date , time } = req.body


      const query = `UPDATE booking SET name = ?, phone = ?, date = ?, time = WHERE id = ? `
    
      const values = [name, phone,date, time,id];

      db.run(query, values, function(err){


        if ( err ) return res.status(500).json({ error: err.message});
        if (this.changes === 0 ) return res.status(404).json({message:'Reserva não encpntrada'})

    
       return res.status(200).json({ message:'Reserva atualizada com sucesso'})


      })
    
    }

    // Deletar reserva 

    export const deleteBooking = (req,res) => {

      const {id } = req.params;

      db.run('DELETE FROM booking WHERE id = ?', [id] , function (err){

            if(err) return res.status(500).json({error: err.message})

            if (this.changes === 0) return res.status(404).json({ message: 'Reserva não encontrada' });

             return res.status(200).json({ message: 'Reserva deletada com sucesso' });

      })
    }



