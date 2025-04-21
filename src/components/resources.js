import React, { useState, useEffect } from 'react';
import './resources.css';

function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [newResource, setNewResource] = useState({
    title: '',
    category: '',
    type: 'PDF',
    file: null
  });
  
  const predefinedSubjects = [
    'Bases de datos',
    'Sistemas Operativos',
    'Electrónica',
    'Matemáticas',
    'Ciencias',
    'Historia',
    'Lenguaje',
    'Inglés'
  ];

  useEffect(() => {
    const savedResources = localStorage.getItem('userResources');
    if (savedResources) {
      setResources(JSON.parse(savedResources));
    }

    const savedCategories = localStorage.getItem('userCategories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      const initialCategories = predefinedSubjects.map(subject => {
        const categoryId = subject.toLowerCase().replace(/\s+/g, '-');
        const initialLetter = subject.charAt(0).toUpperCase();
        return {
          id: categoryId,
          title: subject,
          icon: initialLetter,
          iconClass: `category-icon ${getRandomColorClass()}`
        };
      });
      setCategories(initialCategories);
      localStorage.setItem('userCategories', JSON.stringify(initialCategories));
    }
  }, []);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = searchTerm 
    ? categories.map(category => ({
        ...category,
        resources: resources.filter(resource => 
          resource.categoryId === category.id && 
          resource.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.resources.length > 0)
    : categories.map(category => ({
        ...category,
        resources: resources.filter(resource => resource.categoryId === category.id)
      })).filter(category => category.resources.length > 0);

  const handleAddResource = () => {
    setIsEditing(false);
    setEditingResourceId(null);
    setNewResource({
      title: '',
      category: '',
      type: 'PDF',
      file: null
    });
    setShowAddModal(true);
  };

  const handleEditResource = (resource) => {
    setIsEditing(true);
    setEditingResourceId(resource.id);
    setNewResource({
      title: resource.title,
      category: resource.categoryId,
      type: resource.type,
      file: null 
    });
    setShowAddModal(true);
  };

  const handleDeleteResource = (resourceId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
      const updatedResources = resources.filter(resource => resource.id !== resourceId);
      setResources(updatedResources);
      localStorage.setItem('userResources', JSON.stringify(updatedResources));
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewResource({
      title: '',
      category: '',
      type: 'PDF',
      file: null
    });
    setIsEditing(false);
    setEditingResourceId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource({
      ...newResource,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setNewResource({
      ...newResource,
      file: e.target.files[0]
    });
  };

  const handleAddCategory = () => {
    const categoryName = prompt("Nombre de la materia:");
    if (categoryName) {
      const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
      const initialLetter = categoryName.charAt(0).toUpperCase();
      const newCategory = {
        id: categoryId,
        title: categoryName,
        icon: initialLetter,
        iconClass: `category-icon ${getRandomColorClass()}`
      };
      
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      localStorage.setItem('userCategories', JSON.stringify(updatedCategories));
      
      return categoryId;
    }
    return null;
  };

  const getRandomColorClass = () => {
    const colors = ['blue-icon', 'green-icon', 'orange-icon', 'purple-icon', 'red-icon'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSubmitResource = (e) => {
    e.preventDefault();
    
    if (!newResource.title || !newResource.category) {
      alert("Por favor complete los campos obligatorios");
      return;
    }
    
    let categoryId = newResource.category;
    
    if (newResource.category === 'new') {
      categoryId = handleAddCategory();
      if (!categoryId) return; 
    }
    
    let updatedResources;
    
    if (isEditing) {
      updatedResources = resources.map(resource => {
        if (resource.id === editingResourceId) {
          const updatedResource = {
            ...resource,
            title: newResource.title,
            categoryId: categoryId,
            type: newResource.type,
          };
          
          if (newResource.file) {
            const fileSizeMB = newResource.file.size / (1024 * 1024);
            updatedResource.size = fileSizeMB.toFixed(1) + ' MB';
          }
          
          return updatedResource;
        }
        return resource;
      });
    } else {
      if (!newResource.file) {
        alert("Por favor seleccione un archivo");
        return;
      }
      
      const today = new Date();
      const formattedDate = `${today.getDate()} ${getMonthName(today.getMonth())}, ${today.getFullYear()}`;
      const fileSizeMB = newResource.file.size / (1024 * 1024);
      const formattedSize = fileSizeMB.toFixed(1) + ' MB';
      
      const newResourceItem = {
        id: Date.now().toString(),
        title: newResource.title,
        type: newResource.type,
        categoryId: categoryId,
        date: formattedDate,
        size: formattedSize
      };
      
      updatedResources = [...resources, newResourceItem];
    }
    
    setResources(updatedResources);
    localStorage.setItem('userResources', JSON.stringify(updatedResources));
    
    handleCloseModal();
  };
  
  const getMonthName = (monthIndex) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months[monthIndex];
  };

  return (
    <div className="resources-container">
      <header className="resources-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar recursos..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="filter-button">
            <span className="filter-icon">&#9776;</span>
          </button>
        </div>
      </header>

      <div className="resources-content">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <div key={category.id} className="resource-category">
              <div className="category-header">
                <div className={category.iconClass}>{category.icon}</div>
                <h2 className="category-title">{category.title}</h2>
              </div>
              
              <div className="resource-grid">
                {category.resources.map(resource => (
                  <div key={resource.id} className="resource-card">
                    <div className="resource-header">
                      <div className={`resource-icon ${resource.type.toLowerCase()}-icon`}></div>
                      <div className="resource-actions">
                        <button 
                          className="edit-button" 
                          onClick={() => handleEditResource(resource)}
                        >
                          ✏️
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteResource(resource.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="resource-details">
                      <h3 className="resource-title">{resource.title}</h3>
                      <div className="resource-meta">
                        <span className="resource-date">{resource.date}</span>
                        <span className="resource-size">{resource.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No hay recursos disponibles. Haga clic en el botón + para agregar recursos de sus materias.</p>
          </div>
        )}
      </div>
      <div className="add-resource-button" onClick={handleAddResource}>
        <span>+</span>
      </div>
      
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? 'Editar Recurso' : 'Agregar Recurso'}</h2>
            <form onSubmit={handleSubmitResource}>
              <div className="form-group">
                <label>Título</label>
                <input 
                  type="text" 
                  name="title" 
                  value={newResource.title} 
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Materia</label>
                <select 
                  name="category" 
                  value={newResource.category} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione una materia</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                  <option value="new">+ Agregar nueva materia</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select 
                  name="type" 
                  value={newResource.type} 
                  onChange={handleInputChange}
                >
                  <option value="PDF">PDF</option>
                  <option value="PPT">PPT</option>
                  <option value="DOC">DOC</option>
                  <option value="XLS">XLS</option>
                </select>
              </div>

              <div className="form-group">
                <label>{isEditing ? 'Archivo (opcional)' : 'Archivo'}</label>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  required={!isEditing}
                />
                {isEditing && (
                  <p className="file-note">Deje en blanco para mantener el archivo original</p>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="cancel-btn">
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resources;