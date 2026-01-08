"use client";

import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCreateRoleMutation } from "@/store/services/rolesApi";
import MultiSelect from "@/components/form/MultiSelect";

interface FormValues {
  name: string;
  description: string;
  permissions: string[];
}

const PERMISSIONS_OPTIONS = [
  { value: "/api/v1/invoices/*", text: "Invoices (All)", selected: false },
  { value: "/api/v1/users/*", text: "Users (All)", selected: false },
  { value: "/api/v1/roles/*", text: "Roles (All)", selected: false },
  { value: "/api/v1/reports/*", text: "Reports (Read)", selected: false },
];

export default function CreateRoleForm() {
  const [createRole, { isLoading }] = useCreateRoleMutation();

  return (
    <ComponentCard title="Create Role">
      <Formik<FormValues>
        initialValues={{
          name: "",
          description: "",
          permissions: [],
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("Role name is required"),
          description: Yup.string().required("Description is required"),
          permissions: Yup.array()
            .of(Yup.string())
            .min(1, "Select at least one permission"),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createRole({
              name: values.name,
              description: values.description,
              permissions: JSON.stringify(values.permissions),
            }).unwrap();

            resetForm();
            alert("Role created successfully");
          } catch (err) {
            console.error(err);
            alert("Failed to create role");
          }
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Role Name */}
            <div>
              <Label>Role Name</Label>
              <Input
                value={values.name}
                onChange={(e) => setFieldValue("name", e.target.value)}
                placeholder="viewer"
              />
              {touched.name && errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Input
                value={values.description}
                onChange={(e) =>
                  setFieldValue("description", e.target.value)
                }
                placeholder="Read-only access"
              />
              {touched.description && errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Permissions MultiSelect */}
            <div>
              <MultiSelect
                label="Permissions"
                options={PERMISSIONS_OPTIONS}
                defaultSelected={values.permissions}
                onChange={(selected) =>
                  setFieldValue("permissions", selected)
                }
              />
              {touched.permissions && errors.permissions && (
                <p className="text-red-500 text-sm">
                  {errors.permissions as string}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Role"}
            </Button>
          </Form>
        )}
      </Formik>
    </ComponentCard>
  );
}
