import express from 'express';
import {
  getTasks,
  getTasksPaginated,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  deleteTasks,
  updateTaskStatus,
  updateTasksStatus,
  updateTaskOrder,
  getTaskStats,
  getWeeklyStats,
  getTodayTasks,
  getOverdueTasks,
  searchTasks,
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateTask,
  validateObjectId,
  validatePagination,
} from '../middleware/validation.js';

const router = express.Router();

// 所有路由都需要认证
router.use(authenticate);

// 获取任务
router.get('/', getTasks);
router.get('/paginated', validatePagination, getTasksPaginated);
router.get('/search', searchTasks);
router.get('/stats', getTaskStats);
router.get('/weekly-stats', getWeeklyStats);
router.get('/today', getTodayTasks);
router.get('/overdue', getOverdueTasks);
router.get('/:id', validateObjectId(), getTaskById);

// 创建任务
router.post('/', validateTask, createTask);

// 更新任务
router.put('/:id', validateObjectId(), validateTask, updateTask);

// 更新任务状态
router.patch('/:id/status', validateObjectId(), updateTaskStatus);
router.patch('/batch-status', updateTasksStatus);

// 更新任务排序
router.patch('/reorder', updateTaskOrder);

// 删除任务
router.delete('/:id', validateObjectId(), deleteTask);
router.post('/batch-delete', deleteTasks);

export default router;
