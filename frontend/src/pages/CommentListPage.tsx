import React, { useState, useEffect } from 'react';
import { taskCommentAPI } from '../services/api';
import './CommentListPage.css';

interface TaskComment {
  id: number;
  task: number;
  user: number;
  content: string;
  created: string;
}

const CommentListPage: React.FC = () => {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newComment, setNewComment] = useState({
    task: 1, // Varsayılan task ID
    content: '',
  });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await taskCommentAPI.getAll();
      const data = response.data as TaskComment[];
      setComments(data);
    } catch (err: any) {
      setError('Yorumlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskCommentAPI.create(newComment);
      setNewComment({ task: 1, content: '' });
      setShowCreateForm(false);
      fetchComments();
    } catch (err: any) {
      setError('Yorum oluşturulurken bir hata oluştu');
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      try {
        await taskCommentAPI.delete(id);
        fetchComments();
      } catch (err: any) {
        setError('Yorum silinirken bir hata oluştu');
      }
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="comment-list-container">
      <header className="comment-header">
        <h1>Yorumlar</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
          {showCreateForm ? 'İptal' : 'Yeni Yorum'}
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <div className="create-comment-form">
          <h3>Yeni Yorum Ekle</h3>
          <form onSubmit={handleCreateComment}>
            <div className="form-group">
              <label>Görev ID</label>
              <input
                type="number"
                value={newComment.task}
                onChange={(e) => setNewComment({ ...newComment, task: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Yorum</label>
              <textarea
                value={newComment.content}
                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                required
                rows={3}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Ekle</button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <div className="comment-header">
              <span className="comment-task">Görev #{comment.task}</span>
              <div className="comment-actions">
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="btn-danger"
                >
                  Sil
                </button>
              </div>
            </div>
            
            <p className="comment-content">{comment.content}</p>
            
            <div className="comment-meta">
              <span>Kullanıcı: {comment.user}</span>
              <span>Tarih: {new Date(comment.created).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && !loading && (
        <div className="no-comments">
          <p>Henüz yorum bulunmuyor.</p>
          <button onClick={() => setShowCreateForm(true)} className="btn-primary">
            İlk Yorumunuzu Ekleyin
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentListPage; 