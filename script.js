// Select the HTML elements we need
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

// Store all notes in an array
let notes = [];

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem("quicknotes", JSON.stringify(notes));
}

// Load notes from localStorage
function loadNotes() {
  const savedNotes = localStorage.getItem("quicknotes");

  if (savedNotes) {
    notes = JSON.parse(savedNotes);
  }
}

// Display the notes on the page
function render() {
  notesList.textContent = "";

  notes.forEach(function(note) {
    const li = document.createElement("li");

    // Add the note class and category class
    li.classList.add("note", note.category);

    // Create the note text
    const noteText = document.createElement("span");
    noteText.textContent = note.text;

    // Create the delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    // Delete the note when the button is clicked
    deleteButton.addEventListener("click", function() {
      notes = notes.filter(function(item) {
        return item.id !== note.id;
      });

      saveNotes();
      render();
    });

    // Add the text and button to the note
    li.appendChild(noteText);
    li.appendChild(deleteButton);

    // Add the note to the list
    notesList.appendChild(li);
  });

  // Update the note count
  if (notes.length === 1) {
    noteCount.textContent = "1 note";
  } else {
    noteCount.textContent = notes.length + " notes";
  }
}

// Add a new note when the form is submitted
noteForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Validate the note
  if (text === "" || text.length > 200) {
    errorMessage.textContent =
      "Note must be between 1 and 200 characters.";
    return;
  }

  errorMessage.textContent = "";

  // Create the new note object
  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toISOString()
  };

  // Add the note to the array
  notes.push(newNote);

  // Save the updated array
  saveNotes();

  // Clear the input
  noteInput.value = "";

  // Display the updated notes
  render();
});

// Search notes as the user types
searchInput.addEventListener("input", function() {
  const searchText = searchInput.value.toLowerCase();

  const filteredNotes = notes.filter(function(note) {
    return note.text.toLowerCase().includes(searchText);
  });

  notesList.textContent = "";

  filteredNotes.forEach(function(note) {
    const li = document.createElement("li");

    li.classList.add("note", note.category);

    const noteText = document.createElement("span");
    noteText.textContent = note.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function() {
      notes = notes.filter(function(item) {
        return item.id !== note.id;
      });

      saveNotes();
      render();

      // Keep the search results updated
      searchInput.dispatchEvent(new Event("input"));
    });

    li.appendChild(noteText);
    li.appendChild(deleteButton);

    notesList.appendChild(li);
  });
});

// Load saved notes when the page opens
loadNotes();

// Display the notes
render();