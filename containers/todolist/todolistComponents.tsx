import { ReactElement, useContext, useEffect, useState } from 'react';
import { Icon } from '../../components';
import { Checkbox } from '../../components/sharedComponents/Checkbox';
import { Text } from '../../components/typography';
import { TodoListContext, TodoListStatusT, TodoListT } from './todoListContainer';
import { AddListByIdPayloadT } from './todolistRenderer';

type TodoListEditorPropsT = {
  placeholder?: string;
  containerClassName?: string;

  data?: {
    status: TodoListStatusT;
    taskName: string;
  };
  onSave: (taskName: string, status: TodoListStatusT) => void;
};

type TodoListEditorStateT = {
  status: TodoListStatusT;
  taskName: string;
};

export const TodoListEditor = (props: TodoListEditorPropsT) => {
  const { placeholder, data, containerClassName, onSave } = props;
  const [editorState, setEditorState] = useState<TodoListEditorStateT>({
    taskName: data?.taskName || '',
    status: data?.status || 'PENDING',
  });

  useEffect(() => {
    if (data) {
      handleEditorState({
        status: data?.status,
        taskName: data?.taskName || '',
      });
    }
  }, []);

  const handleEditorState = (editorState: Partial<TodoListEditorStateT>) => {
    setEditorState((prevState) => ({ ...prevState, ...editorState }));
  };
  const handleSave = () => {
    if (editorState.taskName) {
      handleEditorState({
        status: 'PENDING',
        taskName: '',
      });
      onSave(editorState.taskName, editorState.status);
    }
  };
  return (
    <div className={`flex p-1 items-center space-x-3 gap-2 sm:gap-0 flex-wrap ${containerClassName || ''}`}>
      <Checkbox
        checked={editorState?.status === 'COMPLETED'}
        onClick={() => {
          handleEditorState({ status: editorState?.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' });
        }}
      />
      <input
        className="w-full outline-none bg-transparent ring-0 flex-1 text-sm"
        value={editorState.taskName}
        placeholder={placeholder || 'Add a new task...'}
        onChange={(e) => {
          handleEditorState({ taskName: e.target.value });
        }}
      />

      <Icon
        icon="check"
        className={` p-1 rounded text-gray-700 transition-all h-6 w-6 duration-150  ${
          editorState?.taskName ? 'cursor-pointer hover:bg-gray-200' : ''
        }`}
        onClick={handleSave}
      />
    </div>
  );
};

type TodolistItemPropsT = {
  data: TodoListT;
  onSaveEdit: (id: string, parentId: string | null, updatedData: Partial<TodoListT>) => void;
  onDelete: (id: string, parentId: string | null) => void;
  onAddTask: (payload: AddListByIdPayloadT) => void;
  children: ReactElement[] | null;
};
export const TodolistItem = (props: TodolistItemPropsT) => {
  const { data, onSaveEdit, onDelete, onAddTask } = props;
  const { editingItems, collapsedItems, onChangeState } = useContext(TodoListContext);
  return (
    <div className={`${!data?.parentId ? 'rounded-lg shadow-md border p-2 mx-0.5' : ''}  bg-white `}>
      {editingItems?.[data?.id] ? (
        <TodoListEditor
          placeholder="Edit a task"
          data={{
            taskName: data?.label,
            status: data?.status,
          }}
          onSave={(taskName, status) => {
            onSaveEdit(data?.id, data?.parentId, {
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
              onSaveEdit(data?.id, data?.parentId, {
                status: data?.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
              });
            }}
          />
          <Text className="break-words flex-1">{data?.label}</Text>
          {data?.children?.length ? (
            <Icon
              icon="chevron-down"
              className={`p-0.5 rounded text-gray-500 transition-all h-6 w-6 duration-150 hover:bg-gray-100 cursor-pointer ${
                collapsedItems?.[data?.id] ? 'rotate-180' : ''
              }`}
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
              onDelete(data.id, data.parentId);
            }}
          />
        </div>
      )}
      {props?.children}
    </div>
  );
};
