const { Task, Project, User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, ProjectId, assignedToId } = req.body;
    const task = await Task.create({ title, description, dueDate, priority, ProjectId, assignedToId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get projects user is part of
    const user = await User.findByPk(userId, { include: [Project] });
    const projectIds = user.Projects.map(p => p.id);

    const totalTasks = await Task.count({ where: { ProjectId: projectIds } });
    const tasksByStatus = await Task.findAll({
      where: { ProjectId: projectIds },
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
      group: ['status']
    });

    const overdueTasks = await Task.count({
      where: {
        ProjectId: projectIds,
        dueDate: { [Op.lt]: new Date() },
        status: { [Op.ne]: 'Done' }
      }
    });

    res.json({ totalTasks, tasksByStatus, overdueTasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
