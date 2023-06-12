import { useContext, useEffect, useState } from 'react';
import { makeId, useDebounce } from '../../utils';
import { TodoListContext, TodoListStatusT, TodoListT } from './todoListContainer';
import { TodoListEditor, TodolistItem } from './todolistComponents';

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
    onChangeState({ editingItems: { ...editingItems, [id]: false } });
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
        <TodolistItem data={data} key={data?.id} onAddTask={onAddTask} onDelete={handleDelete} onSaveEdit={handleUpdateList}>
          {data?.children?.length && collapsedItems?.[data.id] ? RenderTodos(data?.children) : null}
        </TodolistItem>
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
        containerClassName="px-4"
      />
      <div className="flex-1 overflow-auto flex flex-col space-y-3 ">{RenderTodos(state.list)}</div>
    </div>
  );
}
5;
export default TodolistRenderer;
