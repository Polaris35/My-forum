import {
    attachmentsControllerUploadImage,
    postsControllerCreatePost,
} from '@/shared/api';
import { UiAvatar } from '@/shared/ui';
import { getAttachmentUrl } from '@/shared/utils';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaLink } from 'react-icons/fa6';
import { HiOutlinePhotograph } from 'react-icons/hi';

type FormData = {
    postTitle: string;
    postBody: string;
    subreddit: string;
};
export function PostBox() {
    const { data: session } = useSession();
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileSelected = (event: any) => {
        if (event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            return;
        }
        setSelectedFile(null);
    };

    const onSubmit = handleSubmit(async (data: FormData) => {
        console.log(data);
        const notification = toast.loading('Creating new post...');
        let imageId: number | null = null;
        if (selectedFile) {
            imageId = await attachmentsControllerUploadImage({
                image: selectedFile,
            });
        }
        await postsControllerCreatePost(
            {
                title: data.postTitle,
                body: data.postBody,
                subreddit: data.subreddit,
                imageId: imageId!,
            },
            {
                headers: {
                    Authorization: `Bearer ${session?.user.accessToken}`,
                },
            },
        );
        setValue('postTitle', '');
        setValue('postBody', '');
        setValue('subreddit', '');
        setSelectedFile(null);
        toast.success('New Post Created!', { id: notification });
    });
    return (
        <form
            onSubmit={onSubmit}
            className="sticky top-16 z-50 rounded-md p-2 bg-base-100 block"
        >
            <div className="flex items-center space-x-3">
                <UiAvatar url={session?.user?.image!} size={'small'} />
                <input
                    {...register('postTitle', { required: true })}
                    disabled={!session}
                    type="text"
                    className="input input-ghost flex-1"
                    placeholder={
                        session
                            ? 'Create a post by entering title!'
                            : 'Sign in to post'
                    }
                />
                <label htmlFor="selectImage" className="cursor-pointer">
                    <HiOutlinePhotograph className="h-6 w-6" />
                </label>
                <input
                    id="selectImage"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={fileSelected}
                />
                <FaLink className="h-6 w-6" />
            </div>
            {!!watch('postTitle') && (
                <div className="flex flex-col py-2">
                    {/* Body */}
                    <div className="flex items-center px-2">
                        <p className="min-w-[90px]">Body:</p>
                        <input
                            className="m-2 p-2 flex-1 input input-primary"
                            {...register('postBody')}
                            type="text"
                            placeholder="Text (optional)"
                        />
                    </div>

                    {/* Subreddit */}
                    <div className="flex items-center px-2">
                        <p className="min-w-[90px]">Subreddit:</p>
                        <input
                            {...register('subreddit')}
                            className="m-2 p-2 flex-1 input input-primary"
                            type="text"
                            placeholder="i.e. reactjs"
                        />
                    </div>

                    {selectedFile && (
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Image Name:</p>
                            <p className="m-2 p-2 flex-1 rounded-md bg-base-100">
                                {selectedFile.name}
                            </p>
                        </div>
                    )}

                    {/* Errors */}
                    {Object.keys(errors).length > 0 && (
                        <div className="space-y-2 p-2 text-error">
                            {errors.postTitle?.type === 'required' && (
                                <p>- A post title is required!</p>
                            )}
                        </div>
                    )}

                    {!!watch('postTitle') && (
                        <button
                            type="submit"
                            className="flex-1 btn btn-outline btn-primary mx-4"
                        >
                            Create Post
                        </button>
                    )}
                </div>
            )}
        </form>
    );
}
