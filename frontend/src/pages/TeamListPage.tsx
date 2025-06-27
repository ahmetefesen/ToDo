import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamAPI } from '../services/api';
import './TeamListPage.css';

interface Team {
  id: number;
  name: string;
  description: string;
  created: string;
}

const TeamListPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      const data = response.data as Team[];
      setTeams(data);
    } catch (err: any) {
      setError('Takımlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await teamAPI.create(newTeam);
      setNewTeam({ name: '', description: '' });
      setShowCreateForm(false);
      fetchTeams();
    } catch (err: any) {
      setError('Takım oluşturulurken bir hata oluştu');
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (window.confirm('Bu takımı silmek istediğinizden emin misiniz?')) {
      try {
        await teamAPI.delete(id);
        fetchTeams();
      } catch (err: any) {
        setError('Takım silinirken bir hata oluştu');
      }
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="team-list-container">
      <header className="team-header">
        <h1>Takımlar</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
          {showCreateForm ? 'İptal' : 'Yeni Takım'}
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <div className="create-team-form">
          <h3>Yeni Takım Oluştur</h3>
          <form onSubmit={handleCreateTeam}>
            <div className="form-group">
              <label>Takım Adı</label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Açıklama</label>
              <textarea
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              />
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

      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <div className="team-header">
              <h3>{team.name}</h3>
              <div className="team-actions">
                <Link to={`/teams/${team.id}`} className="btn-link">Detay</Link>
                <Link to={`/teams/${team.id}/edit`} className="btn-link">Düzenle</Link>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="btn-danger"
                >
                  Sil
                </button>
              </div>
            </div>
            
            <p className="team-description">{team.description}</p>
            
            <div className="team-meta">
              <span>Oluşturulma: {new Date(team.created).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && !loading && (
        <div className="no-teams">
          <p>Henüz takım bulunmuyor.</p>
          <button onClick={() => setShowCreateForm(true)} className="btn-primary">
            İlk Takımınızı Oluşturun
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamListPage; 