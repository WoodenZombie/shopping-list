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
  const { dtoIn: normDtoIn, validationResult, isValid } = validate(
    { name: { required: true, type: "string", min: 1, max: 255 }, listId: { required: true, type: "string" } },
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
    const result = await service.add(normDtoIn);
    return sendServiceResult(res, result, 201);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { add: e.message }, status: "error" });
  }
};

exports.remove = async (req, res) => {
  const { validationResult, isValid } = validate(
    { id: { required: true, type: "string" } },
    req.body,
    { allowExtraKeys: false }
  );
  if (!isValid) {
    return res.status(400).json({
      data: req.body,
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
    const result = await service.remove(req.body.id);
    return sendServiceResult(res, result);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { remove: e.message }, status: "error" });
  }
};

exports.update = async (req, res) => {
  const { id, name } = req.body;
  if (!id) return res.status(400).json({ data: null, uuAppErrorMap: { invalidDtoIn: { missingKeyMap: { id: "is required" } } }, status: "error" });
  const { validationResult, isValid } = validate(
    { name: { type: "string", min: 1, max: 255 } },
    { name },
    { allowExtraKeys: false }
  );
  if (!isValid) {
    return res.status(400).json({
      data: { id, name },
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
    const result = await service.update(id, req.body);
    return sendServiceResult(res, result);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { update: e.message }, status: "error" });
  }
};

exports.resolve = async (req, res) => {
  const { validationResult, isValid } = validate(
    { id: { required: true, type: "string" } },
    req.body,
    { allowExtraKeys: false }
  );
  if (!isValid) {
    return res.status(400).json({ data: req.body, uuAppErrorMap: { invalidDtoIn: validationResult }, status: "error" });
  }
  try {
    const result = await service.resolve(req.body.id);
    return sendServiceResult(res, result);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { resolve: e.message }, status: "error" });
  }
};

exports.unresolve = async (req, res) => {
  const { validationResult, isValid } = validate(
    { id: { required: true, type: "string" } },
    req.body,
    { allowExtraKeys: false }
  );
  if (!isValid) {
    return res.status(400).json({ data: req.body, uuAppErrorMap: { invalidDtoIn: validationResult }, status: "error" });
  }
  try {
    const result = await service.unresolve(req.body.id);
    return sendServiceResult(res, result);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { unresolve: e.message }, status: "error" });
  }
};

exports.list = async (req, res) => {
  const { validationResult, isValid } = validate(
    { listId: { required: true, type: "string" } },
    req.query,
    { allowExtraKeys: false }
  );
  if (!isValid) {
    return res.status(400).json({ data: null, uuAppErrorMap: { invalidDtoIn: validationResult }, status: "error" });
  }
  try {
    const result = await service.list(req.query.listId);
    return sendServiceResult(res, result);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { list: e.message }, status: "error" });
  }
};

exports.get = async (req, res) => {
  const { validationResult, isValid } = validate(
    { id: { required: true, type: "string" } },
    req.query,
    { allowExtraKeys: false }
  );
  if (!isValid) {
    return res.status(400).json({ data: null, uuAppErrorMap: { invalidDtoIn: validationResult }, status: "error" });
  }
  try {
    const result = await service.get(req.query.id);
    return sendServiceResult(res, result);
  } catch (e) {
    return res.status(500).json({ data: null, uuAppErrorMap: { get: e.message }, status: "error" });
  }
};
