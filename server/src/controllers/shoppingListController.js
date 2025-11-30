const validate = require("../validators/validate");
// Select appropriate service (Mongo or mock) based on USE_MOCK env flag
const { shoppingListService: service } = require("../services/factory");

// Helper to map Mongo document to frontend DTO shape (moved to top-level)
function toDto(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id?.toString?.() || obj.id,
    name: obj.name,
    owner: obj.ownerId || obj.owner,
    archived: obj.isArchived || obj.archived || false,
    // Filter out any member record that represents the owner to avoid duplication in UI
    members: (obj.members || []).filter(m => m.userId !== (obj.ownerId || obj.owner)),
    items: (obj.items || []).map(it => ({
      id: it._id?.toString?.() || it.id,
      name: it.name,
      resolved: it.isResolved || it.resolved || false
    }))
  };
}

exports.create = async (req, res, next) => {
  const dtoIn = req.body;
  const errors = validate({ name: { required: true, type: "string" }, owner: { required: true, type: "string" } }, dtoIn);
  if (Object.keys(errors).length) return res.status(400).json({ data: dtoIn, uuAppErrorMap: errors, status: "error" });
  try {
    const data = await service.create(dtoIn);
    res.json({ data: toDto(data), uuAppErrorMap: {}, status: "success" });
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  const userId = req.query.userId || "user-1";
  try {
    const data = await service.list(userId);
    res.json({ data: data.map(toDto), uuAppErrorMap: {}, status: "success" });
  } catch (e) {
    next(e);
  }
};

exports.get = async (req, res, next) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { id: "is required" }, status: "error" });
  try {
    const data = await service.get(id);
    if (!data) return res.status(404).json({ data: null, uuAppErrorMap: { notFound: "List not found" }, status: "error" });
    res.json({ data: toDto(data), uuAppErrorMap: {}, status: "success" });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { id: "is required" }, status: "error" });
  try {
    const data = await service.update(id, req.body);
    res.json({ data: toDto(data), uuAppErrorMap: {}, status: "success" });
  } catch (e) { next(e); }
};

exports.archive = async (req, res, next) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { id: "is required" }, status: "error" });
  try {
    const data = await service.archive(id);
    res.json({ data: toDto(data), uuAppErrorMap: {}, status: "success" });
  } catch (e) { next(e); }
};

exports.unarchive = async (req, res, next) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { id: "is required" }, status: "error" });
  try {
    const data = await service.unarchive(id);
    res.json({ data: toDto(data), uuAppErrorMap: {}, status: "success" });
  } catch (e) { next(e); }
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { id: "is required" }, status: "error" });
  try {
    await service.delete(id);
    res.json({ data: { id }, uuAppErrorMap: {}, status: "success" });
  } catch (e) { next(e); }
};

exports.leave = async (req, res, next) => {
  const { id, userId } = req.body;
  if (!id || !userId) return res.status(400).json({ data: null, uuAppErrorMap: { id: "is required", userId: "is required" }, status: "error" });
  try {
    await service.leave(id, userId);
    res.json({ data: { id, leftUserId: userId }, uuAppErrorMap: {}, status: "success" });
  } catch (e) { next(e); }
};
