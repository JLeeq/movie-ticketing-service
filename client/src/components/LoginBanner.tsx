import { useNavigate } from 'react-router-dom';
import './LoginBanner.css';

interface LoginBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginBanner = ({ isOpen, onClose }: LoginBannerProps) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className="login-banner-overlay" onClick={onClose}>
      <div className="login-banner" onClick={(e) => e.stopPropagation()}>
        <div className="banner-content">
          <h3>로그인이 필요합니다</h3>
          <p>예매를 하려면 로그인이 필요합니다.</p>
          <div className="banner-buttons">
            <button className="banner-login-button" onClick={handleLoginClick}>
              로그인하러 가기
            </button>
            <button className="banner-cancel-button" onClick={onClose}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBanner;

