const { Project, User, ProjectMember, Task } = require('../models');

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ name, description, ownerId: req.user.id });
    await ProjectMember.create({ ProjectId: project.id, UserId: req.user.id, role: 'Admin' });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Project, through: { attributes: ['role'] } }]
    });
    res.json(user.Projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectDetails = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, through: { attributes: ['role'] } },
        { model: Task, include: [{ model: User, as: 'assignee', attributes: ['id', 'name'] }] }
      ]
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const userToAdd = await User.findOne({ where: { email } });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });

    const existingMember = await ProjectMember.findOne({
      where: { ProjectId: req.params.id, UserId: userToAdd.id }
    });
    if (existingMember) return res.status(400).json({ message: 'User already a member' });

    await ProjectMember.create({ ProjectId: req.params.id, UserId: userToAdd.id, role: role || 'Member' });
    res.json({ message: 'Member added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
