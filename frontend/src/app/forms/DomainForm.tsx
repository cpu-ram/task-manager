function DomainForm({
  onMenuClose,
  onSubmit,
  initialState,
}: {
  onMenuClose?: () => void;
  onSubmit: ({ e }: { e: React.FormEvent<HTMLFormElement> }) => void;
  initialState?: {
    title: string;
  }
}) {
  return (
    <form
      className="entry-form"
      onSubmit={(e) => onSubmit({ e })}
    >
      <label htmlFor="title">Title</label>
      <input name="title" defaultValue={initialState?.title}
        style={{
          display: 'block',
          margin: '0.3em 0 1em 0',
        }}
      />
      <button type="submit">Submit</button>
      <button name="cancel" onClick={() => onMenuClose && onMenuClose()}>
        Cancel
      </button>
    </form>
  );
}

export default DomainForm;
