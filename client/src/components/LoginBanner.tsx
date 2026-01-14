import { useModal } from '../contexts/ModalContext';
import './LoginBanner.css';

interface LoginBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginBanner = ({ isOpen, onClose }: LoginBannerProps) => {
  const { openLoginModal } = useModal();

  const handleLoginClick = () => {
    onClose();
    openLoginModal();
  };

  if (!isOpen) return null;

  return (
    <div className="login-banner-overlay" onClick={onClose}>
      <div className="login-banner" onClick={(e) => e.stopPropagation()}>
        <div className="banner-content">
          <h3>Login Required</h3>
          <p>You need to login to make a booking.</p>
          <div className="banner-buttons">
            <button className="banner-login-button" onClick={handleLoginClick}>
              Go to Login
            </button>
            <button className="banner-cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBanner;

