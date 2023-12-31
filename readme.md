## Nome Repo: vue-boolzapp

[Working Demo](https://raw.githack.com/aSwanting/vue-boolzapp/main/index.html)

#### Milestone 1

- Replica della grafica con la possibilità di avere messaggi scritti dall’utente (verdi) e
dall’interlocutore (bianco) assegnando due classi CSS diverse
- Visualizzazione dinamica della lista contatti: tramite la direttiva v-for, visualizzare
nome e immagine di ogni contatto

#### Milestone 2

- Visualizzazione dinamica dei messaggi: tramite la direttiva v-for, visualizzare tutti i
messaggi relativi al contatto attivo all’interno del pannello della conversazione
- Click sul contatto mostra la conversazione del contatto cliccato

#### Milestone 3

- Aggiunta di un messaggio: l’utente scrive un testo nella parte bassa e digitando
“enter” il testo viene aggiunto al thread sopra, come messaggio verde
- Risposta dall’interlocutore: ad ogni inserimento di un messaggio, l’utente riceverà
un “ok” come risposta, che apparirà dopo 1 secondo.

#### Milestone 4

- Ricerca utenti: scrivendo qualcosa nell’input a sinistra, vengono visualizzati solo i
contatti il cui nome contiene le lettere inserite (es, Marco, Matteo Martina -> Scrivo
“mar” rimangono solo Marco e Martina)

#### Milestone 5 (opzionale)

- Cancella messaggio: cliccando sul messaggio appare un menu a tendina che
permette di cancellare il messaggio selezionato
- Visualizzazione ora e ultimo messaggio inviato/ricevuto nella lista dei contatti

## Extra functionality

#### Scroll to new message
- The app will always scroll new messages into view 

#### Responsive layout
- Media Queries keep the app fluid

#### Slash Commands
Added some slash commands that exectute a couple of fun actions:
- Typing "/circles number" (eg. /circles 10) will spawn the chosen number of bouncing circles in the chat area. To clear them type "/clearcircles".
- Typing "/rotate number"  (eg. /rotate 45) will rotate the main app window by the chosen number of degrees. Rotate by 0 to reset the rotation.
