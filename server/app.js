// Simple Express-based server replacing uu_appg01_server entry point
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// helper to build minimal ucEnv expected by the existing controllers
function buildUcEnv(req) {
	return {
		session: {
			identity: { uuIdentity: req.headers["x-user-id"] || (req.body && req.body.userId) || "anonymous" },
			profiles: req.headers["x-profiles"] ? req.headers["x-profiles"].split(",") : []
		},
		uri: req.originalUrl
	};
}

function handleResult(res, result) {
	if (result && typeof result === "object") {
		res.json(result);
	} else {
		res.json({ result });
	}
}

function handleError(res, err) {
	// If error has .code (custom BaseError), return 400 with code and message
	if (err && err.code) {
		res.status(400).json({ code: err.code, message: err.message, dtoIn: err.dtoIn || null });
	} else {
		console.error(err && err.stack ? err.stack : err);
		res.status(500).json({ message: err && err.message ? err.message : String(err) });
	}
}

// Shopping list routes
app.post("/api/shopping-list/create", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "shoppingList", "create"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.get("/api/shopping-list/get", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "shoppingList", "get"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.query);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.get("/api/shopping-list/list", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "shoppingList", "list"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.query);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.put("/api/shopping-list/update", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "shoppingList", "update"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.post("/api/shopping-list/archive", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "shoppingList", "archive"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.post("/api/shopping-list/unarchive", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "shoppingList", "unarchive"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.delete("/api/shopping-list/delete", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "shoppingList", "delete"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body || req.query);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.post("/api/shopping-list/leave", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "shoppingList", "leave"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

// Item routes
app.post("/api/item/add", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "item", "add"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.get("/api/item/get", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "item", "get"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.query);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.get("/api/item/list", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "item", "list"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.query);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.put("/api/item/update", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "item", "update"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.post("/api/item/remove", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "item", "remove"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.post("/api/item/resolve", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "item", "resolve"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.post("/api/item/unresolve", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "item", "unresolve"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

// Member routes
app.post("/api/member/add", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "member", "add"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.get("/api/member/list", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "member", "list"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.query);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

app.post("/api/member/remove", async (req, res) => {
	const handler = require(path.join(__dirname, "app", "app", "controllers", "member", "remove"));
	try {
		const dtoOut = await handler(buildUcEnv(req), req.body);
		handleResult(res, dtoOut);
	} catch (err) {
		handleError(res, err);
	}
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
