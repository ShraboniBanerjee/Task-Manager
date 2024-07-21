import { ref, set, get, update, remove, push } from 'firebase/database';
import { db } from './firebase';  // Import your initialized db instance
import { getUser } from './user';

// Boards References
const boardsRef = ref(db, "boards");
const listsRef = ref(db, "lists");
const cardsRef = ref(db, "cards");

export const doCreateUser = async (id, username, email) => {
  await set(ref(db, `users/${id}`), {
    username,
    email,
  });
};

export const onceGetUsers = () => get(ref(db, "users"));

export const doCreateBoard = async (board) => {
  const uid = getUser().uid;
  const boardRef = ref(db, `boards/${uid}`);
  const newBoardRef = push(boardRef);
  await set(newBoardRef, board);
  board.key = newBoardRef.key;
  return board;
};

export const doDeleteBoard = async (boardKey) => {
  const uid = getUser().uid;
  await remove(ref(db, `boards/${uid}/${boardKey}`));
};

export const doUpdateBoard = async (boardKey, title) => {
  const uid = getUser().uid;
  await update(ref(db, `boards/${uid}/${boardKey}`), { ...title });
};

export const onceGetBoards = () => {
  const uid = getUser().uid;
  return get(ref(db, `boards/${uid}`));
};

export const doEditBoard = async (boardKey, board) => {
  const uid = getUser().uid;
  await update(ref(db, `boards/${uid}/${boardKey}`), { ...board });
  return board;
};

export const onceGetBoard = (boardKey) => {
  const uid = getUser().uid;
  return get(ref(db, `boards/${uid}/${boardKey}`));
};

export const onListMove = async (params) => {
  const { boardKey, lists } = params;
  let updates = {};

  lists.forEach((list, index) => {
    updates[list.key] = { ...list, index };
  });

  await update(ref(db, `lists/${boardKey}`), updates);
};

export const onceGetLists = (key) => get(ref(db, `lists/${key}`));

export const doCreateList = async (boardKey, list) => {
  let listIndex;
  const listRef = ref(db, `lists/${boardKey}`);
  const snapshot = await get(listRef);
  const listsObject = snapshot.val();
  listIndex = listsObject ? Object.keys(listsObject).length : 0;

  const newListRef = push(listRef);
  await set(newListRef, { ...list, index: listIndex - 1 });
  list.key = newListRef.key;
  return list;
};

export const doDeleteList = async (boardKey, listKey) => {
  await remove(ref(db, `lists/${boardKey}/${listKey}`));
  await remove(ref(db, `cards/${listKey}`));
};

export const doUpdateList = async (boardKey, listKey, list) => {
  await update(ref(db, `lists/${boardKey}/${listKey}`), { ...list });
  return list;
};

export const doAddCard = async (listKey, cardTitle) => {
  let cardIndex;
  const cardRef = ref(db, `cards/${listKey}`);
  const snapshot = await get(cardRef);
  const cardsObject = snapshot.val();
  cardIndex = cardsObject ? Object.keys(cardsObject).length : 0;

  await set(push(cardRef), {
    title: cardTitle,
    index: cardIndex,
  });
};

export const onceGetCard = (listKey) => get(ref(db, `cards/${listKey}`));

export const doEditCard = async (listKey, cardKey, card) => {
  await update(ref(db, `cards/${listKey}/${cardKey}`), { ...card });
  card.key = cardKey;
  return card;
};

export const doMoveCard = async (params) => {
  const { oldListKey, newListKey, cardKey, newIndex, cards } = params;

  // Retrieve the card data
  const cardSnapshot = await get(ref(db, `cards/${oldListKey}/${cardKey}`));
  const card = cardSnapshot.val();

  let updates = {};
  cards.forEach((card, index) => {
    updates[card.key] = { ...card, index };
  });

  // Remove card from old list and add it to the new list
  await remove(ref(db, `cards/${oldListKey}/${cardKey}`));
  await update(ref(db, `cards/${newListKey}`), updates);

  return onceGetCard(newListKey);
};

export const doDeleteCard = (listKey, cardKey) => remove(ref(db, `cards/${listKey}/${cardKey}`));
