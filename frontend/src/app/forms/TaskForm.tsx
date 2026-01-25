import TextField from '@mui/material/TextField';
import { Temporal } from 'temporal-polyfill';
import DatePicker from '../components/DatePicker/DatePicker.tsx';

function TaskForm({
  onMenuClose,
  onSubmit,
  initialState,
}: {
  onMenuClose?: () => void;
  onSubmit: ({ e }: { e: React.FormEvent<HTMLFormElement> }) => void;
  initialState?: {
    title: string;
    dueDate?: Temporal.PlainDate;
    instructions?: string;
  };
}) {
  return (
    <form className="entry-form" onSubmit={(e) => onSubmit({ e })}>
      <label htmlFor="title">Title</label>
      <input name="title" required defaultValue={initialState?.title} />
      <label htmlFor="dueDate">Due Date</label>
      <DatePicker defaultValue={initialState?.dueDate} />
      <br />
      <br />
      <label htmlFor="instructions">Instructions</label>
      <TextField
        defaultValue={initialState?.instructions}
        className="textarea-wrapper"
        multiline
        minRows={5}
        maxRows={20}
        name="instructions"
      />
      <button type="submit">Submit</button>
      <button
        name="cancel"
        type="reset"
        onClick={() => onMenuClose && onMenuClose()}
      >
        Cancel
      </button>
    </form>
  );
}

export default TaskForm;
