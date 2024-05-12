import Spinner from 'react-bootstrap/Spinner';

const LoadingOverlay = () => (
    <div className="loading-overlay">
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </div>
);

export default LoadingOverlay;