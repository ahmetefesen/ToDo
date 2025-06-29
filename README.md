# Todo List Uygulaması

Bu proje, Django REST Framework backend'i ve React TypeScript frontend'i ile geliştirilmiş kapsamlı bir todo list uygulamasıdır.

## 🚀 Özellikler

### Backend (Django)
- **RESTful API**: Django REST Framework ile geliştirilmiş
- **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- **Comprehensive Models**: Task, User, Team, Comment, Attachment vb.
- **Logging System**: Detaylı log kayıtları
- **API Versioning**: v1 API desteği
- **Security**: CORS, XSS, CSRF koruması
- **Database**: SQLite (Development) / PostgreSQL (Production)

### Frontend (React + TypeScript)
- **Modern UI**: Responsive ve kullanıcı dostu arayüz
- **TypeScript**: Tip güvenliği
- **State Management**: React Hooks
- **Error Handling**: Kapsamlı hata yönetimi
- **Authentication**: JWT token yönetimi
- **API Integration**: Axios ile API entegrasyonu

## 📋 Gereksinimler

### Backend
- Python 3.8+
- Django 3.0+
- Django REST Framework
- Django CORS Headers
- Django REST Framework Simple JWT

### Frontend
- Node.js 14+
- React 18+
- TypeScript 4.9+
- Axios

## 🛠️ Kurulum

### 1. Backend Kurulumu

```bash
# Proje dizinine git
cd Django-To-Do-list-with-user-authentication

# Virtual environment oluştur
python -m venv venv

# Virtual environment aktifleştir
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Bağımlılıkları yükle
pip install -r requirements.txt
# veya
pipenv install

# Veritabanı migration'larını çalıştır
python manage.py makemigrations
python manage.py migrate

# Superuser oluştur
python manage.py createsuperuser

# Sunucuyu başlat
python manage.py runserver
```

### 2. Frontend Kurulumu

```bash
# Frontend dizinine git
cd frontend

# Bağımlılıkları yükle
npm install

# Development sunucusunu başlat
npm start
```

## 🔧 Konfigürasyon

### Environment Variables

Backend için `.env` dosyası oluşturun:

```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Database Konfigürasyonu

Production için PostgreSQL kullanmak istiyorsanız, `settings.py` dosyasındaki database ayarlarını güncelleyin:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'todo_db',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 📚 API Dokümantasyonu

### Authentication Endpoints

- `POST /api/token/` - Login
- `POST /api/token/refresh/` - Token yenileme
- `POST /api/token/verify/` - Token doğrulama
- `POST /api/register/` - Kullanıcı kaydı

### Task Endpoints

- `GET /api/v1/tasks/` - Tüm görevleri listele
- `POST /api/v1/tasks/` - Yeni görev oluştur
- `GET /api/v1/tasks/{id}/` - Görev detayı
- `PUT /api/v1/tasks/{id}/` - Görev güncelle
- `DELETE /api/v1/tasks/{id}/` - Görev sil
- `POST /api/v1/tasks/{id}/toggle/` - Görev durumu değiştir

### Team Endpoints

- `GET /api/v1/teams/` - Tüm takımları listele
- `POST /api/v1/teams/` - Yeni takım oluştur
- `GET /api/v1/teams/{id}/` - Takım detayı
- `PUT /api/v1/teams/{id}/` - Takım güncelle
- `DELETE /api/v1/teams/{id}/` - Takım sil

### Comment Endpoints

- `GET /api/v1/taskcomments/` - Tüm yorumları listele
- `POST /api/v1/taskcomments/` - Yeni yorum oluştur
- `GET /api/v1/taskcomments/{id}/` - Yorum detayı
- `PUT /api/v1/taskcomments/{id}/` - Yorum güncelle
- `DELETE /api/v1/taskcomments/{id}/` - Yorum sil

## 🔒 Güvenlik

### JWT Token Yönetimi
- Access token: 60 dakika
- Refresh token: 1 gün
- Otomatik token yenileme
- Token doğrulama

### CORS Ayarları
- Sadece güvenli origin'ler
- Credential desteği
- HTTP method kısıtlamaları

### Input Validation
- Model seviyesinde validation
- Serializer seviyesinde validation
- XSS koruması
- SQL injection koruması

## 📊 Logging

Sistem aşağıdaki log türlerini kaydeder:

- **Security Logs**: Login/logout, yetkisiz erişim
- **Operation Logs**: CRUD işlemleri, API erişimleri
- **Error Logs**: Validation hataları, sistem hataları

Log dosyaları `logs/` dizininde saklanır.

## 🧪 Test

### Backend Testleri

```bash
# Tüm testleri çalıştır
python manage.py test

# Belirli bir app'in testlerini çalıştır
python manage.py test base

# Coverage ile test
coverage run --source='.' manage.py test
coverage report
```

### Frontend Testleri

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Ayarları

1. `DEBUG = False` yapın
2. Güvenli `SECRET_KEY` kullanın
3. PostgreSQL veritabanı kullanın
4. Static files'ları collect edin
5. HTTPS kullanın

```bash
# Static files collect
python manage.py collectstatic

# Production sunucusu
gunicorn todo_list.wsgi:application
```

### Docker Deployment

```dockerfile
# Dockerfile örneği
FROM python:3.8
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "todo_list.wsgi:application"]
```

## 📁 Proje Yapısı

```
Django-To-Do-list-with-user-authentication/
├── base/                    # Ana Django app
│   ├── models.py           # Veritabanı modelleri
│   ├── views.py            # API view'ları
│   ├── serializers.py      # API serializer'ları
│   ├── urls.py             # URL routing
│   └── utils.py            # Utility fonksiyonları
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React component'leri
│   │   ├── pages/         # Sayfa component'leri
│   │   ├── services/      # API servisleri
│   │   └── types/         # TypeScript type'ları
│   └── package.json
├── todo_list/             # Django project settings
├── manage.py
└── README.md
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Destek

Herhangi bir sorun yaşarsanız:

1. Issue oluşturun
2. Email gönderin
3. Dokümantasyonu kontrol edin

## 🔄 Güncellemeler

### v1.0.0
- İlk sürüm
- Temel CRUD işlemleri
- JWT authentication
- React frontend

### v1.1.0
- API versioning eklendi
- Enhanced error handling
- TypeScript type definitions
- Security improvements


