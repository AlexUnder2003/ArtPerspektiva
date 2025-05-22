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
  /** Текст тултипа */
  tooltip?: string;
}

/**
 * Кнопка с требованием авторизации:
 * - Если не залогинен — открывает модалку логина.
 * - Иначе — вызывает onClick и выполняет действие.
 * Тултип устанавливается через prop tooltip.
 */
export function RequireAuthButton({
  onClick,
  children,
  tooltip = "Добавить в избранное",
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

  return (
    <>
      <Tooltip content={tooltip}>
        <Button
          variant="outline"
          onClick={handleClick}
          aria-label={tooltip}
        >
          {children}
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>
            <h2>Требуется авторизация</h2>
          </ModalHeader>
          <ModalBody>
            Чтобы выполнить действие, нужно войти или зарегистрироваться.
          </ModalBody>
          <ModalFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => navigate("/login")}>Войти</Button>
            <Button onClick={() => navigate("/signup")}>Регистрация</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}