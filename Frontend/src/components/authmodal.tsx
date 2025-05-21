import React, { ReactNode, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip
} from "@heroui/react";

interface RequireAuthButtonProps {
  onClick: () => void;
  children: ReactNode;
}

/**
 * Обёртка кнопки, показывающая модалку авторизации при отсутствии сессии
 */
export function RequireAuthButton({ onClick, children }: RequireAuthButtonProps) {
  const { isAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAuthenticated) {
      setIsOpen(true);
    } else {
      onClick();
    }
  };

  return (
    <>
      <Tooltip content="Добавить в избранное">
        <Button variant="outline" onClick={handleClick}>
            {children}
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>
            <h2>Требуется авторизация</h2>
          </ModalHeader>
          <ModalBody>
            Чтобы добавить картину в избранное, нужно войти или зарегистрироваться.
          </ModalBody>
          <ModalFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Войти
            </Button>
            <Button onClick={() => navigate("/signup")}>
              Регистрация
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}