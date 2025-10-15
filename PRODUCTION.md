# 🚀 Guía de Deployment en Producción

Esta guía describe los pasos exactos para deployar **777 E-commerce API** en un servidor de producción.

## 📋 Requisitos del Servidor

- **Sistema Operativo**: Linux (Ubuntu 20.04+ recomendado)
- **Node.js**: >= 18.x LTS
- **pnpm**: >= 8.x
- **MySQL**: 8.0+ (instalado o accesible)
- **PM2**: Para gestión de procesos (recomendado)
- **Nginx**: Para reverse proxy (opcional pero recomendado)

## 🔧 Preparación del Servidor

### 1. Instalar Node.js y pnpm

```bash
# Instalar Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pnpm globalmente
npm install -g pnpm

# Verificar instalación
node --version
pnpm --version
```

### 2. Instalar PM2

```bash
npm install -g pm2

# Verificar instalación
pm2 --version
```

### 3. Configurar MySQL

```bash
# Si no tienes MySQL, instalarlo
sudo apt-get update
sudo apt-get install mysql-server

# Crear base de datos y usuario
sudo mysql -u root -p
```

Dentro de MySQL:

```sql
CREATE DATABASE ecommerce_prod;
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'contraseña_segura';
GRANT ALL PRIVILEGES ON ecommerce_prod.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 📦 Deploy de la Aplicación

### Paso 1: Clonar el Repositorio

```bash
# Ir al directorio de aplicaciones
cd /var/www  # o tu directorio preferido

# Clonar repositorio
git clone <url-del-repositorio> 777-ecommerce
cd 777-ecommerce
```

### Paso 2: Configurar Variables de Entorno

```bash
# Crear archivo .env desde el template
cp .env.example .env

# Editar con las credenciales de producción
nano .env
```

Configurar así:

```env
# Base de datos de producción
DATABASE_URL="mysql://ecommerce_user:contraseña_segura@localhost:3306/ecommerce_prod"

# Entorno de producción
NODE_ENV="production"

# Puerto (usualmente 3000, Nginx hará reverse proxy al 80/443)
PORT=3000

# Información de la aplicación
APP_NAME="777 E-commerce API"
APP_VERSION="1.0.0"
```

### Paso 3: Instalar Dependencias

```bash
# Instalar solo dependencias de producción
pnpm install --prod

# Esto ejecutará automáticamente 'prisma generate' (postinstall)
```

### Paso 4: Compilar el Proyecto

```bash
pnpm run build
```

Esto generará el directorio `dist/` con el código JavaScript compilado.

### Paso 5: Sincronizar Base de Datos

```bash
# Sincronizar esquema de Prisma con MySQL
pnpm run db:push:prod
```

⚠️ **IMPORTANTE**: `db:push:prod` usa `--accept-data-loss`. Solo usar en primera instalación o si estás seguro.

### Paso 6: Ejecutar Seed (Solo Primera Vez)

```bash
# Poblar base de datos con categorías iniciales
pnpm run db:seed
```

Esto creará:
- Resto-Bar con 14 subcategorías
- Sex-Shop con 10 subcategorías

### Paso 7: Iniciar con PM2

```bash
# Iniciar aplicación con PM2
pm2 start dist/main.js --name "777-ecommerce" --time

# Guardar configuración de PM2
pm2 save

# Configurar PM2 para iniciar en boot del servidor
pm2 startup
# Seguir las instrucciones que PM2 muestre
```

### Paso 8: Verificar que está Corriendo

```bash
# Ver logs en tiempo real
pm2 logs 777-ecommerce

# Ver estado
pm2 status

# Probar endpoint
curl http://localhost:3000/api
```

Deberías ver la documentación Swagger si todo está bien.

## 🔄 Actualizar la Aplicación

Cuando necesites actualizar el código:

```bash
# 1. Ir al directorio del proyecto
cd /var/www/777-ecommerce

# 2. Detener la aplicación
pm2 stop 777-ecommerce

# 3. Obtener últimos cambios
git pull origin main

# 4. Instalar nuevas dependencias (si las hay)
pnpm install --prod

# 5. Recompilar
pnpm run build

# 6. Sincronizar cambios de base de datos (si los hay)
pnpm run db:push:prod

# 7. Reiniciar aplicación
pm2 restart 777-ecommerce

# 8. Ver logs para verificar
pm2 logs 777-ecommerce --lines 50
```

## 🌐 Configurar Nginx (Reverse Proxy)

Opcional pero recomendado para usar puerto 80/443:

### 1. Instalar Nginx

```bash
sudo apt-get install nginx
```

### 2. Crear Configuración

```bash
sudo nano /etc/nginx/sites-available/777-ecommerce
```

Contenido:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;  # Cambiar por tu dominio

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Activar Sitio

```bash
# Crear symlink
sudo ln -s /etc/nginx/sites-available/777-ecommerce /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

Ahora la API estará disponible en `http://tu-dominio.com/api`

### 4. Configurar SSL con Let's Encrypt (Opcional)

```bash
# Instalar certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Certbot configurará automáticamente Nginx para HTTPS
```

## 📊 Comandos Útiles de PM2

```bash
# Ver logs en tiempo real
pm2 logs 777-ecommerce

# Ver logs con filtro
pm2 logs 777-ecommerce --err  # Solo errores

# Reiniciar aplicación
pm2 restart 777-ecommerce

# Detener aplicación
pm2 stop 777-ecommerce

# Eliminar de PM2
pm2 delete 777-ecommerce

# Ver uso de recursos
pm2 monit

# Ver información detallada
pm2 show 777-ecommerce
```

## 🔒 Seguridad

### 1. Firewall

```bash
# Permitir SSH, HTTP y HTTPS
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Variables de Entorno Seguras

- Nunca commitear el archivo `.env` a Git
- Usar contraseñas fuertes para MySQL
- Cambiar las credenciales por defecto

### 3. Actualizar el Sistema

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

## 🐛 Troubleshooting

### La aplicación no inicia

```bash
# Ver logs de PM2
pm2 logs 777-ecommerce --lines 100

# Verificar variables de entorno
cat .env

# Verificar que MySQL está corriendo
sudo systemctl status mysql
```

### Error de conexión a MySQL

```bash
# Probar conexión manualmente
mysql -u ecommerce_user -p -h localhost ecommerce_prod

# Verificar permisos
sudo mysql -u root -p
SHOW GRANTS FOR 'ecommerce_user'@'localhost';
```

### Puerto 3000 ya en uso

```bash
# Ver qué proceso usa el puerto
sudo lsof -i :3000

# O cambiar el PORT en .env a otro puerto
```

## 📈 Monitoreo

### PM2 Plus (Opcional)

Para monitoreo avanzado:

```bash
# Registrarse en https://app.pm2.io
# Obtener clave pública/privada

pm2 link <secret_key> <public_key>
```

### Logs del Sistema

```bash
# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Ver logs de PM2
pm2 logs 777-ecommerce --lines 100
```

## 🔄 Backup de Base de Datos

```bash
# Crear backup
mysqldump -u ecommerce_user -p ecommerce_prod > backup_$(date +%Y%m%d).sql

# Restaurar backup
mysql -u ecommerce_user -p ecommerce_prod < backup_20241015.sql
```

## ✅ Checklist de Producción

- [ ] Node.js y pnpm instalados
- [ ] MySQL configurado con usuario y base de datos
- [ ] Código clonado y compilado (`pnpm run build`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Esquema de BD sincronizado (`pnpm run db:push:prod`)
- [ ] Seed ejecutado (primera vez)
- [ ] Aplicación iniciada con PM2
- [ ] PM2 configurado para inicio automático
- [ ] Nginx configurado (opcional)
- [ ] SSL configurado con Let's Encrypt (opcional)
- [ ] Firewall configurado
- [ ] Backup de base de datos programado

## 📞 Soporte

Para problemas o dudas, contactar al equipo de desarrollo.

---

**777 Team** - Producción Ready 🚀
