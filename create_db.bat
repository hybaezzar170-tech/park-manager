@echo off
echo Creation de la base de donnees alba_app...
"C:\xampp\mysql\bin\mysql.exe" -u root < create_alba_db.sql
echo Base de donnees alba_app creee avec succes!
pause
