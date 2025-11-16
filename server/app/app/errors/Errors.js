const BaseError = require("./BaseError");

class Errors {
  static ShoppingList = {
    Create: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/create/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/create/unauthorized", dtoIn, cause);
        }
      }
    },
    Get: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/get/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/get/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/get/shoppingListNotFound", dtoIn, cause);
        }
      }
    },
    List: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/list/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/list/unauthorized", dtoIn, cause);
        }
      }
    },
    Update: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/update/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/update/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/update/shoppingListNotFound", dtoIn, cause);
        }
      }
    },
    Archive: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/archive/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/archive/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/archive/shoppingListNotFound", dtoIn, cause);
        }
      }
    },
    Unarchive: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/unarchive/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/unarchive/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/unarchive/shoppingListNotFound", dtoIn, cause);
        }
      }
    },
    Delete: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/delete/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/delete/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/delete/shoppingListNotFound", dtoIn, cause);
        }
      }
    },
    Leave: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/leave/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/leave/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("ShoppingList/leave/shoppingListNotFound", dtoIn, cause);
        }
      }
    }
  };

  static Member = {
    Add: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Member/add/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Member/add/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Member/add/shoppingListNotFound", dtoIn, cause);
        }
      }
    },
    Remove: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Member/remove/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Member/remove/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Member/remove/shoppingListNotFound", dtoIn, cause);
        }
      },
      MemberNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Member/remove/memberNotFound", dtoIn, cause);
        }
      }
    },
    List: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Member/list/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Member/list/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Member/list/shoppingListNotFound", dtoIn, cause);
        }
      }
    }
  };

  static Item = {
    Add: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/add/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/add/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/add/shoppingListNotFound", dtoIn, cause);
        }
      }
    },
    Remove: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/remove/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/remove/unauthorized", dtoIn, cause);
        }
      },
      ItemNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/remove/itemNotFound", dtoIn, cause);
        }
      }
    },
    Update: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/update/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/update/unauthorized", dtoIn, cause);
        }
      },
      ItemNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/update/itemNotFound", dtoIn, cause);
        }
      }
    },
    Resolve: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/resolve/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/resolve/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/resolve/shoppingListNotFound", dtoIn, cause);
        }
      },
      ItemNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/resolve/itemNotFound", dtoIn, cause);
        }
      }
    },
    Unresolve: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/unresolve/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/unresolve/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/unresolve/shoppingListNotFound", dtoIn, cause);
        }
      },
      ItemNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/unresolve/itemNotFound", dtoIn, cause);
        }
      }
    },
    List: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/list/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/list/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/list/shoppingListNotFound", dtoIn, cause);
        }
      }
    },
    Get: {
      InvalidDtoIn: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/get/invalidDtoIn", dtoIn, cause);
        }
      },
      Unauthorized: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/get/unauthorized", dtoIn, cause);
        }
      },
      ShoppingListNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/get/shoppingListNotFound", dtoIn, cause);
        }
      },
      ItemNotFound: class extends BaseError {
        constructor(dtoIn, cause) {
          super("Item/get/itemNotFound", dtoIn, cause);
        }
      }
    }
  }
}

module.exports = Errors;
