"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Doc } from "../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { EllipsisVertical, FileDown, Trash2 } from "lucide-react"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"

function FileCardActions({
    file
}: { file: Doc<"files"> }) {
    const deleteFile = useMutation(api.files.deleteFile)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { toast } = useToast()

    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            await deleteFile({
                                fileId: file._id,
                            });
                            toast({
                                variant: "default",
                                title: "File deleted",
                                description: "Your file is now gone from the system",
                            });
                        }} className="bg-[#20413e] hover:bg-[#20413e]">Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Dialog box for delete option */}
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <EllipsisVertical className="text-gray-600 h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setIsConfirmOpen(true)} className="flex gap-3 text-red-500 items-center cursor-pointer"><Trash2 className="h-5" />Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    )
}

export function FileCard({ file }: { file: Doc<"files"> }) {
    return (
        <>
            <Card>
                <CardHeader className="relative">
                    <CardTitle>{file.name} </CardTitle>
                    <div className="absolute top-2 right-2">
                        <FileCardActions file={file} />
                    </div>
                    {/* <CardDescription>Card Description</CardDescription> */}
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    <Button variant="normal" className="flex justify-center items-center gap-2">
                        <FileDown className="h-5" />
                        Download
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}