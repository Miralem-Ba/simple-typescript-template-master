// Importieren der Comment-Klasse für den Test.
import { Comment } from './comment';

// Mocken des Database-Moduls, um die tatsächliche Datenbankinteraktion während des Tests zu ersetzen.
// Das Mock-Objekt simuliert die executeSQL-Methode und gibt eine vordefinierte Antwort zurück.
jest.mock('../../database/database', () => {
  return {
    Database: jest.fn().mockImplementation(() => {
      return {
        executeSQL: jest.fn().mockResolvedValue([{ id: 1, content: 'test comment', userId: 1 }])
      };
    })
  };
});

// Gruppieren der Tests für die Comment-API.
describe('Comment API', () => {
  let comment: Comment; // Deklaration einer Variable, um eine Instanz von Comment zu speichern.

  // Initialisieren vor allen Tests.
  beforeAll(() => {
    comment = new Comment(); // Erstellen einer neuen Instanz von Comment für die Tests.
  });

  // Ein Testfall, der überprüft, ob Kommentare erfolgreich abgerufen werden können.
  it('should retrieve comments', async () => {
    const result = await comment.getComment(); // Ausführen der getComment-Methode und Speichern des Ergebnisses in einer Variablen.

    // Überprüfen, ob das Ergebnis ein Array ist. Dies validiert, dass getComment eine Liste zurückgibt.
    expect(result).toEqual(expect.any(Array)); // Annahme, dass getComment ein Array zurückgibt.
    
    // Zusätzlich überprüfen, ob das erste Element des Ergebnisarrays die erwartete Eigenschaft 'content' hat.
    // Dies bestätigt, dass das Array die erwarteten Datenobjekte enthält.
    expect(result[0]).toHaveProperty('content', 'test comment');
  });
});

// Mithilfe von GPT3 habe ich die Tests geschrieben.
// Ich habe die Tests mit Jest geschrieben.