import { useContext, useEffect, useState } from 'react';
import { Icon } from '../../components';
import { Checkbox } from '../../components/sharedComponents/Checkbox';
import { Text } from '../../components/typography';
import { makeId, useDebounce } from '../../utils';
import { TodoListContext, TodoListStatusT, TodoListT } from './todoListContainer';
import { TodoListEditor } from './todolistComponents';

type TodosStateT = {
  loading: boolean;
  list: TodoListT[];
};
type UpdateListByIdPayloadT = {
  id: string;
  parentId: string | null;
  todo?: TodoListT[];
  updatedData: Partial<TodoListT>;
};
export type AddListByIdPayloadT = {
  parentId: string | null;
  id?: string;
  todo?: TodoListT[];
  type: 'CHILD' | 'PARENT';
  taskName?: string;
  status?: TodoListStatusT;
};

function TodolistRenderer() {
  const [state, setState] = useState<TodosStateT>({
    loading: false,
    list: [],
  });
  const debounceList = useDebounce(state.list, 1000);
  const { list, editingItems, collapsedItems, onChangeState } = useContext(TodoListContext);

  useEffect(() => {
    onChangeState({ list: debounceList });
  }, [debounceList]);

  useEffect(() => {
    handleState({
      list,
    });
  }, []);

  const handleState = (payload: Partial<TodosStateT>) => {
    setState((prevState: TodosStateT) => ({ ...prevState, ...payload }));
  };

  const deleteListById = (id: string, parentId: string | null, todo?: TodoListT[]) => {
    let todoList: TodoListT[] = [];
    [...(todo ? todo : state.list)]?.forEach((eachItem) => {
      if (!parentId && id !== eachItem.id) {
        todoList.push(eachItem);
      } else if (parentId) {
        if (eachItem?.children?.length) {
          if (id !== eachItem.id) {
            eachItem.children = deleteListById(id, parentId, eachItem.children);
            todoList.push(eachItem);
          }
        } else {
          if (id !== eachItem.id) {
            todoList.push(eachItem);
          }
        }
      }
    });
    return todoList;
  };

  const handleDelete = (id: string, parentId: string | null) => {
    const updatedList = deleteListById(id, parentId);
    handleState({
      list: updatedList,
    });
  };

  const updateListById = (payload: UpdateListByIdPayloadT) => {
    const { todo, id, parentId, updatedData } = payload;

    return [...(todo ? todo : state.list)]?.map((eachItem) => {
      if (!parentId) {
        if (eachItem.id === id) {
          eachItem = {
            ...eachItem,
            ...updatedData,
          };
        }
      } else {
        if (eachItem?.children?.length) {
          if (eachItem.id === id) {
            eachItem = {
              ...eachItem,
              ...updatedData,
            };
          } else {
            eachItem.children = updateListById({ id, parentId, todo: eachItem.children, updatedData });
          }
        } else {
          if (eachItem?.id === id) {
            eachItem = {
              ...eachItem,
              ...updatedData,
            };
          }
        }
      }
      return eachItem;
    });
  };

  const handleUpdateList = (id: string, parentId: string | null, updatedData: Partial<TodoListT>) => {
    const updatedList = updateListById({ id, parentId, updatedData });
    handleState({
      list: updatedList,
    });
  };

  const addListById = (payload: AddListByIdPayloadT) => {
    const { parentId, id, taskName, status, todo, type } = payload;

    let todoList: TodoListT[] = [...(todo ? todo : state.list)];
    if (type === 'PARENT') {
      todoList.push({
        id: makeId({
          prefixText: type,
          length: 5,
        }),
        label: taskName || 'Untitle',
        status: status || 'PENDING',
        parentId: null,
        children: [],
      });
    } else {
      if (!parentId) {
        todoList = todoList?.map((eachItem) => {
          if (eachItem.id === id) {
            eachItem.children.push({
              id: makeId({
                prefixText: type,
                length: 5,
              }),
              label: taskName || 'Untitle',
              status: status || 'PENDING',
              parentId: eachItem.id,

              children: [],
            });
          }
          return eachItem;
        });
      } else {
        todoList = todoList?.map((eachItem) => {
          if (eachItem.children.length) {
            if (eachItem.id === id) {
              eachItem.children.push({
                id: makeId({
                  prefixText: type,
                  length: 5,
                }),
                label: taskName || 'Untitle',
                status: status || 'PENDING',
                parentId: eachItem.id,

                children: [],
              });
            } else {
              eachItem.children = addListById({ id, parentId, todo: eachItem.children, type, taskName, status });
            }
          } else {
            if (eachItem.id === id) {
              eachItem.children.push({
                id: makeId({
                  prefixText: type,
                  length: 5,
                }),
                label: taskName || 'Untitle',
                status: status || 'PENDING',
                parentId: eachItem.id,

                children: [],
              });
            }
          }
          return eachItem;
        });
      }
    }
    return todoList;
  };

  const onAddTask = (payload: AddListByIdPayloadT) => {
    handleState({
      list: addListById(payload),
    });
  };

  const RenderTodos = (list: TodoListT[]) => {
    return list?.map((data) => {
      return (
        <div key={data?.id} className="flex-col flex space-y-2">
          <div className={`${!data?.parentId ? 'rounded-lg shadow-md border p-2' : ''}  `}>
            {editingItems?.[data?.id] ? (
              <TodoListEditor
                placeholder="Edit a task"
                data={{
                  taskName: data?.label,
                  status: data?.status,
                }}
                onSave={(taskName, status) => {
                  onChangeState({ editingItems: { ...editingItems, [data.id]: false } });
                  handleUpdateList(data?.id, data?.parentId, {
                    label: taskName,
                    status,
                  });
                }}
              />
            ) : (
              <div className="flex p-1 items-center space-x-2 gap-2 sm:gap-0 flex-wrap">
                <Checkbox
                  checked={data?.status === 'COMPLETED'}
                  onClick={() => {
                    handleUpdateList(data?.id, data?.parentId, {
                      status: data?.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
                    });
                  }}
                />
                <Text className="break-words flex-1">{data?.label}</Text>
                {data?.children?.length ? (
                  <Icon
                    icon="chevron-down"
                    className="p-0.5 rounded text-gray-500 transition-all h-6 w-6 duration-150 hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeState({
                        collapsedItems: { ...collapsedItems, [data?.id]: !collapsedItems?.[data?.id] },
                      });
                    }}
                  />
                ) : null}
                <Icon
                  icon="plus"
                  className="p-0.5 rounded text-gray-500 transition-all h-6 w-6 duration-150 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeState({
                      collapsedItems: { ...collapsedItems, [data?.id]: true },
                    });
                    onAddTask({
                      parentId: data?.parentId,
                      type: 'CHILD',
                      id: data?.id,
                    });
                  }}
                />

                <Icon
                  icon="edit-2"
                  className="p-1 rounded text-gray-500 transition-all h-6 w-6 duration-150 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onChangeState({ editingItems: { ...editingItems, [data.id]: !editingItems?.[data.id] } });
                  }}
                />
                <Icon
                  icon="trash"
                  className="p-1 rounded text-red-500 transition-all duration-150 hover:opacity-70 hover:bg-red-100 cursor-pointer"
                  onClick={() => {
                    handleDelete(data.id, data.parentId);
                  }}
                />
              </div>
            )}
            {data?.children?.length && collapsedItems?.[data.id] ? RenderTodos(data?.children) : null}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col space-y-3 w-full">
      <TodoListEditor
        onSave={(taskName, status) => {
          onAddTask({
            parentId: null,
            type: 'PARENT',
            taskName,
            status,
          });
        }}
        containerClassName="px-3"
      />
      <div className="flex-1 overflow-auto flex flex-col space-y-3">{RenderTodos(state.list)}</div>
    </div>
  );
}

export default TodolistRenderer;
