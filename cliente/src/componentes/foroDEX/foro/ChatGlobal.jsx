import React, { useState, useEffect, useRef } from 'react';
import { database } from '../../../Firebase';
import { ref, onValue, push, set, get } from "firebase/database";
import { useAuth } from '../../../ConfiguracionUsuario';

function ChatGlobal() {
  const { usuario } = useAuth();
  const chatRef = useRef(null);
  const [chatGlobal, setChatGlobal] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [detalles, setDetalles] = useState({});

  useEffect(() => {
    const chatRef = ref(database, 'ChatGlobal');

    // Obtener datos iniciales una vez al montar el componente
    get(chatRef).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setChatGlobal(chatArray);

        // Obtener detalles (nombre de usuario y imagen) asociados a los UIDs
        const uniqueUids = new Set(chatArray.map(msg => msg.uid));
        fetchDetalles(uniqueUids);
        
      } else {
        setChatGlobal([]);
      }
    }).catch(error => {
      console.error('Error al obtener datos iniciales:', error);
    });

    // Escuchar cambios en los mensajes del chat en tiempo real
    const chatListener = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setChatGlobal(chatArray);

        // Obtener detalles (nombre de usuario y imagen) asociados a los UIDs
        const uniqueUids = new Set(chatArray.map(msg => msg.uid));
        fetchDetalles(uniqueUids);
        scrollToBottom();
      } else {
        setChatGlobal([]);
      }
    });

    return () => {
      // Limpiar el listener de mensajes cuando el componente se desmonta
      setChatGlobal([]);
      chatListener(); // Detener el listener cuando el componente se desmonta
    };
  }, []); // El segundo argumento [] indica que el efecto se ejecuta solo una vez al montar el componente

  const fetchDetalles = (uids) => {
    const promises = [];
    uids.forEach(uid => {
      const userRef = ref(database, `Usuario/${uid}`);
      promises.push(get(userRef).then(snapshot => ({
        uid,
        username: snapshot.child('userName').val(),
        img: snapshot.child('img').val()
      })));
    });

    Promise.all(promises)
      .then(results => {
        const detallesMap = {};
        results.forEach(result => {
          detallesMap[result.uid] = {
            username: result.username,
            img: result.img
          };
        });
        setDetalles(detallesMap);
      })
      .catch(error => {
        console.error('Error al obtener detalles:', error);
      });
  };

  const handleInputChange = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        handleSubmit(e);
    }else{
      setInputValue(e.target.value);
    }
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usuario) {
      const chatRef = ref(database, 'ChatGlobal');
      const newMessageRef = push(chatRef); // Utiliza push para agregar un nuevo mensaje con una clave única
      const newMessage = {
        uid: usuario.uid,
        message: inputValue,
        timestamp: ""
      };
      set(newMessageRef, newMessage)
        .then(() => {
          setInputValue('');
          console.log('Mensaje enviado con éxito.');
          scrollToBottom();
        })
        .catch(error => {
          console.error('Error al enviar mensaje:', error);
        });
    } else {
      alert('Debes estar autenticado para enviar mensajes.');
    }
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  return (
    <div className='globalChat'>
      <div className='chat' ref={chatRef}>
        {chatGlobal.length > 0 ? (
          chatGlobal.map((msg) => (
            <div key={msg.id} className={usuario.uid==msg.uid ? "active" : ""}>
                {detalles[msg.uid] && (
                  <div className='headerMensaje'>
                    {detalles[msg.uid].img!="" ? (
                        <div><img src={detalles[msg.uid].img} alt="Avatar" style={{ width: '30px', height: '30px', borderRadius: '50%' }} /></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" className='svgUsuario' viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/><path d="M2 12h7m6 0h7"/></g></svg>
                    )}
                    <p>{detalles[msg.uid].username}</p>
                  </div>
                )}
                <p>{msg.message}</p>
                
            </div>
          ))
        ) : (
          <p>No hay mensajes todavía.</p>
        )}
        {scrollToBottom()}
      </div>
      {usuario ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Write your message"
          />
          <button type="submit">Send</button>
        </form>
      ) : (
        <div>Por favor, inicia sesión para enviar mensajes.</div>
      )}
    </div>
  );
}

export default ChatGlobal;
