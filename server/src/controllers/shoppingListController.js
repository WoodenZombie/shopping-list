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
  const { dtoIn: normDtoIn, validationResult, isValid } = validate(
    { name: { required: true, type: "string", min: 1, max: 255 }, owner: { required: true, type: "string" } },
    dtoIn,
    { allowExtraKeys: false }
  );
  if (!isValid) {
    return res.status(400).json({
      data: normDtoIn,
      uuAppErrorMap: {
        unsupportedKeys: validationResult.unsupportedKeyList.length ? { unsupportedKeyList: validationResult.unsupportedKeyList } : undefined,
        invalidDtoIn: {
          invalidTypeKeyMap: validationResult.invalidTypeKeyMap,
          invalidValueKeyMap: validationResult.invalidValueKeyMap,
          missingKeyMap: validationResult.missingKeyMap
        }
      },
      status: "error"
    });
  }
  try {
    const data = await service.create(normDtoIn);
    res.json({ data: toDto(data), uuAppErrorMap: {}, status: "success" });
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  // Validate query keys and apply default
  const query = { userId: req.query.userId };
  const { dtoIn: normQuery, validationResult } = validate(
    { userId: { type: "string", default: "user-1" } },
    query,
    { allowExtraKeys: false }
  );
  try {
    const data = await service.list(normQuery.userId);
    const uuMap = {};
    if (validationResult.unsupportedKeyList.length) {
      uuMap.unsupportedKeys = { unsupportedKeyList: validationResult.unsupportedKeyList };
    }
    res.json({ data: data.map(toDto), uuAppErrorMap: uuMap, status: "success" });
  } catch (e) {
    next(e);
  }
};

exports.get = async (req, res, next) => {
  const query = { id: req.query.id };
  const { validationResult, isValid } = validate(
    { id: { required: true, type: "string" } },
    query,
    { allowExtraKeys: false }
  );
  if (!isValid) {
    return res.status(400).json({
      data: null,
      uuAppErrorMap: {
        unsupportedKeys: validationResult.unsupportedKeyList.length ? { unsupportedKeyList: validationResult.unsupportedKeyList } : undefined,
        invalidDtoIn: {
          invalidTypeKeyMap: validationResult.invalidTypeKeyMap,
          invalidValueKeyMap: validationResult.invalidValueKeyMap,
          missingKeyMap: validationResult.missingKeyMap
        }
      },
      status: "error"
    });
  }
  try {
    const data = await service.get(query.id);
    if (!data) return res.status(404).json({ data: null, uuAppErrorMap: { invalidDtoIn: { invalidValueKeyMap: { id: "List not found" } } }, status: "error" });
    res.json({ data: toDto(data), uuAppErrorMap: {}, status: "success" });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  const { id, name, archived } = req.body;
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { invalidDtoIn: { missingKeyMap: { id: "is required" } } }, status: "error" });
  const { validationResult, isValid } = validate(
    { name: { type: "string", min: 1, max: 255 }, archived: { type: "boolean" } },
    { name, archived },
    { allowExtraKeys: false }
  );
  if (!isValid) {
    return res.status(400).json({
      data: { id, name, archived },
      uuAppErrorMap: {
        unsupportedKeys: validationResult.unsupportedKeyList.length ? { unsupportedKeyList: validationResult.unsupportedKeyList } : undefined,
        invalidDtoIn: {
          invalidTypeKeyMap: validationResult.invalidTypeKeyMap,
          invalidValueKeyMap: validationResult.invalidValueKeyMap,
          missingKeyMap: validationResult.missingKeyMap
        }
      },
      status: "error"
    });
  }
  try {
    const data = await service.update(id, req.body);
    if (!data) return res.status(404).json({ data: null, uuAppErrorMap: { invalidDtoIn: { invalidValueKeyMap: { id: "List not found" } } }, status: "error" });
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
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { invalidDtoIn: { missingKeyMap: { id: "is required" } } }, status: "error" });
  try {
    const deleted = await service.delete(id);
    if (!deleted) return res.status(404).json({ data: null, uuAppErrorMap: { invalidDtoIn: { invalidValueKeyMap: { id: "List not found" } } }, status: "error" });
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
