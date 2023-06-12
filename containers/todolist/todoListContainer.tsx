import { signOut, useSession } from 'next-auth/react';
import React, { useMemo, useState } from 'react';
import { Container, Icon } from '../../components';
import { LargeText, SmallText } from '../../components/typography';
import TodolistRenderer from './todolistRenderer';

export type TodoListStatusT = 'COMPLETED' | 'PENDING';
export type TodoListT = {
  label: string;
  id: string;
  parentId: null | string;
  children: TodoListT[];
  status: TodoListStatusT;
};
type TodoListContextT = {
  onChangeState: (payload: Partial<TodoListContextT>) => void;
} & TodoListContainerStateT;

type TodoListContainerStateT = {
  list: TodoListT[];
  editingItems: Record<string, boolean>;
  collapsedItems: Record<string, boolean>;
};

export const TodoListContext = React.createContext<TodoListContextT>({
  list: [],
  collapsedItems: {},
  editingItems: {},
  onChangeState: () => {},
});
function TodoListContainer() {
  const { data } = useSession();
  signOut;
  const [state, setState] = useState<TodoListContainerStateT>({
    collapsedItems: {},
    editingItems: {},
    list: [],
  });
  const onChangeState = (payload: Partial<TodoListContainerStateT>) => {
    setState((prevState) => ({ ...prevState, ...payload }));
  };

  const getSubTitle = useMemo(() => {
    let pendingTasks = 0;
    let completedTasks = 0;
    const updateCountBystatus = (status: TodoListStatusT) => {
      if (status === 'COMPLETED') {
        completedTasks++;
      } else {
        pendingTasks++;
      }
    };
    const traverseList = (list: TodoListT[]) => {
      list?.forEach((each) => {
        if (!each?.children?.length) {
          updateCountBystatus(each?.status);
        } else {
          updateCountBystatus(each?.status);
          traverseList(each?.children);
        }
      });
    };

    traverseList(state.list);
    if (!completedTasks && !pendingTasks) {
      return 'Empower your day with a productive and organized to-do list!';
    } else if (!completedTasks && pendingTasks) {
      return `You have got ${pendingTasks > 9 ? '9+' : pendingTasks} ${pendingTasks > 1 ? 'tasks' : 'task'} for the day.`;
    } else if (completedTasks && !pendingTasks) {
      return `You have completed ${completedTasks > 9 ? '9+' : completedTasks} ${completedTasks > 1 ? 'tasks' : 'task'} for the day.`;
    } else {
      return `You have completed ${completedTasks > 9 ? '9+' : completedTasks} ${completedTasks > 1 ? 'tasks' : 'task'} and ${
        pendingTasks > 9 ? '9+' : pendingTasks
      } ${pendingTasks > 1 ? 'tasks' : 'task'} pending for the day.`;
    }
  }, [state.list]);

  return (
    <TodoListContext.Provider value={{ ...state, onChangeState }}>
      <Container className="sm:w-3/6 m-auto  p-6 ">
        <div className="h-1/6 px-2 flex items-center space-x-2 gap-2 w-full">
          <div className="flex flex-1 flex-col space-y-2">
            <LargeText className="text-xl font-medium break-words">Welcome back, {data?.user?.name || 'New User'}</LargeText>
            <SmallText className=" break-words">{getSubTitle}</SmallText>
          </div>
          <Icon
            onClick={() => signOut()}
            icon="log-out"
            className="p-1 rounded text-gray-700 transition-all h-6 w-6 duration-150 hover:bg-gray-200 cursor-pointer"
          />
        </div>
        <div className="h-5/6 w-full  pt-4 sm:pt-2 ">
          <TodolistRenderer />
        </div>
      </Container>
    </TodoListContext.Provider>
  );
}

export default TodoListContainer;
