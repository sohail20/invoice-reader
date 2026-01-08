"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { Formik, Form } from "formik";
import * as Yup from "yup";

type RoleOption = {
    value: number;
    label: string;
};

interface FormValues {
    name: string;
    email: string;
    role_id: number | null;
    is_active: number;
}

export default function EditUser() {
    const { id } = useParams();
    const router = useRouter();

    const [roles, setRoles] = useState<RoleOption[]>([]);
    const [initialValues, setInitialValues] = useState<FormValues | null>(null);

    const token = typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    // Fetch roles
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data =>
                setRoles(
                    data.map((r: any) => ({
                        value: r.id,
                        label: r.name,
                    }))
                )
            );
    }, []);

    // Fetch user details
    useEffect(() => {
        if (!id) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                setInitialValues({
                    name: data.name,
                    email: data.email,
                    role_id: data.roles?.[0]?.id ?? null,
                    is_active: data.is_active,
                });
            });
    }, [id]);

    // Validation
    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email().required("Email is required"),
        role_id: Yup.number().nullable().required("Role is required"),
    });

    // Update user
    const handleSubmit = async (
        values: FormValues,
        { setSubmitting }: any
    ) => {
        try {
            const payload = {
                name: values.name,
                email: values.email,
                role_id: values.role_id,
                is_active: values.is_active,
            };

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Update failed");

            alert("User updated successfully");
            router.push("/users");
        } catch (err) {
            console.error(err);
            alert("Error updating user");
        } finally {
            setSubmitting(false);
        }
    };

    if (!initialValues) return <p>Loading...</p>;

    return (
        <ComponentCard title="Edit User">
            <Formik
                initialValues={initialValues}
                enableReinitialize
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
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={values.name}
                                onChange={(e) =>
                                    setFieldValue("name", e.target.value)
                                }
                            />
                            {touched.name && errors.name && (
                                <p className="text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                value={values.email}
                                onChange={(e) =>
                                    setFieldValue("email", e.target.value)
                                }
                            />
                            {touched.email && errors.email && (
                                <p className="text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label>Role</Label>
                            <Select
                                options={roles}
                                value={values.role_id ?? ""}
                                onChange={(value) =>
                                    setFieldValue("role_id", Number(value))
                                }
                            />
                            {touched.role_id && errors.role_id && (
                                <p className="text-red-500">{errors.role_id}</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : "Update User"}
                            </Button>

                            <Button
                                type="button"
                                variant="danger"
                                onClick={async () => {
                                    if (!confirm("Delete user?")) return;

                                    await fetch(
                                        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
                                        {
                                            method: "DELETE",
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                            },
                                        }
                                    );

                                    router.push("/users");
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </ComponentCard>
    );
}
