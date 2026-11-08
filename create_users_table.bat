@echo off
echo Creation de la table users dans la base de donnees alba_app...
"C:\xampp\mysql\bin\mysql.exe" -u root alba_app -e "CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    telephone VARCHAR(20) NULL,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);"
echo.
if %errorlevel% equ 0 (
    echo ✅ Table users creee avec succes!
) else (
    echo ❌ Erreur lors de la creation de la table users
)
pause
