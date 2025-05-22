"use client";

import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { signup as apiSignup } from "@/services/api";
import type { InputProps } from "@heroui/react";
import { Button, Input, } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ThemeSwitch } from "@/components/theme-switch";
import ART_PERSPEKTIVA from "@/icons/ArtPerspektiva";

export default function Signup() {
  
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(prev => !prev);
  const toggleConfirmVisibility = () => setIsConfirmVisible(prev => !prev);

  const inputClasses: InputProps["classNames"] = {
    inputWrapper:
      "border-transparent bg-foreground dark:bg-default-50/20 group-data-[focus=true]:border-primary data-[hover=true]:border-foreground/20 shadow-sm",
  };

  const buttonClasses = "w-full bg-foreground/10 dark:bg-foreground/20";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const username = form.get("username") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      await apiSignup(username, email, password, confirmPassword);
      navigate("/login");
    } catch (err: any) {
      const resp = err.response?.data;
      setError(
        resp?.non_field_errors?.[0] ||
        resp?.username?.[0] ||
        resp?.email?.[0] ||
        resp?.password?.[0] ||
        "Ошибка при регистрации"
      );
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-2 sm:p-4 lg:p-8">
      <div className="absolute top-10 right-10">
        <ThemeSwitch />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-background/60 px-8 pb-10 pt-6 shadow-small backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
        <ART_PERSPEKTIVA className="mx-auto h-10 mb-2 size-44" />
        <p className="pb-2 text-xl font-medium">Зарегистрироваться</p>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            isRequired
            classNames={inputClasses}
            label="Имя пользователя"
            name="username"
            placeholder="Придумайте логин"
            type="text"
            variant="bordered"
          />
          <Input
            isRequired
            classNames={inputClasses}
            label="Email адрес"
            name="email"
            placeholder="Введите свой email"
            type="email"
            variant="bordered"
          />
          <Input
            isRequired
            classNames={inputClasses}
            label="Парорль"
            name="password"
            placeholder="Придумайте пароль"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            endContent={
              <button type="button" onClick={toggleVisibility}>
                <Icon
                  className="pointer-events-none text-2xl text-foreground/50"
                  icon={isVisible ? "solar:eye-closed-linear" : "solar:eye-bold"}
                />
              </button>
            }
          />
          <Input
            isRequired
            classNames={inputClasses}
            label="Подтвердите пароль"
            name="confirmPassword"
            placeholder="Введите пароль еще раз"
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                <Icon
                  className="pointer-events-none text-2xl text-foreground/50"
                  icon={isConfirmVisible ? "solar:eye-closed-linear" : "solar:eye-bold"}
                />
              </button>
            }
          />
          
          {error && <p className="text-red-500 text-center">{error}</p>}

          <Button className={buttonClasses} type="submit">
            Зарегистрироваться
          </Button>
        </form>
        <p className="text-center text-small text-foreground/50">
          Уже есть аккаунт?&nbsp;
          <RouterLink to="/login" className="text-foreground text-sm">
            Войти
          </RouterLink>
        </p>
      </div>
    </div>
  );
}