import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UseAddCommentMutation } from '../api/use-add-comment-mutation';
import toast from 'react-hot-toast';

type FormData = {
    comment: string;
};

type Props = {
    postId: number;
    onNewComment: () => void;
};
export function SendCommentForm({ postId, onNewComment }: Props) {
    const { data: session } = useSession();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { isSubmitting },
    } = useForm<FormData>();
    const mutation = UseAddCommentMutation(postId);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        console.log(data);
        const notification = toast.loading('Posting your comment....');
        await mutation.mutateAsync({ postId, comment: data.comment });
        onNewComment();
        setValue('comment', '');
        toast.success('Commnet Successfully Posted!', { id: notification });
    };
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex max-w-5xl flex-col space-y-4"
        >
            <textarea
                disabled={!session}
                {...register('comment')}
                placeholder={
                    session
                        ? 'What are your thoughts?'
                        : 'Please sign in to comment'
                }
                className="textarea disabled:textarea-disabled textarea-bordered textarea-md w-full mt-2"
            ></textarea>
            <button
                disabled={!session}
                type="submit"
                className="rounded-full btn btn-primary disabled:btn-disabled"
            >
                Comment
            </button>
        </form>
    );
}
