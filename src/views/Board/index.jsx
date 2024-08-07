import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { getBoardKey, mergeDataWithKey } from "../../utils/index";
import { useHistory } from "react-router-dom";
import { db } from "../../firebase";
import List from "../../components/List";
import CreateList from "../../components/CreateList";
import Loader from "../../components/Loader";
import BoardTitle from "../../components/BoardTitle";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button, Menu, Dropdown } from "antd";
import "./styles.scss";

export default function Board() {
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [board, setBoard] = useState([]);
  const [boardKey, setBoardKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [sortOption, setSortOption] = useState("Recent"); // State for sorting option
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    const boardKey = getBoardKey();
    Promise.all([db.onceGetBoard(boardKey), db.onceGetLists(boardKey)])
      .then((snapshots) => {
        const board = snapshots[0].val();
        const lists = mergeDataWithKey(snapshots[1].val());
        setLists(lists.sort((a, b) => a.index - b.index));
        setBoard(board);
        setBoardKey(boardKey);
        setLoading(false);
        setDataFetched(true);
      })
      .catch((error) => {
        setLoading(false);
        setDataFetched(false);
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (dataFetched) {
      console.log("log one time");
      console.log(cards);
    }
  }, [dataFetched]);

  const handleSetCards = (listCards) => {
    setCards((prevState) => [...prevState, listCards]);
  };

  const handleCreateList = (listTitle) => {
    db.doCreateList(boardKey, { title: listTitle }).then((res) => {
      const copiedLists = [...lists];
      const copiedCards = [...cards];
      copiedCards.push({
        listKey: res.key,
        cards: [],
      });
      copiedLists.push(res);
      console.log(res);
      setLists(copiedLists);
      setCards(copiedCards);
    });
  };

  const handleCreateCard = (params) => {
    const { listKey, cardTitle } = params;
    db.doAddCard(listKey, cardTitle)
      .then(() => db.onceGetCard(listKey))
      .then((snapshot) => {
        const snapshotVal = snapshot.val();
        if (snapshotVal) {
          const newCards = mergeDataWithKey(snapshotVal);
          const cardsClone = [...cards];
          let cardsIndex = cardsClone.findIndex(
            (cards) => cards.listKey === listKey
          );

          if (cardsIndex !== -1) {
            cardsClone[cardsIndex] = {
              ...cardsClone[cardsIndex],
              cards: newCards,
            };
          } else {
            cardsClone[cardsClone.length] = {
              listKey: listKey,
              cards: newCards,
            };
          }

          console.log(cardsClone);
          setCards(cardsClone);
        }
      });
  };

  const handleEditCard = (params) => {
    const { listKey, cardKey, card } = params;

    return db.doEditCard(listKey, cardKey, card).then(() => {
      const updatedCards = [...cards];
      const listIndex = cards.findIndex((card) => card.listKey === listKey);
      const cardIndex = cards[listIndex].cards.findIndex(
        (card) => card.key === cardKey
      );

      updatedCards[listIndex].cards[cardIndex] = {
        ...updatedCards[listIndex].cards[cardIndex],
        ...card,
      };
      setCards(updatedCards);
    });
  };

  const handleDeleteCard = (params) => {
    const { listKey, cardKey } = params;

    return db.doDeleteCard(listKey, cardKey).then(() => {
      const cardsClone = [...cards];
      const listIndex = cardsClone.findIndex(
        (card) => card.listKey === listKey
      );

      const updatedCards = cardsClone[listIndex].cards.filter(
        (card) => card.key !== cardKey
      );

      cardsClone[listIndex].cards = updatedCards;

      setCards(cardsClone);
    });
  };

  const handleUpdateList = (listKey, title) => {
    return db.doUpdateList(boardKey, listKey, { title }).then((res) => {
      const copiedLists = [...lists];
      const listIndex = copiedLists.findIndex((list) => list.key === listKey);
      copiedLists[listIndex] = { ...copiedLists[listIndex], title };

      setLists(copiedLists);
    });
  };

  const handleDeleteList = (listKey) => {
    db.doDeleteList(boardKey, listKey).then(() => {
      const copiedLists = [...lists];
      const updatedLists = copiedLists.filter((list) => list.key !== listKey);
      setLists(updatedLists);
    });
  };

  const handleDeleteBoard = (boardKey) => {
    return db.doDeleteBoard(boardKey).then(() => {
      history.push("/boards");
    });
  };

  const handleUpdateBoard = (boardKey, title) => {
    return db.doUpdateBoard(boardKey, title).then(() => {
      const updatedBoard = { ...board, ...title };
      setBoard(updatedBoard);
    });
  };

  const handleOnDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    let droppableIdStart;
    let droppableIdEnd;
    let droppableIndexStart;
    let droppableIndexEnd;

    if (destination) {
      droppableIdEnd = destination.droppableId;
      droppableIndexEnd = destination.index;
    }

    if (source) {
      droppableIdStart = source.droppableId;
      droppableIndexStart = source.index;
    }

    if (!destination) {
      return;
    }

    if (type === "list") {
      const listsClone = [...lists];
      const pulledOutList = listsClone.splice(droppableIndexStart, 1);
      listsClone.splice(droppableIndexEnd, 0, ...pulledOutList);
      setLists(listsClone);
      db.onListMove({ boardKey, lists: listsClone });
    }

    if (type === "card") {
      if (droppableIdStart === droppableIdEnd) {
        const cardsClone = [...cards];

        let cardsIndex = cardsClone.findIndex(
          (cards) => cards.listKey === droppableIdEnd
        );

        let listCards = cardsClone[cardsIndex].cards;
        const card = listCards.splice(droppableIndexStart, 1);
        listCards.splice(droppableIndexEnd, 0, ...card);

        setCards(cardsClone);

        db.doMoveCard({
          cards: cardsClone[cardsIndex].cards,
          newIndex: droppableIndexEnd,
          oldListKey: droppableIdStart,
          newListKey: droppableIdEnd,
          cardKey: draggableId,
        }).then((snapshot) => {
          console.log("moving cards will work");
          console.log(mergeDataWithKey(snapshot.val()));
        });
      }

      if (droppableIdStart !== droppableIdEnd) {
        const cardsClone = [...cards];

        if (cards.length !== lists.length) {
          const missingCards = lists.filter(
            (list) => !cardsClone.some((card) => list.key === card.listKey)
          );

          missingCards.forEach((list) => {
            cardsClone.push({
              listKey: list.key,
              cards: [],
            });
          });

          setCards(cardsClone);
        }

        let startListIndex = cardsClone.findIndex(
          (cards) => cards.listKey === droppableIdStart
        );
        let endListIndex = cardsClone.findIndex(
          (cards) => cards.listKey === droppableIdEnd
        );
        let startList = cardsClone[startListIndex].cards;
        let endList = cardsClone[endListIndex].cards;

        const card = startList.splice(droppableIndexStart, 1);
        endList.splice(droppableIndexEnd, 0, ...card);

        setCards(cardsClone);
        db.doMoveCard({
          cards: cardsClone[endListIndex].cards,
          newIndex: droppableIndexEnd,
          oldListKey: droppableIdStart,
          newListKey: droppableIdEnd,
          cardKey: draggableId,
        }).then((snapshot) => {
          console.log("moving cards will work");
          console.log(mergeDataWithKey(snapshot.val()));
        });
      }
    }
  };

  // Filter and sort lists based on search query and sort option
  const filteredAndSortedLists = () => {
    let filteredLists = lists.filter((list) =>
      list.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOption === "Recent") {
      filteredLists.sort((a, b) => a.index - b.index);
    } else if (sortOption === "Past Week") {
      // Implement sorting logic for Past Week
    } else if (sortOption === "Past Month") {
      // Implement sorting logic for Past Month
    } else if (sortOption === "Past Year") {
      // Implement sorting logic for Past Year
    }

    return filteredLists;
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <BoardTitle
            title={board.title}
            boardKey={boardKey}
            updateBoard={handleUpdateBoard}
            deleteBoard={handleDeleteBoard}
          />

          <div className="search-sort-bar" style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Search: </InputGroup.Text>
              <Form.Control
                placeholder="Search..."
                aria-label="Search"
                aria-describedby="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{borderColor:"#eff1f3", width:"250px", borderTop: "hidden", borderLeft:"hidden", borderRight:"hidden"}}
              />
            </InputGroup>
            <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                Recent
              </Menu.Item>
              <Menu.Item>
                Past Week
              </Menu.Item>
              <Menu.Item>
                Past Month
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button>Sort By</Button>
        </Dropdown>
           

          </div>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <div className="board-wrapper">
              <Droppable
                droppableId="all-lists"
                direction="horizontal"
                type="list"
              >
                {(provided) => (
                  <div
                    className="lists-container"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {filteredAndSortedLists()?.map((list, index) => {
                      const listCards = cards.find(
                        (cards) => cards.listKey === list.key
                      );

                      return (
                        <List
                          key={list.key}
                          listKey={list.key}
                          listTitle={list.title}
                          cards={listCards}
                          setCards={handleSetCards}
                          handleCreateCard={handleCreateCard}
                          handleEditCard={handleEditCard}
                          handleDeleteCard={handleDeleteCard}
                          setDataFetched={setDataFetched}
                          index={index}
                          title={list.title}
                          handleUpdateList={handleUpdateList}
                          handleDeleteList={handleDeleteList}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <CreateList handleCreateList={handleCreateList} />
            </div>
          </DragDropContext>
        </>
      )}
    </>
  );
}
