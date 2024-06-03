import { useContext, useState } from 'react';
import { SendMessageButton } from './send-message-button';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { FiPaperclip } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { UiButton } from '@/shared/ui';
import { useTheme } from 'next-themes';
import { EmojiStyle, Theme } from 'emoji-picker-react';
import { SendAttachmentsDialog } from './dialog/send-attachments-dialog';
import { SendAttachmentsButton } from './send-attachments-button';
import { UseSendMessageMutation } from '../model/use-send-message-mutation';
import { CurrentConversationContext } from '@/entities/current-conversation';

const Picker = dynamic(
    () => {
        return import('emoji-picker-react');
    },
    { ssr: false },
);

export function SendMessageField() {
    const { theme } = useTheme();
    const [message, setMessage] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const mutation = UseSendMessageMutation();
    const { conversationId } = useContext(CurrentConversationContext);

    return (
        <div className="flex gap-2 p-2 items-center relative">
            <div className="absolute bottom-16 left-4">
                <Picker
                    open={isEmojiPickerOpen}
                    theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
                    emojiStyle={EmojiStyle.NATIVE}
                    skinTonesDisabled={true}
                    onEmojiClick={(emoji) => {
                        setMessage((prev) => prev + emoji.emoji);
                    }}
                />
            </div>
            <div className="flex-1 flex items-center gap-2">
                <UiButton
                    className="rounded-full p-2"
                    variant={'ghost'}
                    onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
                >
                    <MdOutlineEmojiEmotions size={32} />
                </UiButton>

                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="tap message here"
                    className="input input-bordered flex-1"
                />

                <SendAttachmentsButton />
            </div>

            <SendMessageButton
                onClick={() => {
                    mutation.mutate({
                        message,
                        conversationId,
                        attachmentList: [],
                    });
                    setMessage('');
                }}
                className=""
            />
        </div>
    );
}
