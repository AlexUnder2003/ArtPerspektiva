// src/components/ProfileEditModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Avatar,
  addToast,
} from "@heroui/react";  // ✔️ без ModalOverlay, FormControl, FormLabel
import { Icon } from "@iconify/react";
import { updateUserProfile, type UserProfile } from "@/services/api";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updated: UserProfile) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [firstName, setFirstName] = useState(user.name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Сбрасываем форму при повторном открытии
  useEffect(() => {
    if (isOpen) {
      setFirstName(user.name);
      setLastName(user.last_name);
      setEmail(user.email);
      setAvatarFile(null);
    }
  }, [isOpen, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      if (avatarFile) formData.append("avatar", avatarFile);

      const updated = await updateUserProfile(formData);
      addToast({ title: "Профиль обновлён", status: "success", duration: 3000 });
      onSave(updated);
      onClose();
    } catch (error: any) {
      addToast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Не удалось обновить профиль.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="opaque"           // настраиваем фон модалки
      placement="center"         // центрирование
      isDismissable              // закрывается по Esc и клику вне
    >
      <ModalContent className="max-w-md">
        <ModalHeader>Редактировать профиль</ModalHeader>

        <ModalBody>
            <Input
              label="Имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoFocus
            />
            <Input
              label="Фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div>
              <div className="mb-2 font-medium">Аватар</div>
              <div className="flex items-center space-x-4">
                <Avatar src={user.avatarUrl} alt={user.name} />
                <Button variant="outline" component="label">
                  <Icon icon="mdi:upload" />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarChange}
                  />
                </Button>
                {avatarFile && <span>{avatarFile.name}</span>}
              </div>
            </div>
        </ModalBody>

        <ModalFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Сохранение..." : "Сохранить"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
