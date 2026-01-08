"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { MeResponse } from "@/store/services/authApi";
import { useUpdateUserMutation } from "@/store/services/usersApi";
import { useAppContext } from "@/context/AppContext";
import { Role } from "@/store/services/rolesApi";

export default function UserMetaCard({ me }: { me: MeResponse }) {
  const {roles} = useAppContext()
  const { isOpen, openModal, closeModal } = useModal();
  const [name, setName] = useState(me.name);
  const [email, setEmail] = useState(me.email);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  
  function getRoleIds(roleNames: string[]): number[] {
    // Make all names lowercase for case-insensitive match
    const lowerNames = roleNames.map(name => name.toLowerCase());

    return roles
      .filter(role => lowerNames.includes(role.name.toLowerCase()))
      .map(role => role.id);
  }


  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(me.name);
      setEmail(me.email);
    }
  }, [isOpen, me]);

  const handleSave = async () => {
    try {
      await updateUser({
        id: me.id,
        body: {
          name,
          email,
          role_id: getRoleIds(me.roles)[0]
        },
      }).unwrap();

      closeModal();
    } catch (error) {
      console.error("Update user failed:", error);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src="/images/user/placeholder.png"
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {me.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {me.roles}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {me.email}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Personal Information
          </h4>

          <form className="flex flex-col">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-6">
              <div>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <Label>Role</Label>
                <Input value={String(me.roles)} disabled />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
