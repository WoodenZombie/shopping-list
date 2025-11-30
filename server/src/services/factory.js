// Service factory selecting Mongo or mock implementations based on USE_MOCK env flag.
const useMock = process.env.USE_MOCK === 'true';

module.exports = {
  shoppingListService: useMock ? require('./mock/shoppingListService.mock') : require('./shoppingListService'),
  itemService: useMock ? require('./mock/itemService.mock') : require('./itemService'),
  memberService: useMock ? require('./mock/memberService.mock') : null // memberController handles Mongo directly
};
