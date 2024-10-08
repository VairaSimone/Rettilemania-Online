# Rettilemania

Rettilemania è un'applicazione full-stack per la gestione e la visualizzazione di dati relativi ai rettili. L'app è costruita con un backend basato su Node.js e MongoDB, e un frontend React, per offrire un'interfaccia utente intuitiva.

Il sito è visitabile al link: https://www.rettilemania-online.vercel.app

## Struttura del Progetto

- Backend: Node.js, Express, MongoDB.
- Frontend: React.

### Backend
Il backend gestisce le API per l'interazione con il database MongoDB, fornendo funzionalità di autenticazione, gestione dei dati e caricamento di file.

### Frontend
Il frontend è sviluppato con React e comunica con il backend tramite API REST per fornire una gestione intuitiva e dinamica dei dati.

## Requisiti di Sistema

- Node.js (versione 14 o superiore)
- MongoDB (locale o cloud)
- NPM (versione 6 o superiore)

## Installazione

### Clonazione del Progetto
Prima di tutto, clona il repository nel tuo ambiente locale:

```
git clone <link-al-repository>
cd Rettilemania
```

### Backend Setup

1. Spostati nella directory del backend:
   ```
   cd backend
   ```

2. Installa le dipendenze necessarie:
   ```
   npm install
   ```

3. Crea un file `.env` nella cartella del backend. Puoi utilizzare il file `.env.example` come riferimento:


4. Avvia il server backend:
   ```
   npm start
   ```

### Frontend Setup

1. Spostati nella directory del frontend:
   ```
   cd frontend
   ```

2. Installa le dipendenze necessarie:
   ```
   npm install
   ```

3. Crea un file `.env.local` nella cartella del frontend. Puoi utilizzare il file `.env.local.example` come riferimento:

4. Avvia il server frontend:
   ```
   npm start
   ```

## Struttura del Progetto

### Backend (Node.js + MongoDB)
- index.js: Entry point del server Node.js.
- controllers/: Logica di business per la gestione delle risorse.
- models/: Modelli Mongoose per la definizione degli schemi MongoDB.
- routes/: Definizione delle API REST.
- middlewares/: Middleware di autenticazione e altro.
- config/: Configurazioni dell'applicazione, inclusa la connessione a MongoDB.

### Frontend (React)
- public/: Contiene il file `index.html` e altri asset statici.
- src/: Contiene i componenti React, i servizi e la logica di routing.

## Utilizzo

### Funzionalità Principali

- Autenticazione: Registrazione e login con token JWT.
- Gestione dei dati: Creazione, modifica, visualizzazione e cancellazione di dati relativi ai rettili e relativa alimentazione.
- Caricamento File: Possibilità di caricare immagini.
- Forum: Possibilità di inserire domande inerenti ai rettili.
- Notifiche: Possibilità di invio promemoria (mail) sul cibo da fornitore al rettile.

## Tecnologie Utilizzate

### Backend:
- Node.js e Express: Per la creazione delle API REST.
- MongoDB: Database NoSQL per la persistenza dei dati.
- Mongoose: ORM per la gestione del database MongoDB.
- JWT: Per l'autenticazione tramite token.
- Multer: Gestione del caricamento dei file.
- @sendgrid/mail: Libreria per l'invio di email tramite l'API di SendGrid.
- bcrypt: Utilizzato per l'hashing delle password.
- cloudinary: Servizio di hosting per immagini e video.
- cookie-parser: Parsing dei cookie nelle richieste HTTP.
- cors: Middleware per abilitare le richieste CORS (Cross-Origin Resource Sharing).
- dotenv: Gestione delle variabili d'ambiente tramite file .env.
- express: Framework web per Node.js.
- express-validator: Middleware per la validazione delle richieste HTTP.
- helmet: Protezione dell'app tramite HTTP header.
- jsonwebtoken: Implementazione di JSON Web Token (JWT) per l'autenticazione.
- morgan: Logger per le richieste HTTP.
- node-cron: Esecuzione di task in modo ricorrente.
- passport: Middleware di autenticazione per Node.js.
- passport-google-oauth20: Strategia OAuth2.0 per l'autenticazione tramite Google.
- nodemon: Strumento per riavviare automaticamente il server durante lo sviluppo.


### Frontend:
- React: Libreria per la costruzione dell'interfaccia utente.
- Axios: Per le richieste HTTP verso il backend.
- React Router: Per la gestione delle rotte nel frontend.
- @reduxjs/toolkit: Toolkit per la gestione dello stato con Redux.
- bootstrap: Framework CSS per creare interfacce responsive.
- dotenv: Gestione delle variabili d'ambiente nel frontend.
- jwt-decode: Decodifica di JSON Web Token (JWT).
- redux-persist: Persistenza dello stato Redux tra i refresh della pagina.
  
