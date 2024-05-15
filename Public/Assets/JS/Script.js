let NoteForm;
let NoteTitle;
let NoteText;
let SaveNoteBtn;
let NewNoteBtn;
let NoteList;

if (window.location.pathname === '/Notes') {
  NoteForm = document.querySelector('.Note-Form');
  NoteTitle = document.querySelector('.Note-Title');
  NoteText = document.querySelector('.Note-TextArea');
  SaveNoteBtn = document.querySelector('.Save-Note');
  NewNoteBtn = document.querySelector('.New-Note');
  ClearBtn = document.querySelector('.Clear-Btn');
  NoteList = document.querySelectorAll('.List-Container .List-Group');
}

// Show an Element
const Show = (Element) => {
  Element.style.display = 'inline';
};

// Hide an Element
const Hide = (Element) => {
  Element.style.display = 'none';
};

// ActiveNote Keeps Track of the Note in the <TextArea>
let ActiveNote = {};

const GetNotes = () =>
    fetch('/API/Notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

const SaveNote = (Note) =>
    fetch('/API/Notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Note)
    });

const DeleteNote = (ID) =>
    fetch(`/API/Notes/${ID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

const RenderActiveNote = () => {
    Hide(SaveNoteBtn);
    Hide(ClearBtn);
    
    if (ActiveNote.id) {
        Show(NewNoteBtn);
        NoteTitle.setAttribute('readonly', true);
        NoteText.setAttribute('readonly', true);
        NoteTitle.value = ActiveNote.Title;
        NoteText.value = ActiveNote.Text;
    } else {
       Hide(NewNoteBtn);
       NoteTitle.removeAttribute('readonly');
       NoteText.removeAttribute('readonly');
       NoteTitle.value = '';
       NoteText.value = '';
    }
};

const HandleNoteSave = () => {
    const NewNote = {
        Title: NoteTitle.value,
        Text: NoteText.value
    };
    SaveNote(NewNote).then(() => {
        GetAndRenderNotes();
        RenderActiveNote();
    });
};

// Delete the Selected Note
const HandleNoteDelete = (e) => {
    // Prevent Calling List Click Listener When Button Inside of it is Clicked
    e.stopPropagation();
    
    const Note = e.target;
    const NoteParent = Note.parentElement;
    console.log(NoteParent);
    console.log(NoteParent.getAttribute('data--note'));
    const NoteID = JSON.parse(NoteParent.getAttribute('data--note')).id;
    console.log('Note ID:', NoteID);
    
    if (ActiveNote.id === NoteID) {
        ActiveNote = {};
    }
    
    DeleteNote(NoteID).then(() => {
        GetAndRenderNotes();
        RenderActiveNote();
    });
};

// Set and Display ActiveNote
const HandleNoteView = (e) => {
    e.preventDefault();
    ActiveNote = JSON.parse(e.target.parentElement.getAttribute('data--note'));
    RenderActiveNote();
};

// Set ActiveNote to an Empty Object and Allow User to Create a New Note
const HandleNewNoteView = (e) => {
    ActiveNote = {};
    Show(ClearBtn);
    RenderActiveNote();
};

// Render Appropriate Buttons Based on the Form's State
const HandleRenderBtns = () => {
    Show(ClearBtn);
    
    if (!NoteTitle.value.trim() && !NoteText.value.trim()) {
        Hide(ClearBtn);
    } else if (!NoteTitle.value.trim() || !NoteText.value.trim()) {
        Hide(SaveNoteBtn);
    } else {
        Show(SaveNoteBtn);
    }
};

// Render List of Note Titles
const RenderNoteList = async (Notes) => {
    let JSONNotes = await Notes.json();
    
    if (window.location.pathname === '/Notes') {
        NoteList.forEach((Element) => (Element.innerHTML = ''));
    }
    
    let NoteListItems = [];

    // Return HTML Element With or Without Delete Button
    const CreateList = (Text, NoteID, DeleteBtn = true) => {
        const ListElement = document.createElement('li');
        ListElement.classList.add('List-Group-Item');

        const SpanElement = document.createElement('span');
        SpanElement.classList.add('List-Item-Title');
        SpanElement.innerText = Text;
        SpanElement.addEventListener('click', HandleNoteView);
        ListElement.setAttribute('Data-Note', JSON.stringify({ ID: NoteID }));
        ListElement.append(SpanElement);

        if (DeleteBtn) {
            const DeleteBtnElement = document.createElement('i');
            DeleteBtnElement.classList.add(
                'Delete-Note',
                'fas',
                'fa-trash-alt',
                'float-right',
                'text-danger'
            );
            DeleteBtnElement.addEventListener('click', HandleNoteDelete);
            ListElement.append(DeleteBtnElement);
        }
        return ListElement;
    };
    
    if (JSONNotes.length === 0) {
        NoteListItems.push(CreateList('No Saved Notes', false));
    }
    
    JSONNotes.forEach((Note) => {
        const List = CreateList(Note.Title);
        List.dataset.Note = JSON.stringify(Note);
        
        NoteListItems.push(List);
    });
    
    if (window.location.pathname === '/Notes') {
        NoteListItems.forEach((Note) => NoteList[0].append(Note));
    }
};

// Get Notes From Database and Render Notes to Sidebar
const GetAndRenderNotes = () => GetNotes().then(RenderNoteList);

if (window.location.pathname === '/Notes') {
    SaveNoteBtn.addEventListener('click', HandleNoteSave);
    NewNoteBtn.addEventListener('click', HandleNewNoteView);
    ClearBtn.addEventListener('click', RenderActiveNote);
    NoteForm.addEventListener('input', HandleRenderBtns);
}

GetAndRenderNotes();