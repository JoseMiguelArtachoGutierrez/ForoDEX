// src/ChatGlobal.js
import React, { useState, useEffect } from 'react';
import { database } from '../../../Firebase';
import { ref, onValue, push, serverTimestamp, set, get } from "firebase/database";
import { useAuth } from '../../../ConfiguracionUsuario';

function ChatGlobal() {
  const [chatGlobal, setChatGlobal] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const { usuario } = useAuth();  // Asumiendo que useAuth proporciona usuario

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

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usuario) {
      const chatRef = ref(database, 'ChatGlobal');
      const newMessageRef = push(chatRef); // Utiliza push para agregar un nuevo mensaje con una clave única
      const newMessage = {
        uid: usuario.uid,
        message: inputValue
      };
      set(newMessageRef, newMessage)
        .then(() => {
          setInputValue('');
          console.log('Mensaje enviado con éxito.');
        })
        .catch(error => {
          console.error('Error al enviar mensaje:', error);
        });
    } else {
      alert('Debes estar autenticado para enviar mensajes.');
    }
  };

  return (
    <div>
      <h1>Chat Global</h1>
      <div>
        {chatGlobal.length > 0 ? (
          chatGlobal.map((msg) => (
            <div key={msg.id}>
              <p><strong>{msg.uid}</strong>: {msg.message} <em>{new Date(msg.timestamp).toLocaleString()}</em></p>
            </div>
          ))
        ) : (
          <p>No hay mensajes todavía.</p>
        )}
      </div>
      {usuario ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Escribe tu mensaje"
          />
          <button type="submit">Enviar</button>
        </form>
      ) : (
        <div>Por favor, inicia sesión para enviar mensajes.</div>
      )}
    </div>
  );
}

export default ChatGlobal;
