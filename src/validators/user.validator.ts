import { SafeParseReturnType, z } from "zod";

export const RegistrationPayloadSchema = z.object({
    fullName: z.string().min(3).max(50).nonempty().trim(),
    dateOfBirth: z.coerce.date(),
    email: z.string().email().nonempty().trim(),
    password: z.string().min(8).max(30),
    mobile: z
        .string()
        .min(13)
        .max(13)
        .regex(/^\+[1-9]\d{1,14}$/)
        .nonempty(),
});

// exporting payload types
export type RegistrationPayload = typeof RegistrationPayloadSchema._type;
export type ValidatedRegistrationPayload = SafeParseReturnType<
    unknown,
    z.infer<typeof RegistrationPayloadSchema>
>;
