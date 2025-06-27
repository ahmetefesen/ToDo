import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { taskAPI, authAPI } from '../services/api';
import './TaskListPage.css';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  created: string;
  user: number;
}

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      const data = response.data as Task[];
      setTasks(data);
    } catch (err: any) {
      setError('Görevler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskAPI.create(newTask);
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: '',
      });
      setShowCreateForm(false);
      fetchTasks();
    } catch (err: any) {
      setError('Görev oluşturulurken bir hata oluştu');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      try {
        await taskAPI.delete(id);
        fetchTasks();
      } catch (err: any) {
        setError('Görev silinirken bir hata oluştu');
      }
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await taskAPI.update(task.id, { ...task, status: newStatus });
      fetchTasks();
    } catch (err: any) {
      setError('Görev durumu güncellenirken bir hata oluştu');
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'orange';
      case 'pending': return 'gray';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="task-list-container">
      <header className="task-header">
        <h1>Görev Listesi</h1>
        <div className="header-actions">
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
            {showCreateForm ? 'İptal' : 'Yeni Görev'}
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            Çıkış Yap
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="search-section">
        <input
          type="text"
          placeholder="Görev ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {showCreateForm && (
        <div className="create-task-form">
          <h3>Yeni Görev Oluştur</h3>
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <label>Başlık</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Açıklama</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Durum</label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                  <option value="pending">Bekliyor</option>
                  <option value="in_progress">Devam Ediyor</option>
                  <option value="completed">Tamamlandı</option>
                </select>
              </div>
              <div className="form-group">
                <label>Öncelik</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                </select>
              </div>
              <div className="form-group">
                <label>Bitiş Tarihi</label>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Oluştur</button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tasks-grid">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <h3>{task.title}</h3>
              <div className="task-actions">
                <Link to={`/tasks/${task.id}`} className="btn-link">Detay</Link>
                <Link to={`/tasks/${task.id}/edit`} className="btn-link">Düzenle</Link>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="btn-danger"
                >
                  Sil
                </button>
              </div>
            </div>
            
            <p className="task-description">{task.description}</p>
            
            <div className="task-meta">
              <span className={`status status-${getStatusColor(task.status)}`}>
                {task.status === 'completed' ? 'Tamamlandı' : 
                 task.status === 'in_progress' ? 'Devam Ediyor' : 'Bekliyor'}
              </span>
              <span className={`priority priority-${getPriorityColor(task.priority)}`}>
                {task.priority === 'high' ? 'Yüksek' : 
                 task.priority === 'medium' ? 'Orta' : 'Düşük'}
              </span>
            </div>
            
            {task.due_date && (
              <div className="task-due-date">
                Bitiş: {new Date(task.due_date).toLocaleDateString('tr-TR')}
              </div>
            )}
            
            <div className="task-actions-bottom">
              <button
                onClick={() => handleToggleComplete(task)}
                className={`btn-toggle ${task.status === 'completed' ? 'completed' : ''}`}
              >
                {task.status === 'completed' ? 'Tamamlandı' : 'Tamamla'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && !loading && (
        <div className="no-tasks">
          <p>Henüz görev bulunmuyor.</p>
          <button onClick={() => setShowCreateForm(true)} className="btn-primary">
            İlk Görevinizi Oluşturun
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskListPage;
