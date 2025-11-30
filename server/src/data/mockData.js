// In-memory mock data
const shoppingLists = [
  {
    id: "list-1",
    name: "Weekly Groceries",
    owner: "user-1",
    archived: false,
    members: ["user-1", "user-2"],
    items: ["item-1", "item-2"]
  }
];
const members = [
  { id: "user-1", name: "Alice", email: "alice@example.com", role: "owner" },
  { id: "user-2", name: "Bob", email: "bob@example.com", role: "member" }
];
const items = [
  { id: "item-1", listId: "list-1", name: "Milk", isResolved: false },
  { id: "item-2", listId: "list-1", name: "Bread", isResolved: true }
];

module.exports = { shoppingLists, members, items };
