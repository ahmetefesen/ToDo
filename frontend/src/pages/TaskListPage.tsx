import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { taskAPI, authAPI } from '../services/api';
import { Task, CreateTaskData, UpdateTaskData } from '../types';
import './TaskListPage.css';

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
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
      const createData: CreateTaskData = {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        due_date: newTask.due_date || undefined,
      };
      await taskAPI.create(createData);
      setNewTask({
        title: '',
        description: '',
        status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled',
        priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
        due_date: '',
      });
      setShowCreateForm(false);
      fetchTasks();
    } catch (err: any) {
      console.error('Task oluşturma hatası:', err);
      let errorMsg = 'Görev oluşturulurken bir hata oluştu';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (typeof err.response.data === 'object') {
          errorMsg = Object.values(err.response.data).flat().join(' ');
        }
      }
      setError(errorMsg);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      try {
        await taskAPI.delete(id);
        fetchTasks();
      } catch (err: any) {
        console.error('Task silme hatası:', err);
        let errorMsg = 'Görev silinirken bir hata oluştu';
        if (err.response?.data) {
          if (typeof err.response.data === 'string') {
            errorMsg = err.response.data;
          } else if (typeof err.response.data === 'object') {
            errorMsg = Object.values(err.response.data).flat().join(' ');
          }
        }
        setError(errorMsg);
      }
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const updateData: UpdateTaskData = {
        title: task.title,
        description: task.description,
        status: newStatus,
        priority: task.priority,
        due_date: task.due_date || undefined,
      };
      await taskAPI.update(task.id, updateData);
      fetchTasks();
    } catch (err: any) {
      console.error('Task durum güncelleme hatası:', err);
      let errorMsg = 'Görev durumu güncellenirken bir hata oluştu';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (typeof err.response.data === 'object') {
          errorMsg = Object.values(err.response.data).flat().join(' ');
        }
      }
      setError(errorMsg);
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
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
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
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value as 'pending' | 'in_progress' | 'completed' | 'cancelled' })}
                >
                  <option value="pending">Bekliyor</option>
                  <option value="in_progress">Devam Ediyor</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Öncelik</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' | 'critical' })}
                >
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                  <option value="critical">Kritik</option>
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
                 task.status === 'in_progress' ? 'Devam Ediyor' : 
                 task.status === 'cancelled' ? 'İptal Edildi' : 'Bekliyor'}
              </span>
              <span className={`priority priority-${getPriorityColor(task.priority)}`}>
                {task.priority === 'critical' ? 'Kritik' :
                 task.priority === 'high' ? 'Yüksek' : 
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
