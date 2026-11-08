<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre compte AutoPark</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            color: #800C1F;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .title {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .info-box {
            background-color: #f8f9fa;
            padding: 20px;
            border-left: 4px solid #800C1F;
            margin: 20px 0;
            border-radius: 5px;
        }
        .info-item {
            margin: 10px 0;
        }
        .label {
            font-weight: bold;
            color: #555;
            display: inline-block;
            width: 100px;
        }
        .value {
            color: #800C1F;
            font-weight: 600;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #800C1F;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #3C0007;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">AutoPark</div>
            <h1 class="title">Bienvenue dans AutoPark!</h1>
        </div>

        <p>Bonjour {{ $prenom }} {{ $nom }},</p>
        
        <p>Votre compte a été créé avec succès dans le système de gestion AutoPark. Voici vos identifiants de connexion :</p>

        <div class="info-box">
            <div class="info-item">
                <span class="label">Nom:</span>
                <span class="value">{{ $nom }} {{ $prenom }}</span>
            </div>
            <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">{{ $email }}</span>
            </div>
            <div class="info-item">
                <span class="label">Mot de passe:</span>
                <span class="value">{{ $password }}</span>
            </div>
            <div class="info-item">
                <span class="label">Type:</span>
                <span class="value">{{ ucfirst($type) }}</span>
            </div>
        </div>

        <p><strong>Important:</strong> Veuillez conserver ces identifiants en sécurité et changer votre mot de passe lors de votre première connexion.</p>

        <div style="text-align: center;">
            <a href="{{ url('/login') }}" class="button">Se connecter</a>
        </div>

        <div class="footer">
            <p>Cet email a été envoyé automatiquement par le système AutoPark.</p>
            <p>Si vous n'avez pas demandé la création de ce compte, veuillez contacter l'administrateur.</p>
        </div>
    </div>
</body>
</html>
