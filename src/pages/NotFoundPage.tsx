import { useNavigate } from 'react-router';
import { paths } from '../routes';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Page not found or invalid ID</p>
        <button
          onClick={() => navigate(paths.home)}
          className="btn btn-primary"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
