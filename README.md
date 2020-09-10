# Backend-2-todoApp
An Nackademin assignment for the course Backend programming 2.


# Steg 1
Bygg en Webbtjänst med ett JSON-API som kan skapa, läsa, redigera och ta bort Todo Items.

En Todo ska minst ha en `titel` och ett `done` fält.

Webbtjänsten ska vara strukturerad enligt MVC (fast V:et är bara JSON).

Level up 1: (Klar)
- Bygg en FrontEnd som konsumerar webbtjänster med fetch eller axios.

Level up 2: (Klar)
- Lägg till fält på Todo Items som är när den skapades och när den uppdaterades. Lägg även till på FrontEnd-sidan att man kan sorta listan efter senast skapad eller senast ändrad.

Level up 3: (Klar)
- Lägg på pagination på routen som hämtar alla Todos

Exempel:
- Om det finns 50st todos (gud förbjude) i databasen så ska routen som hämtar alla todos endast hämta de 10 senaste. Men med en query parameter ska man kunna välja nästa 10 todos.

## Vue
https://cli.vuejs.org/guide/prototyping.html

## Steg 2 - Auth
Nu är det dags att göra din app redo för det stora vilda farliga internet. Detta görs genom att skapa **auth-funktionalitet**.

**Authentication** handlar om VEM du är, funkitonalitet som säkerställer att DU är du. Ex. login med *användarnamn* och lösenord.

**Authorization** handlar om VAD du har tillgång till, funktionalitet som avgör vilka resurser i ett system du har åtkomst till samt *vad* (CRUD) du för göra med de resurserna.

### Frontend
På frontend ska man nu kunna logga in med ett användarnamn ( epost? ) och lösenord. På frontenden skall efter authentication genomförst visa *state*, d.v.s. *vem* som är inloggad. Ett tips är att spara en token samt inloggad användare i [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).

### Backend (Done)
Du ska utöka ditt API med **RBAC-funktionalitet**. De roller som kan tilldelas är:

|Role|Auth|
|---|---|
|admin| Write, Read, Update, Delete |
|user|Write, Read, Update|

Det är även helt ok att remixa dessa roller eller lägga till egna.


#### Authentication (Done)
Ditt API skall utökas med en resurs som heter ```/auth```. Den resursen ska ta emot en *POST* med användarnamn och lösenord och returnera en signerad [JWT](https://jwt.io/).

#### Authorisation (Done)
Vid varje anrop till servern skall en token medskickas i headern ( Bearer ). På serversidan så ska ditt API kunna kolla upp vilken ```role``` användaren med just den token har samt vilka operationer som därmed användaren tillåts göras.

#### Skapa nya användare (Done)
Ditt API ska kunna hantera att skapa nya användare. Detta görs med en *POST* till resursen ```/users```. Endast administratörer får skapa användare ( dock måste den första ev. hårdkodas in alt. POSTAS in innan auth-funktionaliteten är på plats ).

## Steg 3

Todo App - Step 3

Steg 3 för Todoappen är att börja lägga på enhetstester och integrationstester. (Done)

För att inte lägga på en massa retroaktiva tester så ska ni implementera en av bonusbanorna för appen. (Done)

Ni ska bygga om Datamodellen för appen så att todos tillhör en todolist, och användare kan skapa flera olika todolistor med olika titlar. (Done)

Börja med enhetstester för alla modeller och fortsätt sedan med integrationstester för alla nya endpoints. (Stod alla.... Fuck...)

## Bonus banor

### Features
- Multiple todo lists (Done)
- Mark todos as urgent (Done)
- Add query params for filtering and sorting for todos (Half done)
- Add pagination (Done)
- Share todo lists with other users

### Architecture
- Add a more robust error handling https://expressjs.com/en/guide/error-handling.html (Try and catch )
- Add structured logging with Winston https://stackify.com/winston-logging-tutorial/
