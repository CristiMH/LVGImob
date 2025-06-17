import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';

const Editor = forwardRef(({ readOnly, defaultValue, onTextChange, onSelectionChange, visible }, ref) => {
    const containerRef = useRef(null);
    const editorInstance = useRef(null);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const [initialized, setInitialized] = useState(false);

    useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
        onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
        if (!visible || !containerRef.current || initialized) return;

        const editorContainer = document.createElement('div');
        editorContainer.className = `${readOnly ? '!border-none' : 'rounded-[5px] overflow-hidden border border-gray-300'}`;
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(editorContainer);


        import('quill').then(({ default: Quill }) => {
            const modules = readOnly
                ? { toolbar: false }
                : {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                    ],
                };
            const quill = new Quill(editorContainer, { theme: 'snow', modules });
            ref.current = quill;
            editorInstance.current = quill;

            if (defaultValue) {
                quill.clipboard.dangerouslyPasteHTML(defaultValue);
            }

            quill.root.classList.add('font-body');
            quill.root.classList.add('text-[16px]');

            quill.on('text-change', () => {
                const contents = quill.getContents();
                const html = quill.root.innerHTML;
                onTextChangeRef.current?.(contents, html);
            });

            quill.on('selection-change', (...args) => {
                onSelectionChangeRef.current?.(...args);
            });

            quill.enable(!readOnly);
            setInitialized(true);
        });

        
    }, [defaultValue]);

    return <div ref={containerRef} ></div>;
});

Editor.displayName = 'Editor';

export default Editor;