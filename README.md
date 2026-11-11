# REDMOND Uygulama Panel

Liman temalı proje dashboard'u. Her proje bir konteyner; gantri vinci imleci izler.

- **Masaüstü (Windows):** `derle.bat` çalıştırılır (Node.js gerekir), `dist/REDMOND-Proje-Limani.exe` çıkar. Klasör/exe açma ve durum ışığı bu sürümde çalışır.
- **Sunucu:** `Dockerfile` ile `index.html` nginx'ten yayınlanır (Coolify). Yalnızca web projeleri açılır; liste tarayıcıda saklanır.
