function DomainForm({
  onMenuClose,
  onSubmit,
}: {
  onMenuClose?: () => void;
  onSubmit: ({ e }: { e: React.FormEvent<HTMLFormElement> }) => void;
}) {
  return (
    <form
      onSubmit={(e) => onSubmit({ e })}
    >
      <label htmlFor="title">Title</label>
      <input name="title" />
      <button type="submit">Submit</button>
      <button name="cancel" onClick={() => onMenuClose && onMenuClose()}>
        Cancel
      </button>
    </form>
  );
}

export default DomainForm;
