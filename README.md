# Backend-2-todoApp
An Nackademin assignment for the course Backend programming 2.

Bygg en Webbtjänst med ett JSON-API som kan skapa, läsa, redigera och ta bort Todo Items.

En Todo ska minst ha en `titel` och ett `done` fält.

Webbtjänsten ska vara strukturerad enligt MVC (fast V:et är bara JSON).

Level up 1:
- Bygg en FrontEnd som konsumerar webbtjänster med fetch eller axios.

Level up 2: (Klar)
- Lägg till fält på Todo Items som är när den skapades och när den uppdaterades. Lägg även till på FrontEnd-sidan att man kan sorta listan efter senast skapad eller senast ändrad.

Level up 3: (Klar)
- Lägg på pagination på routen som hämtar alla Todos

Exempel:
- Om det finns 50st todos (gud förbjude) i databasen så ska routen som hämtar alla todos endast hämta de 10 senaste. Men med en query parameter ska man kunna välja nästa 10 todos.