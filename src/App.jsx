
import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:4000/api';

// Gestion du token d'authentification
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUserData();
    }
  }, []);

  const showMessage = (message, type = 'error') => {
    if (type === 'error') {
      setError(message);
      setTimeout(() => setError(''), 5000);
    } else {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 5000);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = getToken();
      if (!token) return;

      // Récupérer les groupes
      const groupsRes = await fetch(`${API_BASE}/groups`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        setGroups(groupsData);
      }

      // Récupérer les tâches
      const tasksRes = await fetch(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const res = await fetch(API_BASE + url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};


  // Composant d'authentification
  const AuthComponent = () => {
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const endpoint = currentView === 'login' ? '/auth/login' : '/auth/register';
        const data = await apiCall(endpoint, {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        
        setToken(data.token);
        setUser(data.user);
        setCurrentView('dashboard');
        await fetchUserData();
        showMessage(`Bienvenue ${data.user.name} !`, 'success');
      } catch (error) {
        console.error('Auth error:', error);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {currentView === 'login' ? 'Connexion' : 'Inscription'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Gestionnaire de tâches collaboratif
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {currentView === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-200"
              >
                {loading ? 'Chargement...' : (currentView === 'login' ? 'Se connecter' : 'Créer mon compte')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setCurrentView(currentView === 'login' ? 'register' : 'login');
                  setError('');
                  setSuccess('');
                }}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                {currentView === 'login' 
                  ? 'Pas de compte ? S\'inscrire' 
                  : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant tableau de bord
  const Dashboard = () => {
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [showEditTask, setShowEditTask] = useState(null);
    const [newGroup, setNewGroup] = useState({ name: '', description: '' });
    const [newTask, setNewTask] = useState({ 
      title: '', 
      description: '', 
      status: 'todo', 
      groupId: '',
      deadline: ''
    });
    const [editTask, setEditTask] = useState({});
    // --- nouveau state pour rejoindre via code d'invitation ---
    const [showJoinGroup, setShowJoinGroup] = useState(false);
    const [inviteCode, setInviteCode] = useState('');

    const handleCreateGroup = async (e) => {
      e.preventDefault();
      try {
        await apiCall('/groups', {
          method: 'POST',
          body: JSON.stringify(newGroup),
        });
        setShowCreateGroup(false);
        setNewGroup({ name: '', description: '' });
        await fetchUserData();
        showMessage('Groupe créé avec succès !', 'success');
      } catch (error) {
        console.error('Error creating group:', error);
      }
    };

    const handleCreateTask = async (e) => {
      e.preventDefault();
      try {
        const taskData = {
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          ...(newTask.groupId && { groupId: newTask.groupId }),
          ...(newTask.deadline && { deadline: newTask.deadline })
        };

        await apiCall('/tasks', {
          method: 'POST',
          body: JSON.stringify(taskData),
        });
        setShowCreateTask(false);
        setNewTask({ title: '', description: '', status: 'todo', groupId: '', deadline: '' });
        await fetchUserData();
        showMessage('Tâche créée avec succès !', 'success');
      } catch (error) {
        console.error('Error creating task:', error);
      }
    };

    const handleEditTask = async (e) => {
      e.preventDefault();
      try {
        await apiCall(`/tasks/${showEditTask.id}`, {
          method: 'PUT',
          body: JSON.stringify(editTask),
        });
        setShowEditTask(null);
        setEditTask({});
        await fetchUserData();
        showMessage('Tâche modifiée avec succès !', 'success');
      } catch (error) {
        console.error('Error updating task:', error);
      }
    };

    const handleDeleteTask = async (taskId) => {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        try {
          await apiCall(`/tasks/${taskId}`, {
            method: 'DELETE',
          });
          await fetchUserData();
          showMessage('Tâche supprimée avec succès !', 'success');
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      }
    };

    const handleLogout = () => {
      removeToken();
      setUser(null);
      setCurrentView('login');
      setGroups([]);
      setTasks([]);
      setError('');
      setSuccess('');
    };

    const viewGroup = async (groupId) => {
      try {
        const data = await apiCall(`/groups/${groupId}`);
        setCurrentGroup(data);
        setCurrentView('group-detail');
      } catch (error) {
        console.error('Error fetching group:', error);
      }
    };

   const createInvite = async (groupId) => {
  try {
    const data = await apiCall(`/invites/${groupId}/create`, { method: 'POST' });

    // Copier seulement le token
    navigator.clipboard.writeText(data.token);

    showMessage("Code d'invitation copié !", 'success');
  } catch (error) {
    console.error('Error creating invite:', error);
  }
};


    // --- nouvelle fonction pour accepter un code d'invitation ---
    const handleAcceptInvite = async (e) => {
      e.preventDefault();
      if (!inviteCode || inviteCode.trim() === '') {
        showMessage('Veuillez saisir un code d\'invitation valide.', 'error');
        return;
      }
      try {
        await apiCall('/invites/accept', {
          method: 'POST',
          body: JSON.stringify({ token: inviteCode.trim() }),
        });
        setInviteCode('');
        setShowJoinGroup(false);
        await fetchUserData();
        showMessage('Vous avez rejoint le groupe !', 'success');
      } catch (error) {
        console.error('Error accepting invite:', error);
      }
    };

    const openEditTask = (task) => {
      setShowEditTask(task);
      setEditTask({
        title: task.title,
        description: task.description,
        status: task.status,
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
        groupId: task.groupId || ''
      });
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-indigo-600">TodoList</h1>
                <span className="ml-4 text-gray-600">Bonjour, {user?.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Messages */}
            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Section Groupes */}
              <div className="bg-white overflow-hidden shadow-xl rounded-lg">
                <div className="px-6 py-7">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900">Mes Groupes</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowCreateGroup(true)}
                        className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
                      >
                        + Nouveau Groupe
                      </button>

                      {/* bouton pour ouvrir la modal rejoindre par code */}
                      <button
                        onClick={() => setShowJoinGroup(true)}
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
                      >
                        Rejoindre (code)
                      </button>
                    </div>
                  </div>
                  
                  {groups.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-lg">Aucun groupe créé</p>
                      <p className="text-gray-400 mt-2">Créez votre premier groupe pour collaborer</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {groups.map((group) => (
                        <div key={group.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-indigo-200 hover:shadow-md transition duration-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-gray-900">{group.name}</h4>
                              <p className="text-gray-600 mt-1">{group.description || 'Aucune description'}</p>
                              <div className="flex items-center mt-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  group.ownerId === user.id 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {group.ownerId === user.id ? 'Propriétaire' : 'Membre'}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => viewGroup(group.id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-200 text-sm"
                              >
                                Voir
                              </button>
                              {group.ownerId === user.id && (
                                <button
                                  onClick={() => createInvite(group.id)}
                                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-200 text-sm"
                                >
                                  Inviter
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section Tâches */}
              <div className="bg-white overflow-hidden shadow-xl rounded-lg">
                <div className="px-6 py-7">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900">Mes Tâches</h3>
                    <button
                      onClick={() => setShowCreateTask(true)}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
                    >
                      + Nouvelle Tâche
                    </button>
                  </div>
                  
                  {tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-lg">Aucune tâche</p>
                      <p className="text-gray-400 mt-2">Créez votre première tâche</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tasks.map((task) => (
                        <div key={task.id} className="border-2 border-gray-100 rounded-xl p-4 hover:shadow-md transition duration-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg text-gray-900">{task.title}</h4>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openEditTask(task)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                  >
                                    Modifier
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                              <p className="text-gray-600 mt-1">{task.description || 'Aucune description'}</p>
                              <div className="flex items-center justify-between mt-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  task.status === 'done' 
                                    ? 'bg-green-100 text-green-800' 
                                    : task.status === 'inprogress'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {task.status === 'done' ? 'Terminé' : 
                                   task.status === 'inprogress' ? 'En cours' : 'À faire'}
                                </span>
                                {task.deadline && (
                                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                    📅 {new Date(task.deadline).toLocaleDateString('fr-FR')}
                                  </span>
                                )}
                                {task.groupId && (
                                  <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                    Groupe
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal création groupe */}
        {showCreateGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Créer un groupe</h3>
              <form onSubmit={handleCreateGroup}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom du groupe *</label>
                    <input
                      type="text"
                      placeholder="Nom de votre groupe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="Description du groupe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="3"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateGroup(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition duration-200"
                  >
                    {loading ? 'Création...' : 'Créer le groupe'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal rejoindre par code d'invitation (nouveau) */}
        {showJoinGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Rejoindre un groupe</h3>
              <form onSubmit={handleAcceptInvite}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code d'invitation</label>
                    <input
                      type="text"
                      placeholder="Collez le code d'invitation ici"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">Vous pouvez coller un token reçu par mail ou copier depuis un propriétaire du groupe.</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => { setShowJoinGroup(false); setInviteCode(''); }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition duration-200"
                  >
                    {loading ? 'Validation...' : 'Rejoindre le groupe'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal création tâche */}
        {showCreateTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Nouvelle tâche</h3>
              <form onSubmit={handleCreateTask}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                    <input
                      type="text"
                      placeholder="Titre de la tâche"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="Description de la tâche"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="3"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newTask.status}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                      >
                        <option value="todo">À faire</option>
                        <option value="inprogress">En cours</option>
                        <option value="done">Terminé</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Échéance</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Groupe (optionnel)</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={newTask.groupId}
                      onChange={(e) => setNewTask({ ...newTask, groupId: e.target.value })}
                    >
                      <option value="">Tâche personnelle</option>
                      {groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateTask(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition duration-200"
                  >
                    {loading ? 'Création...' : 'Créer la tâche'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal modification tâche */}
        {showEditTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Modifier la tâche</h3>
              <form onSubmit={handleEditTask}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editTask.title}
                      onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="3"
                      value={editTask.description}
                      onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editTask.status}
                        onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                      >
                        <option value="todo">À faire</option>
                        <option value="inprogress">En cours</option>
                        <option value="done">Terminé</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Échéance</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editTask.deadline}
                        onChange={(e) => setEditTask({ ...editTask, deadline: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditTask(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition duration-200"
                  >
                    {loading ? 'Modification...' : 'Modifier'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Composant détail du groupe
  const GroupDetail = () => {
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [newTask, setNewTask] = useState({ 
      title: '', 
      description: '', 
      status: 'todo',
      groupId: currentGroup?.group.id 
    });

    const handleCreateTask = async (e) => {
      e.preventDefault();
      try {
        const taskData = {
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          groupId: newTask.groupId
        };

        await apiCall('/tasks', {
          method: 'POST',
          body: JSON.stringify(taskData),
        });
        setShowCreateTask(false);
        setNewTask({ title: '', description: '', status: 'todo', groupId: currentGroup?.group.id });
        // Recharger les données du groupe
        const data = await apiCall(`/groups/${currentGroup.group.id}`);
        setCurrentGroup(data);
        await fetchUserData();
        showMessage('Tâche créée avec succès !', 'success');
      } catch (error) {
        console.error('Error creating task:', error);
      }
    };

    const removeMember = async (userId) => {
      if (window.confirm('Êtes-vous sûr de vouloir retirer ce membre du groupe ?')) {
        try {
          await apiCall(`/groups/${currentGroup.group.id}/remove`, {
            method: 'POST',
            body: JSON.stringify({ userId }),
          });
          // Recharger les données du groupe
          const data = await apiCall(`/groups/${currentGroup.group.id}`);
          setCurrentGroup(data);
          showMessage('Membre retiré du groupe', 'success');
        } catch (error) {
          console.error('Error removing member:', error);
        }
      }
    };

    if (!currentGroup) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Retour
                </button>
                <h1 className="text-2xl font-bold text-gray-900">{currentGroup.group.name}</h1>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Messages */}
            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Membres du groupe */}
              <div className="bg-white shadow-xl rounded-lg">
                <div className="px-6 py-7">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900">Membres du groupe</h3>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {currentGroup.members.length} membre(s)
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {currentGroup.members.map((member) => (
                      <div key={member.id} className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl hover:border-indigo-200 transition duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {member.id === currentGroup.group.ownerId && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              Propriétaire
                            </span>
                          )}
                          {currentGroup.group.ownerId === user.id && member.id !== user.id && (
                            <button
                              onClick={() => removeMember(member.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition duration-200"
                            >
                              Retirer
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tâches du groupe */}
              <div className="bg-white shadow-xl rounded-lg">
                <div className="px-6 py-7">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900">Tâches du groupe</h3>
                    <button
                      onClick={() => setShowCreateTask(true)}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
                    >
                      + Nouvelle Tâche
                    </button>
                  </div>
                  
                  {currentGroup.tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-lg">Aucune tâche dans ce groupe</p>
                      <p className="text-gray-400 mt-2">Créez la première tâche</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentGroup.tasks.map((task) => (
                        <div key={task.id} className="border-2 border-gray-100 rounded-xl p-4 hover:shadow-md transition duration-200">
                          <h4 className="font-bold text-lg text-gray-900">{task.title}</h4>
                          <p className="text-gray-600 mt-1">{task.description || 'Aucune description'}</p>
                          <div className="flex justify-between items-center mt-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              task.status === 'done' 
                                ? 'bg-green-100 text-green-800' 
                                : task.status === 'inprogress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {task.status === 'done' ? 'Terminé' : 
                               task.status === 'inprogress' ? 'En cours' : 'À faire'}
                            </span>
                            {task.deadline && (
                              <span className="text-xs text-gray-500">
                                📅 {new Date(task.deadline).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal création de tâche dans le groupe */}
        {showCreateTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Nouvelle tâche pour {currentGroup.group.name}</h3>
              <form onSubmit={handleCreateTask}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                    <input
                      type="text"
                      placeholder="Titre de la tâche"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="Description de la tâche"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="3"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    >
                      <option value="todo">À faire</option>
                      <option value="inprogress">En cours</option>
                      <option value="done">Terminé</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateTask(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition duration-200"
                  >
                    {loading ? 'Création...' : 'Créer la tâche'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Gestion des vues
  if (!user) {
    return <AuthComponent />;
  }

  switch (currentView) {
    case 'dashboard':
      return <Dashboard />;
    case 'group-detail':
      return <GroupDetail />;
    default:
      return <Dashboard />;
  }
};

export default App;
