import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const userId = req.user._id;
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.perPage) || 10;
  const { tag, search } = req.query;

  const notesQuery = Note.find().where('userId').equals(userId);
  const totalNotesQuery = Note.find().where('userId').equals(userId);

  if (tag) {
    notesQuery.where('tag').equals(tag);
    totalNotesQuery.where('tag').equals(tag);
  }

  if (typeof search === 'string' && search !== '') {
    notesQuery.find({ $text: { $search: search } });
    totalNotesQuery.find({ $text: { $search: search } });
  }

  const totalNotes = await totalNotesQuery.countDocuments();
  const totalPages = Math.ceil(totalNotes / perPage);
  const skip = (page - 1) * perPage;
  const notes = await notesQuery.skip(skip).limit(perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updatedNote = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    {
      returnDocument: 'after',
      runValidators: true,
    },
  );

  if (!updatedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(updatedNote);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const deletedNote = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!deletedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(deletedNote);
};
