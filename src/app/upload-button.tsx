
"use client";

import { Button } from "@/components/ui/button";
import {
    useOrganization,
    useUser,
} from "@clerk/nextjs";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CloudUpload, Loader2 } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(1).max(200),
    file: z
        .custom<FileList>((val) => val instanceof FileList, "Required")
        .refine((files) => files.length > 0, `Required`),
});

export function UploadButton() {
    const { toast } = useToast();
    const organization = useOrganization();
    const user = useUser();
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: undefined,
        },
    });

    const fileRef = form.register("file");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!orgId) return;

        const postUrl = await generateUploadUrl();

        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": values.file[0].type },
            body: values.file[0],
        });
        const { storageId } = await result.json();

        try {
            await createFile({
                name: values.title,
                fileId: storageId,
                orgId,
            });

            form.reset();

            setIsFileDialogOpen(false);

            toast({
                variant: "default",
                title: "File Uploaded",
                description: "Now everyone can view your file",
            });
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Your file could not be uploaded, try again later",
            });
        }
    }

    let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
    const createFile = useMutation(api.files.createFile);

    return (
        <Dialog
            open={isFileDialogOpen}
            onOpenChange={(isOpen) => {
                setIsFileDialogOpen(isOpen);
                form.reset();
            }}
        >
            <DialogTrigger asChild>
                <Button onClick={() => { }} variant="normal">Upload File</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-8">Upload your File Here</DialogTitle>
                    <DialogDescription>
                        This file will be accessible by anyone in your organization
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="file"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>File</FormLabel>
                                        <FormControl>
                                            <Input type="file" {...fileRef} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                variant="normal"
                                disabled={form.formState.isSubmitting}
                                className="flex gap-1"
                            >
                                {form.formState.isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (<CloudUpload className="h-5 w-5 mr-2" />)}

                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>


    );
}
