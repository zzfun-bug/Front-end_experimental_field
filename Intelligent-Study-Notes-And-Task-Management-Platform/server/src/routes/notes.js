import express from 'express';
import {
  getNotes,
  getNotesPaginated,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  deleteNotes,
  searchNotes,
  getTags,
  getNoteStats,
} from '../controllers/noteController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateNote,
  validateObjectId,
  validatePagination,
  validateSearch,
} from '../middleware/validation.js';

const router = express.Router();

// 所有路由都需要认证
router.use(authenticate);

// 获取笔记
router.get('/', validateSearch, getNotes);
router.get('/paginated', validatePagination, validateSearch, getNotesPaginated);
router.get('/search', validateSearch, searchNotes);
router.get('/tags', getTags);
router.get('/stats', getNoteStats);
router.get('/:id', validateObjectId(), getNoteById);

// 创建笔记
router.post('/', validateNote, createNote);

// 更新笔记
router.put('/:id', validateObjectId(), validateNote, updateNote);

// 删除笔记
router.delete('/:id', validateObjectId(), deleteNote);
router.post('/batch-delete', deleteNotes);

export default router;
