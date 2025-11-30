const validate = require("../validators/validate");
// Select appropriate service (Mongo or mock) based on USE_MOCK env flag
const { itemService: service } = require("../services/factory");

function sendServiceResult(res, result, successStatus = 200) {
  if (!result) return res.status(500).json({ data: null, uuAppErrorMap: { internal: "NO_RESULT" }, status: "error" });
  if (result.error === "LIST_NOT_FOUND") return res.status(404).json({ data: null, uuAppErrorMap: { listId: "LIST_NOT_FOUND" }, status: "error" });
  if (result.error === "ITEM_NOT_FOUND") return res.status(404).json({ data: null, uuAppErrorMap: { id: "ITEM_NOT_FOUND" }, status: "error" });
  return res.status(successStatus).json({ data: result.data, uuAppErrorMap: {}, status: "success" });
}

exports.add = async (req, res) => {
  const dtoIn = req.body;
  const errors = validate({ name: { required: true, type: "string" }, listId: { required: true, type: "string" } }, dtoIn);
  if (Object.keys(errors).length) return res.status(400).json({ data: dtoIn, uuAppErrorMap: errors, status: "error" });
  try {
    const result = await service.add(dtoIn);
    return sendServiceResult(res, result, 201);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { add: e.message }, status: "error" });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { id: "is required" }, status: "error" });
  try {
    const result = await service.remove(id);
    return sendServiceResult(res, result);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { remove: e.message }, status: "error" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { id: "is required" }, status: "error" });
  try {
    const result = await service.update(id, req.body);
    return sendServiceResult(res, result);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { update: e.message }, status: "error" });
  }
};

exports.resolve = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { id: "is required" }, status: "error" });
  try {
    const result = await service.resolve(id);
    return sendServiceResult(res, result);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { resolve: e.message }, status: "error" });
  }
};

exports.unresolve = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { id: "is required" }, status: "error" });
  try {
    const result = await service.unresolve(id);
    return sendServiceResult(res, result);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { unresolve: e.message }, status: "error" });
  }
};

exports.list = async (req, res) => {
  const { listId } = req.query;
  if (!listId) return res.status(400).json({ data: null, uuAppErrorMap: { listId: "is required" }, status: "error" });
  try {
    const result = await service.list(listId);
    return sendServiceResult(res, result);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { list: e.message }, status: "error" });
  }
};

exports.get = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { id: "is required" }, status: "error" });
  try {
    const result = await service.get(id);
    return sendServiceResult(res, result);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { get: e.message }, status: "error" });
  }
};
