"use client";

import { useParams } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import MultiSelect from "@/components/form/MultiSelect";
import {
    useGetRoleByIdQuery,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useAssignRoleToUserMutation,
    useRemoveRoleFromUserMutation,
} from "@/store/services/rolesApi";
import { useGetUserQuery } from "@/store/services/usersApi";

const PERMISSIONS_OPTIONS = [
    { value: "/api/v1/invoices/*", text: "Invoices (All)", selected: false },
    { value: "/api/v1/users/*", text: "Users (All)", selected: false },
    { value: "/api/v1/roles/*", text: "Roles (All)", selected: false },
    { value: "/api/v1/reports/*", text: "Reports (Read)", selected: false },
];

interface FormValues {
    name: string;
    description: string;
    permissions: string[];
}

export default function RoleDetailsPage() {
    const { id } = useParams();

    const { data: role, isLoading, isError } = useGetRoleByIdQuery(Number(id));
    const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();
    const [deleteRole, { isLoading: deleting }] = useDeleteRoleMutation();

    // Fetch all users to assign
    const { data: users } = useGetUserQuery({});

    const [assignRole] = useAssignRoleToUserMutation();
    const [removeRole] = useRemoveRoleFromUserMutation();

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading role</p>;
    if (!role) return <p>No role found</p>;

    const initialValues: FormValues = {
        name: role.name,
        description: role?.description || "",
        permissions: role.permissions ? JSON.parse(role.permissions) : [],
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Role Details</h1>

                {/* --- Update Role Form --- */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object({
                        name: Yup.string().required("Role name is required"),
                        description: Yup.string().required("Description is required"),
                        permissions: Yup.array()
                            .of(Yup.string())
                            .min(1, "Select at least one permission"),
                    })}
                    onSubmit={async (values) => {
                        try {
                            await updateRole({
                                id: Number(id),
                                name: values.name,
                                description: values.description,
                                permissions: JSON.stringify(values.permissions),
                            }).unwrap();
                            alert("Role updated successfully!");
                        } catch (err) {
                            console.error(err);
                            alert("Failed to update role");
                        }
                    }}
                >
                    {({ values, errors, touched, setFieldValue }) => (
                        <Form className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={values.name}
                                    onChange={(e) => setFieldValue("name", e.target.value)}
                                />
                                {touched.name && errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={values.description}
                                    onChange={(e) => setFieldValue("description", e.target.value)}
                                />
                                {touched.description && errors.description && (
                                    <p className="text-red-500 text-sm">{errors.description}</p>
                                )}
                            </div>

                            <div>
                                <MultiSelect
                                    label="Permissions"
                                    options={PERMISSIONS_OPTIONS}
                                    defaultSelected={values.permissions}
                                    onChange={(selected) => setFieldValue("permissions", selected)}
                                />
                                {touched.permissions && errors.permissions && (
                                    <p className="text-red-500 text-sm">
                                        {errors.permissions as string}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={updating}>
                                    {updating ? "Updating..." : "Update Role"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="danger"
                                    disabled={deleting}
                                    onClick={async () => {
                                        if (!confirm("Are you sure you want to delete this role?"))
                                            return;
                                        try {
                                            await deleteRole(Number(id)).unwrap();
                                            alert("Role deleted!");
                                            window.location.href = "/roles";
                                        } catch (err) {
                                            console.error(err);
                                            alert("Failed to delete role");
                                        }
                                    }}
                                >
                                    {deleting ? "Deleting..." : "Delete Role"}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>

                {/* --- Role Management Panel --- */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Assigned Users</h2>

                    {/* Assign Users */}
                    <Formik
                        initialValues={{ user_id: "" }}
                        onSubmit={async (values, { resetForm }) => {
                            try {
                                await assignRole({
                                    role_id: Number(id),
                                    user_id: Number(values.user_id),
                                }).unwrap();
                                alert("User assigned!");
                                resetForm();
                            } catch (err) {
                                console.error(err);
                                alert("Failed to assign user");
                            }
                        }}
                    >
                        {({ values, setFieldValue }) => (
                            <Form className="flex gap-2 mb-4">
                                <select
                                    value={values.user_id}
                                    onChange={(e) => setFieldValue("user_id", e.target.value)}
                                    className="rounded border border-gray-300 p-2"
                                >
                                    <option value="">Select user</option>
                                    {users?.map((user: any) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                <Button type="submit">Assign</Button>
                            </Form>
                        )}
                    </Formik>

                    {/* List of users assigned to this role */}
                    <div className="space-y-2">
                        {role?.users?.length === 0 && <p>No users assigned.</p>}
                        {role?.users?.map((user: any) => (
                            <div
                                key={user.id}
                                className="flex justify-between items-center border-b border-gray-200 py-2"
                            >
                                <div>
                                    {user.name} ({user.email})
                                </div>
                                <Button
                                    type="button"
                                    variant="danger"
                                    size="sm"
                                    onClick={async () => {
                                        if (
                                            !confirm(
                                                `Remove ${user.name} from this role?`
                                            )
                                        )
                                            return;
                                        try {
                                            await removeRole({
                                                role_id: Number(id),
                                                user_id: Number(user.id),
                                            }).unwrap();
                                            alert("User removed!");
                                        } catch (err) {
                                            console.error(err);
                                            alert("Failed to remove user");
                                        }
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
