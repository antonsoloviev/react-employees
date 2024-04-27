const { prisma } = require('../prisma/prisma-client');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

/**
 * @route GET /api/employees
 * @description get all employees
 * @access Private
 */
const all = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();

    res.status(200).json(employees);
  } catch {
    res.status(500).json({ message: 'Не удалось получить сотрудников' });
  }
};

/**
 * @route POST /api/employees/add
 * @description create employee
 * @access Private
 */
const add = async (req, res) => {
  try {
    const data = req.body;

    if (!data.firstName || !data.lastName || !data.address || !data.age) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    const newEmployee = await prisma.employee.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });

    return res.status(200).json(newEmployee);
  } catch {
    res.status(500).json({ message: 'Не удалось создать сотрудника' });
  }
};

/**
 * @route POST /api/employees/remove/:id
 * @description remove employee by id
 * @access Private
 */
const remove = async (req, res) => {
  try {
    const { id } = req.body;
    await prisma.employee.delete({
      where: {
        id: id,
      },
    });
    res.status(204).json('User successfully deleted');
  } catch (error) {
    return res.status(500).json({ message: 'Не удалось удалить сотрудника' });
  }
};

/**
 * @route PUT /api/employees/edit/:id
 * @description edit employee by id
 * @access Private
 */
const edit = async (req, res) => {
  try {
    const data = req.body;
    const id = data.id;

    await prisma.employee.update({
      where: {
        id: id,
      },
      data: data,
    });

    res.status(204).json({ message: 'User successfully updated' });
  } catch (error) {
    return res.status(500).json({ message: 'Не удалось отредактировать сотрудника' });
  }
};

/**
 * @route GET /api/employees/:id
 * @description get employee by id
 * @access Private
 */
const getEmployee = async (req, res) => {
  try {
    const { id } = req.params; // api/employees/cde5f690-adb0-4e5d-affc-9ebb9fbe3b53

    const employee = await prisma.employee.findUnique({
      where: {
        id: id,
      },
    });

    res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Не удалось получить сотрудника' });
  }
};

module.exports = {
  all,
  add,
  remove,
  edit,
  getEmployee,
};
