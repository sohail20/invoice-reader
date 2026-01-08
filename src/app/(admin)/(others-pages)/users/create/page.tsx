"use client";

import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "@/icons";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { Formik, Form } from "formik";
import * as Yup from "yup";

type RoleOption = {
    value: number;
    label: string;
};

interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role_id: number | null;
}

export default function SelectInputs() {
    const [roles, setRoles] = useState<RoleOption[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    // Fetch roles
    useEffect(() => {
        const fetchRoles = async () => {
            setLoadingRoles(true);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/roles`, {
                    headers: { Authorization: `Bearer ${token}` },
                }
                );
                const data = await res.json();

                const formattedRoles = data.map((role: any) => ({
                    value: role.id,
                    label: role.name,
                }));

                setRoles(formattedRoles);
            } catch (error) {
                console.error("Failed to load roles", error);
            } finally {
                setLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

    // Formik validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Minimum 6 characters")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords do not match")
            .required("Confirm password is required"),
        // role_id: Yup.number()
        //     .nullable()
        //     .required("Role is required"),
    });

    // Submit handler
    const handleSubmit = async (
        values: FormValues,
        { setSubmitting, resetForm }: any
    ) => {
        console.log("hello")
        try {
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password,
                role_id: values.role_id,
            };

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to create user");
            }

            resetForm();
            alert("User created successfully");
        } catch (error) {
            console.error(error);
            alert("Error creating user");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ComponentCard title="Create User">
            <Formik<FormValues>
                initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    role_id: null,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    isSubmitting,
                }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 md:gap-6 items-center">
                            {/* Name */}
                            <div>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Full name"
                                    value={values.name}
                                    onChange={(e) =>
                                        setFieldValue("name", e.target.value)
                                    }
                                />
                                {touched.name && errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name}</p>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <Label>Select user role</Label>
                                <div className="relative">
                                    <Select
                                        options={roles}
                                        placeholder={
                                            loadingRoles ? "Loading roles..." : "Select role"
                                        }
                                        onChange={(option: any) =>
                                            setFieldValue("role_id", option?.value)
                                        }
                                        className="dark:bg-dark-900"
                                    />
                                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                                {touched.role_id && errors.role_id && (
                                    <p className="text-red-500 text-sm">{errors.role_id}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={values.email}
                                    onChange={(e) =>
                                        setFieldValue("email", e.target.value)
                                    }
                                />
                                {touched.email && errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={values.password}
                                    onChange={(e) =>
                                        setFieldValue("password", e.target.value)
                                    }
                                />
                                {touched.password && errors.password && (
                                    <p className="text-red-500 text-sm">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <Label>Repeat password</Label>
                                <Input
                                    type="password"
                                    placeholder="Repeat password"
                                    value={values.confirmPassword}
                                    onChange={(e) =>
                                        setFieldValue("confirmPassword", e.target.value)
                                    }
                                />
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create User"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </ComponentCard>
    );
}
