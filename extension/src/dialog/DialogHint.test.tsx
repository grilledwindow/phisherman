import { beforeEach, describe, expect, it, test } from "vitest";
import { render } from '@solidjs/testing-library';
import DialogHint, { DialogStore } from "./DialogHint";
import { createStore } from "solid-js/store";

describe('DialogHint', async () => {
    const [dialogStore, setDialogStore] = createStore<DialogStore>({
        pos: { top: 0, left: 0, width: 0, height: 0 },
        link: '',
        show: false,
        state: 'loading',
        onCancel: () => { setDialogStore('show', false); }
    }); 

    beforeEach(() => {
        setDialogStore('show', false);
        setDialogStore('link', '');
        setDialogStore('state', 'loading');
    });
    
    it('is hidden', async () => {
        const { queryByRole } = render(() => <DialogHint id='test-dialog' store={dialogStore} />);
        expect(queryByRole('dialog')).toBeNull();
    });

    it('is shown', async () => {
        setDialogStore('show', true);
        const { queryByRole } = render(() => <DialogHint id='test-dialog' store={dialogStore} />);
        expect(queryByRole('dialog')).not.toBeNull();
    });
});

