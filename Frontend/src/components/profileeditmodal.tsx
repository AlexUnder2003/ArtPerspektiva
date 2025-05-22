// src/components/ProfileEditModal.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Сбрасываем форму при повторном открытии
  useEffect(() => {
    if (isOpen) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
      setAvatarFile(null);
      setAvatarBase64(null);
    }
  }, [isOpen, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const cleaned = base64String.split(",")[1]; // убираем data:image/...
      setAvatarBase64(cleaned);
      setAvatarFile(file); // для отображения имени файла
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        ...(avatarBase64 && { avatar: avatarBase64 }),
      };

      const updated = await updateUserProfile(payload);
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
      backdrop="opaque"
      placement="center"
      isDismissable
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
              <Button onClick={handleOpenFileDialog}>
                <Icon icon="mdi:upload" className="mr-2" />
                Загрузить файл
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />

              {avatarFile && <span className="text-sm">{avatarFile.name}</span>}
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Сохранение..." : "Сохранить"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
