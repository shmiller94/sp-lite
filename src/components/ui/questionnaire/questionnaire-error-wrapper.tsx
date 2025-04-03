/**
 * This component is used to wrap a component and display an error message if the component is in an error state.
 * It takes a children prop, a boolean prop to check if the component is in an error state, and a message prop to display an error message.
 * The reason for the wrapper is to avoid having to pass the error state and message to the component itself.
 */
export function QuestionnaireErrorWrapper({
  children,
  isError,
  message,
}: {
  children: React.ReactNode;
  isError: boolean;
  message?: string;
}) {
  return (
    <div className="space-y-2">
      {children}
      {isError ? (
        <p className="text-sm font-medium text-destructive">
          {message ?? 'This field is required.'}
        </p>
      ) : null}
    </div>
  );
}
