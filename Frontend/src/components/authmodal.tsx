// src/components/RequireAuthButton.tsx
"use client";

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
  Tooltip,
} from "@heroui/react";

interface RequireAuthButtonProps {
  onClick: () => Promise<any>;
  children: ReactNode;
  /** Текст тултипа. Если не передан, тултип не показывается */
  tooltip?: string | null;
}

/**
 * Кнопка с требованием авторизации:
 * - Если не залогинен — открывает модалку логина.
 * - Иначе — вызывает onClick и выполняет действие.
 * Тултип устанавливается через prop tooltip; если tooltip отсутствует, не отображается.
 */
export function RequireAuthButton({
  onClick,
  children,
  tooltip = null,
}: RequireAuthButtonProps) {
  const { isAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!isAuthenticated) {
      setIsOpen(true);
      return;
    }
    try {
      await onClick();
    } catch (err) {
      console.error(err);
      addToast({ title: "Ошибка", description: "Не удалось выполнить действие.", status: "error" });
    }
  };

  const buttonElement = (
    <Button
      variant="outline"
      onClick={handleClick}
      aria-label={tooltip || undefined}
    >
      {children}
    </Button>
  );

  return (
    <>
      {tooltip ? (
        <Tooltip content={tooltip}>
          {buttonElement}
        </Tooltip>
      ) : (
        buttonElement
      )}

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>
            <h2>Требуется авторизация</h2>
          </ModalHeader>
          <ModalBody>
            Чтобы выполнить действие, нужно войти или зарегистрироваться.
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