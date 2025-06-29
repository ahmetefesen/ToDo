import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import { Task, UpdateTaskData } from '../types';
import './TaskEditPage.css';

const TaskEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    due_date: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      const taskData = response.data as Task;
      setTask(taskData);
      setFormData({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        due_date: taskData.due_date ? taskData.due_date.split('T')[0] : '',
      });
    } catch (err: any) {
      setError('Görev yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    setSaving(true);
    setError('');

    try {
      const updateData: UpdateTaskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || undefined,
      };
      await taskAPI.update(task.id, updateData);
      navigate(`/tasks/${task.id}`);
    } catch (err: any) {
      setError('Görev güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (task) {
      navigate(`/tasks/${task.id}`);
    } else {
      navigate('/tasks');
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error && !task) return <div className="error-message">{error}</div>;
  if (!task) return <div className="error-message">Görev bulunamadı</div>;

  return (
    <div className="task-edit-container">
      <div className="task-edit-header">
        <h1>Görev Düzenle</h1>
        <button onClick={handleCancel} className="btn-secondary">
          İptal
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="task-edit-form">
        <div className="form-group">
          <label htmlFor="title">Başlık</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Görev başlığı"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Görev açıklaması"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Durum</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Bekliyor</option>
              <option value="in_progress">Devam Ediyor</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Öncelik</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
              <option value="critical">Kritik</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="due_date">Bitiş Tarihi</label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          <button type="button" onClick={handleCancel} className="btn-secondary">
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskEditPage; 