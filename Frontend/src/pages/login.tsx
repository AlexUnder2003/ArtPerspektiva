"use client";

import React, { useState, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import type { InputProps } from "@heroui/react";
import { Button, Input, Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ThemeSwitch } from "@/components/theme-switch";
import { AuthContext } from "@/contexts/AuthContext";
import ART_PERSPEKTIVA from "@/icons/ArtPerspektiva";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signin } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

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
    const password = form.get("password") as string;
    const remember = form.get("remember") === "on";

    try {
      await signin(username, password, remember);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка авторизации");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-2 sm:p-4 lg:p-8">
      <div className="absolute top-10 right-10">
        <ThemeSwitch />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-2 rounded-large bg-background/60 px-8 pb-10 pt-6 shadow-small backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
        <ART_PERSPEKTIVA className="mx-auto h-10 mb-2 size-44" />
        <p className="pb-2 text-xl font-medium">Войти</p>
        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input
            isRequired
            classNames={inputClasses}
            label="Имя пользователя"
            name="username"
            placeholder="Введите ваш логин"
            type="text"
            variant="bordered"
          />
          <Input
            isRequired
            classNames={inputClasses}
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-foreground/50"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-foreground/50"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Пароль"
            name="password"
            placeholder="Введите ваш пароль"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          <div className="flex w-full items-center justify-between px-1 py-2">
            <RouterLink to="/forgot-password" className="text-foreground/50 text-sm">
              Забыли пароль?
            </RouterLink>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Button className={buttonClasses} type="submit">
            Войти
          </Button>
        </Form>
        <p className="text-center text-small text-foreground/50">
          Нету аккаунта?&nbsp;
          <RouterLink to="/signup" className="text-foreground text-sm">
            Зарегистрироваться
          </RouterLink>
        </p>
      </div>
    </div>
  );
}