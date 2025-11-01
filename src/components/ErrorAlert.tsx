interface ErrorAlertProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  showRetry?: boolean;
  onRetry?: () => void;
}

function ErrorAlert({ message, type = 'error', showRetry = false, onRetry }: ErrorAlertProps) {
  const alertClass = type === 'warning' ? 'alert-warning' : type === 'info' ? 'alert-info' : 'alert-error';

return (
    <div className={`alert ${alertClass}`}>
      <div className="flex-1">
        <span>{message}</span>
      </div>
      {showRetry && onRetry && (
        <button className="btn btn-sm btn-ghost" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorAlert;
