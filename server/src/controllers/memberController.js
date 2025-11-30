const ShoppingList = require('../models/ShoppingList');
const Joi = require('joi');
const { add: validateAdd, remove: validateRemove } = require('../validators/member');
const { memberService } = require('../services/factory');
const useMock = process.env.USE_MOCK === 'true';

exports.add = async (req, res, next) => {
  try {
    const { error } = validateAdd.validate(req.body);
    if (error) return res.status(400).json({ ok: false, data: null, error: error.details[0].message });
    if (useMock && memberService) {
      const result = await memberService.add(req.body);
      if (result.error) return res.status(400).json({ ok: false, data: null, error: result.error });
      return res.json({ ok: true, data: result.data, error: null });
    }
    const { listId, userId, email, role } = req.body;
    const list = await ShoppingList.findById(listId);
    if (!list) return res.status(404).json({ ok: false, data: null, error: 'List not found' });
    if (list.members.some(m => m.userId === userId)) {
      return res.status(400).json({ ok: false, data: null, error: 'Member already exists' });
    }
    list.members.push({ userId, email, role });
    await list.save();
    res.json({ ok: true, data: list, error: null });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { error } = validateRemove.validate(req.body);
    if (error) return res.status(400).json({ ok: false, data: null, error: error.details[0].message });
    if (useMock && memberService) {
      const result = await memberService.remove(req.body);
      if (result.error) return res.status(404).json({ ok: false, data: null, error: result.error });
      return res.json({ ok: true, data: result.data, error: null });
    }
    const { listId, userId } = req.body;
    const list = await ShoppingList.findById(listId);
    if (!list) return res.status(404).json({ ok: false, data: null, error: 'List not found' });
    list.members = list.members.filter(m => m.userId !== userId);
    await list.save();
    res.json({ ok: true, data: list, error: null });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { listId } = req.query;
    if (!listId) return res.status(400).json({ ok: false, data: null, error: 'listId is required' });
    if (useMock && memberService) {
      const result = await memberService.list(listId);
      if (result.error) return res.status(404).json({ ok: false, data: null, error: result.error });
      return res.json({ ok: true, data: result.data, error: null });
    }
    const list = await ShoppingList.findById(listId);
    if (!list) return res.status(404).json({ ok: false, data: null, error: 'List not found' });
    res.json({ ok: true, data: list.members, error: null });
  } catch (err) {
    next(err);
  }
};
