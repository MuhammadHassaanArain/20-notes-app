"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { FilePenIcon, TrashIcon } from "lucide-react"; // Import icons from lucide-react

type Notes = {
  id: number;
  title: string;
  content: string;
};
const defaultNotes: Notes[] = [
  {
    id: 1,
    title: "Note 1",
    content: "This is the cosntent of  Note 1.",
  },
  {
    id: 2,
    title: "Note 2",
    content: "This is the content of Note 2.",
  },

];

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

function NotesAppComponent() {
  const [notes, setNotes] = useLocalStorage<Notes[]>("notes", defaultNotes);
  const [newNotes, setNewNotes] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddNote = () => {
    if (newNotes.title.trim() && newNotes.content.trim()) {
      const newNoteWithId = { id: Date.now(), ...newNotes };
      setNotes([...notes, newNoteWithId]);
      setNewNotes({ title: "", content: "" });
    }
  };

  const handleEditNote = (id: number): void => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setNewNotes({ title: noteToEdit.title, content: noteToEdit.content });
      setEditingNoteId(id);
    }
  };

  const handleUpdateNote = (): void => {
    if (newNotes.title.trim() && newNotes.content.trim()) {
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId
            ? { id: note.id, title: newNotes.title, content: newNotes.content }
            : note
        )
      );
      setNewNotes({ title: "", content: "" });
      setEditingNoteId(null);
    }
  };

  const handleDeleteNote = (id: number): void => {
    setNotes(notes.filter((note) => note.id !== id));
  };
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="bg-muted p-4 shadow">
        <h1 className="text-2xl font-bold">Note Taker</h1>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <div className="mb-4">
          {/* Input for note title */}
          <input
            type="text"
            placeholder="Title"
            value={newNotes.title || ""}
            onChange={(e) =>
              setNewNotes({ ...newNotes, title: e.target.value })
            }
            className="w-full rounded-md border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {/* Textarea for note content */}
          <textarea
            placeholder="Content"
            value={newNotes.content || ""}
            onChange={(e) =>
              setNewNotes({ ...newNotes, content: e.target.value })
            }
            className="mt-2 w-full rounded-md border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            rows={4}
          />
          {/* Button to add or update note */}
          {editingNoteId === null ? (
            <Button onClick={handleAddNote} className="mt-2">
              Add Note
            </Button>
          ) : (
            <Button onClick={handleUpdateNote} className="mt-2">
              Update Note
            </Button>
          )}
        </div>
        {/* Display list of notes */}
        <div className="grid gap-4">
          {notes.map((note) => (
            <Card key={note.id} className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{note.title}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditNote(note.id)}
                  >
                    <FilePenIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-muted-foreground">{note.content}</p>

            </Card>
          ))}
        </div>
        <div className="flex justify-center text-center  font-bold pt-10">Created by Hassaan Arain</div>
      </main>
    </div>
  );
}
export default NotesAppComponent;
