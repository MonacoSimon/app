import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:8000";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("active");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [filter]);

  const loadNotes = async () => {
    try {
      let url = `${API_URL}/notes`;
      if (filter === "active") url += "?archived=false";
      else if (filter === "archived") url += "?archived=true";

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      });
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const noteData = { title: title.trim(), content: content.trim() };
      const url = editingId ? `${API_URL}/notes/${editingId}` : `${API_URL}/notes`;
      const method = editingId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify(noteData),
      });

      setTitle(""); setContent(""); setEditingId(null);
      await loadNotes();
    } catch (error) {
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("¿Eliminar nota?")) return;
    await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
    loadNotes();
  };

  const archiveNote = async (id, archive) => {
    const endpoint = archive ? "archive" : "unarchive";
    await fetch(`${API_URL}/notes/${id}/${endpoint}`, { method: "PUT" });
    loadNotes();
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8"> 
            
            <header className="text-center my-5">
              <h1 className="fw-bold text-primary display-4">Mis Notas</h1>
              <p className="text-muted">Aplicación de Notas</p>
            </header>

            <div className="card shadow-sm border-0 mb-5">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3 text-center">
                  {editingId ? "✏️ Editar Nota" : "➕ Crear nueva nota"}
                </h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input 
                      className="form-control border-0 bg-light p-3" 
                      placeholder="Título de la nota" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="mb-4">
                    <textarea 
                      className="form-control border-0 bg-light p-3" 
                      placeholder="Escribe el contenido de tu nota..." 
                      rows="4" 
                      value={content} 
                      onChange={(e) => setContent(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="d-flex gap-2 justify-content-center">
                    <button 
                      className="btn btn-primary px-4 py-2 rounded-pill shadow-sm" 
                      disabled={loading}
                    >
                      {loading ? "Procesando..." : (editingId ? "Actualizar" : "Guardar Nota")}
                    </button>
                    {editingId && (
                      <button 
                        className="btn btn-outline-secondary px-4 py-2 rounded-pill" 
                        type="button" 
                        onClick={() => {setEditingId(null); setTitle(""); setContent("");}}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="d-flex justify-content-center mb-4">
              <div className="btn-group bg-white shadow-sm p-1 rounded-pill">
                <button 
                  className={`btn btn-sm px-4 ${filter === 'all' ? 'btn-primary' : 'btn-white'} rounded-pill`} 
                  onClick={() => setFilter('all')}
                >
                  Todas
                </button>
                <button 
                  className={`btn btn-sm px-4 ${filter === 'active' ? 'btn-primary' : 'btn-white'} rounded-pill`} 
                  onClick={() => setFilter('active')}
                >
                  Activas
                </button>
                <button 
                  className={`btn btn-sm px-4 ${filter === 'archived' ? 'btn-primary' : 'btn-white'} rounded-pill`} 
                  onClick={() => setFilter('archived')}
                >
                  Archivadas
                </button>
              </div>
            </div>

            <div className="text-center mb-4">
              <span className="badge bg-info rounded-pill p-2">
                {notes.length} {notes.length === 1 ? 'nota' : 'notas'} {filter !== 'all' ? (filter === 'active' ? 'activas' : 'archivadas') : 'en total'}
              </span>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-5 my-5">
                <div className="display-1 text-muted mb-3">📄</div>
                <h4 className="text-muted">No hay notas para mostrar</h4>
                <p className="text-muted">Crea tu primera nota usando el formulario de arriba</p>
              </div>
            ) : (
              <div className="row g-4">
                {notes.map((note) => (
                  <div key={note.id} className="col-12">
                    <div className={`card shadow-sm border-0 ${note.archived ? 'bg-light' : ''}`}>
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h5 className="fw-bold m-0">{note.title}</h5>
                          <span className={`badge ${note.archived ? 'bg-secondary' : 'bg-success'} rounded-pill`}>
                            {note.archived ? '📁 Archivada' : '📄 Activa'}
                          </span>
                        </div>
                        <p className="text-muted mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                          {note.content}
                        </p>

                        <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                          <div>
                            <span className="me-3">ID: {note.id}</span>
                            <span>Creada: {new Date(note.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="d-flex gap-2 pt-3 border-top">
                          {!note.archived ? (
                            <>
                              <button 
                                className="btn btn-outline-warning btn-sm px-3" 
                                onClick={() => { 
                                  setTitle(note.title); 
                                  setContent(note.content); 
                                  setEditingId(note.id); 
                                  window.scrollTo({top: 0, behavior: 'smooth'}); 
                                }}
                              >
                                Editar
                              </button>
                              <button 
                                className="btn btn-outline-success btn-sm px-3" 
                                onClick={() => archiveNote(note.id, true)}
                              >
                                Archivar
                              </button>
                            </>
                          ) : (
                            <button 
                              className="btn btn-outline-info btn-sm px-3" 
                              onClick={() => archiveNote(note.id, false)}
                            >
                              Desarchivar
                            </button>
                          )}
                          <button 
                            className="btn btn-outline-danger btn-sm px-3 ms-auto" 
                            onClick={() => deleteNote(note.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <footer className="text-center mt-5 pt-5 border-top">
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <p className="text-muted mb-4">
                    <strong>Notes App</strong> - Ejercicio Full Stack para Ensolvers
                  </p>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <button 
                      className="btn btn-sm btn-outline-primary" 
                      onClick={async () => {
                        try {
                          const test = await fetch(`${API_URL}/`);
                          const data = await test.json();
                          alert(`Backend conectado\n${JSON.stringify(data, null, 2)}`);
                        } catch (error) {
                          alert(`Error: ${error.message}\n\nAsegúrate que el backend esté corriendo en:\n${API_URL}`);
                        }
                      }}
                    >
                      Probar backend
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={loadNotes}
                    >
                      Recargar notas
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-info"
                      onClick={() => console.log("Estado:", { notes, filter, title, content, editingId })}
                    >
                      Ver en consola
                    </button>
                  </div>
                  <p className="text-muted small mt-4">
                    Backend: {API_URL} | Filtro: {filter} | Notas: {notes.length}
                  </p>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}