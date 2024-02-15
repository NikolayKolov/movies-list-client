/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';
import CloseIcon from '../SVGIcons/CloseIcon';
import useOnClickOutside from '../../hooks/useOnClickOutside';

type ModalProps = {
    show: boolean,
    hideOnClickOutside?: boolean,
    title: string,
    type?: 'normal' | 'warning',
    children: React.ReactNode,
    onClose: (...args: any[]) => any;
}

const Modal = (props: ModalProps) => {
    const { show = false, hideOnClickOutside = true, title, type = 'normal', onClose, children } = props;
    const modalRef = useRef(null);

    useOnClickOutside(modalRef, (e) => {
        hideOnClickOutside && show && onClose(e);
    });

    let classNameOverlay = 'modal--overlay';
    let classNameModal = 'modal';
    if (show) {
        classNameModal += ' modal__open';
        classNameOverlay += ' modal__open';
    }
    if (type === 'warning') classNameModal += ' modal__warning';

    return (
        <div className={classNameOverlay}>
            <div className={classNameModal} ref={modalRef}>
                <h1>
                    <span>{title}</span>
                    <span onClick={(e) => {onClose(e)}}><CloseIcon /></span>
                </h1>
                {children}
            </div>
        </div>
    )
}

export default Modal