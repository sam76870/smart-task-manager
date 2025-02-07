import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../redux/features/taskSlices';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});