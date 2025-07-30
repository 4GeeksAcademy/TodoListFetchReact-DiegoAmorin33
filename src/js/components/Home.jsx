import React, { useState, useEffect } from "react";
import "/workspaces/TodoListFetchReact-DiegoAmorin33/src/styles/index.css";

const usuario = "diego";

const Home = () => {
  const [tarea, setTarea] = useState("");
  const [lista, setLista] = useState([]);

  const crearUsuario = () => {
    fetch(`https://playground.4geeks.com/todo/users/${usuario}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => {
        if (resp.status === 400) {
          console.log("El usuario ya existe");
          return null;
        }
        return resp.json();
      })
      .then((data) => {
        if (data) console.log("Usuario creado:", data);
        cargarTareas();
      })
      .catch((error) => {
        console.error("Error al crear usuario:", error);
        setLista([]);
      });
  };

  const cargarTareas = () => {
    fetch(`https://playground.4geeks.com/todo/users/${usuario}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Respuesta de la API:", data);
        if (Array.isArray(data.todos)) {
          setLista(data.todos);
        } else {
          console.warn("La respuesta no es una lista:", data);
          setLista([]);
        }
      })
      .catch((error) => {
        console.error("Error al cargar tareas:", error);
        setLista([]);
      });
  };

  const manejarCambio = (e) => setTarea(e.target.value);

  const manejarEnter = (e) => {
    if (e.key === "Enter" && tarea.trim()) {
      const nuevaTarea = { label: tarea, done: false };

      fetch(`https://playground.4geeks.com/todo/todos/${usuario}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaTarea),
      })
        .then((resp) => {
          if (!resp.ok) throw new Error("Error al agregar tarea");
          return resp.json();
        })
        .then(() => {
          cargarTareas();
          setTarea("");
        })
        .catch((error) => console.error("Fallo al agregar tarea:", error));
    }
  };

  const eliminarTarea = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => cargarTareas())
      .catch((err) => console.error("Error al eliminar tarea:", err));
  };

  const borrarTodo = () => {
    Promise.all(
      lista.map((item) =>
        fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
          method: "DELETE",
        })
      )
    )
      .then(() => cargarTareas())
      .catch((err) => console.error("Error al borrar todas las tareas", err));
  };

  useEffect(() => {
    crearUsuario();
  }, []);

  return (
    <div className="stacked-card">
      <div className="card-shadow shadow1"></div>
      <div className="card-shadow shadow2"></div>
      <div className="main-card">
        <input
          type="text"
          placeholder="¿Qué necesitas hacer?"
          value={tarea}
          onChange={manejarCambio}
          onKeyDown={manejarEnter}
        />
        <ul>
          {(Array.isArray(lista) ? lista : []).map((item) => (
            <li key={item.id} className="tarea-item">
              <span>{item.label}</span>
              <button
                className="boton-eliminar"
                onClick={() => eliminarTarea(item.id)} >
                    X
              </button>
            </li>
          ))}
        </ul>
        <div className="barra-inferior">
          <button onClick={borrarTodo} className="boton-limpiar"> Borrar todas </button>
          <p className="count">{lista.length} tareas pendientes</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
