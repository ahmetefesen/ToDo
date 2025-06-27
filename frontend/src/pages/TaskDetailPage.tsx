import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskAPI } from '../services/api';
import './TaskDetailPage.css';

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

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchTask(parseInt(id));
    }
  }, [id]);

  const fetchTask = async (taskId: number) => {
    try {
      const response = await taskAPI.getById(taskId);
      const data = response.data as Task;
      setTask(data);
    } catch (err: any) {
      setError('Görev yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    
    if (window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      try {
        await taskAPI.delete(task.id);
        navigate('/tasks');
      } catch (err: any) {
        setError('Görev silinirken bir hata oluştu');
      }
    }
  };

  const handleToggleComplete = async () => {
    if (!task) return;
    
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await taskAPI.update(task.id, { ...task, status: newStatus });
      fetchTask(task.id);
    } catch (err: any) {
      setError('Görev durumu güncellenirken bir hata oluştu');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in_progress': return 'Devam Ediyor';
      case 'pending': return 'Bekliyor';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return priority;
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!task) return <div className="error-message">Görev bulunamadı</div>;

  return (
    <div className="task-detail-container">
      <div className="task-detail-header">
        <h1>{task.title}</h1>
        <div className="task-actions">
          <Link to={`/tasks/${task.id}/edit`} className="btn-primary">
            Düzenle
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            Sil
          </button>
          <Link to="/tasks" className="btn-secondary">
            Geri Dön
          </Link>
        </div>
      </div>

      <div className="task-detail-content">
        <div className="task-info">
          <div className="info-section">
            <h3>Açıklama</h3>
            <p>{task.description || 'Açıklama bulunmuyor'}</p>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label>Durum:</label>
              <span className={`status status-${task.status}`}>
                {getStatusText(task.status)}
              </span>
            </div>

            <div className="info-item">
              <label>Öncelik:</label>
              <span className={`priority priority-${task.priority}`}>
                {getPriorityText(task.priority)}
              </span>
            </div>

            <div className="info-item">
              <label>Oluşturulma Tarihi:</label>
              <span>{new Date(task.created).toLocaleDateString('tr-TR')}</span>
            </div>

            {task.due_date && (
              <div className="info-item">
                <label>Bitiş Tarihi:</label>
                <span>{new Date(task.due_date).toLocaleDateString('tr-TR')}</span>
              </div>
            )}
          </div>

          <div className="task-actions-bottom">
            <button
              onClick={handleToggleComplete}
              className={`btn-toggle ${task.status === 'completed' ? 'completed' : ''}`}
            >
              {task.status === 'completed' ? 'Tamamlandı' : 'Tamamla'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage; 