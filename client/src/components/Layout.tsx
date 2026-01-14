import { Outlet } from 'react-router-dom';
import { useModal } from '../contexts/ModalContext';
import LoginModal from './LoginModal';
import './Layout.css';

const Layout = () => {
  const { isLoginModalOpen, closeLoginModal } = useModal();

  return (
    <div className="app-layout">
      <Outlet />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
      />
    </div>
  );
};

export default Layout;

