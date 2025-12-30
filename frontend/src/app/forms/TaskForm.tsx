import TextField from '@mui/material/TextField';
import DatePicker from '../components/DatePicker/DatePicker.tsx';

function TaskForm({
  onMenuClose,
  onSubmit,
}: {
  onMenuClose?: () => void;
  onSubmit: ({ e }: { e: React.FormEvent<HTMLFormElement> }) => void;
}) {
  return (
    <form className="entry-form" onSubmit={(e) => onSubmit({ e })}>
      <label htmlFor="title">Title</label>
      <input name="title" required />
      <label htmlFor="dueDate">Due Date</label>
      <DatePicker />
      <br />
      <br />
      <label htmlFor="instructions">Instructions</label>
      <TextField className="textarea-wrapper" multiline minRows={5} maxRows={20} name="instructions" />
      <button type="submit">Submit</button>
      <button name="cancel" type="reset" onClick={() => onMenuClose && onMenuClose()}>
        Cancel
      </button>
    </form>
  );
}

export default TaskForm;
