const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});

const Project = sequelize.define('Project', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
});

const ProjectMember = sequelize.define('ProjectMember', {
  role: { type: DataTypes.ENUM('Admin', 'Member'), defaultValue: 'Member' },
});

const Task = sequelize.define('Task', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  dueDate: { type: DataTypes.DATEONLY },
  priority: { type: DataTypes.ENUM('Low', 'Medium', 'High'), defaultValue: 'Medium' },
  status: { type: DataTypes.ENUM('To Do', 'In Progress', 'Done'), defaultValue: 'To Do' },
});

// Associations
User.hasMany(Project, { as: 'ownedProjects', foreignKey: 'ownerId' });
Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

User.belongsToMany(Project, { through: ProjectMember });
Project.belongsToMany(User, { through: ProjectMember });

Project.hasMany(Task, { onDelete: 'CASCADE' });
Task.belongsTo(Project);

User.hasMany(Task, { foreignKey: 'assignedToId' });
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assignedToId' });

module.exports = { User, Project, ProjectMember, Task };
